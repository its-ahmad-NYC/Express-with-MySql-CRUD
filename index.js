const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();


const connection = require("./Config/db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello API");
});


app.post('/create', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).send({ error: "Name and email are required!" });
    }

    const sqlQuery = "INSERT INTO users (name, email) VALUES (?, ?)";
    
    connection.query(sqlQuery, [name, email], (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).send({ error: "Database error" });
        }

        res.status(201).send({ message: "Record created successfully", data: result });
    });
});
app.get('/data', (req, res) => {
   

    const sqlQuery = "select * from users";
    
    connection.query(sqlQuery,(err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).send({ error: "Database error" });
        }

        res.status(201).send({ message: "Record created successfully", data: result });
    });
});
app.delete('/delete/:id', (req, res) => {
    const userId = req.params.id; 

    const sqlQuery = "DELETE FROM users WHERE id = ?";  

    connection.query(sqlQuery, [userId], (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).send({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: `User with id ${userId} deleted successfully` });
    });
});
app.patch('/update/:id', (req, res) => {
    const userId = req.params.id;  
    const { name, email } = req.body; 

    let fieldsToUpdate = [];
    let values = [];

    if (name) {
        fieldsToUpdate.push("name = ?");
        values.push(name);
    }
    if (email) {
        fieldsToUpdate.push("email = ?");
        values.push(email);
    }

    if (fieldsToUpdate.length === 0) {
        return res.status(400).send({ message: "No fields to update" });
    }

   
    const sqlQuery = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    values.push(userId); 

    connection.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).send({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: `User with id ${userId} updated successfully` });
    });
});



app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
