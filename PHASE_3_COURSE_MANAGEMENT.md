# Phase 3: Course Management Implementation Guide

## Database Setup

### 1. Create Tables

Run the migration SQL file to create the necessary tables:

```bash
mysql -u scl_prod -p scl_prod < backend/migrations/001_create_courses_table.sql
```

Or execute each CREATE TABLE statement in your MySQL client:

```sql
-- Run the SQL statements from backend/migrations/001_create_courses_table.sql
```

### 2. Table Structure

**Courses Table:**
- Stores course information
- Links to instructors via `instructor_id`
- Status: draft, active, archived

**Enrollments Table:**
- Tracks student-course relationships
- Records enrollment date and completion status
- Supports grading

**Course Modules Table:**
- Organizes course content into modules
- Each module belongs to one course

**Lessons Table:**
- Contains individual lessons within modules
- Includes lesson content and duration

---

## Backend API Endpoints

### Course CRUD Operations

**GET /v1/courses**
- Get all courses
- Query params: `search`, `instructor_id`

**POST /v1/courses**
- Create a new course
- Body: `{ title, description, instructor_id, duration_weeks, max_students, start_date, end_date }`

**GET /v1/courses/:id**
- Get specific course with enrollment count

**PATCH /v1/courses/:id**
- Update course

**DELETE /v1/courses/:id**
- Delete course

**GET /v1/courses/upcoming?limit=5**
- Get upcoming courses (starting in the future)

**GET /v1/courses/active?limit=5**
- Get active courses (currently running)

---

## Frontend Pages

### Dashboard (`/dashboard`)
- Shows overview with metrics
- Links to course management
- Shows active courses
- Shows upcoming courses

### Course Management (`/courses`)
- List all courses
- Search and filter courses
- Create new course
- Edit existing course
- Delete course

---

## Testing the API

### 1. Create a Test Course

```bash
curl -X POST http://localhost:3000/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Introduction to React",
    "description": "Learn React basics",
    "instructor_id": 1,
    "duration_weeks": 8,
    "max_students": 50,
    "start_date": "2026-02-01T10:00:00",
    "end_date": "2026-03-31T10:00:00"
  }'
```

### 2. Get All Courses

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/courses
```

### 3. Get Upcoming Courses

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/courses/upcoming?limit=5
```

### 4. Update a Course

```bash
curl -X PATCH http://localhost:3000/api/v1/courses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Advanced React",
    "duration_weeks": 10
  }'
```

### 5. Delete a Course

```bash
curl -X DELETE http://localhost:3000/api/v1/courses/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend Usage

### Access Course Management

1. Log in to the application
2. Navigate to `/courses`
3. View all courses
4. Create new course with form
5. Edit or delete existing courses
6. Search for courses

### Integration with Dashboard

- Dashboard will eventually show:
  - Total courses count
  - Active courses list
  - Upcoming courses list
  - Student enrollment metrics

---

## Files Created/Modified

### Backend
- `backend/src/models/Course.js` - Course model with database methods
- `backend/src/controllers/CourseController.js` - Course request handlers
- `backend/src/routes/courseRoutes.js` - Course API routes
- `backend/src/routes/index.js` - Updated to include course routes
- `backend/migrations/001_create_courses_table.sql` - Database migration

### Frontend
- `frontend/src/pages/CoursesPage.jsx` - Course management UI
- `frontend/src/App.jsx` - Added courses route

---

## Next Steps

### Phase 3 Features (In Progress)
- ✅ Course CRUD API
- ✅ Course UI
- ⏳ Student Enrollment API
- ⏳ Course Modules & Lessons
- ⏳ Student Dashboard with enrolled courses

### Phase 4 Features (Future)
- Assessment & Grading
- Student Performance Tracking
- Quiz Management

---

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check DB credentials in .env
- Ensure database exists

### API 404 Errors
- Check if routes are registered in `backend/src/routes/index.js`
- Verify middleware is applied correctly
- Check request headers include Authorization token

### Frontend Not Updating
- Clear browser cache
- Restart frontend dev server
- Check browser console for errors

