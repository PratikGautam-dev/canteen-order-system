const validateFile = (allowedTypes, maxSize) => {
    return (req, res, next) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files were uploaded.'
            });
        }

        // Get the uploaded file
        const file = req.files.file;

        // Validate file type
        const fileType = file.mimetype;
        if (!allowedTypes.includes(fileType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
            });
        }

        // Validate file size (in bytes)
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: `File too large. Maximum size allowed is ${maxSize / (1024 * 1024)}MB`
            });
        }

        // Add validated file to request
        req.validatedFile = file;
        next();
    };
};

// Common validation presets
const imageValidation = validateFile(
    ['image/jpeg', 'image/png', 'image/gif'],
    5 * 1024 * 1024 // 5MB
);

const documentValidation = validateFile(
    ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    10 * 1024 * 1024 // 10MB
);

module.exports = {
    validateFile,
    imageValidation,
    documentValidation
}; 