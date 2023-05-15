
//require all modules to run express, body-parser, ajax and logic for calculations. 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const calculate = require('./modules/calculation');

//created a global array to store objects generated by client.
//created a global solution to get to display. 
let  history = [];
let solution = 0;

//set the client files for express
//configured bodyParser for post and get requests.
app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

//get to send global solution variable when called.
app.get('/solution', function (req, res) {
    console.log('solution GET', solution);
    res.send(`${solution}`);
});

//delete to wipe the history array and solution variable when called
app.delete('/clear/:index',( req, res )=>{ 
    console.log('Clear Request');
    history =[];
    solution = 0;
    res.sendStatus(200);
} )

//get to send history array when called
app.get('/calculation', function (req, res) {
    console.log('Calculation GET' , history);
    res.send(history);
});

//post to take in an object form the client and generates a solution for the values in the object send.
app.post('/calculation', function (req, res) {
    console.log('Calculation POST',req.body)
    let inputs = req.body;
    inputs.solution = calculate((inputs.input1/1), inputs.operator, (inputs.input2/1));
    solution = inputs.solution; 
    history.push(req.body);
    res.sendStatus(200);
});

//states the post the server will be running on.
app.listen(PORT, () => {
        console.log('listening on port', PORT);
});
