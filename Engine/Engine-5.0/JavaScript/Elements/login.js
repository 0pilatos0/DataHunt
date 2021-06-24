loginToggler = document.getElementById("TogglerLogin");
registerToggler = document.getElementById('TogglerRegister');

loginText = document.getElementById('loginText');
registerText = document.getElementById('RegisterText');

loginElement = document.getElementById('loginElement');
registerElement = document.getElementById('RegisterElement');

loginToggler.onclick = () => {
    registerText.classList.remove('active');
    loginText.classList.add('active');
    loginElement.classList.remove('hidden');
    registerElement.classList.add('hidden');
}

registerToggler.onclick = () => {
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