$(onReady);

function onReady() {

    $('#inputForm').on('submit', sendProblem);
    $('.operator').on('click', setOperator);
    $('#clearBtn').on('click', clearCalc);
    $('.number').on('click', inputNumber);
    $('#historyList').on('click', '.historyItem', reduProblem);
    getHistory();
}

let operator = '';


function setOperator(event) {
        event.preventDefault();
        operator = $(this).data().value;
        renderOperatorToDOM();
        console.log(operator);
}
function renderOperatorToDOM() {
    $('#operatorDisplay').empty(); 
    $('#operatorDisplay').text(`${operator}`);

}
function inputNumber() {
    console.log($(this).data().value);
    inputUpdate(`${$(this).data().value}`);


}
let inputA = '';
let inputB = '';
function inputUpdate(input) {
    if(operator===''){
        inputA += input;
        $('#input1').val(`${inputA}`);
    }else{
        inputB += input
        $('#input2').val(`${inputB}`);
}
}
let problemNumber = 0;
function sendProblem(event) {

        event.preventDefault();
    

        let input1 = $('#input1').val();
        let input2 = $('#input2').val();
 
    if(input1 ==='' || operator ==='' || input2 ===''){
        alert('Not all imputs filled out');
        return;
    }
        
    $.ajax({
        method: "POST",
        url: "/calculation",
        data:{
            input1: input1,
            operator: operator,
            input2: input2,
            solution:  '',
            problemNumber: problemNumber,
        }
    }).then(function(response){
        console.log('success');
        getSolution();
        operator = '';
        renderOperatorToDOM();
        inputA ='';
        inputB ='';
        inputUpdate('');
        $('#input1').val('');
        $('#input2').val('');
        problemNumber ++;
    }).catch(function(err){
        alert('error with request');
        console.log('error with request', err);
    })
}

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

function renderSolutionToDOM(solution){

    $('#solution').text(`${solution}`);
}

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

function renderHistoryToDOM(history) {

    $('#historyList').empty()

    for (let his of history){

        $('#historyList').append(`
            <li class="historyItem" data-value="${his.problemNumber}">${his.input1} ${his.operator} ${his.input2}</li>
        `);
    }
}

function reduProblem() {
        
       let problem = $(this).data().value;
        console.log(problem);
    $.ajax({
        method: "GET",
        url: '/calculation'
    }).then(function(response) {
        console.log(response[problem]);
    }).catch(function(err) {
        alert('error with request');
        console.log('error with request', err);
    })
}
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
