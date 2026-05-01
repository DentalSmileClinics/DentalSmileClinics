<?php
require_once 'config.php';

// Add service_id column
$sql = "ALTER TABLE appointments ADD COLUMN service_id INT AFTER dentist_id";
if ($conn->query($sql)) {
    echo "Column service_id added successfully.\n";
} else {
    echo "Error adding column: " . $conn->error . "\n";
}

// Add foreign key constraint
$sql = "ALTER TABLE appointments ADD CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES services(service_id)";
if ($conn->query($sql)) {
    echo "Foreign key constraint added successfully.\n";
} else {
    echo "Error adding foreign key: " . $conn->error . "\n";
}
?>
