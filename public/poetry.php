<?php
include_once __DIR__ . '/cors.php';
include_once __DIR__ . '/constants.php';
include_once __DIR__ . '/form_helpers.php';

header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(['error' => 'Методът не е разрешен.'], 405);
}

// Expected fields from PoetryForm
$author = isset($_POST['author']) ? sanitize($_POST['author']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$title = isset($_POST['title']) ? sanitize($_POST['title']) : '';
$text = isset($_POST['text']) ? trim(strip_tags($_POST['text'], get_allowed_tags())) : '';
$date = isset($_POST['date']) ? sanitize($_POST['date']) : '';

// Validate required fields (author, email, title, text)
if ($author === '' || $email === '' || $title === '' || $text === '') {
    send_json_response(['error' => 'Липсват задължителни полета.'], 400);
}

// Validate email
if (!is_valid_email($email)) {
    send_json_response(['error' => 'Невалиден имейл адрес.'], 400);
}

// Prepare email
$to = 'webmaster@sdabg.net, gabi.ortova@gmail.com';
$subject = sanitize_header("[$DOMAIN] Новото стихотворение: " . ($title));

// Sanitize all fields at the sink — decode sanitize()'s encoding first to avoid double-encoding,
// then strip tags and re-encode once. ENT_NOQUOTES used since content goes inside tag bodies, not attributes.
$authorEsc = htmlspecialchars(strip_tags(html_entity_decode($author, ENT_QUOTES | ENT_HTML5, 'UTF-8')), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
$emailEsc = htmlspecialchars(strip_tags(html_entity_decode($email, ENT_QUOTES | ENT_HTML5, 'UTF-8')), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
$titleEsc = htmlspecialchars(strip_tags(html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8')), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
$dateEsc = htmlspecialchars(strip_tags(html_entity_decode($date, ENT_QUOTES | ENT_HTML5, 'UTF-8')), ENT_NOQUOTES | ENT_SUBSTITUTE, 'UTF-8');
// $text retains allowed HTML tags from strip_tags() whitelist — already bounded at input
$textEsc = $text;

$body = "<html><body>"
    . "<h2>Ново стихотворение</h2>"
    . "<p><strong>Имейл:</strong> " . nl2br($emailEsc) . "</p>"
    . "<p><strong>Автор:</strong> " . nl2br($authorEsc) . "</p>"
    . "<p><strong>Заглавие:</strong> " . nl2br($titleEsc) . "</p>"
    . "<p><strong>Дата/място:</strong> " . nl2br($dateEsc) . "</p>"
    . "<hr/>"
    . "<div><strong>Текст:</strong><br>" . nl2br($textEsc) . "</div>"
    . "</body></html>";

$headers = "From: sdabg.net <no-reply@sdabg.net>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "Reply-To: " . sanitize_header($email) . "\r\n";

// Send email
$success = @mail($to, $subject, $body, $headers);

if ($success) {
    send_json_response(['success' => true]);
} else {
    $logLine = date('Y-m-d H:i:s') . " - Error sending poetry: " . json_encode($_POST, JSON_UNESCAPED_UNICODE) . "\n\n\n";
    file_put_contents(__DIR__ . '/send_mail.log', $logLine, FILE_APPEND);
    send_json_response(['error' => 'Грешка при изпращане на стихотворението.'], 500);
}
?>
