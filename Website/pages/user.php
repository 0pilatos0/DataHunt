<?php

$user = ['name' => 'test']

?>
<!DOCTYPE html>
<html>
    <head>
        <title>User</title>
        <link rel="stylesheet" type="text/css" href="">
    </head>
    <body>
        <div id="container">
            <h1>//username</h1>
            <div id="characters">
                //foreach all characters a user has I.E
                <a href="character?id=0">test</a>
                <a href="character?id=1">test</a>
            </div>

            <div id="delete">
                //deleteaccount
            </div>

            <form action="#" method="post">
                <label for="username">Username</label>
                <input name="username" id="username" value="//username">
                <label for="password">Password</label>
                <input name="password" id="password" value="//password" type="password">
                <label for="phone">Phone Number</label>
                <input name="phone" id="phone" value="//phone">
                <label for="email">email</label>
                <input name="email" id="email" value="//email">
                <input type="submit" value="Submit changes">
            </form>

            <div id="feed">
            //user achievements or other notable things
            </div>

            <div id="friendslist">
                //user friendslist
            </div>

            <div id="chat">
                //chat
            </div>

        </div>
    </body>
</html>