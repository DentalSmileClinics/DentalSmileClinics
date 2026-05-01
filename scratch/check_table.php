<?php
require_once 'config.php';
if ($conn) {
    echo "Connection successful!\n";
    $res = $conn->query("DESCRIBE appointments");
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            echo $row['Field'] . " - " . $row['Type'] . "\n";
        }
    } else {
        echo "DESCRIBE failed: " . $conn->error . "\n";
    }
} else {
    echo "Connection failed.\n";
}
?>
