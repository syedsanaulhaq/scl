import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from '../models/User.js';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX, 10),
      min: parseInt(process.env.DB_POOL_MIN, 10),
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.warn('⚠️  Database connection failed:', error.message);
    return false;
  }
};

// Initialize Models
const User = UserModel(sequelize);

// Export models
export const models = {
  User,
};

export default sequelize;
