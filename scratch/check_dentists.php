<?php
require_once 'config.php';
if ($conn) {
    echo "Connection successful!\n";
    $res = $conn->query("SELECT * FROM users WHERE role = 'dentist'"); // Checking common users table
    if (!$res) {
        $res = $conn->query("SELECT * FROM dentists"); // Checking alternative dentists table
    }
    
    if ($res) {
        if ($res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) {
                print_r($row);
            }
        } else {
            echo "No dentists found.\n";
        }
    } else {
        echo "Query failed: " . $conn->error . "\n";
    }
} else {
    echo "Connection failed.\n";
}
?>
