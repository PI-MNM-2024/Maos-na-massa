const express = require("express");
const cors = require('cors')
const mongoose = require('mongoose');
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