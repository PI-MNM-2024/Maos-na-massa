const express = require("express");
const cors = require('cors')
const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")
const bcrypt = require("bcrypt")
const jws = require("jsonwebtoken")
const res = require("express/lib/response");
const app = express()
app.use(express.json())
app.use(cors())


async function conectarAoMongoDB(){
    await mongoose.connect('mongodb+srv://GabrielFernandes:gabriel@pimaosnamassa.jfekz.mongodb.net/?retryWrites=true&w=majority&appName=PImaosnamassa')
}

const formularioSchema = mongoose.Schema({
    nome: {type:String, required: true, unique: false},
    email: {type:String, required:true, unique: false},
    telefone: {type:String, required: true, unique:false},
    mensagem: {type:String, required: true, unique:false}

})

const Formulario = mongoose.model("Formulario", formularioSchema)

const usuarioSchema = mongoose.Schema({
    login: {type:String, required: true, unique: true},
    password: {type:String, required:true}
})

usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

app.listen(3000, () => {
    try{
        conectarAoMongoDB()
        console.log("Server has started and Connection is ok!")
    }
    catch(error){
        console.log('Erro',error)
    }
    
})



app.post('/formulario', async (req,res) => {
    try{
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const mensagem = req.body.mensagem

    const novoformulario = new Formulario({nome:nome, email:email, telefone:telefone, mensagem:mensagem})

    respMongo = await novoformulario.save()

    console.log(respMongo)
    res.status(201).json({ message: "Formulário enviado com sucesso!", data: respMongo });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao enviar o formulário", error });
    }


})

app.post('/signup', async (req, res) =>{
    try{
     const login = req.body.login
     const password = req.body.password
     const criptografada = await bcrypt.hash(password,10)
     const usuario = new Usuario({
         login: login,
         password: criptografada
     })
     const respMongo = await usuario.save()
     console.log(respMongo)
     res.status(201).end
     }
     catch(error){
         console.log(error)
         res.status(409).end
 
     }
 })

 app.post('/login', async (req,res) => {
    // login/senha que o usuario enviou
    const login = req.body.login
    const password = req.body.password
    // tentamos encontrar no mongo db
    const u = await Usuario.findOne({login: req.body.login})
    if(!u){
        // senão foi encontrado, encerra por aqui com código 401
        return res.status(401).json({mensagem:"login inválido"})
    }
    // se foi encontrado, comparamos a senha, após descriptográ-la
    const senhaValida = await bcrypt.compare(password, u.password)
    if(!senhaValida){
        return res.status(401).json({mensagem:"senha inválida"})
    }
    // aqui vamos gerar o token e devolver para o cliente
    const token = jws.sign(
        {login:login},
        // depois vamos mudar para uma chave secreta de verdade 
        "chave-secreta",
        {expiresIn: "1h"}
    )
    res.status(200).json({token: token})

})