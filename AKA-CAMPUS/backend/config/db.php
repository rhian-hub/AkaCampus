<?php
// config/db.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = "localhost";
$db   = "school_system";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB Connection failed: " . $e->getMessage()]);
    exit;
}

// Helper: sanitize + validate
function clean($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function requireFields($data, $fields) {
    foreach ($fields as $f) {
        if (empty($data[$f])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing field: $f"]);
            exit;
        }
    }
}

function checkAdmin() {
    session_start();
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized. Please login."]);
        exit;
    }
}
?>