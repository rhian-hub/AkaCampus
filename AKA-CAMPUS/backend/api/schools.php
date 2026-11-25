<?php
require '../config/db.php';
checkAdmin();
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? $_POST;

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM schools ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($method === 'POST') {
    requireFields($data, ['name']);
    $stmt = $pdo->prepare("INSERT INTO schools (name, address, contact) VALUES (?,?,?)");
    $stmt->execute([clean($data['name']), clean($data['address'] ?? ''), clean($data['contact'] ?? '')]);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
}

if ($method === 'PUT') {
    requireFields($data, ['id','name']);
    $stmt = $pdo->prepare("UPDATE schools SET name=?, address=?, contact=? WHERE id=?");
    $stmt->execute([clean($data['name']), clean($data['address'] ?? ''), clean($data['contact'] ?? ''), $data['id']]);
    echo json_encode(["success" => true]);
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare("DELETE FROM schools WHERE id=?");
    $stmt->execute([$data['id']]);
    echo json_encode(["success" => true]);
}
?>