const db = require('../config/db');

async function requireAuth(req, res, next) {
    if (!req.session.userId || !req.session.userRole) {
        return res.redirect('/logout');
    }

    const id = req.session.userId;
    const role = req.session.userRole;

    try {
        const [rows] = await db.query(
            "SELECT customer_id as user_id, username, 'patient' as role, status, first_name, last_name FROM customers WHERE customer_id = ?",
            [id]
        );

        if (rows.length !== 1) {
            return res.redirect('/logout');
        }

        const user = rows[0];
        if (user.status === 'blocked' || user.role !== role) {
            return res.redirect('/logout');
        }

        // Attach user to request object
        req.user = user;
        // Make user available to all views
        res.locals.user = user;
        
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.redirect('/logout');
    }
}

module.exports = {
    requireAuth
};
