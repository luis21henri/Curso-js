const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {

    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }


    async login() {
        this.valida();
        if(this.errors.length > 0) return;

        // CORREÇÃO 1: Salvar no "this.user" em vez de criar uma "const user"
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user) {
            this.errors.push('Usuário não existe');
            return;
        }

        // CORREÇÃO 2: Colocar a exclamação (!) no começo. 
        // Lógica: Se a senha NÃO bater, dá erro.
        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida');
            this.user = null; // Limpa a variável pra garantir que não vai logar
            return;
        }
    }

    async register(){
        this.valida();
        if(this.errors.length > 0) return;
        
        
        await this.userExists()
        
        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        
        this.user = await LoginModel.create(this.body);
       
        
    }
    async userExists(){
        this.user = await LoginModel.findOne({email: this.body.email})
        if(this.user){ this.errors.push('Usúario já existe.') }
    }

    valida() {
        this.cleanUp();
        
        // O email precisa ser validado
        if(!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }
        
        // Senha entre 3 e 50 caracteres
        if(this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha é inválida, precisa estar entre 3 e 50');
        }
    } // Fecha o método valida()

    cleanUp() {
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    } // Fecha o método cleanUp()
    
} // Fecha a classe Login

module.exports = Login;