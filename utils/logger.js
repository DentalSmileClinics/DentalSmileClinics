const db = require('../config/db');

async function logAction(userId, username, action) {
    try {
        await db.query(
            "INSERT INTO logs (user_id, username, action) VALUES (?, ?, ?)",
            [userId, username, action]
        );
    } catch (error) {
        // Logging failure must NOT break main operation as per Hard Rule 7
        console.error("Logging error:", error.message);
    }
}

module.exports = {
    logAction
};
