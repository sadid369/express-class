// const express = require('express');
// const zod = require('zod');
// const schema = zod.array(zod.number());

// const app = express();
// app.use(express.json());
// let request = 0;
// function count (req, res, next) {
//     request++;
//     console.log(request);
//     next();
// }
// // updated
// app.use(count);
// app.post('/', (req, res) => {
//     const users = req.body.users;
//     const response = schema.safeParse(users);
//     // const length = response.data.length;
//     // res.send({ length });
//     res.send({ response });

// });
// app.get('/health-checkup', (req, res) => {
//     const username = req.headers.username;
//     const password = req.headers.password;
//     const kidneyId = req.query.kidneyId;
//     if (username === 'sadid' && password === 'pass') {
//         if (kidneyId == 1 || kidneyId == 2) {
//             res.json({ msg: 'your kidney is fine' });
//         } else {
//             res.status(404).send('kidney not found');
//         }
//     } else {
//         res.status(401).send('Unauthorized');
//     }


// });
// app.use(function(err, req, res, next) {
//     res.status(500).send('Something broke!' + err);
// });
// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });

// const schema2 = zod.object({
//     email: zod.string().email(),
//     password: zod.string().min(8)
// });

// function validate (obj) {
//     const response = schema2.safeParse(obj);
//     console.log(response);
// }
// validate({ email: 'email@e.com', password: 'password' });
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const jwtPassword = "123456";

// const app = express();
// app.use(express.json());

// const ALL_USERS = [
//     {
//         username: "harkirat@gmail.com",
//         password: "123",
//         name: "harkirat singh",
//     },
//     {
//         username: "raman@gmail.com",
//         password: "123321",
//         name: "Raman singh",
//     },
//     {
//         username: "priya@gmail.com",
//         password: "123321",
//         name: "Priya kumari",
//     },
// ];

// function userExists (username, password) {
//     for (let i = 0; i < ALL_USERS.length; i++) {
//         const user = ALL_USERS[i];
//         if (user.username === username && user.password === password) {
//             return true;
//         }
//     }
//     return false;
// }

// app.post("/signin", function(req, res) {
//     const username = req.body.username;
//     const password = req.body.password;

//     if (!userExists(username, password)) {
//         return res.status(403).json({
//             msg: "User doesnt exist in our in memory db",
//         });
//     }

//     var token = jwt.sign({ username: username }, jwtPassword);
//     return res.json({
//         token,
//     });
// });

// app.get("/users", function(req, res) {
//     const token = req.headers.authorization;
//     try {
//         const decoded = jwt.verify(token, jwtPassword);
//         const username = decoded.username;
//         // return a list of users other than this username
//         const users = ALL_USERS.filter((user) => user.username !== username);
//         return res.json({
//             users,
//         });
//     } catch (err) {
//         return res.status(403).json({
//             msg: "Invalid token",
//         });
//     }
// });

// app.listen(3000);

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPassword = "123456";

mongoose.connect(
    "mongodb://localhost:27017/users",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String,
});

const app = express();
app.use(express.json());

async function userExists (email) {
    const user = await User.findOne({ email });
    console.log(user);
    return user;
}
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        const isUserExists = await userExists(email);
        if (isUserExists) {
            return res.status(403).json({
                msg: "User already exists in our in memory db",
            });
        }
        const user = new User({
            name, email, password
        });

        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
    }
});
app.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!userExists(email)) {
        return res.status(403).json({
            msg: "User doesn't exist in our in memory db",
        });
    }

    const user = await User.findOne({ email });
    if (user.password !== password) {
        return res.status(403).json({
            msg: "User doesn't exist in our in memory db",
        });

    } else {
        var token = jwt.sign({ email: email }, jwtPassword);
        return res.json({
            token,
        });
    }
});

app.get("/users", async function(req, res) {
    const token = req.headers.authorization;
    console.log(token);
    try {
        const decoded = jwt.verify(token, jwtPassword);
        const email = decoded.email;
        // return a list of users other than this username from the database
        const users = await User.find({ email: { $ne: email } });
        return res.json({
            users,
        });
    } catch (err) {
        return res.status(403).json({
            msg: "Invalid token",
        });
    }
});

app.listen(3000);