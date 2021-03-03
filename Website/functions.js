let usernameRegex = new RegExp(/\w{5,29}/i);
let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

f(username, usernameRegex);
f(password, passwordRegex);

function f(element, elementRegex) {
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