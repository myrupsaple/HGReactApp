const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');

app.use(morgan('short'));

const _currentOrigin = 'http://localhost:3000'

const corsOptions = {
    origin: _currentOrigin,
    optionsSuccessStatus: 200
}

const _CORS_ALLOW = (res) => {
    return res.setHeader('Access-Control-Allow-Origin', _currentOrigin);
};

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#DankDenyk420@Chelsey',
    database: 'HGApp'
})

app.options('*', cors(corsOptions), (req, res) => {
    return;
})

app.get('/', (req, res) => {
    console.log('Responding to root route');
    res.send('Responding from root!');

    _CORS_ALLOW(res);
})

//FETCH_USER
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


app.listen(3001, () => {
    console.log('Server is up and listening on port 3001...');
})