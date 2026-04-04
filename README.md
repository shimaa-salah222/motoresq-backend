MotoResQ Backend API Documentation
📌 Overview
MotoResQ is a backend system designed to monitor devices (ESP32), detect accidents, and provide real-time data for a mobile application (Flutter).
The system supports:
Device tracking (location, speed)
Accident detection and logging
User authentication (JWT)
Secure API access
Dashboard statistics

Base URL
http://localhost:5000

Authentication
1. Register
POST /api/auth/register
Body:
{
  "name": "shima",
  "email": "shima@test.com",
  "password": "123456"
}

2. Login
POST /api/auth/login
Body:
{
  "email": "shima@test.com",
  "password": "123456"
}
Response:
{
  "message": "Login successful",
  "token": "JWT_TOKEN"
}


Authorization
All protected routes require a token in headers:
Authorization: Bearer YOUR_TOKEN


Device APIs
1. Update Device (ESP32)
POST /api/update
Body:
{
  "device_id": "MOTO_001",
  "lat": 30.1,
  "lng": 31.2,
  "speed": 80,
  "accident": true

2. Get Device Status
GET /api/status/:device_id

3. Control Relay
POST /api/relay
Body:
{
  "device_id": "MOTO_001",
  "state": true
}

4. Register Device Token (for notifications)
POST /api/register-token
Body:
{
  "device_id": "MOTO_001",
  "token": "FCM_TOKEN"
}


Accident APIs
1. Get All Accidents
GET /api/accidents

2. Get Accidents by Device
GET /api/accidents/device/:device_id

3. Delete Accident
DELETE /api/accident/:id

4. Resolve Accident
PUT /api/accident/:id

Dashboard API
Get Statistics
GET /api/stats
Response Example:
{
  "totalAccidents": 10,
  "resolvedAccidents": 6,
  "activeAccidents": 4,
  "devices": 3
}


System Features
✅ Real-time device tracking
✅ Accident detection & logging
✅ JWT Authentication
✅ Secure APIs with middleware
✅ MongoDB database integration
✅ Dashboard statistics


Notes
Firebase notifications are partially implemented and require valid configuration.
All protected endpoints require JWT token.
Device updates are typically sent from ESP32.

Tech Stack
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Firebase (optional for notifications)

