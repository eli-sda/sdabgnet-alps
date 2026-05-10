<?php

/**
 * Dynamic sitemap generator - all pages fetched from Sanity
 */

require_once __DIR__ . '/constants.php';
$canonicalSite = $canonicalSite ?? 'https://sdabg.net';

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

// Load SS lesson pages from ss-meta.json
$ssLessonUrls = [];
$ssMetaFile = __DIR__ . '/json/ss-meta.json';
if (file_exists($ssMetaFile)) {
    $ssMeta = json_decode(@file_get_contents($ssMetaFile), true);
    $bucketToPath = ['adult' => 'lesson', 'cq' => 'lesson-cq', 'cc' => 'lesson-cc'];
    foreach ($bucketToPath as $bucket => $lessonPath) {
        if (empty($ssMeta[$bucket])) continue;
        foreach ($ssMeta[$bucket] as $quarterKey => $quarterData) {
            // e.g. 2026_02 -> year=2026, quarter=2
            [$year, $quarter] = explode('_', $quarterKey);
            $year = substr($year, 2); // Use 2-digit year (e.g. 2026 -> 26)
            $quarter = ltrim($quarter, '0') ?: '0';
            $quarterUrl = "/church_life/{$lessonPath}/{$year}/{$quarter}";
            foreach ($quarterData['lessons'] ?? [] as $lesson) {
                $lessonId = ltrim($lesson['id'], '0') ?: '0';
                if (!ctype_digit($lessonId)) continue; // Skip non-numeric IDs (e.g. 'introduction')
                $ssLessonUrls[] = "{$quarterUrl}/{$lessonId}";
            }
        }
    }
    // sort($ssLessonUrls);
}

header('Content-Type: application/xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";


foreach ($pages as $page) {
    if (empty($page['path'])) continue;
    // Skip external URLs (compatible with PHP <8)
    if (strpos($page['path'], 'http://') === 0 || strpos($page['path'], 'https://') === 0) continue;
    $loc = $canonicalSite . $page['path'];
    $lastmod = !empty($page['_updatedAt']) ? date('Y-m-d', strtotime($page['_updatedAt'])) : null;

    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($loc) . "</loc>\n";
    if ($lastmod) echo "    <lastmod>{$lastmod}</lastmod>\n";
    echo "    <changefreq>monthly</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    echo "  </url>\n";
}

// Output SS lesson URLs
foreach ($ssLessonUrls as $loc) {
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($canonicalSite . $loc) . "</loc>\n";
    echo "    <changefreq>yearly</changefreq>\n";
    echo "    <priority>0.6</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>';
