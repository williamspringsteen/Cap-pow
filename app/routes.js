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
        // load the index.hulk file
        res.render('index.hulk');
    });

    // LOGIN
    // Show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.hulk', {
            message: req.flash('loginMessage')
        });
    });

    // Process the login form
    // app.post('/login', do all our passport stuff here);

    // SIGNUP
    // Show the signup form
    app.get('/signup', function (req, res) {
        // Render the page and pass in any flash data if it exists
        res.render('signup.hulk', {
            message: req.flash('signupMessage')
        });
    });

    // Process the signup form
    // app.post('/signup', do all our passport stuff here);

    // PROFILE SECTION -- POSSIBLY TEMPORARY ONLY
    // We will want this protected so you have to be logged in to visit
    // We will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.hulk', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // LOGOUT
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};
