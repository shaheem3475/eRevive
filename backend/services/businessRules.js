const DEVICE_CATALOG = {
    'iPhone 13 Pro (128GB)': 350,
    'Samsung Galaxy S22 (256GB)': 280,
    'iPad Air 4th Gen (WiFi)': 210,
    'Lenovo ThinkPad T490 Core i5': 180,
    'HP Pavilion 15 Core i7': 240
};
const DEFECT_DEDUCTIONS = { Scratch: 10, Dent: 20, Battery: 15, Camera: 25 };
const RECYCLE_HQ = { lat: 28.7041, lng: 77.1025 };
const calculateSale = (deviceName, defects = [], customDefects = '') => {
    const basePrice = DEVICE_CATALOG[deviceName];
    if (!basePrice) throw new Error('Unsupported device model');
    const deduction = defects.reduce((sum, defect) => sum + (DEFECT_DEDUCTIONS[defect] || 0), 0) + (customDefects ? 30 : 0);
    return { basePrice, finalPrice: Math.max(10, basePrice - deduction) };
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
module.exports = { DEVICE_CATALOG, DEFECT_DEDUCTIONS, calculateSale, calculatePickup };
