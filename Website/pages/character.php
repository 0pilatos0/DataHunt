<?php
require "../php/database.php";

if(empty($_SESSION["user"])){
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>User</title>
    <link rel="stylesheet" type="text/css" href="">
</head>
<body>
<div id="container">
    <div>
        <p>//Character name // class</p>
    </div>
    <div>
        //looping through stats
    </div>
    <div>
        //this characters achievement list
    </div>
</div>
</body>
</html>