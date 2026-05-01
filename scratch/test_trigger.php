<?php
require_once 'config.php';

// Create a dummy appointment
$stmt = $conn->prepare("INSERT INTO appointments (customer_id, dentist_id, service_id, appointment_date, appointment_time, status) VALUES (1, 1, 1, CURDATE(), '10:00:00', 'pending')");
$stmt->execute();
$appt_id = $conn->insert_id;

echo "Created test appointment ID $appt_id (status: pending)\n";

// Update it to confirmed
$upd = $conn->prepare("UPDATE appointments SET status = 'confirmed' WHERE appointment_id = ?");
$upd->bind_param("i", $appt_id);
$upd->execute();
echo "Updated appointment $appt_id to 'confirmed'\n";

// Verify treatments
$chk_treatments = $conn->query("SELECT * FROM treatments WHERE appointment_id = $appt_id");
if ($treat = $chk_treatments->fetch_assoc()) {
    $tid = $treat['treatment_id'];
    echo "Success: Found treatment $tid for appointment $appt_id\n";
    
    // Verify treatment services
    $chk_ts = $conn->query("SELECT * FROM treatment_services WHERE treatment_id = $tid");
    if ($ts = $chk_ts->fetch_assoc()) {
        echo "Success: Found treatment_service for treatment $tid (service_id: " . $ts['service_id'] . ", subtotal: " . $ts['subtotal'] . ")\n";
    } else {
        echo "Error: No treatment_service found for treatment $tid\n";
    }
} else {
    echo "Error: No treatment found for appointment $appt_id\n";
}

// Cleanup optionally
$conn->query("DELETE FROM treatment_services WHERE treatment_id IN (SELECT treatment_id FROM treatments WHERE appointment_id = $appt_id)");
$conn->query("DELETE FROM treatments WHERE appointment_id = $appt_id");
$conn->query("DELETE FROM appointments WHERE appointment_id = $appt_id");
echo "Cleaned up test records.\n";
?>
