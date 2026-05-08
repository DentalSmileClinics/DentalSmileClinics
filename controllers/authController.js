const db = require('../config/db');
const bcryptjs = require('bcryptjs');
const { logAction } = require('../utils/logger');

const register = async (req, res) => {
    const { first_name, last_name, username, email, password, phone_number, date_of_birth, gender } = req.body;

    if (!first_name || !last_name || !username || !password || !email) {
        req.session.register_error = 'All main fields, including email, are mandatory.';
        req.session.active_form = 'register';
        return res.redirect('/login#register-form');
    }

    try {
        const [existing] = await db.query("SELECT customer_id FROM customers WHERE username = ? OR email = ?", [username, email]);

        if (existing.length > 0) {
            req.session.register_error = 'Username or Email already registered.';
            req.session.active_form = 'register';
            return res.redirect('/login#register-form');
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const status = 'active';

        const [result] = await db.query(
            "INSERT INTO customers (username, password, first_name, last_name, gender, date_of_birth, contact_number, email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [username, hashedPassword, first_name, last_name, gender, date_of_birth, phone_number, email, status]
        );

        const customerId = result.insertId;

        await logAction(customerId, username, "New Customer Registration");

        req.session.register_success = 'Account created! Welcome to BrightSmile.';
        req.session.active_form = 'login';
        res.redirect('/login#login-form');

    } catch (error) {
        req.session.register_error = 'Registration failure: ' + error.message;
        req.session.active_form = 'register';
        res.redirect('/login#register-form');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.session.login_error = 'Credentials required.';
        return res.redirect('/login');
    }

    try {
        const [rows] = await db.query(
            "SELECT customer_id as id, username, email, password, 'patient' as role, status, first_name, last_name FROM customers WHERE email = ? AND status = 'active'",
            [email]
        );

        if (rows.length === 1) {
            const user = rows[0];
            const match = await bcryptjs.compare(password, user.password);

            if (match) {
                req.session.userId = user.id;
                req.session.userRole = user.role;
                req.session.user_name = user.first_name + " " + user.last_name;

                await logAction(user.id, user.email, `User Login (${user.role})`);

                return res.redirect('/dashboard');
            } else {
                req.session.login_error = 'Invalid password.';
            }
        } else {
            req.session.login_error = 'Account inactive or not found.';
        }
    } catch (error) {
        console.error("Login Error:", error);
        req.session.login_error = 'System Database Error.';
    }

    res.redirect('/login');
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        req.session.login_error = 'Email address is required.';
        req.session.active_form = 'forgot';
        return res.redirect('/login#forgot-step1');
    }

    try {
        const [rows] = await db.query("SELECT customer_id, email FROM customers WHERE email = ?", [email]);

        if (rows.length === 1) {
            const customerId = rows[0].customer_id;

            // Generate 8-character random password
            const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let newPassword = '';
            for (let i = 0; i < 8; i++) {
                newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            const hashedPassword = await bcryptjs.hash(newPassword, 10);

            await db.query("UPDATE customers SET password = ? WHERE customer_id = ?", [hashedPassword, customerId]);

            req.session.new_temp_password = newPassword;
            await logAction(customerId, email, "Password Reset");
        } else {
            req.session.login_error = 'No account found with that email address.';
        }
    } catch (error) {
        req.session.login_error = 'Failed to reset password. Please try again later.';
    }

    req.session.active_form = 'login';
    res.redirect('/login');
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

module.exports = {
    register,
    login,
    forgotPassword,
    logout
};
