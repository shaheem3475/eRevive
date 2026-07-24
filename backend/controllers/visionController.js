const GeminiVisionService = require('../services/geminiVisionService');
const ActivityHistory = require('../models/ActivityHistory');

/**
 * Controller to handle AI Vision requests.
 * Keeps business & HTTP logic separate from Gemini AI service.
 */
const analyzeDevice = async (req, res, next) => {
    try {
        const { image, mimeType } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Image data is required for AI Vision analysis',
                errors: [{ field: 'image', message: 'Missing base64 image data' }]
            });
        }

        // Invoke AI Vision Service
        const visionResult = await GeminiVisionService.analyzeDeviceImage(image, mimeType);

        // Record activity in ActivityHistory database log
        if (req.user && req.user._id) {
            try {
                await ActivityHistory.create({
                    user: req.user._id,
                    action: 'AI_VISION_ANALYSIS',
                    details: `Scanned: ${visionResult.deviceName} | Brand: ${visionResult.brand} | Category: ${visionResult.category} | Confidence: ${visionResult.confidence}%`
                });
            } catch (historyErr) {
                console.error('Failed to log AI Vision ActivityHistory:', historyErr.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Device image successfully analyzed by AI Vision Engine',
            data: visionResult
        });
    } catch (error) {
        console.error('Vision Controller Error:', error.message);

        const statusCode = error.message.includes('required') || error.message.includes('No image') ? 400 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message || 'AI Vision analysis failed',
            errors: [error.message]
        });
    }
};

module.exports = {
    analyzeDevice
};
