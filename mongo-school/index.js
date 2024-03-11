const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
require('dotenv').config();

// if we are trying to require from our
// own files, we need the './'
const { connect } = require('./MongoUtil');
const { authenticateWithJWT } = require('./middleware');

const app = express();
app.use(cors());
app.use(express.json());

// JWT aka 'access token' grants access to protected routes
function generateAccessToken(id, email) {
    // `jwt.sign` is the payload stored
    return jwt.sign({
        'user_id': id,
        'email': email
    }, process.env.TOKEN_SECRET, {
        'expiresIn': '3d'
    });
}

async function main() {
    // connection string 
    const uri = process.env.MONGO_URI;
    // get the database using the `connect` function
    const db = await connect(uri, "mongo_school");

    // CRUD operations for `professors` collection

    // GET all professors
    app.get("/professors", async function (req, res) {
        try {
            const professors = await db.collection("professors").find().toArray();
            res.json(professors);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        }
    });

    // ADD a new professor
    app.post("/professors", async function (req, res) {
        try {
            const { name, email, experience, moduleId } = req.body;
            const result = await db.collection("professors").insertOne({
                name,
                email,
                experience,
                moduleId: ObjectId(moduleId) 
            });
            res.json(result.ops[0]);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        }
    });

    // UPDATE an existing professor
    app.put('/professors/:id', async function (req, res) {
        try {
            const { name, email, experience, moduleId } = req.body;
            const result = await db.collection("professors").updateOne({
                '_id': ObjectId(req.params.id)
            }, {
                '$set': {
                    name,
                    email,
                    experience,
                    moduleId: ObjectId(moduleId) 
                }
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        }
    });

    // DELETE an existing professor
    app.delete('/professors/:id', async function (req, res) {
        try {
            await db.collection('professors').deleteOne({
                '_id': ObjectId(req.params.id)
            });
            res.json({ 'message': "Professor deleted" });
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        }
    });

    // CRUD operations for `modules` collection

    // GET all modules
    app.get("/modules", async function (req, res) {
        try {
            const modules = await db.collection("modules").find().toArray();
            res.json(modules);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        }
    });

    // ADD a new module
    app.post("/modules", async function (req, res) {
        try {
            const { moduleName, moduleCode, studentClass } = req.body;
            const result = await db.collection("modules").insertOne({
                moduleName,
                moduleCode,
                studentClass
            });
            res.json(result.ops[0]);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        }
    });

    // UPDATE an existing module
    app.put('/modules/:id', async function (req, res) {
        try {
            const { moduleName, moduleCode, studentClass } = req.body;
            const result = await db.collection("modules").updateOne({
                '_id': ObjectId(req.params.id)
            }, {
                '$set': {
                    moduleName,
                    moduleCode,
                    studentClass
                }
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        }
    });

    // DELETE an existing module
    app.delete('/modules/:id', async function (req, res) {
        try {
            await db.collection('modules').deleteOne({
                '_id': ObjectId(req.params.id)
            });
            res.json({ 'message': "Module deleted" });
        } catch (error) {
            res.status(500).json({ 'error': error.message });
        }
    });

}

// User SIGNUP route
app.post('/signup', async function (req, res) {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await db.collection('users').insertOne({
            email,
            password: hashedPassword
        });
        res.json({ 'message': 'User signed up successfully' });
    } catch (error) {
        res.status(500).json({ 'error': error.message });
    }
});

// User LOGIN route
// Generate and send back the JWT (access token)
app.post('/login', async function (req, res) {
    try {
        // Login authentication logic
        // // After successful authentication, generate JWT and send back
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(401).json({ 'error': 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ 'error': 'Invalid email or password' });
        }
        const token = generateAccessToken(user._id, user.email);
        res.json({ 'token': token });
    } catch (error) {
        res.status(500).json({ 'error': error.message });
    }
});


// Protected route: client must provide the JWT to access
app.get('/profile', authenticateWithJWT, async function (req, res) {
    // Endpoint to access user profile
    // Use `req.payload` to get user information from the JWT payload
    res.json({
        'message': 'success in accessing protected route',
        'payload': req.payload
    });
});

// Another protected route example
app.get('/payment', authenticateWithJWT, async function (req, res) {
    // Example of another protected route
    res.json({
        'message': "accessing protected payment route"
    });
});


main();

// Start the server
app.listen(3000, function () {
    console.log("Server has started");
});
