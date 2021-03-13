<?php

/**
 * @return bool
 */
function login()
{
    return (new \Datahunt\User)->login();
}

/**
 * @return null
 */
function logout()
{
    return (new \Datahunt\User)->logout();
}

/**
 * @return bool
 */
function account()
{
    return (new \Datahunt\User)->updateAccount();
}

/**
 * @return bool
 */
function delete()
{
    return (new \Datahunt\User)->destroy();
}

/**
 *
 */
function forgotPassword()
{
    (new \Datahunt\User)->forgotPassword();

    header('location: index.php?page=forgot_password');
}

/**
 * @return bool
 */
function canResetPassword()
{
    return (new \Datahunt\User)->canResetPassword();
}

/**
 *
 */
function resetPassword()
{
    (new \Datahunt\User)->resetPassword();
    header('location: index.php');
}

/**
 * @return mixed
 */
function showMessages()
{
    $error = $_SESSION['message'];
    unset($_SESSION['message']);
    return $error;
}