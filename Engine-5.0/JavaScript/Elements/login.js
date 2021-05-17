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

submitlogin.onclick = (e) => {
    e.preventDefault()
    //if(luname.value && lpsw.value) 
    socket.emit('login', {username: luname.value, password: lpsw.value, rememberme:lrememberme.checked})
}

submitregister.onclick = (e) => {
    e.preventDefault()
    //if(rname.value && runame.value && remail.value && rpsw.value && rpswcheck.value) 
    socket.emit('register', {name:rname.value, username:runame.value, email:remail.value, password: rpsw.value, passwordcheck:rpswcheck.value})
}