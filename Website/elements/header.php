<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
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

    .navigation li a:hover:not(.active) {
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

    <!-- 
      Toekomstige mij.....
      hier maak ik een hele coole string waarmee ik later
      de header kan inrichten
    -->

    <?php 
        $get_url = $_SERVER['REQUEST_URI'];
        $pattern = '([^\/]+$)';
        // Works in PHP 5.2.2 and later.
        preg_match($pattern, $get_url, $matches);
        $url = $matches[0];
        if ($url === null or $url === 'index.php') {
            $url = "home";
        }
    ?>


    <div class="container">
        <nav class="navigation">
            <h1 class="bold">DATAHUNT</h1>
            <ul>
                <!-- 
                  Toekomstige mij het spijt me wat ik je heb aangedaan maar....
                  Vergeet als je blieft niet een id te geven aan de link met de value die het zelfde is als de filename,
                  anders werkt de active page checker niet meer
                             
                                   Zijn het zelfde
                            /¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯\                       
                            |                           |
                  <a id="logout" href="/Website/pages/logout">Logout</a>
                
                  comment gemaakt op "2021-04-13"
                -->
                <li><a id="home" href="/index.php">Home</a></li>
                <li><a id="updates" href="/Website/pages/updates">Updates</a></li>
                <?php
                    session_start();
                require $_SERVER["DOCUMENT_ROOT"] . "/Website/php/database.php";
                require $_SERVER["DOCUMENT_ROOT"] . "/Website/php/functions.php";
                    if(isset($_SESSION['user']) && !empty($_SESSION['user'])) {
                        $_SESSION["userinfo"] = userInfo($_SESSION["user"]);
                        $userinfo =  $_SESSION["userinfo"];
                        $baninfo = checkBan($userinfo["id"]);
                        if(!empty($baninfo)){
                            if($baninfo["ban_until"] > date($dateformat)){
                                resetSession();
                            }
                        }

                        if($userinfo["role_id"]){
                            echo '<li><a id="admin" href="/Website/pages/admin">Admin</a></li>';
                        }
                       echo '<li style="float:right"><a id="logout" href="/Website/pages/logout">Logout</a></li>';
                       echo '<li style="float:right"><a id="user" href="/Website/pages/user">User</a></li>';
                       echo '<li style="float:right"><a id="friends" href="/Website/pages/friends">Friends</a></li>';

                    }else{
                        echo '                
                        <li style="float:right"><a id="register" href="/Website/pages/register">Registration</a></li>
                        <li style="float:right"><a id="login" href="/Website/pages/login">Login</a></li>';
                    }
                ?>
                <li style="float:right"><a href="#news">Game</a></li>
                <li style="float:right"><a href="/Website/pages/patchnotes">Patchnotes</a></li>

            </ul>
        </nav>

        <!-- 
            Toekomstige mij.....
            het spijt me wat ik je aangedaan
            maar hier krijgt de actieve pagina een speciaale
            class in de header
        -->
        
        <script defer>
            var element = document.getElementById("<?php echo $url; ?>");
            element.classList.add("active");
        </script>