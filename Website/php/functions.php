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

function createButtons ($id) {
    ?>
    <p class="card-text">You have an incoming friend request.</p>
    <form method="post">
        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="btnradio" id="<?php echo $id;?>btnradio1" autocomplete="off" checked value="AcceptRequest">
            <label class="btn btn-outline-success" for="<?php echo $id;?>btnradio1">Accept</label>

            <input type="radio" class="btn-check" name="btnradio" id="<?php echo $id;?>btnradio2" autocomplete="off" value="DeclineRequest">
            <label class="btn btn-outline-danger" for="<?php echo $id;?>btnradio2">Decline</label>
        </div>
        <input type="submit" class="btn btn-primary" value="Confirm">
        <input type="hidden" name="id" value="<?php echo $id;?>">
    </form>
    <?php
}

function calculateKD ($K, $D){
    return round($K/$D, 2);
}