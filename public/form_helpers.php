<?php
// Общи помощни функции за контактната и обявената форма

// Санитизация на текстово поле
function sanitize($value)
{
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

// Валидация на имейл
function is_valid_email($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Санитизация на хедър (премахва нови редове)
function sanitize_header($value)
{
    return str_replace(["\r", "\n"], '', $value);
}

// Връща JSON отговор и спира изпълнението
function send_json_response($data, $status_code = 200)
{
    http_response_code($status_code);
    echo json_encode($data);
    exit;
}

// Позволени HTML тагове за форматирано съобщение/обява
function get_allowed_tags()
{
    return '<b><strong><i><em><u><ul><ol><li><br><a><p>';
}
