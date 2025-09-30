<?php
// js_mime_fix.php - Include this in your main PHP files or .htaccess to fix JS MIME types

// Function to ensure proper MIME types for JS files
function ensureJavaScriptMimeType()
{
    // Check if the request is for a JavaScript file
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    $path = parse_url($requestUri, PHP_URL_PATH);

    if ($path && (str_ends_with($path, '.js') || str_contains($path, '/assets/') && str_ends_with($path, '.js'))) {
        // If it's a JS file request, set proper headers
        header('Content-Type: application/javascript; charset=utf-8');
        header('Cache-Control: public, max-age=31536000'); // Cache for 1 year

        // Check if the file actually exists
        $filePath = $_SERVER['DOCUMENT_ROOT'] . $path;
        if (file_exists($filePath)) {
            // File exists, serve it
            readfile($filePath);
            exit;
        } else {
            // File doesn't exist, return 404 with proper JS MIME type
            http_response_code(404);
            header('Content-Type: application/javascript; charset=utf-8');
            echo "// Error: JavaScript file not found: " . htmlspecialchars($path);
            exit;
        }
    }
}

// Auto-call the function if this file is accessed directly
if (basename($_SERVER['PHP_SELF']) === 'js_mime_fix.php') {
    ensureJavaScriptMimeType();
}
