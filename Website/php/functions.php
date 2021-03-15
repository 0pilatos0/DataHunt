<?php
function setSessionValue($index, $value)
{
    $_SESSION[$index] = $value;
}

function getSessionValue($index)
{
    return $_SESSION[$index];
}

function getSessionAll()
{
    return print_r($_SESSION);
}

// remove all session variables
function resetSession()
{
    session_unset();
}