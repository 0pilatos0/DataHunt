<?php
    include '../elements/header.php';

    if(!empty($_SESSION["user"])){
        echo "<script>location = \"http://live.datahunt.duckdns.org\";</script>";
    }
<?php include '../elements/header.php' ?>
<script src="../functions.js" defer></script>
<style>
    form{
        font-family: 'Roboto', sans-serif;
        margin-left: auto;
        margin-top: 30px;
    }
?>
<style>
    .list-group{
        color: black;
    }
    .list-group-item{
        padding: .2rem 1.5rem;
        background-color: #DBDBDB;
    }
    .card-header{
        background-color: rgb(61, 61, 61);
    }
    #container img{
        float: left;
        margin-right: 15px;
    }
    #container form{
        display: block;
    }

</style>
<div class="content">

    <div id="container" >
        <img src="https://via.placeholder.com/800x640.png?text=Hier+komt+coole+afbeelding+van+game" alt="">
        <form method="post" style="width: 30rem;" class="formLogin">
            <div>
            <div class="card-header">
                <h3>Registration</h3>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><label for="AccName" class="col-sm-1 col-form-label">Name</label>
                    <div class="col-sm-10">
                        <input type="text" name="AccName" id="irlname" class="input form-control"><br>
                    </div>
                </li>
                <li class="list-group-item"><label for="AccUsername" class="col-sm-1 col-form-label">Username</label>
                    <div class="col-sm-10">
                        <input type="text" name="AccUsername" id="username" class="input form-control"><br>
                    </div>
                <li class="list-group-item"><label for="AccEmail" class="col-sm-1 col-form-label">Email</label>
                    <div class="col-sm-10">
                        <input type="text" name="AccEmail" id="mail" class="input form-control"><br>
                    </div>
                </li>
                <li class="list-group-item"><label for="AccPassword" class="col-sm-1 col-form-label">Password</label>
                    <div class="col-sm-10">
                        <input type="password" name="AccPassword" id="password" class="input form-control"><br>
                    </div>
                </li>
                <li class="list-group-item"><label for="AccPasswordCheck" class="col-sm-6 col-form-label">Password
                        check</label>
                    <div class="col-sm-10">
                        <input type="password" name="AccPasswordCheck" id="passwordCheck" class="input form-control"><br>
                    </div>
                </li>
                <li class="list-group-item">
                    <input type="submit" class="btn btn-primary" value="Create Account">
                </li>
            </ul>
        </div>
    </form>
    <?php
    require "mail.php";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = changeInput($_POST["AccName"]);
        $username = changeInput($_POST["AccUsername"]);
        $email = changeInput($_POST["AccEmail"]);
        $password = changeInput($_POST["AccEmail"]);
        $password = password_hash(changeInput($_POST["AccPassword"]), PASSWORD_BCRYPT, ['cost' => 12]);
        $password2 = password_hash(changeInput($_POST["AccPasswordCheck"]), PASSWORD_BCRYPT, ['cost' => 12]);
        $verificationtoken = password_hash(rand(1, 1000000), PASSWORD_BCRYPT, ['cost' => 12]);
        define("nameRegex", '/^[a-z ,.\'-]+$/i', true);
        define("usernameRegex", '/\w{5,29}/i', true);
        define("mailRegex", '/(?:[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/', true);
        define("passwordRegex", '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', true);

        try {
            if (!preg_match(nameRegex, $name)) {
                echo "<div class=\"alert alert-danger\" role=\"alert\">You are the type of person to have a red line under your name in word.</div>";
                die();
            }
            if (!preg_match(usernameRegex, $username)) {
                echo "<div class=\"alert alert-danger\" role=\"alert\">Your username doesn't follow our rules!</div>";
                die();
            }
            if (!preg_match(mailRegex, $email)) {
                echo "<div class=\"alert alert-danger\" role=\"alert\">This isn't a valid email adress!</div>";
                die();
            }
            if (!preg_match(passwordRegex, $_POST["AccPassword"])) {
                echo "<div class=\"alert alert-danger\" role=\"alert\">Your password should be 8 characters long, have one uppercase and lowercase letters and a number!</div>";
                die();
            }
            if ($_POST["AccPassword"] !== $_POST["AccPasswordCheck"]) {
                echo "<div class=\"alert alert-danger\" role=\"alert\">asswords don't match!</div>";
                die();
            }

            $dbh = db();

            $stmt = $dbh->prepare("INSERT INTO `users` (name, username, email, password, verifytoken) VALUES (:name, :username, :email, :password, :verifytoken)");
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password);
            $stmt->bindParam(':verifytoken', $verificationtoken);
            $stmt->execute();

            $id = $dbh->lastInsertId();

            $stmt = $dbh->prepare("INSERT INTO logintokens (user_id, token) VALUES (:user_id, :token)");
            $stmt->bindParam(':user_id', $id);
            $stmt->bindParam(':token', $token);
            $stmt->execute();


            $dbh = null;
            echo "<p id='succesMessage'>added to the database</p>";
            sendVerificationMail($email, $name, $verificationtoken);
            echo "<script>location = \"http://live.datahunt.duckdns.org/\";</script>";
        } catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();

        }
    }

    ?>
</div>
</div>
<?php include '../elements/footer.php' ?>
