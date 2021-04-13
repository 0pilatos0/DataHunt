<?php

include './../elements/header.php';

if (empty($_SESSION["user"])) {
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}

$results = getMultipleFriendships($_SESSION["user"]);
$user = getUsername($_SESSION["user"]);

for ($i = 0; $i < count($results); $i++) {
    if ($results[$i]["userA"] == $_SESSION["user"]) {
        $results[$i]["name"] = getUsername($results[$i]["userB"])[0];
    } else {
        $results[$i]["name"] = getUsername($results[$i]["userA"])[0];
    }
}
?>

    <div id="friendsContainer">
        <div id="friendsMenu">
            <?php
            foreach ($results as $index) {
                echo "<div class=\"card text-secondary w-75 mt-4\" style=\"width: 18rem;\">
                <div class=\"card-body\">
                    <h5 class=\"card-title\">" . $index["name"] . "</h5>";

                if ($index["friendship"] == 0 && $index["userA"] == $_SESSION["user"]) {
                    echo "<p class=\"card-text\">User hasn't replied to your request yet.</p>";
                } elseif ($index["friendship"] == 0 && $index["userB"] == $_SESSION["user"]) {
                    echo "<p class=\"card-text\">You have an incoming friend request.</p>";
                }elseif ($index["friendship"] == 1) {
                    echo "<p class=\"card-text\">You are friends.</p>";
                }
                echo "
                </div>
            </div>";
            }
            ?>
        </div>
        <div id="friendsForm">
            <form method="post" class="formLogin">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><label for="AccUsername"
                                                       class="col-sm-1 col-form-label">Username</label>
                        <div class="col-sm-10">
                            <input type="text" name="AccUsername" id="username" class="input form-control"><br>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <input type="submit" class="btn btn-primary" value="Add Friend">
                    </li>
                </ul>
            </form>
        </div>
    </div>
<?php
if ($_SERVER['REQUEST_METHOD'] == "POST") {
    var_dump($_POST);
    if (!empty($_POST["AccUsername"])) {
        $username = changeInput($_POST["AccUsername"]);
        define("usernameRegex", '/\w{5,29}/i', true);
        if (!preg_match(usernameRegex, $username)) {
            echo "<div class=\"alert alert-danger\" role=\"alert\">The username doesn't follow our rules</div>";
            die();
        }

        $friendId = getUserId($username);
        $friendship = getFriendship($_SESSION["user"], $friendId[0]);

        if (!empty($friendship)) {
            echo "you are already friends with this users";
            if ($friendship["friendship"] == 0 && $friendship["userA"] == $friendId) {
                updateFriendship($friendship["id"], 1);
                echo "<script>location = \"http://datahunt.duckdns.org/Website/pages/friends\";</script>";
            }
        } elseif ($friendId === false) {
            echo "user doesn't exist";
        } else {
            echo "adding you as a friend right now :)";
            setFriendship($_SESSION["user"], $friendId[0], 0);
            echo "<script>location = \"http://datahunt.duckdns.org/Website/pages/friends\";</script>";
        }
    }
}
?>
<?php include '../elements/footer.php' ?>