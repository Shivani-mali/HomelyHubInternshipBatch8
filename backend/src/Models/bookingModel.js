//which user, which property i booked, what is the datws when i get, price 
//we are taking id rather than the schema:

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Booking must belong to a property']
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Booking must belong to a user']
        },

        price: {
            type: Number,
            required: [true, 'Booking must have a price']
        },

        createdAt: {
            type: Date,
            default: Date.now()
        },

        paid: {
            type: Boolean,
            default: true
        },

        fromDate: {
            type: Date,
            required: [true, 'Booking must have a from date']
        },
        toDate: {
            type: Date,
            required: [true, 'Booking must have a to date']
        },

        guests: {
            type: Number,
            required: [true, 'Booking must have a number of guests']
        },

        numberOfnights: {
            type: Number
        }
    },
    { timestamps: true }

);


bookingSchema.pre(/^find/, function () {
    this.populate("user");
    
    
    this.populate({
        path: "property",
        select: "maximumGuests images propertyName address"
    });
});

const Booking = mongoose.model("Booking", bookingSchema);
export { Booking };