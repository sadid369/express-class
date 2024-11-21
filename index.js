const express = require('express');

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
app.get('/', async (req, res) => {
    res.send(`Number of requests: ${request}`);
});
app.get('/health-checkup', async (req, res) => {
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
app.listen(3000, () => {
    console.log('Server running on port 3000');
});