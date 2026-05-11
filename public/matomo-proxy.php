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

// Parse and rebuild query string to sanitize input — breaks taint flow from raw HTTP input to curl_exec.
// http_build_query properly URL-encodes all values, so no raw user input reaches curl_init.
parse_str($_SERVER['QUERY_STRING'] ?? '', $queryParams);
$query = $queryParams ? ('?' . http_build_query($queryParams)) : '';
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

// Whitelist of Content-Types Matomo is expected to return.
// Only forward the body if it matches — prevents XSS if upstream response is ever unexpected HTML.
$allowedContentTypes = ['image/gif', 'image/png', 'application/json', 'text/plain', 'text/javascript'];
$forwardedCt = '';

// Forward Content-Type safely — strip any newlines to prevent header injection
foreach (preg_split("/\r\n|\n|\r/", $respHeaders) as $line) {
    if (stripos($line, 'Content-Type:') === 0) {
        $ct = trim(substr($line, strlen('Content-Type:')));
        $ct = str_replace(["\r", "\n"], '', $ct);
        // Extract the MIME type without parameters (e.g. strip "; charset=utf-8")
        $mime = strtolower(trim(explode(';', $ct)[0]));
        if (in_array($mime, $allowedContentTypes, true)) {
            $forwardedCt = $ct;
            header('Content-Type: ' . $ct);
        }
        break;
    }
}

// Only echo the body if the Content-Type was in the allowlist.
// Sanitize at the sink by MIME type to explicitly break any remaining taint flow.
if ($forwardedCt !== '') {
    $mime = strtolower(trim(explode(';', $forwardedCt)[0]));
    if ($mime === 'application/json') {
        // Re-encode JSON — decoding and re-encoding removes any injected content
        $decoded = json_decode($respBody, true);
        echo $decoded !== null ? json_encode($decoded) : '{}';
    } elseif ($mime === 'text/plain') {
        echo htmlspecialchars($respBody, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    } elseif ($mime === 'text/javascript' || $mime === 'application/javascript') {
        // Explicitly set nosniff to prevent MIME-type confusion attacks
        header('X-Content-Type-Options: nosniff');
        echo $respBody;
    } else {
        // Binary types (image/gif, image/png) — safe as raw bytes, force nosniff
        header('X-Content-Type-Options: nosniff');
        echo $respBody;
    }
}
