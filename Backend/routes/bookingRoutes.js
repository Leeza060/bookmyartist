const { placeBooking, getAllBookings, getBookingDetails, updateBooking, deleteBooking, getBookingByUser, respondToBooking, updatePayment } = require('../controllers/bookingController')

const router = require('express').Router()

router.post('/bookings', placeBooking)
router.put('/bookings/:bookingId/respond', respondToBooking)

router.get('/bookings', getAllBookings)
router.get('/bookings/:bookingId', getBookingDetails)
router.get('/users/:userId/bookings', getBookingByUser)

router.put('/bookings/:bookingId/payment', updatePayment)

router.put('/bookings/:bookingId', updateBooking)
router.delete("/bookings/:bookingId", deleteBooking);

module.exports = router
