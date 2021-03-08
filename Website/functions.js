let nameRegex = new RegExp(/^[a-z ,.'-]+$/i);
let usernameRegex = new RegExp(/\w{5,29}/i);
let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
let mailRegex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);

function checkForms(element, elementRegex) {
    element.oninput = () => {
        if (elementRegex.exec(element.value)) {
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
        } else {
            element.classList.remove("is-valid");
            element.classList.add("is-invalid");
        }
    }
}

applyFunction();
function applyFunction() {
    let items = [];
    let classes = document.getElementsByClassName("input");
    for (let i = 0; i < classes.length; i++) {
        items.push(document.getElementsByClassName("input")[i].id);
    }
    for (let i = 0; i < items.length; i++) {
        switch (items[i]) {
            case "irlname":
                checkForms(irlname, nameRegex);
                break;
            case "username":
                checkForms(username, usernameRegex);
                break;
            case "mail":
                checkForms(mail, mailRegex);
                break;
            case "password":
                checkForms(password, passwordRegex);
                break;
            case "passwordCheck":
                checkForms(passwordCheck, passwordRegex);
                break;
        }
    }
}