const schoolModel = require('../models/schoolModel');

// Add School
exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    schoolModel.addSchool(name, address, latitude, longitude, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add school' });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
};

// List Schools
exports.listSchools = (req, res) => {
    const { latitude, longitude } = req.query;

    if (typeof parseFloat(latitude) !== 'number' || typeof parseFloat(longitude) !== 'number') {
        return res.status(400).json({ error: 'Invalid coordinates' });
    }

    schoolModel.getAllSchools((err, schools) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve schools' });
        }

        const sortedSchools = schools.map(school => ({
            ...school,
            distance: getDistance(latitude, longitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    });
};

// Helper function to calculate distance between two coordinates
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
