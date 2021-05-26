<?php
include '../elements/header.php' ;

if(!$userinfo["role_id"]){
    echo "<script>location = \"http://datahunt.duckdns.org\";</script>";
}

if(isset($_GET["delete"])){
    if($_GET["delete"] === "true"){
        echo "
            <div id=\"delete-account-overlay\" onclick='removeOverlay()' class=\"overlay delete-element\">
                
            </div>
            <div class=\"delete-confirm delete-element\">
                <h3>Are you sure you want to delete your account?</h3>
                <button id=\"cancel\" onclick=\"removeOverlay()\" class=\"btn btn-cancel\">Cancel</button>
                <a href=\"?delete=confirm&id={$_GET["id"]}\" class=\"btn btn-confirm\">Confirm</a>
                </div>";
    }
    elseif($_GET["delete"] === "confirm"){
        adminDelete($_GET["id"]);
        echo "<script>location = \"/admin\"</script>";
    }
}
if(isset($_GET["ban"])){
    if($_GET["ban"] === "true"){
        echo "
            <div id=\"delete-account-overlay\" onclick='removeOverlay()' class=\"overlay delete-element\">
                <div class=\"card card-info\">
                    <div class=\"card-header\">
                        <h3 class=\"card-title\">Ban User</h3>
                    </div>
                    <form class=\"form-horizontal\ target=\"_self\">
                        <div class=\"card-body\">
                            <div class=\"form-group row\">
                                <label for=\"id\" class=\"col-sm-2 col-form-label\">User ID</label>
                                <div class=\"col-sm-10\">
                                    <input class=\"form-control\" id=\"id\" type='number' value='{$_GET["id"]}'>
                                </div>
                            </div>
                            <div class=\"form-group row\">
                                <label for=\"date\" class=\"col-sm-2 col-form-label\">Ban Until</label>
                                 <div class=\"col-sm-10\">
                                    <input type=\"date\" class=\"form-control\" id=\"date\">
                                 </div>
                            </div>
                            <input class='hide' id=\"banBy\" value='{$userinfo["id"]}'>
                        </div>
                        <div class=\"card-footer\">
                            <button type=\"submit\" class=\"btn btn-info\">Sign in</button>
                            <button type=\"submit\" class=\"btn btn-default float-right\">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>";
    }
}
if(isset($_POST["date"])){
    banUser($_POST);
}

?>
    <div id="container">
        <h1>Admin Panel</h1>
        <div id="buttons">
            <button onclick="show('usertable')">usertable</button>
            <button onclick="show('patchnotes')">patchnotes</button>

        </div>
        <div id="usertable">
            <h1>User Table</h1>
            <table>
                <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Enabled</th>
                    <th>Verified</th>
                    <th>Role</th>
                    <th></th>
                </tr>
                <?php

                foreach(getUsers() as $user){
                    echo "<tr>
                    <td>{$user["id"]}</td>
                    <td>{$user["name"]}</td>
                    <td>{$user["username"]}</td>
                    <td>{$user["email"]}</td>
                    <td>{$user["enabled"]}</td>
                    <td>{$user["verified"]}</td>
                    <td>{$user["role_id"]}</td>
                    
                    <td>
                    <a href=\"?ban=true&id={$user["id"]}\"><i class=\"fas fa-ban\"></i></a>
                    <a href=\"?delete=true&id={$user["id"]}\"><i class=\"fas fa-trash\"></i></a>
                    </td>
                    </tr>";
                }


                ?>
            </table>
        </div>
        <div id="patchnotes" class="hide">
            <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
            <div id="editor">

            </div>

            <button type="button" class="btn btn-block btn-primary" onclick="getData()">Submit</button>
            <script src="//cdn.quilljs.com/1.3.6/quill.js"></script>
            <script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
            <script src="./../js/editor.js"></script>

            <?php
            if(isset($_POST['data']) && $_POST['data'] !== '<p><br></p>'){
                makePatchnote($_POST['data']);
            }
            ?>
        </div>

    </div>
    <script>

        function removeOverlay(){
            let f = document.getElementsByClassName("delete-element");
            while (f.length > 0){
                f[0].remove();
            }
        }
        function show(div){
            let buttons = document.getElementById("buttons").children;
            for(let i = 0; i < buttons.length; i++){
                document.getElementById(buttons[i].innerHTML).classList.add("hide");
            }
            document.getElementById(div).classList.remove("hide");
        }

    </script>
<?php include '../elements/footer.php'; ?>