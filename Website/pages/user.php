<?php
require "../php/database.php";
include './../elements/header.php';

$userinfo = userInfo($_SESSION["user"]);
$characters = characters($_SESSION["user"]);


?>

        <div id="container">
            <h1><?php ?></h1>
            <div id="characters">
                <?php for ($i = 0; $i < sizeof($characters); $i++){
                    $c = $characters[$i];
                    echo "<a href=\"character?id={$c["id"]}\">{$c["char_name"]}</a><br>";

                } ?>


            </div>



            <form method="post" style="width: 30rem;">
                <div>
                    <div class="card-header">
                        <h3>Change account</h3>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <label for="username">Username</label>
                            <div class="col-sm-10">
                                <input name="username" id="username" value="<?php echo $userinfo["username"] ?>"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <label for="oldPassword">Old password</label>
                            <div class="col-sm-10">
                                <input name="oldPassword" id="oldPassword" value="" type="password"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <label for="newPassword1">New password</label>
                            <div class="col-sm-10">
                                <input name="newPassword1" id="newPassword1" value="" type="password"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <label for="newPassword2">Verify new password</label>
                            <div class="col-sm-10">
                                <input name="newPassword2" id="newPassword2" value="" type="password"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <label for="email">Email</label>
                            <div class="col-sm-10">
                                <input name="email" id="email" value="<?php echo $userinfo["email"] ?>"><br>
                            </div>
                        </li>
                        <input type="submit" class="btn btn-primary" value="Log In">
                    </ul>

                </div>
            </form>
            <div id="delete">
                <a href="#?delete=true">Delete account</a>
            </div>

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
<?php include '../elements/footer.php' ?>