<?php
// Simple PHP proxy for Matomo piwik.php endpoint.
// Place this file in public/ and set your client tracker to '/matomo-proxy.php'.

$remote = 'https://matomo.adventist.bg/piwik.php';

// Only allow GET and POST — reject all other methods
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET' && $method !== 'POST') {
    http_response_code(405);
    exit;
}

$query = $_SERVER['QUERY_STRING'] ? ('?' . $_SERVER['QUERY_STRING']) : '';
$url = $remote . $query;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

// forward request body for POST
if ($method === 'POST') {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

// Forward only headers relevant to Matomo visitor tracking — never forward Cookie or Authorization
$allowedRequestHeaders = ['user-agent', 'accept-language', 'referer', 'x-forwarded-for', 'x-real-ip', 'content-type', 'content-length'];
$forwardHeaders = [];
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $k => $v) {
        if (in_array(strtolower($k), $allowedRequestHeaders, true)) {
            $forwardHeaders[] = "$k: $v";
        }
    }
}
if (!empty($forwardHeaders)) curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);

$response = curl_exec($ch);
$info = curl_getinfo($ch);
$headerSize = $info['header_size'] ?? 0;
$httpCode = $info['http_code'] ?? 502;

curl_close($ch);

// Handle cURL failure
if ($response === false) {
    http_response_code(502);
    exit;
}

$respHeaders = substr($response, 0, $headerSize);
$respBody = substr($response, $headerSize);

http_response_code($httpCode);

// Forward Content-Type safely — strip any newlines to prevent header injection
foreach (preg_split("/\r\n|\n|\r/", $respHeaders) as $line) {
    if (stripos($line, 'Content-Type:') === 0) {
        $ct = trim(substr($line, strlen('Content-Type:')));
        $ct = str_replace(["\r", "\n"], '', $ct);
        header('Content-Type: ' . $ct);
        break;
    }
}

echo $respBody;
