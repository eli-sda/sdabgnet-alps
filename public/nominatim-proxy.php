<?php
include_once __DIR__ . '/constants.php';

// CORS headers
$allowed_origins = [
    'http://localhost:5173',  // React dev server
    $site
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    exit(0);
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Allow: GET, OPTIONS');
    echo json_encode(['error' => 'Невалидна заявка'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Get query parameters
$city = $_GET['city'] ?? '';

if (empty($city)) {
    http_response_code(400);
    echo json_encode(['error' => 'Моля въведете населено място'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validate city parameter (allow only letters, spaces, hyphens, and commas)
if (!preg_match('/^[\p{L}\s\-,]+$/u', $city)) {
    http_response_code(400);
    echo json_encode(['error' => 'Невалидно име на населено място'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Limit city name length
if (mb_strlen($city) > 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Името на населеното място е твърде дълго'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Additional security: ensure no path traversal characters
$city = str_replace(['..', '/', '\\', "\0"], '', $city);
$city = trim($city);

// Simple file-based cache to reduce API calls
$cacheDir = __DIR__ . '/cache';

// Convert city name to safe filename (transliterate Cyrillic to Latin)
$translitMap = [
    'А' => 'A',
    'Б' => 'B',
    'В' => 'V',
    'Г' => 'G',
    'Д' => 'D',
    'Е' => 'E',
    'Ж' => 'Zh',
    'З' => 'Z',
    'И' => 'I',
    'Й' => 'Y',
    'К' => 'K',
    'Л' => 'L',
    'М' => 'M',
    'Н' => 'N',
    'О' => 'O',
    'П' => 'P',
    'Р' => 'R',
    'С' => 'S',
    'Т' => 'T',
    'У' => 'U',
    'Ф' => 'F',
    'Х' => 'H',
    'Ц' => 'Ts',
    'Ч' => 'Ch',
    'Ш' => 'Sh',
    'Щ' => 'Sht',
    'Ъ' => 'A',
    'Ь' => 'Y',
    'Ю' => 'Yu',
    'Я' => 'Ya',
    'а' => 'a',
    'б' => 'b',
    'в' => 'v',
    'г' => 'g',
    'д' => 'd',
    'е' => 'e',
    'ж' => 'zh',
    'з' => 'z',
    'и' => 'i',
    'й' => 'y',
    'к' => 'k',
    'л' => 'l',
    'м' => 'm',
    'н' => 'n',
    'о' => 'o',
    'п' => 'p',
    'р' => 'r',
    'с' => 's',
    'т' => 't',
    'у' => 'u',
    'ф' => 'f',
    'х' => 'h',
    'ц' => 'ts',
    'ч' => 'ch',
    'ш' => 'sh',
    'щ' => 'sht',
    'ъ' => 'a',
    'ь' => 'y',
    'ю' => 'yu',
    'я' => 'ya'
];

$cityTranslit = strtr($city, $translitMap);
$cityTranslit = preg_replace('/,/', '', $cityTranslit); // Remove commas
$cityTranslit = preg_replace('/\s+/', '_', $cityTranslit); // Replace multiple spaces with single underscore
$cityTranslit = preg_replace('/[^a-zA-Z0-9\-_]/', '_', $cityTranslit); // Replace other special chars
$cityTranslit = strtolower($cityTranslit);

$cacheFile = $cacheDir . '/nominatim_' . $cityTranslit . '.json';

// Create cache directory if it doesn't exist
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}

// Check if we have cached data (with coordinates)
if (file_exists($cacheFile)) {
    $cachedData = file_get_contents($cacheFile);
    if ($cachedData !== false) {
        header('Content-Type: application/json; charset=utf-8');
        header('X-Cache: HIT');
        echo $cachedData;
        exit;
    }
}

// Build Nominatim URL with hardcoded countrycodes and format
// Use urlencode to safely encode the city parameter
$nominatimUrl = 'https://nominatim.openstreetmap.org/search?' . http_build_query([
    'q' => $city,
    'countrycodes' => 'bg',
    'format' => 'json'
], '', '&', PHP_QUERY_RFC3986);

// Make request to Nominatim with proper User-Agent and timeout
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "User-Agent: sdaBgNetwork/1.0 ($site)\r\n",
        'timeout' => 10, // 10 seconds timeout
        'ignore_errors' => true
    ]
]);

$response = @file_get_contents($nominatimUrl, false, $context);

if ($response === false) {
    http_response_code(502); // Bad Gateway
    echo json_encode(['error' => 'Грешка при свързване със сървъра. Моля опитайте отново.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Validate that response is valid JSON
$decoded = json_decode($response);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(502);
    echo json_encode(['error' => 'Грешка при обработка на данните. Моля опитайте отново.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Cache the successful response
if ($decoded && is_array($decoded) && count($decoded) > 0) {
    @file_put_contents($cacheFile, $response, LOCK_EX);
}

// Return the response as JSON
header('Content-Type: application/json; charset=utf-8');
header('X-Cache: MISS');
echo $response;
