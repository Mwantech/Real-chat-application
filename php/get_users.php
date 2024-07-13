<?php
session_start();
if (!isset($_SESSION['unique_id'])) {
    header("Location: login.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "mwaschatapp");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$unique_id = $_SESSION['unique_id'];
$sql = "SELECT users.unique_id, users.username, users.img, 
        (SELECT msg FROM messages WHERE (incoming_msg_id = users.unique_id OR outgoing_msg_id = users.unique_id) 
        AND (incoming_msg_id = '$unique_id' OR outgoing_msg_id = '$unique_id') 
        ORDER BY msg_id DESC LIMIT 1) AS last_message 
        FROM users WHERE users.unique_id != '$unique_id'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $userProfilePic = $row['img'] ? '../php/images/' . $row['img'] : 'images/default.jpg';
        $lastMessage = $row['last_message'] ? $row['last_message'] : 'No messages yet';
        echo '<div class="user" data-unique-id="' . $row['unique_id'] . '">';
        echo '<img src="' . $userProfilePic . '" alt="User Picture" class="profile-pic">';
        echo '<div class="user-info">';
        echo '<span class="username">' . $row['username'] . '</span>';
        echo '<span class="last-message">' . $lastMessage . '</span>';
        echo '</div>';
        echo '</div>';
    }
} else {
    echo '<p>No users found</p>';
}

$conn->close();
?>
