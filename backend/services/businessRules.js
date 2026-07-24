/**
 * Dynamic Pricing Architecture for eRevive AI Engine
 * Category Base Prices, Condition Multipliers & Defect Deductions
 */
const CATEGORY_BASE_PRICES = {
    'Smartphone': 50000,
    'Laptop': 65000,
    'Tablet': 30000,
    'Smartwatch': 15000,
    'Monitor': 18000,
    'Printer': 12000,
    'Headphones': 8000,
    'Desktop': 45000,
    'Camera': 35000,
    'Gaming Console': 30000,
    'Router': 5000,
    'Keyboard': 3000,
    'Mouse': 2500,
    'Speakers': 6000,
    'Television': 40000,
    'Accessory': 5000,
    'Component': 10000,
    'Illustration': 5000,
    'Unknown Electronics': 10000
};

const CONDITION_MULTIPLIERS = {
    'Like New': 0.95,
    'Excellent': 0.90,
    'Good': 0.80,
    'Fair': 0.65,
    'Poor': 0.45,
    'Broken': 0.25,
    'Unknown': 0.60,
    'Not Applicable': 0.50
};

const DEFECT_DEDUCTIONS = {
    Scratch: 500,
    Dent: 1000,
    Battery: 750,
    Camera: 1250
};

const RECYCLE_HQ = { lat: 28.7041, lng: 77.1025 };

/**
 * AI-Driven Category-based Dynamic Pricing Engine.
 * 
 * Flow: Category Base Price -> Condition Multiplier -> Defect Deductions -> Final Estimated Offer.
 * Eliminates static catalog dependency and handles any device recognized by Gemini AI.
 */
const calculateSale = (param1, param2 = 'Smartphone', param3 = 'Good', param4 = [], param5 = '') => {
    let deviceName, category, condition, defects, customDefects;

    if (typeof param1 === 'object' && param1 !== null) {
        ({
            deviceName = 'Electronic Device',
            category = 'Unknown Electronics',
            condition = 'Good',
            defects = [],
            customDefects = ''
        } = param1);
    } else {
        deviceName = param1 || 'Electronic Device';
        category = param2 || 'Unknown Electronics';
        condition = param3 || 'Good';
        defects = Array.isArray(param4) ? param4 : [];
        customDefects = param5 || '';
    }

    // 1. Resolve Category Base Price (case-insensitive lookup with fallback)
    const categoryKey = Object.keys(CATEGORY_BASE_PRICES).find(
        key => key.toLowerCase() === String(category).trim().toLowerCase()
    ) || 'Unknown Electronics';

    const basePrice = CATEGORY_BASE_PRICES[categoryKey] || 10000;

    // 2. Resolve Condition Multiplier (case-insensitive lookup with fallback)
    const conditionKey = Object.keys(CONDITION_MULTIPLIERS).find(
        key => key.toLowerCase() === String(condition).trim().toLowerCase()
    ) || 'Good';

    const multiplier = CONDITION_MULTIPLIERS[conditionKey] !== undefined
        ? CONDITION_MULTIPLIERS[conditionKey]
        : 0.80;

    // 3. Compute Value After Condition Multiplier
    const priceAfterCondition = Math.round(basePrice * multiplier);

    // 4. Compute Defect Deductions
    const totalDeductions = (defects || []).reduce(
        (sum, defect) => sum + (DEFECT_DEDUCTIONS[defect] || 500),
        0
    ) + (customDefects ? 1500 : 0);

    // 5. Final Estimated Offer calculation (minimum floor ₹500)
    const finalPrice = Math.max(500, priceAfterCondition - totalDeductions);

    return {
        basePrice,
        finalPrice,
        category: categoryKey,
        condition: conditionKey,
        multiplier,
        totalDeductions
    };
};

const calculateDistance = (first, second) => {
    const radius = 6371;
    const dLat = (second.lat - first.lat) * Math.PI / 180;
    const dLng = (second.lng - first.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(first.lat * Math.PI / 180) * Math.cos(second.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return radius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const calculatePickup = (coordinates, isPickup) => {
    if (!isPickup) return { coordinates: '', distance: 0, pickupCharge: 0 };
    const match = /^(-?\d{1,2}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)$/.exec(coordinates || '');
    if (!match) throw new Error('Valid pickup coordinates are required');
    const location = { lat: Number(match[1]), lng: Number(match[2]) };
    if (location.lat < -90 || location.lat > 90 || location.lng < -180 || location.lng > 180) throw new Error('Pickup coordinates are out of range');
    const distance = calculateDistance(location, RECYCLE_HQ);
    return { coordinates: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, distance: Number(distance.toFixed(2)), pickupCharge: Math.round(distance * 5) };
};

module.exports = {
    CATEGORY_BASE_PRICES,
    CONDITION_MULTIPLIERS,
    DEFECT_DEDUCTIONS,
    calculateSale,
    calculatePickup
};
