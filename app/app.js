const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const path = require('path');
const bodyParser = require('body-parser');

const dbPath = "app/db/database.sqlite3";


//setting to parse the body of a request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//"__dirname means" current directory of this file.
//so... below code sets "currentDirectory/public" as the route directory of static files( like .html, .css and so on.)
app.use(express.static(path.join(__dirname, 'public')));


//Get all users
app.get('/api/v1/users', (req, res) => {
    //Connect database
    const db = new sqlite3.Database(dbPath);//"constructor declaration"( another style is "object literal.")

    db.all('SELECT * FROM users', (err, rows) => {
        res.json(rows);
    });
    db.close();
});

//Get following users
app.get('/api/v1/users/:id/following', (req, res) => {
    //Connect database
    const db = new sqlite3.Database(dbPath);//"constructor declaration"( another style is "object literal.")
    const id = req.params.id;

    db.all(`SELECT * FROM following LEFT JOIN users ON following.followed_id = users.id WHERE following_id = ${id};`, (err, rows) => {
        if(!rows){
            res.status(404).send({error: "Not Found!"});
        }else{
            res.status(200).json(rows);
        }    
    });
    db.close();
});


//Get a user
app.get('/api/v1/users/:id', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;

    db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
        if(!row){
            res.status(404).send({error: "Not Found!"});
        }else{
            res.status(200).json(row);
        }
    });
    db.close();
});

//Search users matching keyword
app.get('/api/v1/search', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    const keyword = req.query.q;

    db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
        res.json(rows);
    });
    db.close();
});


//create a function to implement a DB query 
const run = async (sql, db) => {
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {//this "db" is sqlite DB.
            if(err){
                return reject(err);//Promise's method.
            }else{
                return resolve();//Promise's method too.
            }
        });
    });
};


//Create a new user
app.post('/api/v1/users', async (req, res) => {
    if(!req.body.name || req.body.name === ""){
        res.status(400).send({error: "No name is inputted!"});
    }else{
        const db = new sqlite3.Database(dbPath);

        const name = req.body.name;
        const profile = req.body.profile ? req.body.profile : "";//ideally we should write the process for an error.
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : "";//same as above.
        try {
            await run(
                `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`,
                db
            );
            res.status(201).send({message: "Successfully create a new user!"});
        } catch (e) {//if "run function" returns "err", "catch" catches it as "e".
            res.status(500).send({error: e});
        }
        db.close();
    }
});


//Update user data
app.put('/api/v1/users/:id', async (req, res) => {
    if(!req.body.name || req.body.name === ""){
        res.status(400).send({error: "No name is inputted!"});
    }else{
        const db = new sqlite3.Database(dbPath);
        const id = req.params.id;

        //update the data after comparing current user data
        db.get(`SELECT * FROM users WHERE id = ${id}`, async (err, row) => {
            if(!row){
                res.status(404).send({error: "The user is not Found!"});
            }else{
                const name = req.body.name ? req.body.name : row.name ;
                const profile = req.body.profile ? req.body.profile : row.profile;
                const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth;

                try {
                    await run(
                        `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
                        db
                    );
                    res.status(200).send({message: "Updated user data!"});
                } catch (e) {
                    res.status(500).send({error: e});
                }
            }
        });

        db.close();
    }
});


//Delete user data
app.delete('/api/v1/users/:id', async (req, res) => {
    
    const db = new sqlite3.Database(dbPath);
    const id = req.params.id;
    db.get(`SELECT * FROM users WHERE id = ${id}`, async (err, row) => {
        if(!row){
            res.status(404).send({error: "The user is not Found!"});
        }else{
            try {
                await run(`DELETE FROM users WHERE id=${id}`, db);
                res.status(200).send({message: "Successfully deleted!"});
            } catch (e) {
                res.status(500).send({error: e});
            }
        }
    });
    db.close();
});


const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listen on port: " + port);