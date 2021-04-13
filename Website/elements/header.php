<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"> 
    <script src="https://kit.fontawesome.com/b7ec31b3a5.js" crossorigin="anonymous"></script>
    <link href="../css/datahunt.css" type="text/css" rel="stylesheet">
    <title>DataHunt</title>
</head>
<style>
    body {
        background-color: #333333;
        font-family: 'RocknRoll One', sans-serif;
        color: white;
    }

    .navigation {
        margin-top: 30px;
        text-align: center;
    }

    .navigation ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: rgb(61, 61, 61);

    }

    .navigation ul li {
        float: left;
    }

    .navigation ul a {
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }

    .bold {
        font-weight: bolder;
    }

    li a:hover:not(.active) {
        background-color: #111;
    }

    .active {
        background-color: #ffffff;
        color: black !important;
    }

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #333333;
        color: white;
        text-align: center;
    }
</style>

<body>

    <div class="container">
        <nav class="navigation">
            <h1 class="bold">DATAHUNT</h1>
            <ul>
                <li><a class="active" href="">Home</a></li>
                <li><a href=" #home">Updates</a></li>
                <?php
                    session_start();
                require $_SERVER["DOCUMENT_ROOT"] . "/Website/php/database.php";
                require $_SERVER["DOCUMENT_ROOT"] . "/Website/php/functions.php";
                    if(isset($_SESSION['user']) && !empty($_SESSION['user'])) {
                       echo '<li style="float:right"><a href="/Website/pages/logout">Logout</a></li>';
                       echo '<li style="float:right"><a href="/Website/pages/user">User</a></li>';
                       echo '<li style="float:right"><a href="/Website/pages/friends">Friends</a></li>';
                       $_SESSION["userinfo"] = userInfo($_SESSION["user"]);
                    }else{
                        echo '                
                        <li style="float:right"><a href="/Website/pages/register">Registration</a></li>
                        <li style="float:right"><a href="/Website/pages/login">Login</a></li>';
                    }
                ?>
                <li style="float:right"><a href="#news">Game</a></li>

            </ul>
        </nav>