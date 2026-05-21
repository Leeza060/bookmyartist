const { placeBooking, getAllBookings, getBookingDetails, updateBooking, deleteBooking, getBookingByUser } = require('../controllers/bookingController')

const router = require('express').Router()

router.post('/placebooking', placeBooking)
router.get('/getallbookings', getAllBookings)
router.get('/getbookingdetails/:id', getBookingDetails)
router.get('/getbookingbyuser', getBookingByUser)
router.put('/updatebooking/:id', updateBooking)
router.delete('/deletebooking/:id', deleteBooking)

module.exports = router
