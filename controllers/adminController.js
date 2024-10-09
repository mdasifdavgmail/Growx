const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');

// Register a new admin
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({ username, password: hashedPassword, role: 'admin' });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering admin', error });
    }
};

// Admin login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await User.findOne({ username, role: 'admin' });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Admin logged in', token });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error });
    }
};

// View assignments tagged to the admin
exports.getAssignments = async (req, res) => {
    try {
        const adminId = req.user.id;
        const assignments = await Assignment.find({ admin: adminId });
        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching assignments', error });
    }
};

// Accept an assignment
exports.acceptAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'accepted' });
        res.status(200).json({ message: 'Assignment accepted' });
    } catch (error) {
        res.status(400).json({ message: 'Error accepting assignment', error });
    }
};

// Reject an assignment
exports.rejectAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        await Assignment.findByIdAndUpdate(assignmentId, { status: 'rejected' });
        res.status(200).json({ message: 'Assignment rejected' });
    } catch (error) {
        res.status(400).json({ message: 'Error rejecting assignment', error });
    }
};
