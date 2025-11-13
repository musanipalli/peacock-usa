const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const {
    mockProducts,
    mockReviews,
    mockUsers,
    mockOrders,
} = require('./mockData');

const app = express();
const port = process.env.PORT || 8080;
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for base64 images

// --- Database Connection ---
const resolveDbHost = () => {
  if (process.env.INSTANCE_CONNECTION_NAME) {
    return `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }
  if (process.env.DB_SOCKET_PATH) {
    return process.env.DB_SOCKET_PATH;
  }
  return process.env.DB_HOST || '127.0.0.1';
};

const isDbConfigured = process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME;

const pool = isDbConfigured ? new Pool({
  user: process.env.DB_USER,
  host: resolveDbHost(),
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
}) : null;

if (!isDbConfigured) {
    console.warn('Database environment variables were not found. The backend will run in mock mode using in-memory sample data.');
}

let productIdCounter = mockProducts.length + 1;
let reviewIdCounter = mockReviews.length + 1;

// --- Database Initialization ---
const initializeDb = async () => {
    if (!pool) {
        console.log('Skipping database initialization because mock mode is enabled.');
        return;
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
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

app.get('/', (req, res) => {
  res.status(200).send('Peacock Backend is running!');
});

const apiRouter = express.Router();

// User Endpoints
apiRouter.post('/signup', async (req, res) => {
    const { user, userType } = req.body;
    try {
        if (!pool) {
            const existingUser = mockUsers.find(u => u.email === user.email && u.userType === userType);
            if (existingUser) {
                return res.status(409).send(`A ${userType} account with this email already exists.`);
            }
        } else {
            const existing = await pool.query('SELECT * FROM users WHERE email = $1 AND user_type = $2', [user.email, userType]);
            if (existing.rows.length > 0) {
                return res.status(409).send(`A ${userType} account with this email already exists.`);
            }
        }
        
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        if (!pool) {
            mockUsers.push({
                id: mockUsers.length + 1,
                name: user.name,
                email: user.email,
                password: hashedPassword,
                userType,
                phoneNumber: '',
            });
        } else {
            await pool.query(
                'INSERT INTO users (name, email, password, user_type, phone_number) VALUES ($1, $2, $3, $4, $5)',
                [user.name, user.email, hashedPassword, userType, '']
            );
        }
        res.status(201).json({ success: true, message: 'Account created successfully! Please log in.' });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).send('Server error during signup.');
    }
});

apiRouter.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;
    try {
        let foundUser;
        if (!pool) {
            foundUser = mockUsers.find(u => u.email === email && u.userType === userType);
        } else {
            const result = await pool.query('SELECT * FROM users WHERE email = $1 AND user_type = $2', [email, userType]);
            foundUser = result.rows[0];
        }

        if (foundUser) {
            const match = await bcrypt.compare(password, foundUser.password);
            if (match) {
                const userResponse = {
                    name: foundUser.name,
                    email: foundUser.email,
                    phoneNumber: foundUser.phoneNumber || foundUser.phone_number
                };
                return res.json({ success: true, user: userResponse });
            }
        }
        
        res.status(401).send('Invalid email or password.');
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).send('Server error during login.');
    }
});

apiRouter.put('/users/:email', async (req, res) => {
    const { email } = req.params;
    const { name, phoneNumber } = req.body;
    try {
        let updatedUser;
        if (!pool) {
            const user = mockUsers.find(u => u.email === email);
            if (user) {
                user.name = name;
                user.phoneNumber = phoneNumber;
                updatedUser = user;
            }
        } else {
            const result = await pool.query(
                'UPDATE users SET name = $1, phone_number = $2 WHERE email = $3 RETURNING *',
                [name, phoneNumber, email]
            );
            updatedUser = result.rows[0];
        }
        if (updatedUser) {
            res.json({
                name: updatedUser.name,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber || updatedUser.phone_number,
            });
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Update User Error:', err);
        res.status(500).send('Failed to update user');
    }
});

apiRouter.post('/change-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    try {
        let user;
        if (!pool) {
            user = mockUsers.find(u => u.email === email);
        } else {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            user = result.rows[0];
        }

        if (!user) {
            return res.status(404).send('User not found.');
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).send('Current password is not correct.');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        if (!pool) {
            user.password = hashedNewPassword;
        } else {
            await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedNewPassword, email]);
        }

        res.json({ success: true, message: 'Password updated successfully!' });
    } catch (err) {
        console.error('Change Password Error:', err);
        res.status(500).send('Server error during password change.');
    }
});


// Product Endpoints
apiRouter.get('/products', async (req, res) => {
    try {
        if (!pool) {
            return res.json(mockProducts);
        }
        const result = await pool.query('SELECT * FROM products ORDER BY id');
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
        res.status(500).send('Failed to fetch products');
    }
});

apiRouter.post('/products', async (req, res) => {
    const { name, category, description, imageUrls, buyPrice, rentPrice, sellerEmail } = req.body;
    try {
        if (!pool) {
            const newProduct = {
                id: productIdCounter++,
                name,
                category,
                description,
                imageUrls,
                buyPrice,
                rentPrice,
                sellerEmail,
            };
            mockProducts.push(newProduct);
            return res.status(201).json(newProduct);
        }
        const result = await pool.query(
            'INSERT INTO products (name, category, description, image_urls, buy_price, rent_price, seller_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, category, description, imageUrls, buyPrice, rentPrice, sellerEmail]
        );
        const p = result.rows[0];
         res.status(201).json({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            imageUrls: p.image_urls,
            buyPrice: parseFloat(p.buy_price),
            rentPrice: parseFloat(p.rent_price),
            sellerEmail: p.seller_email
        });
    } catch (err) {
        console.error('Add Product Error:', err);
        res.status(500).send('Failed to add product');
    }
});

apiRouter.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, description, imageUrls, buyPrice, rentPrice } = req.body;
    try {
        if (!pool) {
            const index = mockProducts.findIndex(p => p.id === Number(id));
            if (index === -1) {
                return res.status(404).send('Product not found');
            }
            mockProducts[index] = {
                ...mockProducts[index],
                name,
                category,
                description,
                imageUrls,
                buyPrice,
                rentPrice,
            };
            return res.json(mockProducts[index]);
        }
        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, description = $3, image_urls = $4, buy_price = $5, rent_price = $6 WHERE id = $7 RETURNING *',
            [name, category, description, imageUrls, buyPrice, rentPrice, id]
        );
        const p = result.rows[0];
        res.json({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            imageUrls: p.image_urls,
            buyPrice: parseFloat(p.buy_price),
            rentPrice: parseFloat(p.rent_price),
            sellerEmail: p.seller_email
        });
    } catch (err) {
        console.error('Update Product Error:', err);
        res.status(500).send('Failed to update product');
    }
});

apiRouter.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!pool) {
            const index = mockProducts.findIndex(p => p.id === Number(id));
            if (index === -1) {
                return res.status(404).send('Product not found');
            }
            mockProducts.splice(index, 1);
            return res.status(200).json({ success: true });
        }
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Delete Product Error:', err);
        res.status(500).send('Failed to delete product');
    }
});

// Review Endpoints
apiRouter.get('/reviews', async (req, res) => {
    try {
        if (!pool) {
            return res.json(mockReviews);
        }
        const result = await pool.query('SELECT * FROM reviews ORDER BY id DESC');
        const reviews = result.rows.map(r => ({
            id: r.id,
            productId: r.product_id,
            author: r.author,
            location: r.location,
            text: r.text,
            rating: r.rating
        }));
        res.json(reviews);
    } catch (err) {
        console.error('Get Reviews Error:', err);
        res.status(500).send('Failed to fetch reviews');
    }
});

apiRouter.post('/reviews', async (req, res) => {
    const { productId, author, location, text, rating } = req.body;
    try {
        if (!pool) {
            const newReview = {
                id: reviewIdCounter++,
                productId,
                author,
                location,
                text,
                rating,
            };
            mockReviews.unshift(newReview);
            return res.status(201).json(newReview);
        }
        const result = await pool.query(
            'INSERT INTO reviews (product_id, author, location, text, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [productId, author, location, text, rating]
        );
        const newReview = result.rows[0];
        res.status(201).json({
            id: newReview.id,
            productId: newReview.product_id,
            author: newReview.author,
            location: newReview.location,
            text: newReview.text,
            rating: newReview.rating
        });
    } catch (err) {
        console.error('Add Review Error:', err);
        res.status(500).send('Failed to add review');
    }
});


// Order Endpoints
apiRouter.post('/orders', async (req, res) => {
    const { userEmail, items, total, shippingDetails } = req.body;
    const orderId = `PCK-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const orderDate = new Date();
    try {
        if (!pool) {
            const order = {
                id: orderId,
                userEmail,
                date: orderDate.toISOString(),
                items,
                total,
                status: 'Processing',
                shippingDetails,
            };
            mockOrders.push(order);
            return res.status(201).json(order);
        }
        const result = await pool.query(
            'INSERT INTO orders (id, user_email, date, items, total, status, shipping_details) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [orderId, userEmail, orderDate, items, total, 'Processing', shippingDetails]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Add Order Error:', err);
        res.status(500).send('Failed to create order');
    }
});

apiRouter.get('/orders/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    try {
        if (!pool) {
            const orders = mockOrders
                .filter(order => order.userEmail === userEmail)
                .sort((a, b) => (a.date < b.date ? 1 : -1));
            return res.json(orders);
        }
        const result = await pool.query('SELECT * FROM orders WHERE user_email = $1 ORDER BY date DESC', [userEmail]);
        const orders = result.rows.map(order => ({
            id: order.id,
            userEmail: order.user_email,
            date: order.date,
            items: order.items,
            total: parseFloat(order.total),
            status: order.status,
            trackingNumber: order.tracking_number,
            shippingDetails: order.shipping_details
        }));
        res.json(orders);
    } catch (err) {
        console.error('Get Orders Error:', err);
        res.status(500).send('Failed to fetch orders');
    }
});


app.use('/api', apiRouter);

// --- Server Start ---
const startServer = async () => {
    try {
        await initializeDb();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
