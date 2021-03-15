<!DOCTYPE html>
<html lang="eng">
<head>
    <title>login</title>
    <link rel="icon" href="https://avatars.githubusercontent.com/u/54599584?s=460&u=2028f3a15094713b305fb21f6b2fbda52b2e557a&v=4" type="image/ico">
    <link rel="stylesheet" type="text/css" href="">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
</head>
<body>
<div id="container" style="width: 18rem;">
    <form method="post">
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
                    <label for="AccRemember" class="col-sm-6 col-form-label">Remember me</label>
                    <input type="checkbox" id="AccRemember">
                </li>
                <li class="list-group-item">
                    <input type="submit" class="btn btn-primary" value="Log In">
                </li>
            </ul>
        </div>
    </form>
    <?php
    require"../php/database.php";
    require "../php/functions.php";
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = changeInput($_POST["AccUsername"]);
        $password = changeInput($_POST["AccPassword"]);
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
        if (password_verify($password, $result['password'])) {
            session_start();
            $_SESSION["user"] = $result["id"];
            echo 'Password is valid!';
            $dbh = null;
            header('location: http://datahunt.duckdns.org');
        } else {
            echo 'Invalid password.';
            $dbh = null;
        }
    }
    if (false) {
        header('Location: test.php');
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
<script src="../functions.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0"
        crossorigin="anonymous"></script>
</body>
</html>