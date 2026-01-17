-- Create Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id INT,
  duration_weeks INT DEFAULT 8,
  max_students INT DEFAULT 50,
  current_students INT DEFAULT 0,
  start_date DATETIME,
  end_date DATETIME,
  status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_instructor_id (instructor_id),
  INDEX idx_start_date (start_date),
  INDEX idx_status (status)
);

-- Create Enrollments Table (for student-course relationships)
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  completion_date DATETIME,
  grade VARCHAR(2),
  status ENUM('enrolled', 'completed', 'dropped') DEFAULT 'enrolled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, course_id),
  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id),
  INDEX idx_status (status)
);

-- Create Course Modules Table
CREATE TABLE IF NOT EXISTS course_modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  module_number INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id)
);

-- Create Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content LONGTEXT,
  lesson_number INT,
  duration_minutes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE,
  INDEX idx_module_id (module_id)
);
