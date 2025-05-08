<?php

// Enable debugging if "debug" parameter is set
$debug = isset($_GET['debug']) && $_GET['debug'] == '1';

$site = 'https://new.sdabg.net';
$siteName = 'Адвентната българска мреж@';
$defTitle = '';
$defDescription = 'Адвентната българска мрежа - Християнски портал на Църквата на адвентистите от седмия ден, място където да намерите книги, аудио, видео и други ресурси и адвентни сайтове, да споделите вярата си.';
$defImage = "$site/img/sdabg.net-logo.jpg";

$path = htmlspecialchars($_GET['path'] ?? '/');

// Construct the Sanity API query
$sanityQuery = '*[_type == "page" && path.current == "' . addslashes($path) . '"][0]{
    title,
    "path": path.current,
    description,
    "imageUrl": headerImage.asset->url,
    "imageWidth": headerImage.asset->metadata.dimensions.width,
    "imageHeight": headerImage.asset->metadata.dimensions.height
}';
$sanityUrl = 'https://tw3a1q78.apicdn.sanity.io/v2025-04-21/data/query/production?query=' . urlencode($sanityQuery);

// Fetch the data from Sanity
$response = @file_get_contents($sanityUrl);
if ($response === false) {
    error_log("Failed to fetch data from Sanity API: $sanityUrl");
    $page = [];
} else {
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decode error: " . json_last_error_msg());
        $page = [];
    } else {
        $page = $data['result'] ?? [];
        if (empty($page)) {
            error_log("No data found for path: $path");
        }
    }
}

// Extract dynamic data or use defaults
$title = $page['title'] ?? $defTitle;
$description = $page['description'] ?? $defDescription;
$imageUrl = $page['imageUrl'] ?? $defImage;
$imageWidth = $page['imageWidth'] ?? 1200;
$imageHeight = $page['imageHeight'] ?? 630;
$ogUrl = $site . $path;
?>

<!DOCTYPE html>
<html lang="bg">

<head>
    <meta charset="UTF-8" />
    <title><?= htmlspecialchars($title) ?></title>
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="<?= htmlspecialchars($siteName) ?>" />
    <meta property="description" content="<?= htmlspecialchars($description) ?>" />
    <meta property="og:title" content="<?= htmlspecialchars($title) ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($description) ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($imageUrl) ?>" />
    <meta property="og:image:secure_url" content="<?= htmlspecialchars($imageUrl) ?>" />
    <meta property="og:image:width" content="<?= htmlspecialchars($imageWidth) ?>" />
    <meta property="og:image:height" content="<?= htmlspecialchars($imageHeight) ?>" />
    <meta property="og:url" content="<?= htmlspecialchars($ogUrl) ?>" />


</head>

<body>
    <img src="<?= htmlspecialchars($imageUrl) ?>">
    <?php
    if ($debug) {
        echo "Sanity URL: $sanityUrl<br>";
        echo "Response: " . htmlspecialchars(print_r($response, true)) . "<br>";
        echo "Title: $title<br>";
        echo "Description: $description<br>";
        echo "Image URL: $imageUrl<br>";
        echo "Image Width: $imageWidth<br>";
        echo "Image Height: $imageHeight<br>";
        echo "OG URL: $ogUrl<br>";
    }
    ?>
</body>

</html>