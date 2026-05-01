<?php
require_once 'config.php';
if ($conn) {
    echo "Connection successful!\n";
    $res = $conn->query("SHOW TABLES LIKE 'services'");
    if ($res->num_rows > 0) {
        echo "Services table exists.\n";
        $res2 = $conn->query("SELECT COUNT(*) as c FROM services");
        $row = $res2->fetch_assoc();
        echo "Service count: " . $row['c'] . "\n";
    } else {
        echo "Services table does NOT exist.\n";
    }
} else {
    echo "Connection failed.\n";
}
?>
