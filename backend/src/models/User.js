import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

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
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            msg: 'Invalid email address',
          },
          notEmpty: {
            msg: 'Email is required',
          },
        },
        lowercase: true,
        trim: true,
        index: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 255],
            msg: 'Password must be at least 6 characters',
          },
          notEmpty: {
            msg: 'Password is required',
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 100],
            msg: 'Name must be between 2 and 100 characters',
          },
          notEmpty: {
            msg: 'Name is required',
          },
        },
        trim: true,
      },
      role: {
        type: DataTypes.ENUM('student', 'teacher', 'admin'),
        defaultValue: 'student',
        validate: {
          isIn: {
            args: [['student', 'teacher', 'admin']],
            msg: 'Role must be student, teacher, or admin',
          },
        },
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
      freezeTableName: true,
      tableName: 'users',
    }
  );

  // Hash password before creating/updating user
  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Instance method to compare passwords
  User.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  // Instance method to get user data without password
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  // Class method to find by email
  User.findByEmail = function (email) {
    return User.findOne({ where: { email: email.toLowerCase() } });
  };

  // Update last login timestamp
  User.prototype.updateLastLogin = async function () {
    this.lastLogin = new Date();
    await this.save();
  };

  return User;
}
