<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if (!isset($_GET['url'])) {
    echo json_encode(['error' => 'Missing url parameter']);
    exit;
}

$url = $_GET['url'];

// Validate URL
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    echo json_encode(['error' => 'Invalid URL']);
    exit;
}

// Fetch the HTML content
$html = @file_get_contents($url);
if ($html === false) {
    echo json_encode(['error' => 'Failed to fetch URL']);
    exit;
}

// Extract the description meta tag
if (preg_match('/<meta[^>]+name=["\\\']description["\\\'][^>]+content=["\\\']([^"\\\']+)["\\\']/i', $html, $matches)) {
    $description = $matches[1];
    echo json_encode(['description' => $description]);
} else {
    echo json_encode(['description' => null, 'error' => 'No description meta tag found']);
}
