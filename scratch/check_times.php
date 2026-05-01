<?php
require_once 'config.php';
$result = $conn->query("SELECT appointment_time FROM appointments LIMIT 5");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
