const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');

app.use(morgan('short'));

const _currentOrigin = 'http://localhost:3000';

const corsOptions = {
    origin: _currentOrigin,
    optionsSuccessStatus: 200
};

const _CORS_ALLOW = (res) => {
    return res.setHeader('Access-Control-Allow-Origin', _currentOrigin);
};

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#DankDenyk420@Chelsey',
    database: 'HGApp'
});

// Setup work in the case that a database is missing
// connection.connect((err) => {
//     if(err) {
//         return console.log('error: ' + err.message);
//     }

//     const createUsers = `CREATE TABLE IF NOT EXISTS users(
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         first_name VARCHAR(20) NOT NULL,
//         last_name VARCHAR(20) NOT NULL,
//         email VARCHAR(40) NOT NULL,
//         permissions VARCHAR(10) NOT NULL
//     )`;

//     connection.query(createUsers, (err, results, fields) => {
//         if(err) {
//             console.log(err.message);
//         }
//     });

//     const createTributes = `CREATE TABLE IF NOT EXISTS tributes(
//         id INT PRIMARY KEY AUTO_INCREMENT,
//         first_name VARCHAR(20) NOT NULL,
//         last_name VARCHAR(20) NOT NULL,
//         email VARCHAR(40) NOT NULL,
//         district TINYINT NOT NULL,
//         districtPartner_email VARCHAR(40),
//         area VARCHAR(15) NOT NULL,
//         mentor_email VARCHAR(40),
//         profilePhoto_link VARCHAR(200),
//         profileBio VARCHAR(500),
//         paid_registration BIT NOT NULL
//     )`

//     connection.query(createTributes, (err, results, fields) => {
//         if(err) {
//             console.log(err.message);
//         }
//     });

// });

app.options('*', cors(corsOptions), (req, res) => {
    return;
})

//########################### (1) USER MANAGEMENT ############################//

// FETCH_USER
app.get('/user/get/:email', (req, res) => {
    const email = req.params.email;
    const queryStringGetUser = `SELECT * FROM users WHERE email = '${email}'`;
    console.log(queryStringGetUser);
    connection.query(queryStringGetUser, (err, rows, fields) => {
        if (err){
            console.log('Failed to query for user: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }
        _CORS_ALLOW(res);
        
        res.json(rows);
    });
})

// FETCH_USERS
app.get('/users/get/:type/:query', (req, res) => {
    const type = req.params.type;
    const query = req.params.query;
    const queryStringGetUsers = `SELECT * FROM users WHERE ${type} LIKE '%${query}%'`;
    console.log(queryStringGetUsers);
    connection.query(queryStringGetUsers, (err, rows, fields) => {
        if (err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// FETCH_ALL_USERS
app.get('/users/get', (req, res) => {
    const queryStringGetUsers = 'SELECT * FROM users';
    console.log(queryStringGetUsers);
    connection.query(queryStringGetUsers, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_USER
app.put('/user/put/:id/:firstname/:lastname/:email/:permissions', (req, res) => {
    const { id, firstname, lastname, email, permissions } = req.params;
    const queryStringUpdateUser = `UPDATE users SET first_name = "${firstname}", last_name = "${lastname}", email = "${email}", permissions = "${permissions}" WHERE id = ${id}`
    console.log(queryStringUpdateUser);
    connection.query(queryStringUpdateUser, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// CREATE_USER
app.post('/user/post/:firstname/:lastname/:email/:permissions', (req, res) => {
    const { firstname, lastname, email, permissions } = req.params;
    const queryStringUpdateUser = `INSERT INTO users (first_name, last_name, email, permissions) VALUES ('${firstname}', '${lastname}', '${email}', '${permissions}')`
    console.log(queryStringUpdateUser);
    connection.query(queryStringUpdateUser, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_USER
app.delete('/user/delete/:id', (req, res) => {
    const id = req.params.id;
    const queryStringDeleteUser = `DELETE FROM users WHERE id = ${id}`;
    console.log(queryStringDeleteUser);
    connection.query(queryStringDeleteUser, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for users: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

//########################## (2) TRIBUTE MANAGEMENT ###########################//

// GET_TRIBUTES
app.get('/tributes/get', (req, res) =>{
    const queryStringGetTributes = `SELECT * FROM tributes`;
    console.log(queryStringGetTributes);
    connection.query(queryStringGetTributes, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// GET_TRIBUTE
app.get('/tribute/get/:email', (req, res) =>{
    const email = req.params.email;
    const queryStringGetTributes = `SELECT * FROM tributes WHERE email = '${email}'`;
    console.log(queryStringGetTributes);
    connection.query(queryStringGetTributes, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    })
})

// CREATE_TRIBUTE
app.post('/tribute/post/:firstname/:lastname/:email/:district/:partneremail/:area/:mentoremail/:paidreg', (req, res) => {
    const { firstname, lastname, email, district, partneremail, area, mentoremail, paidreg } = req.params;
    const queryStringCreateTribute = `INSERT INTO tributes (first_name, last_name, email, district,
        districtPartner_email, area, mentor_email, paid_registration) VALUES ("${firstname}", 
        "${lastname}", "${email}", "${district}", "${partneremail}", "${area}", 
        "${mentoremail}", "${paidreg}")`;
    console.log(queryStringCreateTribute);
    connection.query(queryStringCreateTribute, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// UPDATE_TRIBUTE
app.put('/tribute/put/:id/:firstname/:lastname/:email/:district/:partneremail/:area/:mentoremail/:paidreg', (req, res) => {
    const { id, firstname, lastname, email, district, partneremail, area, mentoremail, paidreg } = req.params;
    const queryStringUpdateTribute = `UPDATE tributes SET first_name = "${firstname}",
        last_name = "${lastname}", email = "${email}", district = "${district}",
        districtPartner_email = "${partneremail}", area = "${area}", mentor_email ="${mentoremail}", 
        paid_registration = "${paidreg}" WHERE id = ${id}`;
    console.log(queryStringUpdateTribute);
    connection.query(queryStringUpdateTribute, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})

// DELETE_USER
app.delete('/tribute/delete/:id', (req, res) => {
    const id = req.params.id;
    const queryStringDeleteTribute = `DELETE FROM tributes WHERE id = ${id}`;
    console.log(queryStringDeleteTribute);
    connection.query(queryStringDeleteTribute, (err, rows, fields) => {
        if(err){
            console.log('Failed to query for tributes: ' + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        _CORS_ALLOW(res);

        res.json(rows);
    });
})




app.listen(3001, () => {
    console.log('Server is up and listening on port 3001...');
})