
// variables

 const myConfig = require('./config/myConfig.js')
 const functions = require('./actions/actions.js')
 const app = myConfig.app
 const exphbs = myConfig.exphbs
 const session = myConfig.session
 const bodyparser = myConfig.bodyparser
 const port = process.env.PORT || 5000
 const methodOverride = require('method-override')
 const crypto = require('crypto')
 app.engine('hbs', exphbs({
     defaultLayout: '',
}
)
)
 
 //Routes actions

 app.listen(port, () => console.log(`Running on port ${port}..`))


 app.set('view engine', 'hbs')
 app.set('views', 'views')

 app.use(session({
     secret: "nobody should guess this",

     saveUninitialized: true,

     cookie: { secure: false }
}
)
)

 app.use(bodyparser.urlencoded({ extended: true }));
 app.use(methodOverride('_method'));


const loggedInOnly = ( failure = "/login") => (req, res, next) => {
    if (req.session.user) {next()} 
    else {
        res.redirect(failure)}} 

//GET: /
 app.get("/", loggedInOnly(), (req, res) => {
     res.render("index", {
         bands: req.session.band
    })
})

//PUT: /edit/n
app.put("/edit/:id", (req, res) =>  {
    
      functions.editBands(req, res)
})

//POST:editband/n
app.post("/editband/:id", (req, res) =>  {
     const  bandname  = req.body
     const id = req.params.id
     functions.editBand(req, res,  id, bandname)
});

//DELETE: /delete/n
app.delete("/delete/:id",  (req, res) => {

    const id =  req.params.id;
     functions.deleteBands(req, res, id);
})

//POST: /forgotpassword
app.post("/forgotpassword", (req, res) => {
    const user_email = req.body.user_email;
    functions.forgotpassword(req, res, user_email);
});

//GET: /login
app.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("login", {
            signupSuccessStatus: req.session.SighnupSuccessStatus,
            signupFailureStatus: req.session.SighnupFailureStatus,
            loginFailureStatus: req.session.LoginFailureStatus,
            login: "block",
            forgot: "none",
            new: "none"
        })
    }
})

//GET: /signup
app.get("/signup",(req,res)=>{
    if(req.session.user){res.redirect("/")

}else{
    res.render("signup");

}
});

//POST: /login
app.post("/login", (req, res) => {
    const user_email = req.body.user_email;
    const password = crypto.createHash('sha256').update(req.body.password).digest('base64');
    
    functions.authUser(req, res, user_email, password)
});

//GET: /add
app.get("/add", (req, res) => {
    res.render("band")
})

//POST: /add
app.post("/add", (req, res) => {
    const bandname  = req.body.bandname
    functions.bands(req, res, bandname)
})

//GET: /logout

app.get("/logout", (req, res) => {
    functions.logout(req, res)
})
//POST: /signup
app.post("/signup", (req, res) => {
    const { username, password, user_email, user_dob } = req.body
    functions.addUser(req, res, username, crypto.createHash('sha256').update(password).digest('base64'), user_email, user_dob);
})

//POST: /newpassword
app.post("/newpassword", (req, res) => {

    const {userotp, newpassword} = req.body
    const user_email =  req.session.user_email
    functions.newpassword(req, res, user_email, userotp, crypto.createHash('sha256').update(newpassword).digest('base64'))
})

//GET: /profile
app.get("/profile", (req, res) => {

    res.render("profile",{
        user: req.session.user
    })
})






