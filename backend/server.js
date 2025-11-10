const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for base64 images

// --- Database Connection ---
// This configuration uses environment variables that will be set by Cloud Run
// when connecting to a Cloud SQL instance.
const pool = new Pool({
  user: process.env.DB_USER, // e.g., 'postgres'
  host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // e.g., '/cloudsql/project:region:instance'
  database: process.env.DB_NAME, // e.g., 'peacock_store'
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// --- Database Initialization ---
const initializeDb = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Create tables if they don't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone_number VARCHAR(50),
                user_type VARCHAR(50) NOT NULL
            );
        `);
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                image_urls TEXT[],
                buy_price NUMERIC(10, 2) NOT NULL,
                rent_price NUMERIC(10, 2) NOT NULL,
                seller_email VARCHAR(255)
            );
        `);
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                product_id INTEGER NOT NULL,
                author VARCHAR(255),
                location VARCHAR(255),
                text TEXT,
                rating INTEGER
            );
        `);

        await client.query(`
             CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(255) PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                date TIMESTAMPTZ NOT NULL,
                items JSONB,
                total NUMERIC(10, 2) NOT NULL,
                status VARCHAR(50) NOT NULL,
                tracking_number VARCHAR(255),
                shipping_details JSONB
            );
        `);

        await client.query('COMMIT');
        console.log('Database tables are ready.');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error initializing database', e);
        throw e;
    } finally {
        client.release();
    }
};

// --- API Endpoints ---
const apiRouter = express.Router();

// User Endpoints
apiRouter.post('/signup', async (req, res) => {
    const { user, userType } = req.body;
    try {
        const existing = await pool.query('SELECT * FROM users WHERE email = $1 AND user_type = $2', [user.email, userType]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ success: false, message: `A ${userType} account with this email already exists.` });
        }
        await pool.query(
            'INSERT INTO users (name, email, password, user_type, phone_number) VALUES ($1, $2, $3, $4, $5)',
            [user.name, user.email, user.password, userType, '']
        );
        res.status(201).json({ success: true, message: 'Account created successfully! Please log in.' });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ success: false, message: 'Server error during signup.' });
    }
});

apiRouter.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND user_type = $2', [email, userType]);
        const foundUser = result.rows[0];
        if (foundUser && foundUser.password === password) {
             const userResponse = {
                name: foundUser.name,
                email: foundUser.email,
                password: foundUser.password, // In real-world, never send password back.
                phoneNumber: foundUser.phone_number
            };
            res.json({ success: true, user: userResponse });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

apiRouter.put('/users/:email', async (req, res) => {
    const { email } = req.params;
    const { name, phoneNumber, password } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, phone_number = $2, password = $3 WHERE email = $4 RETURNING *',
            [name, phoneNumber, password, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update User Error:', err);
        res.status(500).json({ message: 'Failed to update user' });
    }
});

// Product Endpoints
apiRouter.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id');
        // Convert snake_case from DB to camelCase for frontend
        const products = result.rows.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            imageUrls: p.image_urls,
            buyPrice: parseFloat(p.buy_price),
            rentPrice: parseFloat(p.rent_price),
            sellerEmail: p.seller_email
        }));
        res.json(products);
    } catch (err) {
        console.error('Get Products Error:', err);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

apiRouter.post('/products', async (req, res) => {
    const { name, category, description, imageUrls, buyPrice, rentPrice, sellerEmail } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, category, description, image_urls, buy_price, rent_price, seller_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, category, description, imageUrls, buyPrice, rentPrice, sellerEmail]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Add Product Error:', err);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

apiRouter.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, description, imageUrls, buyPrice, rentPrice } = req.body;
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, description = $3, image_urls = $4, buy_price = $5, rent_price = $6 WHERE id = $7 RETURNING *',
            [name, category, description, imageUrls, buyPrice, rentPrice, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update Product Error:', err);
        res.status(500).json({ message: 'Failed to update product' });
    }
});

apiRouter.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete Product Error:', err);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});


// Review Endpoints
apiRouter.get('/reviews', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reviews ORDER BY id');
        const reviews = result.rows.map(r => ({ ...r, productId: r.product_id }));
        res.json(reviews);
    } catch (err) {
        console.error('Get Reviews Error:', err);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

apiRouter.post('/reviews', async (req, res) => {
    const { productId, author, location, text, rating } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO reviews (product_id, author, location, text, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [productId, author, location, text, rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Add Review Error:', err);
        res.status(500).json({ message: 'Failed to add review' });
    }
});

// Order Endpoints
apiRouter.post('/orders', async (req, res) => {
    const { userEmail, items, total, shippingDetails } = req.body;
    const newOrder = {
        id: `PEA-${Date.now()}`,
        userEmail,
        date: new Date(),
        items,
        total,
        status: 'Processing',
        shippingDetails,
    };
    try {
        await pool.query(
            'INSERT INTO orders (id, user_email, date, items, total, status, shipping_details) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [newOrder.id, newOrder.userEmail, newOrder.date, newOrder.items, newOrder.total, newOrder.status, newOrder.shippingDetails]
        );
        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Create Order Error:', err);
        res.status(500).json({ message: 'Failed to create order' });
    }
});

apiRouter.get('/orders/:email', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders WHERE user_email = $1 ORDER BY date DESC', [req.params.email]);
        const orders = result.rows.map(o => ({
            ...o,
            userEmail: o.user_email,
            trackingNumber: o.tracking_number,
            shippingDetails: o.shipping_details
        }));
        res.json(orders);
    } catch (err) {
        console.error('Get Orders Error:', err);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

app.use('/api', apiRouter);

// Start server
app.listen(port, async () => {
    try {
        await initializeDb();
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
});