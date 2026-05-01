<?php
require_once 'config.php';
$result = $conn->query("DESCRIBE appointments");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
$result = $conn->query("DESCRIBE services");
if ($result) {
    echo "\nServices table:\n";
    while ($row = $result->fetch_assoc()) {
        print_r($row);
    }
}
?>
