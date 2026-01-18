import { Sequelize } from 'sequelize';
import { hashPassword } from '../utils/tokenUtils.js';
import AppError from '../errors/AppError.js';
import logger from '../config/logger.js';
import { models } from '../config/database.js';

const { User } = models;

const userController = {
    // Get all users with pagination and filtering
    getAllUsers: async (req, res, next) => {
        try {
            const { page = 1, limit = 10, role, search } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (role) where.role = role;
            if (search) {
                where[Sequelize.Op.or] = [
                    { name: { [Sequelize.Op.like]: `%${search}%` } },
                    { email: { [Sequelize.Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows } = await User.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                success: true,
                data: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Create a new user (Admin only)
    createUser: async (req, res, next) => {
        try {
            const { name, email, password, role, instituteId } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new AppError('Email already in use', 400);
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create user
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'student',
                instituteId,
                status: 'active'
            });

            // Remove password from response
            const userResponse = newUser.toJSON();
            delete userResponse.password;

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: userResponse
            });
        } catch (error) {
            next(error);
        }
    },

    // Get single user by ID
    getUserById: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                throw new AppError('User not found', 404);
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    // Update user details
    updateUser: async (req, res, next) => {
        try {
            const { name, role, status, instituteId } = req.body;
            const user = await User.findByPk(req.params.id);

            if (!user) {
                throw new AppError('User not found', 404);
            }

            // Prevent changing own role to avoid lockout (optional safety)
            // if (req.user.id === user.id && role && role !== user.role) { ... }

            await user.update({
                name,
                role,
                status,
                instituteId
            });

            const updatedUser = user.toJSON();
            delete updatedUser.password;

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete user (Soft delete if model supports paranoid, otherwise hard delete)
    deleteUser: async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                throw new AppError('User not found', 404);
            }

            // Prevent deleting yourself
            if (req.user.id === user.id) {
                throw new AppError('Cannot delete your own account', 403);
            }

            await user.destroy();

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};

export default userController;
