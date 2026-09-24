import { Property } from "../Models/propertyModel.js"
import { Booking } from "../Models/bookingModel.js"

//createorder:
const createOrder = async (req, res) => {
    const { amount, propertyId, fromDate, toDate, guests } = req.body

    //orderID:
    const orderId = "order_" + Date.now()
    res.json({
        success: true,
        message: "Order created successfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })
}


//verifyingPayment:
//25, 26
//1. save the booking
//2. Block the dates

const verifyPayment = async (req, res) => {
    const { orderId, bookingDetails, forceStatus } = req.body;

    if (forceStatus === "success") {
        //save the booking:
        const newbooking = await Booking.create({
            user: req.user._id,
            property: bookingDetails.propertyId,
            price: bookingDetails.price,
            fromDate: bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            guests: bookingDetails.guests,
            nights: bookingDetails.numberOfnights ?? bookingDetails.nights,
            paid: true
        });

        //tell property those dates are taken:
        const updateProperty = await Property.findByIdAndUpdate(
            bookingDetails.propertyId, {
            $push: {
                currentBookings: {
                    bookingId: newbooking._id,
                    fromDate: bookingDetails.fromDate,
                    toDate: bookingDetails.toDate,
                    userId: req.user._id,
                }
            }
        },
        {new:true}
    );

    res.json({
        success: true,
        message: "Payment verified and booking created successfully",
        orderId,
        booking: newbooking,
    });

    }else{
        res.status(400).json({
            success: false,
            message: "Payment verification failed",
            orderId
        });
    }
}

//get my booking:
const getUserBookings = async (req, res)=>{
    try{
        const bookings = await Booking.find({user:req.user._id});

        res.status(200).json({
            status: "success",
            data:{
                bookings
            }
        })
    } catch (error) {
        res.status(401).json({
            status: "error",
            message:error.message
        })
    }
}

//get one booking details:
// /:bookingid

const getBookingDetails = async(req, res)=>{
    try{
        const bookings = await Booking.findById(req.params.bookingId);

        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })
    }

    catch (error) {
        res.status(401).json({
            status: "error",
            message:error.message
        })
    }
}

export {getBookingDetails, getUserBookings, createOrder, verifyPayment}