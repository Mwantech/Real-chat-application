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
$chat_unique_id = $_GET['chat_unique_id'];
$last_message_id = $_GET['last_message_id'];

$sql = "SELECT * FROM messages WHERE ((incoming_msg_id = '$unique_id' AND outgoing_msg_id = '$chat_unique_id') OR (incoming_msg_id = '$chat_unique_id' AND outgoing_msg_id = '$unique_id')) AND msg_id > '$last_message_id' ORDER BY msg_id ASC";
$result = $conn->query($sql);

$messages = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $messages[] = [
            'msg_id' => $row['msg_id'],
            'outgoing_msg_id' => $row['outgoing_msg_id'],
            'msg' => htmlspecialchars($row['msg'], ENT_QUOTES, 'UTF-8')
        ];
    }
}

echo json_encode($messages);
$conn->close();
?>
