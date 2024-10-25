const protocolo = 'http://'
const baseURL = 'localhost:3000'

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
        alert.classList.remove('show')
        alert.classList.add('d-none')
    }, timeout)
}

function ocultarModal(seletor, timeout) {
    setTimeout(() => {
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
        modal.hide()
    }, timeout)
}

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

async function cadastrarUsuario(){
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value
    if (usuarioCadastro && passwordCadastro) {
      try{
      const cadastroEndpoint = '/signup'
      const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
        await axios.post(URLCompleta, { login: usuarioCadastro, password: passwordCadastro })
        usuarioCadastroInput.value = ""
        passwordCadastroInput.value = ""
        exibirAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
        ocultarModal('#modalLogin', 2000)
      }
      catch(error){
        exibirAlerta('.alert-modal-cadastro', "Erro ao cadastrar usuário", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
        ocultarModal('#modalLogin', 2000)
      }
    }
    else{
      exibirAlerta('.alert-modal-cadastro', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
  }