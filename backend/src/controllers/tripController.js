// take the users information
// validate the required information
// send the information to our AI trip planner
// calculate the budget per night
// search MongoDB for suitable properties
// send both AI trip plan + matching properties back to the frontend /user

import { Property } from "../Models/propertyModel.js";
import { planTrip } from "../ai/tripPlanner.js";
import { generateDescription } from "../ai/generateDescription.js"


const createTripPlan = async (req, res) => {
    try {
        const { destination, budget, days, people, interests } = req.body;

        if (!destination || !budget || !days || !people) {
            return res.status(400).json({
                status: "fail",
                message: "Please fill in destination, budget, days, and people"
            })
        }

        const plan = await planTrip({
            destination,
            budget,
            days,
            people,
            interests: interests || []
        });

        const budgetPerNight = Number(budget) / Number(days);

        const city = destination.trim();

        const properties = await Property.find({
            $or: [
                { "address.city": city },
                { "address.state": city },
                { "address.area": city }
            ],
            price: { $lte: budgetPerNight },
            maximumGuest: { $gte: Number(people) },
        }).limit(6);

        res.status(200).json({
            status: "success",
            data: { plan, properties, perNight: budgetPerNight }

        })
    } catch (error) {
        console.error("Trip plan creation failed:", error);
        res.status(500).json({
            status: "fail",
            message: "Could not create a trip plan, please try again "
        });
    }
};



const writeDescription = async (req, res) => {
    try {
        const description = await generateDescription(req.body);

        res.status(200).json({
            status: "success",
            data: { description }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: "Could not generate a description"
        });
    }
};

export { createTripPlan, writeDescription };
