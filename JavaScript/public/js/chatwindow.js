let block = document.getElementById("SocialBlock");
let button = document.getElementById("SocialButton");

function openForm() {
    block.style.display = "block";
    button.style.display = "none";
    block.classList.add("fadein");
}

function closeForm() {
    block.style.display = "none";
    button.style.display = "block";
    block.classList.remove("fadein");
}

function disableSocial() {
    block.style.display = "none";
    button.style.display = "none";
}

function enableSocial() {
    block.style.display = "block";
    button.style.display = "block";
}