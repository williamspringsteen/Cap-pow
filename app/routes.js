// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // If user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // If they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = function (app, passport) {
    // HOME
    app.get('/', function (req, res) {
        // load the index.ejs file
        res.render('index.ejs');
    });

    // LOGIN
    // Show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // Process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP
    // Show the signup form
    app.get('/signup', function (req, res) {
        // Render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // Process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        // Redirect to the secure profile section
        successRedirect : '/profile',

        // Redirect back to the signup page if there is an error
        failureRedirect : '/signup',

        // Allow flash messages
        failureFlash : true
    }));

    // PROFILE SECTION -- POSSIBLY TEMPORARY ONLY
    // We will want this protected so you have to be logged in to visit
    // We will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // LOGOUT
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};