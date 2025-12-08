<?php
require_once __DIR__ . '/cors.php';
include_once __DIR__ . '/constants.php';
include_once __DIR__ . '/form_helpers.php';

header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(['error' => 'Методът не е разрешен.'], 405);
}

// Get and sanitize form fields
$type = isset($_POST['type']) ? sanitize($_POST['type']) : '';
$typeText = isset($_POST['typeText']) ? sanitize($_POST['typeText']) : '';
$name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$place = isset($_POST['place']) ? sanitize($_POST['place']) : '';
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$ad = isset($_POST['ad']) ? trim(strip_tags($_POST['ad'], get_allowed_tags())) : '';

// Validate required fields
if ($name === '' || $place === '' || $phone === '' || $email === '' || $ad === '') {
    send_json_response(['error' => 'Липсват задължителни полета.'], 400);
}

// Validate email
if (!is_valid_email($email)) {
    send_json_response(['error' => 'Невалиден имейл адрес.'], 400);
}

// Handle image upload (optional)
$hasImage = isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK;
$attachment = '';
$attachmentName = '';
$attachmentType = '';
if ($hasImage) {
    $allowedTypes = ['image/jpeg', 'image/png'];
    $maxSize = 1024 * 1024; // 1MB
    $fileType = $_FILES['image']['type'];
    $fileSize = $_FILES['image']['size'];
    if (!in_array($fileType, $allowedTypes)) {
        send_json_response(['error' => 'Позволени са само JPG и PNG изображения.'], 400);
    }
    if ($fileSize > $maxSize) {
        send_json_response(['error' => 'Изображението трябва да е до 1MB.'], 400);
    }
    $attachment = chunk_split(base64_encode(file_get_contents($_FILES['image']['tmp_name'])));
    $attachmentName = $_FILES['image']['name'];
    $attachmentType = $fileType;
}

// Prepare email with or without attachment
$to = 'webmaster@sdabg.net, gabi.ortova@gmail.com';
// Sanitize subject to prevent header injection
$subject = sanitize_header("📝[$DOMAIN] Нова обява от $name ($type)");

// Additional HTML escaping for email body (already sanitized, but explicit for security scanners)
$typeTextEscaped = htmlspecialchars($typeText, ENT_QUOTES, 'UTF-8');
$nameEscaped = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$placeEscaped = htmlspecialchars($place, ENT_QUOTES, 'UTF-8');
$phoneEscaped = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$emailEscaped = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
// Ad already has allowed HTML tags from strip_tags(), so don't escape it
$adEscaped = $ad;

$bodyHtml = "<html><body>"
    . "<p><strong>Тип на обявата:</strong> " . nl2br($typeTextEscaped) . "</p>"
    . "<p><strong>Име за контакт:</strong> " . nl2br($nameEscaped) . "</p>"
    . "<p><strong>Населено място:</strong> " . nl2br($placeEscaped) . "</p>"
    . "<p><strong>Телефонен номер:</strong> " . nl2br($phoneEscaped) . "</p>"
    . "<p><strong>Имейл:</strong> " . nl2br($emailEscaped) . "</p>"
    . "<p><strong>Обява:</strong><br>" . nl2br($adEscaped) . "</p>"
    . "</body></html>";

$headers = "From: sdabg.net <no-reply@sdabg.net>\r\n";
$headers .= "Reply-To: " . sanitize_header($email) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";

if ($hasImage) {
    $boundary = bin2hex(random_bytes(16));
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $bodyHtml . "\r\n";
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: $attachmentType; name=\"$attachmentName\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$attachmentName\"\r\n\r\n";
    $body .= $attachment . "\r\n";
    $body .= "--$boundary--";
} else {
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $body = $bodyHtml;
}

// Send email
$success = mail($to, $subject, $body, $headers);

if ($success) {
    send_json_response(['success' => true]);
} else {
    $logLine = date('Y-m-d H:i:s') . " - Error sending ad: " . json_encode($_POST, JSON_UNESCAPED_UNICODE) . "\n\n\n";
    file_put_contents(__DIR__ . '/send_mail.log', $logLine, FILE_APPEND);
    send_json_response(['error' => 'Грешка при изпращане на обявата.'], 500);
}
