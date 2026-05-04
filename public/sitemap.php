<?php
/**
 * Dynamic sitemap generator - all pages fetched from Sanity
 */

$sanityQuery = '*[_type == "page"] | order(path.current asc){ "path": path.current, _updatedAt }';
$sanityUrl = 'https://tw3a1q78.apicdn.sanity.io/v2025-04-21/data/query/production?query=' . urlencode($sanityQuery);


$pages = [];
$response = @file_get_contents($sanityUrl);
if ($response !== false) {
    $data = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $pages = $data['result'] ?? [];
    }
}

header('Content-Type: application/xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($pages as $page) {
    if (empty($page['path'])) continue;
    // Skip external URLs (compatible with PHP <8)
    if (strpos($page['path'], 'http://') === 0 || strpos($page['path'], 'https://') === 0) continue;
    $loc = 'https://sdabg.net' . $page['path'];
    $lastmod = !empty($page['_updatedAt']) ? date('Y-m-d', strtotime($page['_updatedAt'])) : null;

    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($loc) . "</loc>\n";
    if ($lastmod) echo "    <lastmod>{$lastmod}</lastmod>\n";
    echo "    <changefreq>monthly</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>';

