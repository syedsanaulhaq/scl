import Course from '../models/Course.js';
import AppError from '../errors/AppError.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const { search, instructor_id } = req.query;
    const filters = {};
    
    if (search) filters.search = search;
    if (instructor_id) filters.instructor_id = instructor_id;

    const courses = await Course.findAll(filters);
    
    res.status(200).json({
      status: 'success',
      data: courses,
      message: `Retrieved ${courses.length} courses`
    });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    // Get enrollment count
    const enrollmentCount = await Course.getEnrollmentCount(id);

    res.status(200).json({
      status: 'success',
      data: {
        ...course,
        enrollment_count: enrollmentCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, instructor_id, duration_weeks, max_students, start_date, end_date } = req.body;

    // Validation
    if (!title || !description || !instructor_id) {
      return next(new AppError('Title, description, and instructor_id are required', 400));
    }

    const course = await Course.create({
      title,
      description,
      instructor_id,
      duration_weeks: duration_weeks || 8,
      max_students: max_students || 50,
      start_date,
      end_date
    });

    res.status(201).json({
      status: 'success',
      data: course,
      message: 'Course created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, instructor_id, duration_weeks, max_students, start_date, end_date } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    const updatedCourse = await Course.update(id, {
      title: title || course.title,
      description: description || course.description,
      instructor_id: instructor_id || course.instructor_id,
      duration_weeks: duration_weeks || course.duration_weeks,
      max_students: max_students || course.max_students,
      start_date: start_date || course.start_date,
      end_date: end_date || course.end_date
    });

    res.status(200).json({
      status: 'success',
      data: updatedCourse,
      message: 'Course updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError('Course not found', 404));
    }

    await Course.delete(id);

    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingCourses = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const courses = await Course.getUpcomingCourses(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: courses,
      message: `Retrieved ${courses.length} upcoming courses`
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveCourses = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const courses = await Course.getActiveCourses(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: courses,
      message: `Retrieved ${courses.length} active courses`
    });
  } catch (error) {
    next(error);
  }
};
