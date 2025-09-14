import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hostel from './models/hostel.js';
import User from './models/user.js';
import Category from './models/category.js';
import Product from './models/product.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the .env file");
        }
        await mongoose.connect(process.env.MONGO_URI, { dbName: "HostelBuddy" });
        console.log('MongoDB connected for seeding! 🌟');

        // 1. Clear existing data
        console.log('Clearing old data...');
        await Product.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({});
        await Hostel.deleteMany({});
        console.log('Old data cleared.');

        // 2. Seed Hostels
        const hostelsData = [
            { name: 'Manimala', isInsideCampus: true },
            { name: 'Shayadri', isInsideCampus: true },
            { name: 'Ganga', isInsideCampus: true },
        ];
        const hostels = await Hostel.insertMany(hostelsData);
        console.log('Hostels seeded.');

        // 3. Seed a Default User (to own the products)
        const defaultUser = await User.create({
            name: 'Python Kumar',
            email: 'python.kumar@hostelbuddy.com',
            batchYear: 2021,
            hostel: hostels[0]._id, // Assign Manimala hostel
            phone: '1234567890',
            room: '101',
            profileImage: 'https://t4.ftcdn.net/jpg/09/59/21/77/360_F_959217710_7tXOGV30gaUOjgGuMvnFzAwZhOOXbgvd.jpg',
        });
        console.log('Default user seeded.');

        // 4. Seed Categories
        const categoriesData = [
            { title: 'Electronic Items', isReturnable: true },
            { title: 'Computer Accessories', isReturnable: true },
            { title: 'Food Items', isReturnable: false },
            { title: 'Books', isReturnable: true },
            { title: 'Clothing', isReturnable: true },
        ];
        const categories = await Category.insertMany(categoriesData);
        console.log('Categories seeded.');

        // Map categories for easy lookup
        const categoryMap = categories.reduce((map, category) => {
            map[category.title] = category._id;
            return map;
        }, {});

        // 5. Seed Products
        const productsData = [
            {
                owner: defaultUser._id,
                images: 'https://t3.ftcdn.net/jpg/03/36/01/34/360_F_336013424_qOpfg1UGo3DVC1OpVlwzIfUx8WUTBV8s.jpg',
                title: 'Mobile Charger',
                description: '65W fast charger for all types of phones. Good condition.',
                category: categoryMap['Electronic Items'],
            },
            {
                owner: defaultUser._id,
                images: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRbdG6zfDgMb1MnaZm28Th5VjzMKUyIAdECSAbVMjb-V1tBKfhF6ghqQIpCDTlWEgbfIIdCh8889hbZ47RMizz-8TgAGsO21-jEYv3T2Mz9-wqV1t3eP0de6w',
                title: 'electric kettle',
                description: '1.5L electric kettle with auto shut-off. Good condition.',
                category: categoryMap['Electronic Items'],
            },
            {
                owner: defaultUser._id,
                images: 'https://uniquec.com/wp-content/uploads/235.jpg',
                title: 'Wireless Mouse',
                description: 'Logitech wireless mouse with long battery life.',
                category: categoryMap['Computer Accessories'],
            },
            {
                owner: defaultUser._id,
                images: 'https://www.shutterstock.com/image-photo/chennai-india-april-12-2021-260nw-1959559120.jpg',
                title: 'Packet of Maggi',
                description: 'Unopened family pack of Maggi noodles. Expires next year.',
                category: categoryMap['Food Items'],
            },
            {
                owner: defaultUser._id,
                images: 'https://www.vr1publications.com/wp-content/uploads/2022/10/Data-Structures-scaled.jpg',
                title: 'Data Structures Book',
                description: 'D.S. book by Cormen. Essential for computer science students.',
                category: categoryMap['Books'],
            },
            {
                owner: defaultUser._id,
                images: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkjaEpz_YH1tydO9Zgv4xEO_SlatjaVer5nA&s',
                title: 'Induction Cooktop',
                description: 'Pigeon induction stove, perfect for quick meals.',
                category: categoryMap['Electronic Items'],
            },
            {
                owner: defaultUser._id,
                images: 'https://m.media-amazon.com/images/I/71Pw5IVeEeL.jpg',
                title: 'USB-C Hub',
                description: 'Multi-port USB-C hub for Macbooks and other laptops.',
                category: categoryMap['Computer Accessories'],
            },
            {
                owner: defaultUser._id,
                images: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTp7dePeLxZkjV6JknWYMZ1T39NouA-TdYGkSYa6aCQPVSGRm_bME2TiB4fozcDS-QZXDlRRfGAAb5fJbBgsaNv5rE8nc_n',
                title: 'Formal Shirt',
                description: 'Size M formal white shirt for interviews or events.',
                category: categoryMap['Clothing'],
            },
            {
                owner: defaultUser._id,
                images: 'https://www.allrecipes.com/thmb/LAfNFUjS5nZBIjOB53D1gS_GB3k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ar-lays-taste-test-group-4x3-67f87a8f3c4c4710b50ab762b7f90257.jpg',
                title: 'Lays Chips',
                description: 'A large, unopened bag of Lays Classic Salted chips.',
                category: categoryMap['Food Items'],
            },
        ];
        await Product.insertMany(productsData);
        console.log('Products seeded.');

        console.log('✅ ✅ ✅ Database seeding completed successfully! ✅ ✅ ✅');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

seedDatabase();