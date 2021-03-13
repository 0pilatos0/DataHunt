<?php

// Zet php waarden zodat we errors kunnen zien voor debuggen.
ini_set('error_reporting', '-1');
ini_set('display_errors', 'On');

// Start de sessie zodat we accounts kunnen beheren.
session_start();

// Require composer autoloader zodat we classes kunnen autoloaden.
require __DIR__.'/vendor/autoload.php';

// Laad omgevingsvariablen in zodat we database en email connecties kunnen maken.
require 'env.php';
require 'functions.php';

// Controleer of we een gebruiker token hebben
(new Datahunt\User())->loginUserByToken();

// Kijk of we een actie uitvoeren
if (isset($_GET['action'])) {
    if (function_exists($_GET['action'])) {
        call_user_func($_GET['action']);
    }
}

// Als er een pagina beschikbaar is laad deze pagina
// anders laden we de gebruikers informatie.
if (isset($_GET['page'])) {
    if (file_exists('html/'.$_GET['page'].'.phtml')) {
        require ('html/'.$_GET['page'].'.phtml');
    } else {
        throw new \Exception ('Je probeert een pagina te laden die niet bestaat');
    }
} else {
    // Laad de juiste files in op basis van of we al zijn ingelogd of niet.
    if (!isset($_SESSION['user']) || empty($_SESSION['user'])) {
        require 'html/login.phtml';
    } else {
        require 'html/user.phtml';
    }
}