let form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", display);
let allTrue = 0;

function display(event) {
    event.preventDefault();
    allTrue = 0;
    let inputFieldsContainers = Array.from(document.getElementsByClassName("input-container"));

    inputFieldsContainers.forEach(checkFieldValue);
    if(allTrue === 3) {
        calculateAge(inputFieldsContainers);
    }
}

function calculateAge(elmnts) {
    let currentDate = new Date();
    let birthDay = parseInt(elmnts[0].querySelector(`input[type="text"]`).value);
    let birthMonth = parseInt(elmnts[1].querySelector(`input[type="text"]`).value);
    let birthYear = parseInt(elmnts[2].querySelector(`input[type="text"]`).value);

    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();

    if(currentDay < birthDay) {
        currentDay += getMaxDays(currentMonth);
        currentMonth--;
        currentDay -= birthDay;
    } else {
        currentDay -= birthDay;
    }

    if(currentMonth < birthMonth) {
        currentMonth += 12;
        currentYear--;
        currentMonth -= birthMonth;
    } else {
        currentMonth -= birthMonth;
    }

    currentYear = (currentYear !== 0) ? currentYear - birthYear : 0;

    let outputFields = Array.from(document.getElementsByClassName("output-field"));
    function displayCurrentAge(elmnt) {
        async function animateDisplay(elmnt, value) {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            let span = elmnt.querySelector("span");
            span.textContent = "0";
            for(let i = 1; i <= value; i++) {
                span.textContent = i;
                await sleep(35);
            }
        }
        if(elmnt.classList.contains("days")) {
            animateDisplay(elmnt, currentDay);
        }
        else if(elmnt.classList.contains("months")) {
            animateDisplay(elmnt, currentMonth);
        }
        else {
            animateDisplay(elmnt, currentYear);
        }
    }
    
    outputFields.forEach(displayCurrentAge);
}

function checkFieldValue(elmnt) {
    let elmntValue = elmnt.querySelector(`input[type="text"]`).value;

    if(isEmpty(elmntValue)) {
        errorDisplay(elmnt, "This field is required");
        return;
    }
    else if(!isValid(elmnt)) {
        return;
    }

    errorDisplay(elmnt, "", null);
    allTrue++;

}

function isEmpty(value) {
    return !value;
}

function errorDisplay(elmnt, spanErrorText, errorColor = "hsl(0, 100%, 67%)") {
    elmnt.querySelector("label").style.color = errorColor;
    elmnt.querySelector(`input[type="text"]`).style.borderColor = errorColor || "hsl(0, 0%, 92%";
    let errorSpan = elmnt.querySelector("span");
    errorSpan.textContent = spanErrorText;
}

function getMaxDays(month) {
    let maxDaysPerMonth = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    }
    return maxDaysPerMonth[month];
}

function isValid(elmnt) {
    let fieldValue = elmnt.querySelector(`input[type="text"]`).value;

    if(elmnt.classList.contains("days") && !isValidDay(elmnt)) {
        errorDisplay(elmnt, "Must be a valid day");
        return false;
    }
    else if(elmnt.classList.contains("months") && !isValidMonth(fieldValue)) {
        errorDisplay(elmnt, "Must be a valid month");
        return false;
    }
    else if(!isValidYear(fieldValue)){
        errorDisplay(elmnt, "Must be in the past");
        return false;
    }

    return true;
}

function isValidDay(elmnt) {
    let dayValue = parseInt(elmnt.querySelector(`input[type="text"]`).value);
    let monthValue =  elmnt.nextElementSibling.querySelector(`input[type="text"]`).value
    if(isValidMonth(monthValue)) {
        return (dayValue >= 1 && dayValue <= getMaxDays(parseInt(monthValue)));
    }
}

function isValidMonth(value) {
    let intValue = parseInt(value);
    return (intValue >= 1 && intValue <= 12);
}

function isValidYear(value) {
    let currentYear = new Date().getFullYear();
    return (parseInt(value) <= currentYear);
}