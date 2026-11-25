<?php
require '../config/db.php';
checkAdmin();
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? [];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, name, email, role, status, created_at FROM users");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
if ($method === 'POST') {
    requireFields($data, ['name','email','password','role']);
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400); echo json_encode(["error"=>"Invalid email"]); exit;
    }
    $hash = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)");
    $stmt->execute([clean($data['name']), clean($data['email']), $hash, clean($data['role'])]);
    echo json_encode(["success"=>true]);
}
if ($method === 'PUT') { // Update status / role
    $stmt = $pdo->prepare("UPDATE users SET role=?, status=? WHERE id=?");
    $stmt->execute([clean($data['role']), clean($data['status']), $data['id']]);
    echo json_encode(["success"=>true]);
}
if ($method === 'DELETE') {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id=?");
    $stmt->execute([$data['id']]);
    echo json_encode(["success"=>true]);
}
?>