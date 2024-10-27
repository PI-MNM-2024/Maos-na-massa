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

async function enviarFormulario() {
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


  if (nome && email && telefone && mensagem) {

    nomeInput.value = ""
    emailInput.value = ""
    telefoneInput.value = ""
    mensagemInput.value = ""

    const formulario = (await axios.post(URLcompleta, { nome, email, telefone, mensagem })).data

    console.log("Foi bonitão")
  }
  else {
    console.log("vish não foi")
  }


}

async function cadastrarUsuario() {
  let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
  let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
  let usuarioCadastro = usuarioCadastroInput.value
  let passwordCadastro = passwordCadastroInput.value
  if (usuarioCadastro && passwordCadastro) {
    try {
      const cadastroEndpoint = '/signup'
      const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
      await axios.post(URLCompleta, { login: usuarioCadastro, password: passwordCadastro })
      usuarioCadastroInput.value = ""
      passwordCadastroInput.value = ""
      exibirAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
      ocultarModal('#modalLogin', 2000)
    }
    catch (error) {
      exibirAlerta('.alert-modal-cadastro', "Erro ao cadastrar usuário", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
      ocultarModal('#modalLogin', 2000)
    }
  }
  else {
    exibirAlerta('.alert-modal-cadastro', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
  }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadPages(); // Carrega as páginas do servidor ao iniciar
});

async function loadPages() {
  try {
      const response = await fetch('http://localhost:3000/pages'); // Requisição para obter páginas
      if (response.ok) {
          const pages = await response.json(); // Converte a resposta para JSON
          const pageList = document.getElementById("pageList");
          pages.forEach(page => {
              pageList.innerHTML += `<li><a href="${protocolo}${baseURL}/pages/${page.slug}">${page.title}</a></li>`; // protocolo e base url momentanios(talvez) mas por enquanto funcionado
          });
      } else {
          console.log('Erro ao carregar as páginas');
      }
  } catch (error) {
      console.error('Erro ao buscar páginas:', error);
  }
}

document.getElementById('pageForm').addEventListener('submit', async (event) => {

  event.preventDefault()

  const title = document.getElementById('title').value
  const content = document.getElementById('content').value
  const images = document.getElementById('images').files

  const formData = new FormData()
  formData.append('title', title)
  formData.append('content', content)

  for (let i = 0; i < images.length; i++) {
    formData.append('images', images[i])
  }

  const response = await fetch('http://localhost:3000/pages', {
    method: 'POST',
    body: formData
  })

  if (response.ok) {
    const result = await response.json();

    const newPage = { title: result.data.title, slug: result.data.slug };

    document.getElementById('pageList').innerHTML += `<li><a href="http://localhost:3000/pages/${result.data.slug}">${result.data.title}</a></li>`;

    document.getElementById('pageForm').reset();
  }
  else {
    console.log("não foi")
  }

})