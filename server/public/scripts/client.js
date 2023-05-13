$(onReady);

function onReady() {

    $('#inputForm').on('submit', sendProblem);
    $('.operator').on('click', setOperator);
    $('#clearBtn').on('click', clearCalc);
    $('.number').on('click', inputNumber);
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
let input1 = '';
let input2 = '';
function inputUpdate(input) {
    if(operator===''){
        input1 += input;
        $('#input1').val(`${input1}`);
    }else{
        input2 += input
        $('#input2').val(`${input2}`);
}
}
function sendProblem(event) {

        event.preventDefault();

        let input1 = $('#input1').val();
        let input2 = $('#input2').val();
 ;
        
    $.ajax({
        method: "POST",
        url: "/calculation",
        data:{
            input1: input1,
            operator: operator,
            input2: input2,
            solution:  '',
        }
    }).then(function(response){
        console.log('success');
        getSolution();
        operator = '';
        renderOperatorToDOM();
        input1 = '';
        input2 = '';
        $('#input1').val('');
        $('#input2').val('');
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
             <li>${his.input1} ${his.operator} ${his.input2} = ${his.solution}</li>
        `);
    }
}

function clearCalc(event) {
    let index = 0;
    operator = '';
    input1 = '';
    input2 = '';
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
