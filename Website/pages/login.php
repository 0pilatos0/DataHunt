<?php include '../elements/header.php' ?>
<div class="content">

    <div id="container" >
        <img class="login-img" src="https://via.placeholder.com/800x427.png?text=Hier+komt+coole+afbeelding+van+game" alt="">
        <form class="formLogin" method="post" style="width: 30rem;">
            <div>
                <div class="card-header">
                    <h3>Login</h3>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <label for="AccUsername" class="col-sm-1 col-form-label">Username</label>
                        <div class="col-sm-10">
                            <input type="text" name="AccUsername" class="input form-control" id="username"><br>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <label for="AccPassword" class="col-sm-1 col-form-label">Password</label>
                        <div class="col-sm-10">
                            <input type="password" name="AccPassword" class="input form-control" id="password"><br>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <label for="AccRemember" class="col-sm-9 col-form-label">Remember me</label>
                        <input type="checkbox" name="AccRemember" id="AccRemember">
                    </li>
                    <li class="list-group-item">
                        <input type="submit" class="btn btn-primary" value="Log In">
                    </li>
                </ul>
            </div>
        </form>
        <?php
        require "../php/database.php";
        require "../php/functions.php";
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $username = changeInput($_POST["AccUsername"]);
            $password = changeInput($_POST["AccPassword"]);
            $token = password_hash(rand(1, 1000000), PASSWORD_BCRYPT, ['cost' => 12]);
            setrawcookie("token", $token, time() + (86400 * 30));
            define("usernameRegex", '/\w{5,29}/i', true);
            define("passwordRegex", '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', true);
            if (!preg_match(usernameRegex, $username)) {
                echo "<div class=\"alert alert-danger\" role=\"alert\">Your username doesn't follow our rules!</div>";
                die();
            }
            if (!preg_match(passwordRegex, $_POST["AccPassword"])) {
                echo "<div class=\"alert alert-danger\" role=\"alert\">Password is incorrect!</div>";
                die();
            }

            $dbh = db();
            $stmt = $dbh->prepare("SELECT * FROM `users` WHERE `username` = (:username) AND `enabled` = 1 and `verified` = 1");
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            $result = $stmt->fetch();
            $uid = $result['id'];
            if (password_verify($password, $result['password'])) {
                setSessionValue("user", $uid);
                echo 'Password is valid!';
                if ($_POST["AccRemember"] === "on") {
                    $dbh = db();
                    $stmt = $dbh->prepare("INSERT INTO logintokens (user_id, token) VALUES (:user_id, :token)");
                    $stmt->bindParam(':user_id', $uid);
                    $stmt->bindParam(':token', $token);
                    $stmt->execute();
                }
                $dbh = null;
                echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
            } else {
                $dbh = null;
                echo 'Invalid password or username';
            }
        }

        function changeInput($data)
        {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }

        ?>
    </div>
</div>
<?php include '../elements/footer.php' ?>
