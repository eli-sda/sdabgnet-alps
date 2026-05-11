<?php
include_once __DIR__ . '/cors.php';
include_once __DIR__ . '/constants.php';
include_once __DIR__ . '/form_helpers.php';

header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(['error' => 'Методът не е разрешен.'], 405);
}

// Get and sanitize form fields
$name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$topic = isset($_POST['topic']) ? sanitize($_POST['topic']) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'], get_allowed_tags())) : '';

// Validate required fields
if ($name === '' || $phone === '' || $message === '') {
    send_json_response(['error' => 'Липсват задължителни полета.'], 400);
}

// Validate email if present
if ($email !== '' && !is_valid_email($email)) {
    send_json_response(['error' => 'Невалиден имейл адрес.'], 400);
}

// Prepare email
$to = 'webmaster@sdabg.net, gabi.ortova@gmail.com';
// Sanitize subject to prevent header injection
$subject = sanitize_header("💬 [$DOMAIN] Съобщение от контактната форма");

// Sanitize all fields at the sink — decode sanitize()'s encoding first to avoid double-encoding,
// then strip tags and re-encode once. ENT_NOQUOTES used since content goes inside tag bodies, not attributes.
$topicEscaped = htmlspecialchars(strip_tags(html_entity_decode($topic, ENT_QUOTES | ENT_HTML5, 'UTF-8')), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
$nameEscaped = htmlspecialchars(strip_tags(html_entity_decode($name, ENT_QUOTES | ENT_HTML5, 'UTF-8')), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
$phoneEscaped = htmlspecialchars(strip_tags(html_entity_decode($phone, ENT_QUOTES | ENT_HTML5, 'UTF-8')), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
$emailEscaped = htmlspecialchars(strip_tags(html_entity_decode($email, ENT_QUOTES | ENT_HTML5, 'UTF-8')), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
// Message retains allowed HTML tags from strip_tags() whitelist — already bounded at input
$messageEscaped = $message;

$body = "<html><body>"
    . "<p><strong>Тема:</strong> " . nl2br($topicEscaped) . "</p>"
    . "<p><strong>Име:</strong> " . nl2br($nameEscaped) . "</p>"
    . "<p><strong>Телефон:</strong> " . nl2br($phoneEscaped) . "</p>"
    . "<p><strong>Имейл:</strong> " . nl2br($emailEscaped) . "</p>"
    . "<p><strong>Съобщение:</strong><br>" . nl2br($messageEscaped) . "</p>"
    . "</body></html>";
$headers = "From: sdabg.net <no-reply@sdabg.net>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
if ($email !== '') {
    $headers .= "Reply-To: " . sanitize_header($email) . "\r\n";
}
// Send email
$success = mail($to, $subject, $body, $headers);

if ($success) {
    send_json_response(['success' => true]);
} else {
    $logLine = date('Y-m-d H:i:s') . " - Error sending message from contact form: " . json_encode($_POST, JSON_UNESCAPED_UNICODE) . "\n\n\n";
    file_put_contents(__DIR__ . '/send_mail.log', $logLine, FILE_APPEND);
    send_json_response(['error' => 'Грешка при изпращане на съобщението.'], 500);
}
