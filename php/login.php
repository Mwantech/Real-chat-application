<?php 
session_start();
include_once "dbconnect.php";

$username = mysqli_real_escape_string($conn, $_POST['username']);
$password = mysqli_real_escape_string($conn, $_POST['password']);

if(!empty($username) && !empty($password)){
    $sql = mysqli_query($conn, "SELECT * FROM users WHERE username = '{$username}'");
    if(mysqli_num_rows($sql) > 0){
        $row = mysqli_fetch_assoc($sql);
        $user_pass = md5($password);
        $enc_pass = $row['password'];
        if($user_pass === $enc_pass){
            $status = "Active now";
            $sql2 = mysqli_query($conn, "UPDATE users SET status = '{$status}' WHERE unique_id = {$row['unique_id']}");
            if($sql2){
                $_SESSION['unique_id'] = $row['unique_id'];
                header("Location: ../public/chatbox.php");
            }else{
                echo "Something went wrong. Please try again!";
            }
        }else{
            echo "Username or Password is Incorrect!";
        }
    }else{
        echo "$username - This username does not exist!";
    }
}else{
    echo "All input fields are required!";
}
?>
