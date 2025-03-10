const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    //check if the user exsists - No duplicate usernames
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Username already taken.');
    }
        //check if the password and confirm password are a match
        if (req.body.password !== req.body.confirmPassword) {
            return res.send('Password and Confirm Password must match');
          }  
          
          //create encrypted version of password, hashed and salted
          const hashedPassword = bcrypt.hashSync(req.body.password, 10);
          req.body.password = hashedPassword;

          // validation logic

        const user = await User.create(req.body);
        res.send(`Thanks for signing up ${user.username}`);


});

//GET sign-in: send a page that has a login form
router.get('/sign-in', async (req, res) => {
    res.render('auth/sign-in.ejs');
});

//POST sign-in: route that will be used when login form is submitted
router.post('/sign-in', async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }    

//bycrypt's comparison function
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if(!validPassword) {
        return res.send('Login Failed. Please try again!');
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };

    res.redirect('/');
});

module.exports = router;

