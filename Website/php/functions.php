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
function deleteAccount($id){
    deleteUser($id);
    resetSession();
}
function showCharacters($characters){
    for ($i = 0; $i < sizeof($characters); $i++){
        $c = $characters[$i];
        echo "
<li class=\"list-group-item char-li\">
    <a class=\"char-link\" href=\"character?id={$c["id"]}\">
        <div class='char'>
            {$c["char_name"]}<br>Lvl {$c["level"]} - {$c["name"]}
        </div>
    </a>
</li>";
    }
}



function changeInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}