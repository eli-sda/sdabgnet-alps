<?php
// get description meta tag from a given URL called from local React app
header('Access-Control-Allow-Origin: http://localhost:5173');
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

// Block localhost/internal requests
$host = parse_url($url, PHP_URL_HOST);
if (in_array($host, ['localhost', '127.0.0.1', '::1'])) {
    echo json_encode(['error' => 'Local URLs are not allowed']);
    exit;
}

// Fetch the HTML content
$html = file_get_contents($url);
if ($html === false) {
    echo json_encode(['error' => 'Failed to fetch URL']);
    exit;
}

// Parse HTML and extract meta description
libxml_use_internal_errors(true);
$doc = new DOMDocument();
if (!$doc->loadHTML($html)) {
    echo json_encode(['error' => 'Failed to parse HTML']);
    exit;
}
$xpath = new DOMXPath($doc);
$meta = $xpath->query("//meta[@name='description']");
if ($meta->length > 0) {
    $description = $meta[0]->getAttribute('content');
    echo json_encode(['description' => $description]);
} else {
    echo json_encode(['description' => null, 'error' => 'No description meta tag found']);
}
