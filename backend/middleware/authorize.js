/**
 * Role-based authorization middleware
 */
const authorize = (role) => {
    return (req, res, next) => {
        // User should be attached to request by auth middleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if user has the required role
        if (req.user.role !== role) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

module.exports = {
    authorize
}; 