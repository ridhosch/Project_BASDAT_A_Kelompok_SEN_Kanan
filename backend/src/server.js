const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');
const profileRouter = require('./routes/profile');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5001;

// Izinkan request dari senkanan-app maupun senkanan-admin (port 5173 & 5174)
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'SENkanan Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Main API Routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/profile', profileRouter);
app.use('/api/orders', ordersRouter);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ message: `Endpoint ${req.originalUrl} tidak ditemukan` });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`=================================================`);
  console.log(`SENkanan Backend API berjalan di http://localhost:${PORT}`);
  console.log(`=================================================`);
  await testConnection();
});