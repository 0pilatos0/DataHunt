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

?>
    <div id="container">
        <h1>Admin Panel</h1>
        <div id="buttons">
            <button onclick="show('usertable')">Usertable</button>

            <!-- <button onclick="show('patchnotes')">Patchnotes</button> -->

        </div>
        <div id="usertable" class="hide">
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
            document.getElementById(div).classList.add("show");
            document.getElementById(div).classList.remove("hide");
        }

    </script>
<?php include '../elements/footer.php'; ?>