//schema here where we create:
import slugify from "slugify";
import mongoose from "mongoose";


const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, "Property name is required"],
        unique: true
    },

    description: {
        type: String,
        required: [true, "Description is required"]
    },

    extraInfo: {
        type: String,
        default: "Checking on a time, good in services"
    },

    propertyType: {
        type: String,
        enum: ["House", "Flat", "GuestHouse", "Hotel", "Mansion", "Villa"],
        default: "House",
        required: [true, "Property type is required"]
    },

    roomType: {
        type: String,
        enum: ["Single", "Double", "Triple", "Quad"],
        default: "Single",
        required: [true, "Room type is required"]
    },

    maximumGuest: {
        type: Number,
        required: [true, "Please give the max no. of guests allowed"],
    },

    amenities: [
        {
            name: {
                type: String,
                required: true,
                enum: [
                    "Wi-Fi",
                    "kitchen",
                    "AC",
                    "Washing Machine",
                    "TV",
                    "Pool",
                    "free Parking",
                ]
            },

            icon: {
                type: String,
                required: true
            }
        }
    ],

    images: {
        type: [
            {
                public_id: {
                    type: String,
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ],
        //less than 6 images not taken this account:
        validate: {
            validator: function (arr) {
                return arr.length < 6;
            },
            message: "The maximum number of images allowed is 5.",
        }
    },

    price: {
        type: Number,
        required: [true, "Please enter the price per night"],
        default: 500

    },

    address: {
        area: String,
        city: String,
        state: String,
        pincode: Number
    },

    currentBookings: [
        {
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            },
            fromDate: {
                type: Date
            },
            toDate: {
                type: Date
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],

    //who own the peoperty that person detail:
    userId: {
        type: mongoose.Schema.Types.ObjectId, //use this take from : earlier user dat give here also
        ref: "User",
        required: true
    },

    slug: String,
    checkInTime: { type: String, default: "12:00 PM" },
    checkOutTime: { type: String, default: "11:00 AM" },


})


//pre-save hook to generate slug before saving the property:
propertySchema.pre("save", function () {
    this.slug = slugify(this.propertyName, { lower: true });

})

propertySchema.pre("save", function () {
    this.address.city = this.address.city.toLowerCase().replaceAll(" ", "")

})

const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);

export { Property };