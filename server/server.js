require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✅ Swagger Imports
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import Routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactionroutes');
const insightRoutes = require('./routes/insights');
const budgetRoutes = require('./routes/budgetsuggestion'); // ✅ Added new route

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'API documentation for Expense Tracker',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'], // ✅ Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/budget', budgetRoutes); // ✅ Route added here

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
