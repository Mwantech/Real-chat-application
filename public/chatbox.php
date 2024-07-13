<?php
session_start();
if (!isset($_SESSION['unique_id'])) {
    header("Location: ../index.html");
    exit();
}

$conn = new mysqli("localhost", "root", "", "mwaschatapp");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$unique_id = $_SESSION['unique_id'];
$result = $conn->query("SELECT * FROM users WHERE unique_id = '$unique_id'");
$user = $result->fetch_assoc();

$profilePic = $user['img'] ? '../php/images/' . $user['img'] : 'images/default.jpg';
$username = $user['username'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Interface</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="../css/main.css">
  
</head>
<body>
<div class="container">
        <div class="user-section" id="user-section">
            <div class="user-header">
                <img src="<?php echo $profilePic; ?>" alt="Profile Picture" class="profile-pic">
                <span class="username"><?php echo $username; ?></span>
                <button class="logout-button" onclick="location.href='../php/logout.php'"><i class="fas fa-sign-out-alt"></i></button>
                <button class="search-icon"><i class="fas fa-search"></i></button>
                <input type="text" class="search-bar" placeholder="Search users..." style="display:none;">
            </div>
            <div class="user-list" id="user-list">
                <!-- User list will be loaded here -->
            </div>
        </div>
        <div class="chat-section" id="chat-section" data-unique-id="">
            <div class="chat-header">
                <img src="" alt="Profile Picture" class="profile-pic">
                <div class="icon-buttons">
                    <button class="video-call-icon"><i class="fas fa-video"></i></button>
                    <button class="voice-call-icon"><i class="fas fa-phone"></i></button>
                    <button class="options-icon"><i class="fas fa-ellipsis-v"></i></button>
                </div>
                <div class="options-menu">
                    <button class="block-button" data-action="block"><i class="fas fa-ban"></i> Block</button>
                    <button class="report-button"><i class="fas fa-flag"></i> Report</button>
                </div>
            </div>
            <div class="chat-area" id="chat-area">
                <!-- Chat messages will be displayed here -->
            </div>
            <div class="input-area">
                <button class="attachment-button"><i class="fas fa-paperclip"></i></button>
                <input type="file" id="file-input" style="display:none;">
                <div class="attachment-options">
                    <button class="upload-picture"><i class="fas fa-image"></i> Upload Picture</button>
                    <button class="upload-document"><i class="fas fa-file"></i> Upload Document</button>
                </div>
                <input type="text" class="message-input" placeholder="Type a message">
                <button class="send-button"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
    <script src="../js/chatbox.js"></script>
    <script src="../js/sendingmessage.js"></script>
    <script src="../js/ajaxpolling.js"></script>
    <script src="../js/loadChat.js"></script>
</body>
</html>
