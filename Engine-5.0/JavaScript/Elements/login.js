let login = document.getElementById("TogglerLogin");
let register = document.getElementById('TogglerRegister');

let loginText = document.getElementById('loginText');
let registerText = document.getElementById('RegisterText');

let loginElement = document.getElementById('loginElement');
let registerElement = document.getElementById('RegisterElement');

login.onclick = () => {
    registerText.classList.remove('active');
    loginText.classList.add('active');
    loginElement.classList.remove('hidden');
    registerElement.classList.add('hidden');
}

register.onclick = () => {
    loginText.classList.remove('active');
    registerText.classList.add('active');
    registerElement.classList.remove('hidden');
    loginElement.classList.add('hidden');
}