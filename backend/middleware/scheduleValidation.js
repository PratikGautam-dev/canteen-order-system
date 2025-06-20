const Order = require('../models/Order');

const validateScheduling = async (req, res, next) => {
    try {
        const { scheduledTime, duration = 30 } = req.body; // Default duration 30 minutes

        if (!scheduledTime) {
            return next();
        }

        const scheduledDateTime = new Date(scheduledTime);
        const endTime = new Date(scheduledDateTime.getTime() + duration * 60000);

        // Check for overlapping orders
        const overlappingOrders = await Order.find({
            scheduledTime: {
                $lt: endTime
            },
            expectedCompletionTime: {
                $gt: scheduledDateTime
            },
            status: { 
                $nin: ['completed', 'cancelled'] 
            }
        });

        if (overlappingOrders.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'This time slot is already booked. Please choose a different time.'
            });
        }

        // Add expected completion time to the request
        req.body.expectedCompletionTime = endTime;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error validating schedule',
            error: error.message
        });
    }
};

module.exports = validateScheduling; 