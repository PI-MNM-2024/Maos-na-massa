const protocolo = 'http://'
const baseURL = 'localhost:3000'

async function enviarFormulario(){
    const formularioEndPoint = '/formulario'

    const URLcompleta = `${protocolo}${baseURL}${formularioEndPoint}`

    let nomeInput = document.querySelector('#nome')
    let emailInput = document.querySelector('#email')
    let telefoneInput = document.querySelector('#telefone')
    let mensagemInput = document.querySelector('#mensagem') 

    let nome = nomeInput.value
    let email = emailInput.value
    let telefone = telefoneInput.value
    let mensagem = mensagemInput.value 

    
    if (nome&&email&&telefone&&mensagem){
        
        nomeInput.value = ""
        emailInput.value = ""
        telefoneInput.value = ""
        mensagemInput.value = ""

        const formulario = (await axios.post(URLcompleta,{nome, email, telefone, mensagem})).data

        console.log("Foi bonitão")
    }
    else{
        console.log("vish não foi")
    }
    

}