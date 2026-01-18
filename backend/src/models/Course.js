import db from '../config/database.js';

class Course {
  static async create(courseData) {
    const { title, description, instructor_id, duration_weeks, max_students, start_date, end_date } = courseData;
    
    const query = `
      INSERT INTO courses (title, description, instructor_id, duration_weeks, max_students, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [title, description, instructor_id, duration_weeks, max_students, start_date, end_date], (err, result) => {
        if (err) reject(err);
        resolve({ id: result.insertId, ...courseData });
      });
    });
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];

    if (filters.instructor_id) {
      query += ' AND instructor_id = ?';
      params.push(filters.instructor_id);
    }

    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY created_at DESC';

    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static async findById(id) {
    const query = 'SELECT * FROM courses WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }

  static async update(id, courseData) {
    const { title, description, instructor_id, duration_weeks, max_students, start_date, end_date } = courseData;
    
    const query = `
      UPDATE courses 
      SET title = ?, description = ?, instructor_id = ?, duration_weeks = ?, 
          max_students = ?, start_date = ?, end_date = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [title, description, instructor_id, duration_weeks, max_students, start_date, end_date, id], (err, result) => {
        if (err) reject(err);
        resolve({ id, ...courseData });
      });
    });
  }

  static async delete(id) {
    const query = 'DELETE FROM courses WHERE id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) reject(err);
        resolve({ message: 'Course deleted successfully' });
      });
    });
  }

  static async getEnrollmentCount(courseId) {
    const query = 'SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [courseId], (err, results) => {
        if (err) reject(err);
        resolve(results[0].count);
      });
    });
  }

  static async getUpcomingCourses(limit = 5) {
    const query = `
      SELECT * FROM courses 
      WHERE start_date > NOW()
      ORDER BY start_date ASC
      LIMIT ?
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [limit], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static async getActiveCourses(limit = 5) {
    const query = `
      SELECT * FROM courses 
      WHERE start_date <= NOW() AND end_date >= NOW()
      ORDER BY start_date ASC
      LIMIT ?
    `;
    
    return new Promise((resolve, reject) => {
      db.query(query, [limit], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
}

export default Course;
