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
$defImage = "$site/img/sdabg.net-map-logo.webp";

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
    keyWords,
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
$keywords = !empty($page['keyWords']) ? implode(', ', $page['keyWords']) : '';
$imageUrl = $page['imageUrl'] ?? $defImage;
$imageWidth = $page['imageWidth'] ?? 1200;
$imageHeight = $page['imageHeight'] ?? 630;
$ogUrl = $site . $path;
$canonicalUrl = $canonicalSite . $path;

// Section-specific title prefixes

// Add 'Обяви' to the title if path starts with '/adver/' and not already present
if (strpos($path, '/adver/') === 0 && mb_stripos($title, 'Обяви') === false) {
    $title = 'Обяви - ' . $title;
}

if (strpos($path, '/health/') === 0 && mb_stripos($title, 'Здраве') === false) {
    $title = 'Здраве - ' . $title;
}
if (strpos($path, '/info/') === 0 && mb_stripos($title, 'БГ Справочник') === false) {
    $title = 'БГ Справочник - ' . $title;
}

if (strpos($path, '/resources/') === 0 && mb_stripos($title, 'Ресурси') === false) {
    $title = 'Ресурси - ' . $title;
}

// Add site name to the end of the title for all pages except homepage, unless already present
if ($path !== '/' && mb_stripos($title, $siteName) === false) {
    $title .= ' | ' . $siteName;
}

// Build the full URL with query parameters (excluding 'path' and 'spa' parameters)
if (!empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $queryParams);
    unset($queryParams['path']); // Remove path parameter from og:url
    unset($queryParams['spa']);  // Remove spa parameter from og:url
    if (!empty($queryParams)) {
        $ogUrl .= '?' . http_build_query($queryParams);
    }
}

// Check for playlistTitle and title query parameters for custom sharing descriptions
$playlistTitle = $_GET['playlistTitle'] ?? null;
$itemTitle = $_GET['title'] ?? null;

// If playlistTitle is present, construct custom title for sharing
if ($playlistTitle) {
    // Decode the URL-encoded parameters
    $playlistTitle = urldecode($playlistTitle);

    // Build custom title: <pageTitle> - <playlistTitle> - <title>
    $customTitleParts = [];
    if ($title && trim($title) !== '') {
        $customTitleParts[] = $title;
    }
    $customTitleParts[] = $playlistTitle;

    if ($itemTitle) {
        $itemTitle = urldecode($itemTitle);
        $customTitleParts[] = $itemTitle;
    }

    $title = implode(' - ', $customTitleParts);
}
?>

<!DOCTYPE html>
<html lang="bg">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= htmlspecialchars($title) ?></title>

    <!-- Open Graph meta tags for social media sharing -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="bg_BG">
    <meta property="og:site_name" content="<?= htmlspecialchars($siteName) ?>" />
    <meta name="description" content="<?= htmlspecialchars($description) ?>" />
    <?php if ($keywords): ?>
    <meta name="keywords" content="<?= htmlspecialchars($keywords) ?>" />
    <?php endif; ?>
    <meta property="og:title" content="<?= htmlspecialchars($title) ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($description) ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($imageUrl) ?>" />
    <meta property="og:image:secure_url" content="<?= htmlspecialchars($imageUrl) ?>" />
    <meta property="og:image:width" content="<?= htmlspecialchars($imageWidth) ?>" />
    <meta property="og:image:height" content="<?= htmlspecialchars($imageHeight) ?>" />
    <meta property="og:url" content="<?= htmlspecialchars($ogUrl) ?>" />

    <!-- Twitter Card meta tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= htmlspecialchars($title) ?>" />
    <meta name="twitter:description" content="<?= htmlspecialchars($description) ?>" />
    <meta name="twitter:image" content="<?= htmlspecialchars($imageUrl) ?>" />

    <!-- Canonical URL -->
    <link rel="canonical" href="<?= htmlspecialchars($canonicalUrl) ?>" />

    <!-- JSON-LD structured data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": <?= json_encode($title, JSON_UNESCAPED_UNICODE) ?>,
      "description": <?= json_encode($description, JSON_UNESCAPED_UNICODE) ?>,
      "url": <?= json_encode($canonicalUrl, JSON_UNESCAPED_UNICODE) ?>,
      "image": <?= json_encode($imageUrl, JSON_UNESCAPED_UNICODE) ?>,
      "inLanguage": "bg",
      "publisher": {
        "@type": "Organization",
        "name": "Адвентната българска мреж@",
        "url": "https://sdabg.net"
      }
    }
    </script>
</head>

<body>
    <?php
    if ($debug) {
        $debugVars = [
            'Title' => $title,
            'Description' => $description,
            'Image URL' => $imageUrl,
            'Image Width' => $imageWidth,
            'Image Height' => $imageHeight,
            'OG URL' => $ogUrl,
        ];
        echo "<div>";
        foreach ($debugVars as $label => $value) {
            echo "<b>{$label}:</b> " . htmlspecialchars($value) . "<br>";
        }
        echo "</div>";
        exit;
    }
    ?>
    <!-- Visible content for search engine indexing -->
    <h1><?= htmlspecialchars($title) ?></h1>
    <p><?= htmlspecialchars($description) ?></p>
</body>

</html>