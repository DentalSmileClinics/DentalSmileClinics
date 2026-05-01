<?php
require_once 'config.php';

$drop_sql = "DROP TRIGGER IF EXISTS after_appointment_confirmed";
if ($conn->query($drop_sql)) {
    echo "Dropped existing trigger if any.\n";
} else {
    echo "Error dropping trigger: " . $conn->error . "\n";
}

$trigger_sql = "
CREATE TRIGGER after_appointment_confirmed
AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        -- create treatment record
        INSERT INTO treatments (appointment_id, dentist_id, status) VALUES (NEW.appointment_id, NEW.dentist_id, 'ongoing');
        
        -- Get the newly created treatment ID natively without using @vars for safety
        -- but wait, we need LAST_INSERT_ID() or we can just set it:
        -- Using a subquery since we can't reliably use LAST_INSERT_ID() in a trigger safely 
        -- across concurrent connections without some variable, but LAST_INSERT_ID() is connection-safe.
        -- We will use a local variable.
    END IF;
END;
";

// Let's refine the trigger SQL string, standard syntax for mysql:
$trigger_sql_full = "
CREATE TRIGGER after_appointment_confirmed
AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
    DECLARE new_treatment_id INT;
    DECLARE dynamic_price DECIMAL(10,2);
    
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        -- Create treatment record
        INSERT INTO treatments (appointment_id, dentist_id, status) 
        VALUES (NEW.appointment_id, NEW.dentist_id, 'ongoing');
        
        SET new_treatment_id = LAST_INSERT_ID();
        
        -- Get the service price
        SELECT COALESCE(price, min_price, 1000) INTO dynamic_price 
        FROM services WHERE service_id = NEW.service_id LIMIT 1;
        
        -- Create treatment_services record
        INSERT INTO treatment_services (treatment_id, service_id, quantity, subtotal) 
        VALUES (new_treatment_id, NEW.service_id, 1, dynamic_price);
    END IF;
END;
";

if ($conn->multi_query($trigger_sql_full)) {
    echo "Trigger created successfully.\n";
} else {
    echo "Error creating trigger: " . $conn->error . "\n";
}
?>
