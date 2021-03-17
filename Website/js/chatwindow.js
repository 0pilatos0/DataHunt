function openForm() {
    document.getElementById("SocialBlock").style.display = "block";
    document.getElementById("SocialButton").style.display = "none";
}

function closeForm() {
    document.getElementById("SocialBlock").style.display = "none";
    document.getElementById("SocialButton").style.display = "block";
}

function disableSocial() {
    document.getElementById("SocialBlock").style.display = "none";
    document.getElementById("SocialButton").style.display = "none";
}

function enableSocial() {
    document.getElementById("SocialBlock").style.display = "block";
    document.getElementById("SocialButton").style.display = "block";
}