<?php
include_once __DIR__ . '/constants.php';
$allowed_origins = [
    // 'http://localhost:5173',  // React dev server
    $site
];

if (isset($_SERVER['HTTP_ORIGIN'])) {
    // If the request includes an Origin header, require it to be in the allow list
    if (!in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins, true)) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=UTF-8');
        echo 'Origin not allowed';
        exit(0);
    }

    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    exit(0);
}

// Restrict to POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    header('Allow: POST, OPTIONS');
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Method Not Allowed';
    exit(0);
}
