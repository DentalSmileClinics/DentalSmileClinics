const renderIndex = (req, res) => {
    res.render('index');
};

const renderLogin = (req, res) => {
    // If user is already logged in, redirect to dashboard
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    
    // Pass session error variables and the active form step
    res.render('login', {
        error: req.session.login_error || req.session.register_error || null,
        success: req.session.register_success || null,
        active_form: req.session.active_form || 'login',
        new_temp_password: req.session.new_temp_password || null
    });

    // Clear these session vars after rendering
    delete req.session.login_error;
    delete req.session.register_error;
    delete req.session.register_success;
    delete req.session.active_form;
    delete req.session.new_temp_password;
};

module.exports = {
    renderIndex,
    renderLogin
};
