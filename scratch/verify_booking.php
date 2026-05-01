<?php
require_once 'config.php';

echo "1. Verifying schema...\n";
$result = $conn->query("DESCRIBE appointments");
$found = false;
while ($row = $result->fetch_assoc()) {
    if ($row['Field'] === 'service_id') {
        $found = true;
        echo "Found service_id column: Type=" . $row['Type'] . "\n";
    }
}
if (!$found) echo "ERROR: service_id column not found!\n";

echo "\n2. Simulating booking...\n";
// Get a sample customer
$cust = $conn->query("SELECT customer_id FROM customers LIMIT 1")->fetch_assoc();
if (!$cust) {
    echo "No customers found to test with.\n";
    exit();
}
$customer_id = $cust['customer_id'];
$dentist_id = 1; // Assuming Dr. Je is id 1 or similar
$service_id = 3; // Cleaning
$date = date('Y-m-d', strtotime('+1 day'));
$time = '10:00:00';

$stmt = $conn->prepare("INSERT INTO appointments (customer_id, dentist_id, service_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, 'pending')");
$stmt->bind_param("iiiss", $customer_id, $dentist_id, $service_id, $date, $time);

if ($stmt->execute()) {
    $inserted_id = $conn->insert_id;
    echo "Simulated booking successful. Appt ID: $inserted_id\n";
    
    // Check the saved data
    $check = $conn->query("SELECT service_id FROM appointments WHERE appointment_id = $inserted_id")->fetch_assoc();
    if ($check['service_id'] == $service_id) {
        echo "SUCCESS: service_id $service_id correctly saved in database.\n";
    } else {
        echo "ERROR: service_id NOT correctly saved! Expected $service_id, got " . ($check['service_id'] ?? 'NULL') . "\n";
    }
    
    // Cleanup
    $conn->query("DELETE FROM appointments WHERE appointment_id = $inserted_id");
} else {
    echo "Simulated booking FAILED: " . $stmt->error . "\n";
}
?>
