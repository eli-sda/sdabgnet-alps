<?php

/**
 * URL Resolver API Endpoint
 *
 * This script resolves bit.ly short URLs to their final YouTube destinations.
 * It follows redirects securely and returns the final URL in JSON format.
 *
 * Security Features:
 * - Only accepts HTTPS URLs from whitelisted domains (bit.ly)
 * - Validates URL format and structure
 * - Limits redirect chains to prevent abuse
 * - Only returns HTTPS URLs to whitelisted destinations (YouTube)
 * - SSL certificate verification enabled
 * - Request timeouts to prevent hanging
 * - Output sanitization to prevent XSS
 *
 * Usage:
 *   GET /resolve-url.php?url=https://bit.ly/xxx
 *
 * Response:
 *   Success: {"url": "https://youtu.be/xxx"}
 *   Error:   {"error": "Error message"}
 */

include_once __DIR__ . '/constants.php';

// CORS headers
$allowed_origins = [
    'http://localhost:5173',  // React dev server
    $site
];

// Security headers
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Max-Age: 3600');
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header("Content-Security-Policy: frame-ancestors 'none'");

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get and validate URL parameter
$url = $_GET['url'] ?? '';

if (empty($url)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL parameter required']);
    exit;
}

// Validate URL format
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL format']);
    exit;
}

// Parse URL and validate
$parsedUrl = parse_url($url);

if (
    !$parsedUrl ||
    !isset($parsedUrl['scheme']) ||
    $parsedUrl['scheme'] !== 'https' ||
    !isset($parsedUrl['host']) ||
    strtolower($parsedUrl['host']) !== 'bit.ly'
) {
    http_response_code(400);
    echo json_encode(['error' => 'Only HTTPS bit.ly URLs are allowed.']);
    exit;
}

// Initialize cURL with secure settings
$ch = curl_init($url);
if ($ch === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to initialize request']);
    exit;
}

// Set secure cURL options
curl_setopt_array($ch, [
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,              // Limit redirects
    CURLOPT_NOBODY => true,              // We only care about the final destination URL after redirects, not the page content. 
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,               // Overall timeout
    CURLOPT_CONNECTTIMEOUT => 5,         // Connection timeout
    CURLOPT_SSL_VERIFYPEER => true,      // Verify SSL certificates
    CURLOPT_SSL_VERIFYHOST => 2,         // Verify hostname
    CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, // Only allow HTTPS
    CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTPS, // Only allow HTTPS redirects
    CURLOPT_HEADER => true,
    CURLOPT_HTTPHEADER => ['Host: bit.ly'], // Prevent Host header injection - extra validation for bit.ly “Host” Header (Defense-in-Depth)
    CURLOPT_USERAGENT => 'Mozilla/5.0 (compatible; URLResolver/1.0)',
]);

// Execute request (fetching only headers, not body, due to CURLOPT_NOBODY)
// curl_exec will return true on success, false on failure.
$requestSucceeded = curl_exec($ch);

// Check for cURL errors
if ($requestSucceeded === false) {
    $error = curl_error($ch);
    curl_close($ch);
    http_response_code(500);
    echo json_encode(['error' => 'Request failed: ' . htmlspecialchars($error, ENT_QUOTES, 'UTF-8')]);
    exit;
}

// Get response information
$finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Validate response
if ($httpCode >= 400 || empty($finalUrl)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to resolve URL']);
    exit;
}

// Validate final URL
if (!filter_var($finalUrl, FILTER_VALIDATE_URL)) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid resolved URL']);
    exit;
}

// Parse and validate final URL
$finalParsedUrl = parse_url($finalUrl);
if (!$finalParsedUrl || !isset($finalParsedUrl['scheme']) || !isset($finalParsedUrl['host'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid resolved URL structure']);
    exit;
}

// Security check: Prevent SSRF to private/internal IPs in case of unexpected redirect or DNS rebinding.
$resolvedIp = gethostbyname($finalParsedUrl['host']);
if (
    filter_var($resolvedIp, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false ||
    $resolvedIp === '127.0.0.1' || $resolvedIp === '::1'
) {
    http_response_code(403);
    echo json_encode(['error' => 'Resolved IP address is not allowed']);
    exit;
}

// Only return HTTPS URLs
if ($finalParsedUrl['scheme'] !== 'https') {
    http_response_code(500);
    echo json_encode(['error' => 'Resolved URL is not HTTPS']);
    exit;
}

// Optional: Whitelist allowed destination domains (YouTube only)
$allowedDestinations = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'];
if (!in_array($finalParsedUrl['host'], $allowedDestinations)) {
    http_response_code(403);
    echo json_encode(['error' => 'Destination domain not allowed']);
    exit;
}

// Return sanitized URL
echo json_encode([
    'url' => htmlspecialchars($finalUrl, ENT_QUOTES, 'UTF-8')
]);
