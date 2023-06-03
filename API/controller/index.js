const express = require('express')

const path = require('path')

const bodyParser = require('body-parser')

const router = express.Router()

const {User, Flower} = require('../modal')

const user = new User()

const flower = new Flower()

router.get('^/$|/YoMama', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, '../view/index.html'))
})

// User Routes 

router.post('/login', bodyParser.json(), (req, res)=>{
    user.login(req, res);
})

router.get('/users', (req, res)=>{
    user.fetchUsers(req, res);
});

router.get('/user/:id', (req, res)=>{
    user.fetchUser(req, res);
});

router.put('/user/:id',bodyParser.json(), (req, res)=>{
    user.updateUser(req, res);
});

router.post('/register', bodyParser.json(), (req, res)=> {
    user.createUser(req, res);
})

router.delete('/user/:id', (req, res)=>{
    user.deleteUser(req, res);
});

// Product Routes

router.get('/items', (req, res)=> {
    flower.fetchFlowers(req, res);
})

router.get('/item/:id', (req, res)=> {
    flower.fetchFlower(req, res);
})

router.post('/item', bodyParser.json(), 
(req, res)=> {
    flower.addFlower(req, res);
})

router.put('/item/:id', bodyParser.json(),
(req, res)=> {
    flower.updateFlower(req, res);
})

router.delete('/item/:id', 
(req, res)=> {
    flower.deleteFlower(req, res);
})

module.exports = router;