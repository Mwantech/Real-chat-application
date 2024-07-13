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

$outgoing_msg_id = $_SESSION['unique_id'];
$incoming_msg_id = $_POST['unique_id'];
$message = $_POST['message'];

// Sanitize message input to prevent SQL injection
$message = $conn->real_escape_string($message);

$sql = "INSERT INTO messages (incoming_msg_id, outgoing_msg_id, msg) VALUES ('$incoming_msg_id', '$outgoing_msg_id', '$message')";
if ($conn->query($sql) === TRUE) {
    echo "Message sent successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
