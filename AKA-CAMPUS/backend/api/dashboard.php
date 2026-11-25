<?php
require '../config/db.php';
checkAdmin();

$stats = [];
$stats['total_schools'] = $pdo->query("SELECT COUNT(*) FROM schools")->fetchColumn();
$stats['total_courses'] = $pdo->query("SELECT COUNT(*) FROM courses")->fetchColumn();
$stats['total_users'] = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$stats['pending_admissions'] = $pdo->query("SELECT COUNT(*) FROM admissions WHERE status='pending'")->fetchColumn();
$stats['total_tuition'] = $pdo->query("SELECT COALESCE(SUM(amount),0) FROM tuition")->fetchColumn();

$recent = $pdo->query("SELECT * FROM admissions ORDER BY applied_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["stats" => $stats, "recent_admissions" => $recent]);
?>