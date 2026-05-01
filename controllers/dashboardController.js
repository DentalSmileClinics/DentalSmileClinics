const db = require('../config/db');

const renderDashboard = async (req, res) => {
    const userId = req.user.user_id;

    try {
        // 1. Overview Stats
        const [[{ total_visits }]] = await db.query(
            "SELECT COUNT(*) as total_visits FROM appointments WHERE customer_id = ? AND status = 'completed'",
            [userId]
        );

        const [[{ upcoming }]] = await db.query(
            "SELECT COUNT(*) as upcoming FROM appointments WHERE customer_id = ? AND status IN ('pending', 'confirmed') AND appointment_date >= CURDATE()",
            [userId]
        );

        const stats = { total_visits, upcoming };

        // 2. Next Appointment
        const [nextAppts] = await db.query(
            "SELECT a.appointment_date, a.appointment_time, a.service_id FROM appointments a WHERE a.customer_id = ? AND a.status IN ('pending', 'confirmed') AND a.appointment_date >= CURDATE() ORDER BY a.appointment_date ASC, a.appointment_time ASC LIMIT 1",
            [userId]
        );
        const next_appt = nextAppts.length > 0 ? nextAppts[0] : null;

        // 3. Services Map & Full list for select
        const [services] = await db.query("SELECT service_id, service_name, price, min_price, max_price, notes FROM services");
        const services_map = {};
        services.forEach(s => {
            services_map[s.service_id] = s.service_name;
        });

        // 4. Appointments History
        const [appointments] = await db.query(
            "SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.status, a.service_id, a.dentist_id FROM appointments a WHERE a.customer_id = ? ORDER BY a.appointment_date DESC, a.appointment_time DESC",
            [userId]
        );

        // 5. Customer Profile Info
        const [[cust]] = await db.query(
            "SELECT gender, date_of_birth, contact_number, email FROM customers WHERE customer_id = ?",
            [userId]
        );

        res.render('dashboard', {
            stats,
            next_appt,
            services_map,
            services,
            appointments,
            cust
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).send("Error loading dashboard");
    }
};

module.exports = {
    renderDashboard
};
