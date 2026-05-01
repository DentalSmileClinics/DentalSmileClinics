const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { requireAuth } = require('../middlewares/auth');

router.post('/book_appointment', requireAuth, apiController.bookAppointment);
router.post('/add_patient', requireAuth, apiController.addPatient);

module.exports = router;
