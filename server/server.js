
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const history = require('./modules/history');
const calculate = require('./modules/calculation');


let solution = 0;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/solution', function (req, res) {
    console.log('solution GET', solution);
    res.send(`${solution}`);
})

app.get('/calculation', function (req, res) {
    console.log('Calculation GET' , history);
    res.send(history);
})

app.post('/calculation', function (req, res) {
    console.log('Calculation POST',req.body)
    let inputs = req.body;
    solution = calculate(inputs.input1, inputs.operator, inputs.input2);
    history.push(req.body);
    res.sendStatus(200);
})

app.listen(PORT, () => {
        console.log('listening on port', PORT);
});
