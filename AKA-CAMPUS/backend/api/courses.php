<?php
require '../config/db.php';
checkAdmin();
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true) ?? [];

if ($method === 'GET') {
    // Courses + Curriculum join
    $sql = "SELECT c.*, s.name as school_name,
            (SELECT COUNT(*) FROM curriculum WHERE course_id=c.id) as subject_count
            FROM courses c LEFT JOIN schools s ON c.school_id=s.id";
    echo json_encode($pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC));
}

if ($method === 'POST') {
    requireFields($data, ['school_id','course_name']);
    $stmt = $pdo->prepare("INSERT INTO courses (school_id, course_name, description, duration) VALUES (?,?,?,?)");
    $stmt->execute([$data['school_id'], clean($data['course_name']), clean($data['description'] ?? ''), clean($data['duration'] ?? '')]);
    $course_id = $pdo->lastInsertId();

    // Optional: insert curriculum at same time
    if (!empty($data['curriculum'])) {
        $cstmt = $pdo->prepare("INSERT INTO curriculum (course_id, subject_name, year_level, semester, units) VALUES (?,?,?,?,?)");
        foreach ($data['curriculum'] as $sub) {
            $cstmt->execute([$course_id, clean($sub['subject_name']), $sub['year_level'], $sub['semester'], $sub['units']]);
        }
    }
    echo json_encode(["success" => true, "id" => $course_id]);
}

if ($method === 'PUT') {
    $stmt = $pdo->prepare("UPDATE courses SET course_name=?, description=?, duration=? WHERE id=?");
    $stmt->execute([clean($data['course_name']), clean($data['description'] ?? ''), clean($data['duration'] ?? ''), $data['id']]);
    echo json_encode(["success" => true]);
}

if ($method === 'DELETE') {
    $stmt = $pdo->prepare("DELETE FROM courses WHERE id=?");
    $stmt->execute([$data['id']]);
    echo json_encode(["success" => true]);
}
?>