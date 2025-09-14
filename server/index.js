import express from 'express'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import 'dotenv/config';
import connectToDB from './config/db.js';

// Routes
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/product.js';
import imageRoutes from './routes/images.js';
import userRoutes from './routes/user.js';
import hostelRoutes from './routes/hostels.js';
import orderRoutes from './routes/order.js';
import requestRoutes from './routes/request.js';
import notificationRoutes from './routes/notification.js';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "*", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Register API routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/images', imageRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/hostels', hostelRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.listen(PORT, () => {
    console.log(`Hostel Buddy server running on port ${PORT}.`);
    connectToDB();
});