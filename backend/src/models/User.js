import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

/**
 * User Model - Sequelize definition
 * Defines user table schema with password hashing and helper methods
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} User model
 */
export default function (sequelize) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
          name: 'users_email_unique',
          msg: 'Email already exists',
        },
        validate: {
          isEmail: true,
        },
        index: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [6, 255],
        },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [2, 255],
        },
      },
      role: {
        type: DataTypes.ENUM('student', 'teacher', 'admin'),
        defaultValue: 'student',
        index: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'users',
      indexes: [
        {
          fields: ['email'],
          unique: true,
        },
        {
          fields: ['role'],
        },
      ],
    }
  );

  /**
   * Hash password before saving
   */
  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  /**
   * Compare password with hashed password
   * @param {string} password - Plain text password to compare
   * @returns {Promise<boolean>} Whether password matches
   */
  User.prototype.comparePassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error('Password comparison failed');
    }
  };

  /**
   * Return user data without password
   * @returns {Object} User object without password
   */
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} User object or null
   */
  User.findByEmail = async function (email) {
    return User.findOne({
      where: { email: email.toLowerCase() },
    });
  };

  /**
   * Update last login timestamp
   * @returns {Promise<User>} Updated user
   */
  User.prototype.updateLastLogin = async function () {
    this.lastLogin = new Date();
    return this.save();
  };

  return User;
}
