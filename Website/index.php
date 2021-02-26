<?php

// Zet php waarden zodat we errors kunnen zien voor debuggen.
ini_set('error_reporting', '-1');
ini_set('display_errors', 'On');

// Start de sessie zodat we accounts kunnen beheren.
session_start();

// Laad omgevingsvariablen in zodat we database en email connecties kunnen maken.
require 'env.php';
require 'functions.php';

// Kijk of we een actie uitvoeren
if (isset($_GET['action'])) {
    if (function_exists($_GET['action'])) {
        call_user_func($_GET['action']);
    }
}

// Laad de juiste files in op basis van of we al zijn ingelogd of niet.
if(!isset($_SESSION['user']) || empty($_SESSION['user'])) {
    require 'html/login.phtml';
} else {
    require 'html/user.phtml';
}


// Kijk eerst of the gebruiker is ingelogd of niet
// als de gebruiker niet is ingelogd laten we het login formulier zien.
// Als een gebruiker nog geen account heeft dan ziet hij een registreet linkje bij het formulier van inloggen
// Bij het formulier komt ook een linkje voor wachtwoord vergeten aanvragen.

// Als de gebruiker wel is ingelogd laten we de loguit button zien.
// Laat account gegevens zien in formulier zodat we kunnen bewerken.
// en een verwijder account knop
