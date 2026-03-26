const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "shopzy_secret_key";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

// MYSQL CONNECTION
const db = mysql.createConnection({
host:"localhost",
user:"root",
password:"vtu@24958",
database:"shopzy"
});

db.connect(err=>{
if(err){
console.log(err);
return;
}
console.log("MySQL Connected");
});


// PRODUCTS API
app.get("/products",(req,res)=>{

db.query("SELECT * FROM products",(err,result)=>{

if(err){
return res.status(500).send(err);
}

res.json(result);

});

});


// CART API
app.post("/cart",(req,res)=>{

const {product_id,product_name,price,quantity,image,user_id}=req.body;

const sql=`
INSERT INTO cart (product_id,product_name,price,quantity,image,user_id)
VALUES (?,?,?,?,?,?)
ON DUPLICATE KEY UPDATE quantity=quantity+?
`;

db.query(sql,
[product_id,product_name,price,quantity,image,user_id,quantity],
(err,result)=>{

if(err) return res.status(500).send(err);

res.json({message:"Cart updated"});

});

});


app.get("/cart",(req,res)=>{

db.query("SELECT * FROM cart",(err,result)=>{

if(err) return res.status(500).send(err);

res.json(result);

});

});


app.delete("/cart/:id",(req,res)=>{

const {id}=req.params;

db.query("DELETE FROM cart WHERE id=?",[id],(err,result)=>{

if(err) return res.status(500).send(err);

res.json({message:"Item removed"});

});

});


// REGISTER
app.post("/register",async(req,res)=>{

const {username,email,password}=req.body;

const hashed=await bcrypt.hash(password,10);

db.query(
"INSERT INTO users (username,email,password) VALUES (?,?,?)",
[username,email,hashed],
(err,result)=>{

if(err){
return res.status(400).json({message:"Email exists"});
}

res.json({message:"User registered"});

});

});


// LOGIN
app.post("/login",(req,res)=>{

const {email,password}=req.body;

db.query(
"SELECT * FROM users WHERE email=?",
[email],
async(err,results)=>{

if(results.length==0){
return res.status(400).json({message:"Invalid login"});
}

const user=results[0];

const match=await bcrypt.compare(password,user.password);

if(!match){
return res.status(400).json({message:"Invalid login"});
}

const token=jwt.sign({id:user.id},SECRET_KEY,{expiresIn:"1h"});

res.json({
message:"Login success",
token,
username:user.username,
id:user.id
});

});

});


// REVIEWS API

// GET REVIEWS
app.get("/reviews",(req,res)=>{

db.query(
"SELECT * FROM reviews ORDER BY created_at DESC",
(err,result)=>{

if(err){
return res.status(500).send(err);
}

res.json(result);

});

});


// ADD REVIEW
app.post("/reviews",(req,res)=>{

const {name,rating,comment}=req.body;

db.query(
"INSERT INTO reviews (name,rating,comment) VALUES (?,?,?)",
[name,rating,comment],
(err,result)=>{

if(err){
return res.status(500).send(err);
}

res.json({message:"Review added"});

});

});


// START SERVER
app.listen(3000,()=>console.log("Server running at http://localhost:3000"));