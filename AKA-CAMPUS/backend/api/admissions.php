<?php
// api/admissions.php
require '../config/db.php';
checkAdmin();
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? [];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT a.*, c.course_name FROM admissions a LEFT JOIN courses c ON a.course_id=c.id ORDER BY a.applied_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
if ($method === 'POST') {
    requireFields($data, ['student_name','course_id']);
    $stmt = $pdo->prepare("INSERT INTO admissions (student_name, course_id) VALUES (?,?)");
    $stmt->execute([clean($data['student_name']), $data['course_id']]);
    echo json_encode(["success"=>true]);
}
if ($method === 'PUT') { // Approve / Reject
    if (!in_array($data['status'], ['pending','approved','rejected'])) {
        http_response_code(400); echo json_encode(["error"=>"Invalid status"]); exit;
    }
    $stmt = $pdo->prepare("UPDATE admissions SET status=? WHERE id=?");
    $stmt->execute([$data['status'], $data['id']]);
    echo json_encode(["success"=>true]);
}
if ($method === 'DELETE') {
    $stmt = $pdo->prepare("DELETE FROM admissions WHERE id=?");
    $stmt->execute([$data['id']]);
    echo json_encode(["success"=>true]);
}
?>