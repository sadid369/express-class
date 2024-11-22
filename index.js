const express = require('express');
const zod = require('zod');
const schema = zod.array(zod.number());

const app = express();
app.use(express.json());
let request = 0;
function count (req, res, next) {
    request++;
    console.log(request);
    next();
}
// updated
app.use(count);
app.post('/', (req, res) => {
    const users = req.body.users;
    const response = schema.safeParse(users);
    // const length = response.data.length;
    // res.send({ length });
    res.send({ response });

});
app.get('/health-checkup', (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    const kidneyId = req.query.kidneyId;
    if (username === 'sadid' && password === 'pass') {
        if (kidneyId == 1 || kidneyId == 2) {
            res.json({ msg: 'your kidney is fine' });
        } else {
            res.status(404).send('kidney not found');
        }
    } else {
        res.status(401).send('Unauthorized');
    }


});
app.use(function(err, req, res, next) {
    res.status(500).send('Something broke!' + err);
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

const schema2 = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8)
});

function validate (obj) {
    const response = schema2.safeParse(obj);
    console.log(response);
}
validate({ email: 'email@e.com', password: 'password' });