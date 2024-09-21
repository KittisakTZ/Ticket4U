const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const SECRET_KEY = 'your_secret_key'; // ใช้สำหรับ JWT (ควรเก็บเป็นความลับ)

// Middleware เพื่อเปิดใช้งาน CORS
app.use(cors());

// Middleware เพื่อแปลงข้อมูล JSON ในคำขอที่เข้ามา
app.use(express.json());

// การตั้งค่าการเชื่อมต่อฐานข้อมูล
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'Ticket4U',
  password: 'MyPassword',
  port: 5432,
});

// Endpoint เพื่อจัดการการสมัครสมาชิกผู้ใช้งาน
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // กำหนดวันที่สมัคร
    const registrationDate = new Date();

    // เพิ่มข้อมูลผู้ใช้ลงในฐานข้อมูลพร้อมรหัสผ่านที่เข้ารหัสแล้วและวันที่สมัคร
    const result = await pool.query(
      'INSERT INTO users (username, password, email, registration_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, email, registrationDate]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Server Error');
  }
});

// API endpoint สำหรับ Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // ค้นหาผู้ใช้ตาม username
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];

    // ตรวจสอบรหัสผ่านโดยใช้ bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }

    // สร้าง JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server Error');
  }
});

// API เพื่อทดสอบการตรวจสอบ token
app.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ success: true, message: 'Access granted', user: decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// API endpoint เพื่อดึงข้อมูล username ตาม token
app.get('/user', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // ดึงข้อมูลผู้ใช้ตาม ID ที่เก็บใน token
    pool.query('SELECT username FROM users WHERE id = $1', [decoded.userId], (error, result) => {
      if (error) {
        throw error;
      }
      res.json({ success: true, username: result.rows[0].username });
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// API endpoint เพื่อดึงข้อมูลคอนเสิร์ต
app.get('/concerts', async (req, res) => {
  try {
    // ดึงข้อมูลทั้งหมดจากตาราง concerts
    const result = await pool.query('SELECT * FROM concerts');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching concerts:', error);
    res.status(500).send('Server Error');
  }
});

// API สำหรับดึงข้อมูลโซนที่นั่งจากตาราง seat_zones
app.get('/concerts/zones', async (req, res) => {
  try {
    // ดึงข้อมูลโซนที่นั่งทั้งหมดจากตาราง seat_zones
    const result = await pool.query('SELECT * FROM seat_zones');
    console.log(result.rows); // ตรวจสอบข้อมูลโซนที่ดึงมา
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).send('Server Error');
  }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});