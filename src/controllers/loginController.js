const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user){
        return res.render('login-logado');
    }
    res.render('login');
};

exports.register = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.register();
        
        // Se houver erros (ex: e-mail já existe)
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('/login/index');
            });
            return;
        }
        
        // Se deu tudo certo
        req.flash('success', 'Seu usuário foi criado com sucesso.');
        req.session.save(function() {
            return res.redirect('/login/index'); 
        });
        
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

exports.login = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.login();
        
        // Se houver erros (ex: senha inválida)
        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function() {
                return res.redirect('/login/index');
            });
            return;
        }
        
        // Se deu tudo certo, SALVA O USUÁRIO NA SESSÃO!
        req.flash('success', 'Você entrou no sistema.');
        req.session.user = login.user; // <-- Faltava isso para o login funcionar!
        req.session.save(function() {
            return res.redirect('/login/index'); 
        });
        
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};