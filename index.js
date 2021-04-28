const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const users = require('./model/user.js')


mongoose.connect('mongodb://localhost:27017/project', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:
        true
})
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => {
        console.log("OH NO ERROR!!!");
        console.log(err);
    })


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("index.ejs");
})


app.post('/', async (req, res) => {

    const n = req.body.name;
    const a = req.body.age;
    const id = req.body.id;
    const add = req.body.address;
    const ph = req.body.phone;


    const user = new users({
        name: n,
        age: a,
        email: id,
        address: add,
        phone: ph
    })

    await user.save();

    res.redirect('/users');
})


app.get('/users', async (req, res) => {
    const user = await users.find({ db: true });
    console.log(user);
    res.render("users.ejs", { user });
})

app.get('/users/details/:id', async (req, res) => {
    const { id } = req.params;

    const user = await users.findOne({ email: id });
    console.log(user);
    res.render("details.ejs", { user });
})


app.post('/users/details', async (req, res) => {
    const naam = req.body.name;
    const user = await users.find({ name: naam });
    console.log(user);


    if (user.length > 0) {

        res.render("users.ejs", { user });

    }
    else {
        res.send("Sorry no user found");
    }
})

app.post('/users/:id', async (req, res) => {
    const { id } = req.params;

    const user = await users.findOne({ email: id });

    if (req.body.action === 'delete') {
        await users.remove({ email: id });
    }
    else {
        user.name = req.body.name;
        user.email = req.body.email;
        user.address = req.body.address;
        user.phone = req.body.phone;


        user.age = req.body.age;

        await user.save();
    }

    res.redirect('/users')
})

app.listen(3000, () => {
    console.log("STARTED");
})