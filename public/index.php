<?php
include_once __DIR__ . '/constants.php';

// If ?spa=1 is present, remove it from the URL (for clean navigation), serve SPA (index.html) and stop execution
if (isset($_GET['spa'])) {
    // Remove spa=1 from the URL using JS (if possible)
?>
    <script>
        if (window.history && window.location) {
            const url = new URL(window.location.href);
            url.searchParams.delete("spa");
            window.history.replaceState({}, "", url.pathname + url.search + url.hash);
        }
    </script>
<?php
    readfile(__DIR__ . '/index.html');
    exit;
}

// Bot/crawler detection (Viber is not detected)
function isBot()
{
    $ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
    return preg_match('/bot|crawl|slurp|spider|facebook|twitter|vk|telegram|whatsapp|discord|linkedin|pinterest|google|bing|yandex|duckduckgo|viber/', $ua);
}

// If not a bot and no ?spa=1, reload with ?spa=1 using JS
if (!isBot()) {
    // Browsers will execute JS, but Viber and other bots will not and will show the HTML with meta tags
    // This ensures that the SPA is loaded correctly in browsers
?>
    <script>
        if (!/[?&]spa=1/.test(window.location.search)) {
            var url = new URL(window.location.href);
            url.searchParams.set('spa', '1');
            window.location.replace(url.toString());
        }
    </script>
<?php
}

/** This page generates HTML for preview in social media
 *  and redirects in browsers to index.html - the React app
 */
// Enable debugging if "debug" parameter is set
$debug = isset($_GET['debug']) && $_GET['debug'] == '1';

// Example URL with debug (load the page with clear cache!): https://new.sdabg.net/church_life/lesson/25/2/9?debug=1


$siteName = 'Адвентната българска мреж@';
$defTitle = 'Адвентната българска мреж@';
$defDescription = 'Адвентната българска мрежа - Християнски портал на Църквата на адвентистите от седмия ден, място където да намерите книги, аудио, видео и други ресурси и адвентни сайтове, да споделите вярата си.';
$defImage = "$site/img/sdabg.net-logo.jpg";

$path = htmlspecialchars($_GET['path'] ?? '/');
if ($debug) echo "<b>path:</b> {$path}<br>";
$searchPath = $path;
// For SS lesson the path is by year and quarter (like /church_life/lesson-cq/2023/1) 
// When the path is like /church_life/lesson-cq/2023/1/12
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
// Use default title if missing or blank (including only whitespace)
$title = ($page['title'] && trim($page['title']) !== '') ? $page['title'] : $defTitle;
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
</body>

</html>