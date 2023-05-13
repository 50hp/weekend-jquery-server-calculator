
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const calculate = require('./modules/calculation');

let  history = [];
let solution = 0;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/solution', function (req, res) {
    console.log('solution GET', solution);
    res.send(`${solution}`);
});

app.delete('/clear/:index',( req, res )=>{ 
    console.log('Clear Request');
    history =[];
    solution = 0;
    res.sendStatus(200);
} )

app.get('/calculation', function (req, res) {
    console.log('Calculation GET' , history);
    res.send(history);
});

app.post('/calculation', function (req, res) {
    console.log('Calculation POST',req.body)
    let inputs = req.body;
    inputs.solution = calculate((inputs.input1/1), inputs.operator, (inputs.input2/1));
    solution = inputs.solution; 
    history.push(req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
        console.log('listening on port', PORT);
});
