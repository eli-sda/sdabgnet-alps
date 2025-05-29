<?php

/** This page generates HTML for preview in social media
 *  and redirects in browsers to index.html - the React app
 */
// Enable debugging if "debug" parameter is set
$debug = isset($_GET['debug']) && $_GET['debug'] == '1';

// example URL with debug (load the page with clear cache!): https://new.sdabg.net/church_life/lesson/25/2/9?debug=1

$site = 'https://new.sdabg.net';
$siteName = 'Адвентната българска мреж@';
$defTitle = '';
$defDescription = 'Адвентната българска мрежа - Християнски портал на Църквата на адвентистите от седмия ден, място където да намерите книги, аудио, видео и други ресурси и адвентни сайтове, да споделите вярата си.';
$defImage = "$site/img/sdabg.net-logo.jpg";

$path = htmlspecialchars($_GET['path'] ?? '/');
if ($debug) echo "<b>path:</b> {$path}<br>";
$searchPath = $path;
// for SS lesson the path is by year and quarter (like /church_life/lesson-cq/2023/1) 
// when the path is like /church_life/lesson-cq/2023/1/12
if (preg_match('#(/church_life/lesson(?:-cq|-cc)?/\d+/\d+)/\d+$#', $path, $matches)) {
    $searchPath = $matches[1];
}
if ($debug) echo "<b>searchPath:</b> {$searchPath}<br>";

// Construct the Sanity API query
$sanityQuery = '*[_type == "page" && path.current == "' . addslashes($searchPath) . '"][0]{
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
    <?php
    if ($debug) {
        echo "<div>";
        echo "<b>Sanity URL:</b> " . urldecode($sanityUrl) . "<br>";
        echo "<b>Response:</b> " . htmlspecialchars(print_r($response, true)) . "<br>";
        echo "<b>Title:</b> $title<br>";
        echo "<b>Description:</b> $description<br>";
        echo "<b>Image URL:</b> $imageUrl<br>";
        echo "<b>Image Width:</b> $imageWidth<br>";
        echo "<b>Image Height:</b> $imageHeight<br>";
        echo "<b>OG URL:</b> $ogUrl<br>";
        echo "</div>";
        exit;
    }
    ?>
    <script type="text/javascript">
        // Redirect to index.html, not working for social media previews
        window.location.href = '/index.html';
    </script>
</body>

</html>