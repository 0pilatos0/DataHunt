<?php
require "../php/database.php";
require "../php/functions.php";
include './../elements/header.php';

$userinfo = userInfo($_SESSION["user"]);



?>

        <div class="user-container">
            <div class="user-characters">
                <div class="card-header">
                    <h3>Characters</h3>
                </div>
                <div>
                    <ul class="list-group list-group-flush">

                        <?php showCharacters(characters($_SESSION["user"])); ?>

                    </ul>
                </div>
            </div>

            <div class="user user-feed">
                <div class="card-header">
                    <h3>Feed</h3>
                </div>
            </div>

            <form class="user user-form" method="post">
                <div>
                    <div class="card-header">
                        <h3>Change account</h3>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <label for="username">Username</label>
                            <div class="col-sm-10">
                                <input class="input form-control" name="username" id="username" value="<?php echo $userinfo["username"] ?>"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <label for="oldPassword">Old password</label>
                            <div class="col-sm-10">
                                <input class="input form-control" name="oldPassword" id="oldPassword" value="" type="password"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <label for="newPassword1">New password</label>
                            <div class="col-sm-10">
                                <input class="input form-control" name="newPassword1" id="newPassword1" value="" type="password"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <label for="newPassword2">Verify new password</label>
                            <div class="col-sm-10">
                                <input class="input form-control" name="newPassword2" id="newPassword2" value="" type="password"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <label for="email">Email</label>
                            <div class="col-sm-10">
                                <input class="input form-control" name="email" id="email" value="<?php echo $userinfo["email"] ?>"><br>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <input type="submit" class="btn btn-primary" value="Save changes">
                            <a class="btn btn-primary" href="#?delete=true">Delete account</a>
                        </li>
                    </ul>

                </div>
            </form>




            <div class="user user-friend">
                <div class="card-header">
                    <h3>Friends</h3>
                </div>
            </div>


        </div>
<?php include '../elements/footer.php' ?>