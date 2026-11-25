<?php
session_start();
require '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
requireFields($data, ['email','password']);

$stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
$stmt->execute([clean($data['email'])]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if ($admin && password_verify($data['password'], $admin['password'])) {
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_name'] = $admin['name'];
    $_SESSION['admin_role'] = $admin['role'];
    echo json_encode(["success" => true, "message" => "Login success", "admin" => [
        "id" => $admin['id'], "name" => $admin['name'], "email" => $admin['email'], "role" => $admin['role']
    ]]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid email or password"]);
}
?>