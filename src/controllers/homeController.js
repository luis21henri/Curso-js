
const Contato = require('../models/ContatoModel')

exports.index = async(req, res) => {
    // CORREÇÃO: Captura o ID do usuário se ele estiver logado na sessão
    const id_usuario = req.session.user ? req.session.user._id : null;
    
    // Só faz a busca no banco se houver um usuário logado, filtrando os contatos dele
    const contatos = id_usuario ? await Contato.buscaContatos(id_usuario) : [];
    
    res.render('index', { contatos });
    return;
}