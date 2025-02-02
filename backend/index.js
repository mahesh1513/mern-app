const express = require('express');
const cors = require('cors');
const {dbconnect} = require('./db/mongodb')
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const authMiddleware = require('./middlewares/authMiddleware')
const OrderController = require('./controllers/OrderController')
const AuthController = require('./controllers/AuthController')
const { validateEmailPassword, handleValidationErrors } = require('./validators/loginValidator')

const app = express()
const PORT = process.env.PORT || 3005;

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file names
  },
});
const upload = multer({ storage });
app.use((req, res, next) => {
    if (dbconnect.getConnection().readyState === 1) {
      console.log('DB connection established')
      next();
    } else {
      res.status(500).send('Database connection failed');
    }
});

app.get('/',(req,res) => {
    return res.json({message:"ORDER API working"});
})

app.post('/auth/login',validateEmailPassword,handleValidationErrors,AuthController.login);
app.post('/auth/register',AuthController.createUser);

app.use(authMiddleware);
app.get('/orders', OrderController.getAllOrders); 
app.get('/orders/:id', OrderController.findOrderById);
app.post('/orders/create',upload.single('file'),OrderController.createOrder);
app.put('/orders/:id',upload.single('file'),OrderController.updateOrder);
app.delete('/orders/:id', OrderController.deleteOrder);
app.get('/orders/download/:fileName', OrderController.downloadFile); 
app.listen(PORT,() => console.log(`Sever is running at ${PORT}`));