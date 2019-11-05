const User = require('../Sequelize.js').User
const Band = require('../Sequelize.js').Band
var randomstring = require("randomstring")
var nodemailer = require('nodemailer')


//nodemailer otp implementation
 module.exports = {

       sendmail: function (req, res, user_email, logintoken) {
            let transport = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
            //Enter your Gmail and password  here to send the otp as sender
                user: 'band@gmail.com',           
                pass: 'band123_'           
            }
        }
        );
             const message = {
              from: 'band@gmail.com',
              to: email,
             subject: 'Forgot Password',
                text: " OTP : " + logintoken 
        };
         transport.sendMail(message, function (er, inf) {
             if (er) {
                 console.log(er)
             } else {
                 console.log(inf);
            }
        });
    },


    //CRUD band functionalities

    editBands: function (req, res) {
        Band.findOne({
            where: { id: req.params.id }
        }).then(
            bands => {
                    var band = {
                     id: bands.id,
                     bandname: bands.bandname,
                   
                };
                res.render("edit", {
                    band: band
                })
            }
        )
    },

        editBand: function (req, res, id, bandname) {

        Band.findOne({
            where: { id: id }
        }).then(
            bands => {
                bands.update({
                    bandname: bandname
                }).then(setTimeout(function ()
                 {
       Band.findAll({ where: { userUserId: req.session.userid } }).then(
                        bands => {req.session.band = bands;
                            res.redirect("/")
                        })}, 1000))
            });
    },

    deleteBands: function (req, res, bid) {
         Band.destroy({
            where: { id: bid }
        }).then(
            Band.findAll({ where: { userUserId: req.session.userid } }).then(
                 bands => {
                    req.session.band = bands;
                     res.redirect("/");
                }
            )
        )
    },

    authUser: function (req, res, user_email, password) {
        User.findOne({
            where: { user_email: user_email, user_password: password }
        }).then(
            user => {
                if (user) {
                    req.session.user = user;
                    req.session.userid = user.user_id;
                }
                else {
                    req.session.LoginFailureStatus = "No User exist :(";
                    req.session.SignupSuccessStatus = '';
                }
                res.redirect("/");
            }
        );
    },


    //Create Bands  in DB
        bands: function (req, res, bname) {

        Band.create({
            bandname: bname,
            userUserId: req.session.userid
        }).then(setTimeout(function () {
            Band.findAll({ where: { userUserId: req.session.userid } }).then(
                bands => {
                    req.session.band = bands;
                    res.redirect("/");
                }
            )
        }, 1000)
        );
    },

    //adduser registration 

    addUser: function (req, res, username, password, user_email, user_dob,company) {
          User.create({
                 username: username,
                 user_password: password,
                user_dob: user_dob,
                user_email: user_email,
                company:company
          }).then(
                 req.session.SignupSuccessStatus = "Account Created Successfully",
                 res.redirect("/")
         );
         },  

    //forgot password
         forgotpassword: function (req, res, email) {
                 let logintoken = randomstring.generate({
              length: 4, charset: 'numeric'
        }
        );
        var date = new Date();
        var otplife = date.getTime() + 60000;
        User.update({
            user_otp: logintoken,
            otplife: otplife
        }, 
        {
            where: { user_email: email }
        }).then(
             user => {
                 if (user != 0) {
                      this.sendmail(req, res, email, logintoken);
                      req.session.user_email = email;
                        res.render("login", {
                          login : "none",
                          forgot: "none",
                          new: "block",
                         otpmessageShow: "none",
                      });
                 }
             else {
                       res.render("login", {
                              login : " none",
                              forgot: " block",
                              new: " none",
                              message: " No User found"
                    }
                    );
                }
            }
        )
    },

    //update password

    updatepassword: function(req, res, email, newpass){
        User.update({
            user_password: newpass,
            otplife: 0,
            user_otp: 0
        }, {
            where: { user_email: email }
        }).then(
            res.redirect("/")
        )
    },

    //reset password

    newpassword: function(req, res, email, otp, newpass){
        var d = new Date();
        var curtime = d.getTime();
        User.findOne({
            where: {user_email: email}
        }).then(
            user => {
                if(user.otplife > curtime && user.user_otp == otp){
                    req.session.SignupSuccessStatus = '',
                    req.session.SignupFailureStatus ='',
                    req.session.LoginFailureStatus = '',
                    this.updatepassword(req, res, email, newpass);   
                }
                else{
                    res.render("login", {
                        login : "none",
                        forgot: "none",
                        new: "block",
                        otpmessageShow: "block",
                        otpmessage: "OTP  expired!!! "
                    });
                }
            }
        )
    },


    //logout
     logout: function (req, res) {
         req.session.destroy();
          res.redirect("/");
    }
}    