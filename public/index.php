<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/vendor/autoload.php';

use Brunoinds\LinkPreviewDetector\LinkPreviewDetector;

// Check if the request is for a link preview
$isForLinkPreview = LinkPreviewDetector::isForLinkPreview();

if ($isForLinkPreview) {
    // Include meta.php to serve only the Open Graph meta tags
    include 'meta.php';
    exit;
} else {
    // Redirect to index.html for regular users
    header('Location: /index.html');
    exit;
}
