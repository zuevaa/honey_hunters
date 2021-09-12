<?php
require '../db/connect.php';
header('Content-type: json/application');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'GET') {
    $id = null;
    if (array_key_exists('q', $_GET)) {
        $id = $_GET['q'];
    }
    if (isset($id)) {
        $stmt = mysqli_prepare($connect, 'select * from message where id = ?');
        mysqli_stmt_bind_param($stmt, 'i', $id);
        mysqli_stmt_execute($stmt);
        $message = mysqli_stmt_get_result($stmt);
        if (mysqli_num_rows($message) > 0) {
            $message = mysqli_fetch_assoc($message);
            echo json_encode($message);
        }
        else {
            http_response_code(404);
            echo json_encode(['status' => false,
                              'message' => 'Not found']);
        }
    }
    else {
        $messages = mysqli_query($connect,'select * from message');
        $messagesList = [];
        while ($message = mysqli_fetch_assoc($messages)) {
            $messagesList[] = $message;
        }
        echo json_encode($messagesList);
    }
}
elseif ($method == 'POST') {
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);
    $stmt = mysqli_prepare($connect, 'insert into message (name, email, message) values(?,?,?)');
    mysqli_stmt_bind_param($stmt, 'sss', $data['name'], $data['email'], $data['message']);
    mysqli_stmt_execute($stmt);
    http_response_code(201);
    echo json_encode(['status' => true,
                      'id' => mysqli_insert_id($connect)]);
}
elseif ($method == 'PUT') {
    $id = $_GET['q'];
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);
    $stmt = mysqli_prepare($connect, 'update message set name = ?, email = ?, message = ? where id = ?');
    mysqli_stmt_bind_param($stmt, 'sssi', $data['name'], $data['email'], $data['message'], $id);
    mysqli_stmt_execute($stmt);
    echo json_encode(['status' => true,
                      'id' => $id]);
}
elseif ($method == 'DELETE') {    
    $id = $_GET['q'];    
    $stmt = mysqli_prepare($connect, 'delete from message where id = ?');
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    echo json_encode(['status' => true]);
}
