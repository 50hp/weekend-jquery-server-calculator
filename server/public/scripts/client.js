$(onReady);

function onReady() {

    $('#inputForm').on('submit', sendProblem);
    $('.operator').on('click', setOperator);
    $('#clearBtn').on('click', clearCalc);
    getHistory();
}

let operator;


function setOperator(event) {
        event.preventDefault();
        operator = $(this).data().value;
        console.log(operator);
}

function sendProblem(event){

        event.preventDefault();

        let input1 = $('#input1').val();
        let input2 = $('#input2').val();
        
    $.ajax({
        method: "POST",
        url: "/calculation",
        data:{
            input1: input1,
            operator: operator,
            input2: input2
        }
    }).then(function(response){
        console.log('success');
        getSolution();
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

    for (his of history){

        $('#historyList').append(`
             <li>${his.input1} ${his.operator} ${his.input2}</li>
        `);
    }
}

function clearCalc(event) {
    let index = 0;
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