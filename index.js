const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/teste",
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 20000
});

const UsuarioSchema = new mongoose.Schema({
    email : {type : String, required : true},
    senha : {type : String}
});

const Usuario = new mongoose.model("Usuario", UsuarioSchema);

app.post("/cadastrousuario", async(req, res)=>{
    const email = req.body.email;
    const senha = req.body.senha;

if(email == null || senha == null){
    return res.status(400).json({error : "Preencha todos os campos"})
}

const emailExiste = await Usuario.findOne({email : email})

if(emailExiste){
    return res.status(400).json({error : "O e-mail cadastrado já existe"})
}

const usuario = new Usuario({
    email : email,
    senha : senha
})

try{
    const newUsuairo = await usuario.save()
    res.json({error : null, msg : "Cadastro OK", usuarioId : newUsuario._id});
}catch(error){
    res.status(400).json({error})
}
});

app.listen(port, ()=>{
    console.log(`O servidor está rodando na porta ${port}`);
});