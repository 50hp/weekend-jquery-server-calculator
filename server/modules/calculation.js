
function calculate(input1, operator, input2) {

        switch(operator){
            case"+":
            return input1 + input2;
            break;
            case"-":
            return input1 - input2;
            break;
            case"*":
            return input1 * input2;
            break;
            case"/":
            return input1 / input2;
            break;

        }
}

module.exports = calculate;

