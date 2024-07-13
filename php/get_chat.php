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
$chat_unique_id = $_GET['unique_id'];
$sql = "SELECT * FROM messages WHERE (incoming_msg_id = '$unique_id' AND outgoing_msg_id = '$chat_unique_id') OR (incoming_msg_id = '$chat_unique_id' AND outgoing_msg_id = '$unique_id') ORDER BY msg_id ASC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $msg_class = $row['outgoing_msg_id'] == $unique_id ? 'sent' : 'received';
        echo '<div class="message ' . $msg_class . '" data-id="' . $row['msg_id'] . '">' . htmlspecialchars($row['msg'], ENT_QUOTES, 'UTF-8') . '</div>';
    }
} else {
    echo '<p>No messages yet</p>';
}

$conn->close();
?>
