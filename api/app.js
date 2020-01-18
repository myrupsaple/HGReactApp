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

//################################ (0) SETUP #################################//

connection.connect(async (err) => {
    if(err) {
        return console.log('error: ' + err.message);
    }

    const findTables = `SHOW TABLES`;
    var res = {};

    connection.query(findTables, (err, results, fields) => {
        if(err) {
            console.log(err.message);
        }
        res = results.map(table => {
            return table.Tables_in_hgapp;
        });
    

        const tableList = {
            users: false,
            tributes: false,
            tribute_stats:false,
            gameStatus: false
        }
        
        for(let table of res){
            switch(table){
                case 'users':
                    tableList.users = true;
                    break;
                case 'tributes':
                    tableList.tributes = true;
                    break;
                case 'tribute_stats':
                    tableList.tribute_stats = true;
                    break;
                case 'gameStatus':
                    tableList.gameStatus = true;
                    break;
                default:
                    break;
            }
        }

        const createUsers = `CREATE TABLE users(
            id INT PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            email VARCHAR(40) NOT NULL,
            permissions VARCHAR(10) NOT NULL
        )`;

        const createTributes = `CREATE TABLE tributes(
            id INT PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            email VARCHAR(40) NOT NULL,
            district TINYINT NOT NULL,
            districtPartner_email VARCHAR(40),
            area VARCHAR(15) NOT NULL,
            mentor_email VARCHAR(40),
            paid_registration TINYINT(1)
        )`;

        const createTributeStats = `CREATE TABLE tribute_stats(
            id INT PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            email VARCHAR(40) NOT NULL,
            funds_remaining INT NOT NULL,
            lives_remaining TINYINT NOT NULL,
            food_resources TINYINT NOT NULL,
            water_resources TINYINT NOT NULL,
            medicine_resources TINYINT NOT NULL,
            roulette_resources TINYINT NOT NULL,
            life_resources TINYINT NOT NULL,
            lives_starting TINYINT NOT NULL,
            lives_purchased TINYINT NOT NULL,
            lives_lost TINYINT NOT NULL,
            kill_count TINYINT NOT NULL
        )`;
        
        if(!tableList.users){
            connection.query(createUsers, (err, results, fields) => {
                if(err) {
                    console.log(err.message);
                }
            });
        }
        if(!tableList.tributes){
            connection.query(createTributes, (err, results, fields) => {
                if(err) {
                    console.log(err.message);
                }
            });
        }
        if(!tableList.tribute_stats){
            connection.query(createTributeStats, (err, results, fields) => {
                if(err) {
                    console.log(err.message);
                }
            });
        }
    })

});

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

//####################### (2) TRIBUTE INFO MANAGEMENT #######################//

// GET_TRIBUTES
app.get('/tributes/info/get', (req, res) =>{
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
app.get('/tribute/info/get/:email', (req, res) =>{
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
app.post('/tribute/info/post/:firstname/:lastname/:email/:district/:partneremail/:area/:mentoremail/:paidreg', (req, res) => {
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
app.put('/tribute/info/put/:id/:firstname/:lastname/:email/:district/:partneremail/:area/:mentoremail/:paidreg', (req, res) => {
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
app.delete('/tribute/info/delete/:id', (req, res) => {
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