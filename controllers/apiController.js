const db = require('../config/db');
const { logAction } = require('../utils/logger');

const bookAppointment = async (req, res) => {
    const customer_id = req.user.user_id;
    const sid = req.body.service_id || 0;
    const did = req.body.dentist_id || 0;
    const date = req.body.date || '';
    let time = req.body.time || '';

    // Convert time e.g., '10:00 AM' to '10:00:00'
    if (time) {
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        time = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }

    try {
        const [result] = await db.query(
            "INSERT INTO appointments (customer_id, dentist_id, service_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, 'pending')",
            [customer_id, did, sid, date, time]
        );

        const aid = result.insertId;
        await logAction(customer_id, req.user.username, `Client-initiated Booking (Appt ID: ${aid}) - Direct Save`);
        
        res.json({ success: true, message: 'Thank you! Your appointment request has been sent for confirmation.' });
    } catch (error) {
        console.error("Booking failure:", error);
        res.json({ success: false, message: 'Booking failure: ' + error.message });
    }
};

const addPatient = async (req, res) => {
    const { first_name, last_name, gender, dob, phone } = req.body;

    if (!first_name || !last_name) {
        return res.json({ success: false, message: 'Patient name is required.' });
    }

    try {
        await db.query(
            "INSERT INTO customers (first_name, last_name, gender, date_of_birth, contact_number) VALUES (?, ?, ?, ?, ?)",
            [first_name, last_name, gender, dob, phone]
        );

        await logAction(req.user.user_id, req.user.username, `Created/Updated customer record: ${first_name} ${last_name}`);
        
        res.json({ success: true, message: 'Patient record successfully synchronized.' });
    } catch (error) {
        console.error("Add patient failure:", error);
        res.json({ success: false, message: 'Database constraint violation.' });
    }
};

module.exports = {
    bookAppointment,
    addPatient
};
