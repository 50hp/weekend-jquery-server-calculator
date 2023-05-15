$(onReady);

//function to call event listeners and functions that need to be on page load.
function onReady() {

    $('#inputForm').on('submit', sendProblem);
    $('.operator').on('click', setOperator);
    $('#clearBtn').on('click', clearCalc);
    $('.number').on('click', inputNumber);
    $('#historyList').on('click', '.historyItem', reduProblem);
    getHistory();
}

//declare a global operator variable to be updated when a operator is pressed on the DOM.
let operator = '';
function setOperator(event) {
    event.preventDefault();
    operator = $(this).data().value;
    renderOperatorToDOM();
    console.log(operator);
}
//function to display the operator to the DOM when selected.
function renderOperatorToDOM() {
    $('#operatorDisplay').empty(); 
    $('#operatorDisplay').text(`${operator}`);

}
//function to capture what number is clicked on the DOM.
function inputNumber() {
    console.log($(this).data().value);
    inputUpdateMan(`${$(this).data().value}`);


}
//declares 2 variables to hold the value of the buttons clicked on the DOM for each problem input.
let inputA = '';
let inputB = '';
//function to update the inputs on the DOM when the buttons are selected. 
//this function is used for new problems not in history.
function inputUpdateMan(input) {
    if(operator===''){
        inputA += input;
        $('#input1').val(`${inputA}`);
    }else{
        inputB += input
        $('#input2').val(`${inputB}`);
    }
}
//declares a variable to count how many problems have been submitted to the sever.
let problemNumber = 0;
//function to capture the input values, operator, and problem number and puts them in a object to be sent to the server for processing.
function sendProblem(event) {

    event.preventDefault();


    let input1 = $('#input1').val();
    let input2 = $('#input2').val();

    if(input1 ==='' || operator ==='' || input2 ===''){
        alert('Not all imputs filled out');
        return;
    }
    if (isNaN(input1) || isNaN(input2)) {
        alert('Numbers Only');
        $('#input1').val('');
        $('#input2').val('');
        operator = '';
        renderOperatorToDOM();
        return;
    }

    let object ={
        input1: input1,
        operator: operator,
        input2: input2,
        solution:  '',
        problemNumber: problemNumber,
    } 

    $.ajax({
        method: "POST",
        url: "/calculation",
        data: object,
    }).then(function(response) {
        console.log('success');
        getSolution();
        operator = '';
        renderOperatorToDOM();
        inputA ='';
        inputB ='';
        inputUpdateMan('');
        $('#input1').val('');
        $('#input2').val('');
        problemNumber ++;
    }).catch(function(err){
        alert('error with request');
        console.log('error with request', err);
    })
}

//function to call the sever and receive the solution variable.
function getSolution(){

    $.ajax({
        method: "GET",
        url: "/solution"
    }).then(function(response){
        console.log(response);
        renderSolutionToDOM(response);
        getHistory();
    }).catch(function(err){
        alert('error with request');
        console.log('error with request', err);
    })
}
//function to display the solution variable to the DOM.
function renderSolutionToDOM(solution){

    $('#solution').text(`${solution}`);
}

//function to call the sever and receive the history array.
function getHistory() {

    $.ajax({
        method: "GET",
        url: '/calculation'
    }).then(function (response){
        renderHistoryToDOM(response);
    }).catch(function(err){
        alert('error with request');
        console.log('error with request', err);
    })
}

//function to loop through the history array and render it on the DOM.
function renderHistoryToDOM(history) {

    $('#historyList').empty()

    for (let his of history){

        $('#historyList').append(`
            <li class="historyItem" data-value="${his.problemNumber}">${his.input1} ${his.operator} ${his.input2} = ${his.solution}</li>
            `);
    }
}

//function the pull a problem from the history array and render the inputs to the DOM to be sent to the server.
//allows the user to redo problems.
function reduProblem() {

    let problem = $(this).data().value;
    console.log(problem);
    $.ajax({
        method: "GET",
        url: '/calculation'
    }).then(function(response) {
        console.log(response[problem]);
        inputUpdateAuto(response[problem]);
    }).catch(function(err) {
        alert('error with request');
        console.log('error with request', err);
    })
}

//function that automatically puts inputs from the history on the DOM
function inputUpdateAuto(inputs) {
    operator = inputs.operator;
    renderOperatorToDOM();
    inputAuto1 = inputs.input1;
    $('#input1').val(`${inputAuto1}`);
    inputAuto2 = inputs.input2
    $('#input2').val(`${inputAuto2}`);

    inputAuto1 ='';
    inputAuto2 ='';

}

//function to clear all variables and arrays back to default.
//sends a delete request to the sever to reset the history array.
function clearCalc(event) {
    let index = 0;
    problemNumber = 0;
    operator = '';
    inputA = '';
    inputB = '';
    renderOperatorToDOM();
    event.preventDefault();

    $('#input1').val('');
    $('#input2').val('');
    $('#solution').empty();

    $.ajax({
        type: "DELETE",
        url: "/clear/" + index,
    }).then(function(response){
        console.log('deleted');
        getHistory();
    }).catch(function(err){
        alert('error with request');
        console.log('error with request', err);
    })
}
