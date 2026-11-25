<?php
// api/tuition.php
require '../config/db.php';
checkAdmin();
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? [];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT t.*, c.course_name FROM tuition t LEFT JOIN courses c ON t.course_id=c.id");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
if ($method === 'POST') {
    requireFields($data, ['course_id','amount']);
    if (!is_numeric($data['amount']) || $data['amount'] < 0) {
        http_response_code(400); echo json_encode(["error"=>"Invalid amount"]); exit;
    }
    $stmt = $pdo->prepare("INSERT INTO tuition (course_id, amount, misc_fee, school_year) VALUES (?,?,?,?)");
    $stmt->execute([$data['course_id'], $data['amount'], $data['misc_fee'] ?? 0, clean($data['school_year'] ?? '')]);
    echo json_encode(["success"=>true, "id"=>$pdo->lastInsertId()]);
}
if ($method === 'PUT') {
    $stmt = $pdo->prepare("UPDATE tuition SET amount=?, misc_fee=?, school_year=? WHERE id=?");
    $stmt->execute([$data['amount'], $data['misc_fee'] ?? 0, clean($data['school_year'] ?? ''), $data['id']]);
    echo json_encode(["success"=>true]);
}
if ($method === 'DELETE') {
    $stmt = $pdo->prepare("DELETE FROM tuition WHERE id=?");
    $stmt->execute([$data['id']]);
    echo json_encode(["success"=>true]);
}
?>