const inputSlider = document.querySelector("[lengthSlider]");
const lengthDisplay = document.querySelector(".passwordLength");

const passwordDisplay = document.querySelector("[passwordDisplay]");
const copyBtn = document.querySelector("[btn-copy]");
const copyMsg = document.querySelector(".copyMessage");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[passwordColor]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


// starting password empty----
let password = "";
// default password length----
let passwordLength = 10;
// starting checkbox count-----
let checkBoxCount = 0;
//function for slider----
Slider();
//set strength circle color to grey
setColorIndicator("#ccc");


//set passwordLength
function Slider() {                             //password length ko ui pr reflect krwata hai----  
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye tha----
    //haan---
    // slider me kitne percent color kisme rkhna hai let see by this formula----
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

//function  for color indicator ------------

function setColorIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//random generate function--------

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRndInteger(0, 9);
}

function getLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123))
}

function getUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91))
}

function getSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// function for strength checker--------------

function strengthIndicator() {
    let upper = false;
    let lower = false;
    let num = false;
    let sym = false;
    if (uppercaseCheck.checked)
        upper = true;
    if (lowercaseCheck.checked)
        lower = true;
    if (numbersCheck.checked)
        num = true;
    if (symbolsCheck.checked)
        sym = true;

    if (upper && lower && (num || sym) && passwordLength >= 10) {
        setColorIndicator("#0f0");
    } else if (
        (lower || upper) &&
        (num || sym) &&
        passwordLength >= 6
    ) {
        setColorIndicator("#ff0");
    } else {
        setColorIndicator("#f00");
    }
}

async function copyMessage() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function dealWithCheckBoxChange() {
    checkBoxCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkBoxCount++;
    });

    //special condition
    if (passwordLength < checkBoxCount) {
        passwordLength = checkBoxCount;
        Slider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', dealWithCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    Slider();
})


copyBtn.addEventListener('click', () => {
    // if(passwordDisplay.value)
    if (passwordLength > 0)
        copyMessage();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if (checkBoxCount == 0)
        return;

    if (passwordLength < checkBoxCount) {
        passwordLength = checkBoxCount;
        Slider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(getUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(getLowerCase);

    if (numbersCheck.checked)
        funcArr.push(getRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(getSymbol);

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    strengthIndicator();
});