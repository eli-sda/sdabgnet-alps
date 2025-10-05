<?php
// js_mime_fix.php - Include this in your main PHP files or .htaccess to fix JS MIME types

// Function to ensure proper MIME types for JS files
function ensureJavaScriptMimeType()
{
    // Check if the request is for a JavaScript file
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    $path = parse_url($requestUri, PHP_URL_PATH);

    if ($path && str_ends_with($path, '.js')) {
        $filePath = $_SERVER['DOCUMENT_ROOT'] . $path;
        $realDocRoot = realpath($_SERVER['DOCUMENT_ROOT']);
        $realFile = realpath($filePath);

        if ($realFile && strpos($realFile, $realDocRoot) === 0 && is_file($realFile)) {
            header('Content-Type: application/javascript; charset=utf-8');
            header('Cache-Control: public, max-age=31536000');
            header('Content-Length: ' . filesize($realFile));
            // If the file exists: The content is served.
            if (readfile($realFile) === false) {
                http_response_code(500);
                echo "// Error: Could not read JavaScript file.";
            }
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
