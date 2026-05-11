<?php

/**
 * Legacy page.php handler
 * Redirects old URLs to new SPA routes
 */

// Get the 'id' parameter from the URL
$id = $_GET['id'] ?? '';

// Special handling for 'ss' with year/quarter/week parameters
if ($id === 'ss' && isset($_GET['year']) && isset($_GET['quarter']) && isset($_GET['week'])) {
    $year = $_GET['year'];
    $quarter = $_GET['quarter'];
    $week = $_GET['week'];

    $newUrl = "/church_life/lesson/{$year}/{$quarter}/{$week}";

    header('Location: ' . $newUrl, true, 301);
    exit;
}

// Special handling for 'adver' with subid parameter
if ($id === 'adver' && isset($_GET['subid'])) {
    $subid = $_GET['subid'];
    header('Location: /adver/' . urlencode($subid), true, 301);
    exit;
}

// Map old page IDs to new SPA routes
$redirectMap = [
    'ss' => '/church_life/lesson',
    'calendar' => '/church_life/events',
    'ssstories' => '/church_life/testimonies',
    'radios' => '/media/radio',
    'tvs' => '/media/tv',
    'adver' => '/adver',
    'bglinks' => '/media/bg-links',
    'links' => '/media/links',
    'bible_reference' => '/info/biblical',
    'sunset' => '/info/sunset',
    'teritory' => '/churches',
    'books' => '/resources/books',
    'audio' => '/resources/audio',
    'video' => '/resources/video',
    'music' => '/resources/music',
    'present' => '/resources/presentation',
    // 'poetry' => '/church_life/poetry',
    'answer' => '/commune/pastor-online'
];

// Check if we have a mapping for this ID
if (isset($redirectMap[$id])) {
    $newUrl = $redirectMap[$id];

    // Add any additional query parameters (except 'id')
    $queryParams = $_GET;
    unset($queryParams['id']);

    if (!empty($queryParams)) {
        $newUrl .= '?' . http_build_query($queryParams);
    }

    // Redirect with 301 (permanent redirect)
    header('Location: ' . $newUrl, true, 301);
    exit;
}

// If no mapping found, redirect to old site with same parameters
header('Location: https://old.sdabg.net/page.php?' . http_build_query($_GET), true, 301);
exit;
