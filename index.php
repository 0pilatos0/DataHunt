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
    <title>DataHunt || Home</title>
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
                <li><a class="active" href="#home">Home</a></li>
                <li><a href=" #home">Updates</a></li>
                <li style="float:right"><a href="#news">Game</a></li>
                <li style="float:right"><a href="./Website/pages/register">Registration</a></li>
                <li style="float:right"><a href="./Website/pages/login">Login</a></li>
            </ul>
        </nav>
        <div class="content">

        </div>
        <footer class="footer">
            <p>© 2021 - Datahunt Team</p>
        </footer>

    </div>

    <!-- Optional JavaScript; choose one of the two! -->

    <!-- Option 1: Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous">
    </script>

    <!-- Option 2: Separate Popper and Bootstrap JS -->
    <!--
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.6.0/dist/umd/popper.min.js" integrity="sha384-KsvD1yqQ1/1+IA7gi3P0tyJcT3vR+NdBTt13hSJ2lnve8agRGXTTyNaBYmCR/Nwi" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.min.js" integrity="sha384-nsg8ua9HAw1y0W1btsyWgBklPnCUAFLuTMS2G72MMONqmOymq585AcH49TLBQObG" crossorigin="anonymous"></script>
    -->
</body>

</html>