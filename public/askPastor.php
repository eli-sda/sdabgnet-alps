<?php
include_once __DIR__ . '/constants.php';
include_once __DIR__ . '/form_helpers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(['error' => 'Методът не е разрешен.'], 405);
}

// Get and sanitize form fields
$name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$question = isset($_POST['question']) ? trim(strip_tags($_POST['question'], get_allowed_tags())) : '';

// Validate required fields
if ($name === '' || $email === '' || $question === '') {
    send_json_response(['error' => 'Липсват задължителни полета.'], 400);
}

// Validate email
if (!is_valid_email($email)) {
    send_json_response(['error' => 'Невалиден имейл адрес.'], 400);
}

// Prepare email
$to = 'webmaster@sdabg.net';
$subject = "❔ [$DOMAIN] Въпрос към ПАСТОР ОНЛАЙН";
$body = "<html><body>"
    . "<p><strong>Име:</strong> " . nl2br($name) . "</p>"
    . "<p><strong>Имейл:</strong> " . nl2br($email) . "</p>"
    . "<p><strong>Въпрос:</strong><br>" . nl2br($question) . "</p>"
    . "</body></html>";
$headers = "From: sdabg.net <no-reply@sdabg.net>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "Reply-To: $email\r\n";

// Send email
$success = mail($to, $subject, $body, $headers);

if ($success) {
    send_json_response(['success' => true]);
} else {
    send_json_response(['error' => 'Грешка при изпращане на въпроса.'], 500);
}
