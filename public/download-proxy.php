<?php

/**
 * Download Proxy Script
 *
 * This script acts as a proxy to download files from https://sdasofia.org
 * It solves CORS (Cross-Origin Resource Sharing) issues when the React app
 * tries to download files from a different domain.
 *
 * How it works:
 * 1. Receives a resourcePath parameter (e.g., /sdabg/images/file.zip)
 * 2. Validates that the path starts with /sdabg for security
 * 3. Constructs the full URL by combining https://sdasofia.org + resourcePath
 * 4. URL-encodes the path to handle spaces and special characters
 * 5. Fetches the file using cURL from the remote server
 * 6. Returns the file content to the browser as a download
 *
 * Usage example: /download-proxy.php?resourcePath=/sdabg/images/Angels.zip
 */

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Basic security: Ensure a resourcePath is provided
if (!isset($_GET['resourcePath'])) {
    http_response_code(400);
    echo 'Error: resourcePath parameter is missing.';
    exit;
}

$resourcePath = $_GET['resourcePath'];
$baseDomain = 'https://sdasofia.org';

// Security: Ensure the path starts with /sdabg to prevent directory traversal attacks
// This prevents access to files outside the allowed directory
if (strpos($resourcePath, '/sdabg') !== 0) {
    http_response_code(403);
    echo 'Error: Only /sdabg paths are allowed.';
    exit;
}

// Construct the full URL with proper encoding
// URL encode each path part separately to handle spaces and special characters correctly
// Example: "Miroslav Stefanov - Zdrave" becomes "Miroslav%20Stefanov%20-%20Zdrave"
$pathParts = explode('/', $resourcePath);
$encodedParts = array_map('rawurlencode', $pathParts);
$encodedPath = implode('/', $encodedParts);
$fileUrl = $baseDomain . $encodedPath;

// Fetch the file content using cURL for better reliability and control
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $fileUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // Return content as string instead of outputting directly
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects automatically
curl_setopt($ch, CURLOPT_TIMEOUT, 30); // Timeout after 30 seconds to prevent hanging
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'); // Set user agent for compatibility
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Skip SSL verification if certificate issues occur
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // Skip SSL host verification if needed

$fileContent = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Check for cURL errors first (network issues, timeouts, etc.)
if ($fileContent === false || !empty($curlError)) {
    http_response_code(500);
    echo "Error: cURL failed. Details: " . $curlError . " | Trying URL: " . $fileUrl;
    exit;
}

// Check if the HTTP request was successful (200 OK)
if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo "Error: Failed to fetch file from the remote server. Status: $httpCode | URL: " . $fileUrl;
    exit;
}

// Set appropriate headers to make the browser download the file
$fileName = basename($resourcePath);
header('Content-Type: application/octet-stream'); // Binary file type
header('Content-Disposition: attachment; filename="' . $fileName . '"'); // Force download with filename
header('Content-Length: ' . strlen($fileContent)); // Set file size for download progress

// Send the file content to the browser
echo $fileContent;
exit;
