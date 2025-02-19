
# Project Details: Digital Attendance System
## 1. Overview
The Digital Attendance System allows users (employees) to mark their attendance and track their working hours while providing an admin panel for monitoring attendance records. It includes an automated time-tracking system, a query system for attendance correction, and email notifications.
## 2. Features & Functionalities
### A. User Module (Employee)
1. Registration & Login ✅
   - Users register with their details (name, email, password, etc.).
   - After registration, users log in with their credentials.
2. Attendance System
   - When a user logs in, the attendance page opens automatically.
   - Entry Button: Marks the time of entry and records the date.
   - Exit Button: Marks the time of exit.
   - Work Duration Calculation:
     - Total working hours = Exit time - Entry time.
     - If total work hours < required hours, duration is displayed in red.
     - If total work hours ≥ required hours, duration is displayed in green.
   - Date Field: Automatically updates based on the system's date and time.
3. Query System for Missed Exit Time
   - If a user forgets to mark their exit, they can raise a request for admin approval.
   - A message is sent to the admin explaining the issue.
   - An automated email notification is sent to the admin.
4. Email Notifications
   - When a query is raised, an email is sent to the admin.
   - When the admin approves/rejects the request, an email is sent to the user with the update.
### B. Admin Module
1. Admin Dashboard
   - Displays the attendance details of all users.
   - Information includes:
     - User Name
     - Email ID
     - Date
     - Total work duration (color-coded: red/green based on completion).
   - Admin can filter attendance records by date.
2. Query Management
   - Admin can see all user queries for missing exit times.
   - Can approve/reject attendance correction requests.
   - An email is sent to the user when the request is processed.
3. Technology Stack
   - Frontend: React.js (with Tailwind CSS)
   - Backend: Node.js with Express.js
   - Database: MongoDB (NoSQL database)
   - Authentication: JWT (JSON Web Token) for secure login
   - Email Notifications: Nodemailer (for sending emails)
## 3. Project Structure

digital-attendance-system/
## 4. Database Schema
### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (enum: ['employee', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```
### Attendance Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  date: Date,
  entryTime: Date,
  exitTime: Date,
  totalHours: Number,
  status: String (enum: ['complete', 'incomplete']),
  createdAt: Date,
  updatedAt: Date
}
```
### Query Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  attendanceId: ObjectId (ref: 'Attendance'),
  requestType: String,
  reason: String,
  status: String (enum: ['pending', 'approved', 'rejected']),
  adminResponse: String,
  createdAt: Date,
  updatedAt: Date
}
```
## 5. API Endpoints
### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```
### Attendance
```
POST /api/attendance/mark-entry
POST /api/attendance/mark-exit
GET /api/attendance/today
GET /api/attendance/history
```
### Queries
```
POST /api/query/create
GET /api/query/user/:userId
PUT /api/query/:queryId/respond
```
### Admin
```
GET /api/admin/attendance
GET /api/admin/queries
GET /api/admin/users
PUT /api/admin/attendance/:id
```
## 6. User Roles and Permissions
### Employee
- Register and login
- Mark attendance (entry/exit)
- View personal attendance history
- Create queries for missed exit times
- Receive email notifications
- View attendance status and duration
### Admin
- All employee permissions
- View all users' attendance
- Manage attendance queries
- Generate reports
- Export attendance data
- Filter and search functionality
## 7. Technical Implementation Details
### Authentication
- JWT-based authentication
- Token expiration: 24 hours
- Refresh token mechanism
- Password hashing using bcrypt
### Email Notifications
```javascript
// Email Templates
{
  queryCreated: {
    subject: 'New Attendance Query',
    template: 'query-created.html'
  },
  queryResolved: {
    subject: 'Attendance Query Update',
    template: 'query-resolved.html'
  },
  attendanceReminder: {
    subject: 'Missing Exit Time',
    template: 'attendance-reminder.html'
  }
}
```
### Frontend Features
- Responsive design using Tailwind CSS
- Real-time updates using WebSocket (future enhancement)
- Client-side form validation
- Error handling and loading states
- Protected routes
- Dark/Light theme support
### Performance Considerations
- Database indexing on frequently queried fields
- Caching strategies for attendance data
- Pagination for large data sets
- Rate limiting for API endpoints
- Data validation and sanitization
## 8. Additional Features (Future Enhancements)
- Attendance Reports: Generate monthly/yearly reports for employees.
- Export Data: Option to download attendance records in CSV/PDF.
