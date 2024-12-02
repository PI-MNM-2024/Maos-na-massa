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

async function enviarFormulario(event) {
  event.preventDefault();
  const formularioEndPoint = '/formulario'

  const URLcompleta = `${protocolo}${baseURL}${formularioEndPoint}`

  let nomeInput = document.querySelector('#nome')
  let emailInput = document.querySelector('#email')
  let assuntoInput = document.querySelector('#assunto')
  let mensagemInput = document.querySelector('#mensagem')

  let nome = nomeInput.value
  let email = emailInput.value
  let assunto = assuntoInput.value
  let mensagem = mensagemInput.value


  if (nome && email && assunto && mensagem) {

    nomeInput.value = ""
    emailInput.value = ""
    assuntoInput.value = ""
    mensagemInput.value = ""

    const formulario = (await axios.post(URLcompleta, { nome, email, assunto, mensagem })).data

    console.log("Foi bonitão")
  }
  else {
    console.log("vish não foi")
  }


}

document.addEventListener('DOMContentLoaded', function () {
  // Lista de perguntas que contêm a opção "Outro"
  const perguntasOutro = [
    { name: 'tipodemoradia', inputId: 'OutroMoradia' },
    { name: 'tipodeficiencia', inputId: 'OutroDeficiencia' },
    { name: 'necessidadeAcessibilidade', inputId: 'OutroNecessidade' },
    { name: 'dificuldadesEnfrentadas', inputId: 'OutroDificuldade' }
  ];

  const perguntasOutroEmpresa = [
    { name: 'tipodeInstituicao', inputId: 'OutroMoradia' },
    { name: 'tipodeficiencia', inputId: 'OutroDeficiencia' },
    { name: 'necessidadeAcessibilidade', inputId: 'OutroNecessidade' },
    { name: 'dificuldadesEnfrentadas', inputId: 'OutroDificuldade' },
  ]


  // Função para alternar a visibilidade do campo "Outro"
  function toggleOutroInput(name, inputId) {
    const outroRadio = document.querySelector(`input[name="${name}"][value="Outro"]`);
    console.log(outroRadio)
    const outroInput = outroRadio.nextElementSibling.nextElementSibling; // Seleciona o campo de texto após o rótulo "Outro: "

    if (!outroInput) {
      console.error(`Campo de texto associado a "Outro" para ${name} não foi encontrado.`);
      return;
    }

    outroInput.disabled = !outroRadio.checked;
    if (!outroRadio.checked) {
      outroInput.value = ''; // Limpa o campo de texto "Outro" se ele for desabilitado
    }
  }

  if (window.location.pathname === "/public/src/form-pessoa.html") {
    perguntasOutro.forEach(pergunta => {
      const radios = document.querySelectorAll(`input[name="${pergunta.name}"]`);

      radios.forEach(radio => {
        radio.addEventListener('change', function () {
          toggleOutroInput(pergunta.name, pergunta.inputId);
        });
      });

      // Inicializa o estado correto para cada grupo de botões
      toggleOutroInput(pergunta.name, pergunta.inputId);
    });

  }

  if (window.location.pathname === "/public/src/form-instituicao.html") {

    perguntasOutroEmpresa.forEach(pergunta => {
      const radios = document.querySelectorAll(`input[name="${pergunta.name}"]`);

      radios.forEach(radio => {
        radio.addEventListener('change', function () {
          toggleOutroInput(pergunta.name, pergunta.inputId);
        });
      });

      // Inicializa o estado correto para cada grupo de botões
      toggleOutroInput(pergunta.name, pergunta.inputId);
    });
  }

  // Define as respostas da pergunta 9
  const perguntas9respostas = [
    { name: 'tipodeficiencia', inputId: 'deficienciaFisica' },
    { name: 'tipodeficiencia', inputId: 'deficienciaVisual' },
    { name: 'tipodeficiencia', inputId: 'deficienciaAuditiva' },
    { name: 'tipodeficiencia', inputId: 'deficienciaIM' },
    { name: 'tipodeficiencia', inputId: 'OutroDeficiencia' },
    { name: 'tipodeficiencia', inputId: 'prefiroNResponder' }
  ];

  const perguntas12respostas = [
    { name: 'dificuldadesEnfrentadas', inputId: 'faltaRecurso' },
    { name: 'dificuldadesEnfrentadas', inputId: 'faltaConhecimento' },
    { name: 'dificuldadesEnfrentadas', inputId: 'faltaProfissionais' },
    { name: 'dificuldadesEnfrentadas', inputId: 'OutroDificuldade' }
  ];

  // Seleciona os botões de rádio da pergunta 8
  const p8Sim = document.querySelector('input[name="simOUnaoDeficiencia"][value="Sim"]');
  const p8Nao = document.querySelector('input[name="simOUnaoDeficiencia"][value="Não"]');

  const p11Sim = document.querySelector('input[name="tentouAdaptacoes"][value="Sim, com sucesso"]');
  const p11Sim2 = document.querySelector('input[name="tentouAdaptacoes"][value="Sim, mas enfrentei dificuldades"]');

  const p11Sim3 = document.querySelector('input[name="tentouAdaptacoes"][value="Sim, mas enfrentou dificuldades"]');

  const p11Nao = document.querySelector('input[name="tentouAdaptacoes"][value="Não, nunca tentei"]');

  const p11Nao2 = document.querySelector('input[name="tentouAdaptacoes"][value="Não, nunca tentou"]');

  // Seleciona todos os botões de rádio da pergunta 9 com base nos IDs
  const radios9 = perguntas9respostas.map(item => document.getElementById(item.inputId));
  const radios12 = perguntas12respostas.map(item => document.getElementById(item.inputId));


  function desabilitarProxPergunta(radio, condicional) {
    radio.forEach(radio => {
      radio.disabled = condicional
    })
  }

  function limparCampos(radio, idOutro) {
    radio.forEach(radio => radio.checked = false);
    const textOutro = document.querySelector(`input[id="${idOutro}"]`);

    if (textOutro) { // Verifica se o elemento foi encontrado
      textOutro.value = "";
    } else {
      console.warn(`Elemento com id "${idOutro}" não foi encontrado.`);
    }
  }
  if (window.location.pathname === "/public/src/form-pessoa.html") {
    //verrifica a pergunta 8
    p8Sim.addEventListener('change', function () {
      desabilitarProxPergunta(radios9, false);

    });

    p8Nao.addEventListener('change', function () {
      desabilitarProxPergunta(radios9, true);
      limparCampos(radios9, 'OutroDeficienciaInput');
    });

    // verifica a pergunta 11
    p11Sim.addEventListener('change', function () {
      desabilitarProxPergunta(radios12, false);
    });

    p11Sim2.addEventListener('change', function () {
      desabilitarProxPergunta(radios12, false);
    });

    p11Nao.addEventListener('change', function () {
      desabilitarProxPergunta(radios12, true);
      limparCampos(radios12, 'inputOutroDificuldade');
    });
  }

  if (window.location.pathname === "/public/src/form-instituicao.html") {
    //verrifica a pergunta 9
    p8Sim.addEventListener('change', function () {
      desabilitarProxPergunta(radios9, false);

    });

    p8Nao.addEventListener('change', function () {
      desabilitarProxPergunta(radios9, true);
      limparCampos(radios9, 'OutroDeficienciaInput');
    });

    // verifica a pergunta 11
    p11Sim.addEventListener('change', function () {
      desabilitarProxPergunta(radios12, false);
    });

    p11Sim3.addEventListener('change', function () {
      desabilitarProxPergunta(radios12, false);
    });

    p11Nao2.addEventListener('change', function () {
      desabilitarProxPergunta(radios12, true);
      limparCampos(radios12, 'inputOutroDificuldade');
    });
  }

})


async function enviarFormularioBeneficiario() {
  //  Inputs
  let nomeInput = document.querySelector('#nome')
  let idadeInput = document.querySelector('#idade')
  let enderecoInput = document.querySelector('#endereco')
  let telefoneInput = document.querySelector('#telefone')
  let emailInput = document.querySelector('#email')

  let tipodemoradiaInput = document.getElementsByName('tipodemoradia')
  let pessoasResidenciaInput = document.querySelector('#pessoasResidencia')
  let simOUnaoDeficienciaInput = document.getElementsByName('simOUnaoDeficiencia')
  let tipodeficienciaInput = document.getElementsByName('tipodeficiencia')
  let necessidadeAcessibilidadeInput = document.getElementsByName('necessidadeAcessibilidade')
  let tentouAdaptacoesInput = document.getElementsByName('tentouAdaptacoes')
  let dificuldadesEnfrentadasInput = document.getElementsByName('dificuldadesEnfrentadas')
  let segurançaCasaInput = document.getElementsByName('segurançaCasa')
  let impactoReformaInput = document.getElementsByName('impactoReforma')

  let mensagemP15Input = document.querySelector('#mensagemP15')
  let mensagemP16Input = document.querySelector('#mensagemP16')

  let maisInformacoesInput = document.getElementsByName('maisInformacoes')
  let ondeConheceuONGInput = document.getElementsByName('ondeConheceuONG')

  // Valores

  const nome = nomeInput.value;
  const idade = idadeInput.value;
  const endereco = enderecoInput.value;
  const telefone = telefoneInput.value;
  const email = emailInput.value;

  let tipodemoradia = Array.from(tipodemoradiaInput).find(radio => radio.checked)?.value;
  let pessoasResidencia = pessoasResidenciaInput.value;
  let simOUnaoDeficiencia = Array.from(simOUnaoDeficienciaInput).find(radio => radio.checked)?.value;
  let tipodeDeficiencia = Array.from(tipodeficienciaInput).find(radio => radio.checked)?.value;
  let necessidadeAcessibilidade = Array.from(necessidadeAcessibilidadeInput).find(radio => radio.checked)?.value;
  let tentouAdaptacoes = Array.from(tentouAdaptacoesInput).find(radio => radio.checked)?.value;
  let dificuldadesEnfrentadas = Array.from(dificuldadesEnfrentadasInput).find(radio => radio.checked)?.value;
  let segurançaCasa = Array.from(segurançaCasaInput).find(radio => radio.checked)?.value;
  let impactoReforma = Array.from(impactoReformaInput).find(radio => radio.checked)?.value;

  let mensagemP15 = mensagemP15Input.value;
  let mensagemP16 = mensagemP16Input.value;

  let maisInformacoes = Array.from(maisInformacoesInput).find(radio => radio.checked)?.value;
  let ondeConheceuONG = Array.from(ondeConheceuONGInput).find(radio => radio.checked)?.value;

  const perguntasOutro = [
    { name: 'tipodemoradia', inputId: 'OutroMoradiaInput' },
    { name: 'tipodeficiencia', inputId: 'OutroDeficienciaInput' },
    { name: 'necessidadeAcessibilidade', inputId: 'OutroNecessidadeInput' },
    { name: 'dificuldadesEnfrentadas', inputId: 'inputOutroDificuldade' }
  ];

  // Função para capturar valores e formatar "Outro"
  function obterValorComOutro(pergunta) {
    const radioGroup = document.getElementsByName(pergunta.name);
    let valor = Array.from(radioGroup).find(radio => radio.checked)?.value;

    // Se a opção "Outro" for escolhida, captura o valor do input correspondente
    if (valor === "Outro") {
      const outroInput = document.querySelector(`#${pergunta.inputId}`).value;
      // Verifica se o input não está vazio antes de formatar
      valor = outroInput ? `outro: ${outroInput}` : `outro: [sem informação]`; // Se não houver valor, define um valor padrão
    }

    return valor; // Retorna o valor (ou formatado se for "Outro")
  }

  const requiredFields = [
    nome, idade, endereco, telefone, email,
    tipodemoradia, pessoasResidencia, simOUnaoDeficiencia,
    necessidadeAcessibilidade, tentouAdaptacoes, segurançaCasa, impactoReforma,
    mensagemP15, mensagemP16, maisInformacoes, ondeConheceuONG
  ];

  const allRequiredFilled = requiredFields.every(field => field);

  if (!allRequiredFilled) {
    console.error('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Monta o objeto com os dados do formulário
  const formularioData = {
    nome,
    idade,
    endereco,
    telefone,
    email,
    moradiaCondicao: obterValorComOutro({ name: 'tipodemoradia', inputId: 'OutroMoradiaInput' }),
    pessoasPorResidencia: pessoasResidencia,
    pessoaComDeficienciaNaResidencia: simOUnaoDeficiencia,
    tipoDeDeficiencia: obterValorComOutro({ name: 'tipodeficiencia', inputId: 'OutroDeficienciaInput' }),
    necessidadeAcessibilidade: obterValorComOutro({ name: 'necessidadeAcessibilidade', inputId: 'OutroNecessidadeInput' }),
    jaTentouAdaptacoes: tentouAdaptacoes,
    dificuldadesEnfrentadas: obterValorComOutro({ name: 'dificuldadesEnfrentadas', inputId: 'inputOutroDificuldade' }),
    segurancaEAcessibilidadeCasaAtual: segurançaCasa,
    impactoReforma,
    pa1: mensagemP15,
    pa2: mensagemP16,
    atualizacaoProjetos: maisInformacoes,
    conheceAONGComo: ondeConheceuONG
  };

  // Envia os dados para o servidor usando Axios
  try {
    const formularioEndPoint = '/formularioBeneficiario'

    const URLcompleta = `${protocolo}${baseURL}${formularioEndPoint}`


    const response = await axios.post(URLcompleta, formularioData);

    if (response.status === 200) {
      console.log('Formulário enviado com sucesso:', response.data);


      nomeInput.value = '';
      idadeInput.value = '';
      enderecoInput.value = '';
      telefoneInput.value = '';
      emailInput.value = '';
      pessoasResidenciaInput.value = '';
      mensagemP15Input.value = '';
      mensagemP16Input.value = '';


      tipodemoradiaInput.forEach(radio => radio.checked = false);
      simOUnaoDeficienciaInput.forEach(radio => radio.checked = false);
      tipodeficienciaInput.forEach(radio => radio.checked = false);
      necessidadeAcessibilidadeInput.forEach(radio => radio.checked = false);
      tentouAdaptacoesInput.forEach(radio => radio.checked = false);
      dificuldadesEnfrentadasInput.forEach(radio => radio.checked = false);
      segurançaCasaInput.forEach(radio => radio.checked = false);
      impactoReformaInput.forEach(radio => radio.checked = false);


      maisInformacoesInput.forEach(radio => radio.checked = false);
      ondeConheceuONGInput.forEach(radio => radio.checked = false);

    } else {
      throw new Error(`Erro ao enviar o formulário: ${response.statusText}`);
    }

  } catch (error) {
    console.error('Erro ao enviar o formulário:', error);
  }
}

async function enviarFormularioInstituicao() {

  let nomeinstituicaoInput = document.querySelector('#nomeInstituicao')
  let responsavelInput = document.querySelector('#responsavelLegal')
  let CNPJInput = document.querySelector('#CNPJ')
  let enderecoInput = document.querySelector('#endereco')
  let telefoneInput = document.querySelector('#telefone')
  let emailInput = document.querySelector('#email')

  let tipodemoradiaInput = document.getElementsByName('tipodeInstituicao')
  let descInstituicaoInput = document.querySelector('#descInstituicao')
  let pessoasAtendidasInput = document.querySelector('#nPessoasAtendidas')
  let simOUnaoDeficienciaInput = document.getElementsByName('simOUnaoDeficiencia')
  let tipodeficienciaInput = document.getElementsByName('tipodeficiencia')
  let necessidadeAcessibilidadeInput = document.getElementsByName('necessidadeAcessibilidade')
  let tentouAdaptacoesInput = document.getElementsByName('tentouAdaptacoes')
  let dificuldadesEnfrentadasInput = document.getElementsByName('dificuldadesEnfrentadas')
  let segurançaInstituicaoInput = document.getElementsByName('segurançaCasa')
  let impactoReformaInput = document.getElementsByName('impactoReforma')

  let mensagemDInput = document.querySelector('#mensagemP16')
  let mensagemAInput = document.querySelector('#mensagemP17')

  let maisInformacoesInput = document.getElementsByName('maisInformacoes')
  let ondeConheceuONGInput = document.getElementsByName('ondeConheceuONG')

  //Valores 

  const nomeInstituicao = nomeinstituicaoInput.value;
  const responsavelLegal = responsavelInput.value
  const CNPJ = CNPJInput.value;
  const endereco = enderecoInput.value;
  const telefone = telefoneInput.value;
  const email = emailInput.value;

  let tipoInstituicao = Array.from(tipodemoradiaInput).find(radio => radio.checked)?.value;
  let descInstituicao = descInstituicaoInput.value; 
  let pessoasInstituicaoAtende = pessoasAtendidasInput.value;
  let atendePessoaComDeficienciaNaInstitucao = Array.from(simOUnaoDeficienciaInput).find(radio => radio.checked)?.value;
  let tipoDeDeficiencia = Array.from(tipodeficienciaInput).find(radio => radio.checked)?.value;
  let necessidadeAcessibilidade = Array.from(necessidadeAcessibilidadeInput).find(radio => radio.checked)?.value;
  let jaTentouAdaptacoes = Array.from(tentouAdaptacoesInput).find(radio => radio.checked)?.value;
  let dificuldadesEnfrentadas = Array.from(dificuldadesEnfrentadasInput).find(radio => radio.checked)?.value;
  let segurancaEAcessibilidadeInstituicao = Array.from(segurançaInstituicaoInput).find(radio => radio.checked)?.value;
  let impactoReforma = Array.from(impactoReformaInput).find(radio => radio.checked)?.value;

  let mensagemP15 = mensagemDInput.value;
  let mensagemP16 = mensagemAInput.value;

  let atualizacaoProjetos = Array.from(maisInformacoesInput).find(radio => radio.checked)?.value;
  let conheceAONGComo = Array.from(ondeConheceuONGInput).find(radio => radio.checked)?.value;

  const perguntasOutro = [
    { name: 'tipodeInstituicao', inputId: 'OutroMoradia' },
    { name: 'tipodeficiencia', inputId: 'OutroDeficiencia' },
    { name: 'necessidadeAcessibilidade', inputId: 'OutroNecessidade' },
    { name: 'dificuldadesEnfrentadas', inputId: 'OutroDificuldade' },
  ];

  // Função para capturar valores e formatar "Outro"
  function obterValorComOutro(pergunta) {
    const radioGroup = document.getElementsByName(pergunta.name);
    let valor = Array.from(radioGroup).find(radio => radio.checked)?.value;

    // Se a opção "Outro" for escolhida, captura o valor do input correspondente
    if (valor === "Outro") {
      const outroInput = document.querySelector(`#${pergunta.inputId}`).value;
      // Verifica se o input não está vazio antes de formatar
      valor = outroInput ? `outro: ${outroInput}` : `outro: [sem informação]`; // Se não houver valor, define um valor padrão
    }

    return valor; // Retorna o valor (ou formatado se for "Outro")
  }

  const requiredFields = [
    nomeInstituicao, responsavelLegal, CNPJ, endereco, telefone, email,
    tipoInstituicao, descInstituicao, pessoasInstituicaoAtende, atendePessoaComDeficienciaNaInstitucao,
    necessidadeAcessibilidade, jaTentouAdaptacoes, segurancaEAcessibilidadeInstituicao, impactoReforma,
    mensagemP15, mensagemP16, atualizacaoProjetos, conheceAONGComo
  ];

  const allRequiredFilled = requiredFields.every(field => field);

  if (!allRequiredFilled) {
    console.error('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Monta o objeto com os dados do formulário
  const formularioData = {
    nomeInstituicao,
    responsavelLegal,
    CNPJ,
    endereco,
    telefone,
    email,
    tipoInstituicao: obterValorComOutro({ name: 'tipodeInstituicao', inputId: 'OutroMoradiaInput' }),
    descInstituicao,
    pessoasInstituicaoAtende,
    atendePessoaComDeficienciaNaInstitucao,
    tipoDeDeficiencia: obterValorComOutro({ name: 'tipodeficiencia', inputId: 'OutroDeficienciaInput' }),
    necessidadeAcessibilidade: obterValorComOutro({ name: 'necessidadeAcessibilidade', inputId: 'OutroNecessidadeInput' }),
    jaTentouAdaptacoes,
    dificuldadesEnfrentadas: obterValorComOutro({ name: 'dificuldadesEnfrentadas', inputId: 'inputOutroDificuldade' }),
    segurancaEAcessibilidadeInstituicao,
    impactoReforma,
    pa1: mensagemP15,
    pa2: mensagemP16,
    atualizacaoProjetos,
    conheceAONGComo
  };

  // Envia os dados para o servidor usando Axios
  try {
    const formularioEndPoint = '/formularioIntituicao'

    const URLcompleta = `${protocolo}${baseURL}${formularioEndPoint}`


    const response = await axios.post(URLcompleta, formularioData);

    if (response.status === 200) {
      console.log('Formulário enviado com sucesso:', response.data);


      nomeInstituicaoInput.value = '';
      CNPJInput.value = '';
      enderecoInput.value = '';
      telefoneInput.value = '';
      emailInput.value = '';
      descInstituicao.value = ''; 
      pessoasInstituicaoAtende.value = '';
      mensagemDInput.value = '';
      mensagemAInput.value = '';


      tipodemoradiaInput.forEach(radio => radio.checked = false);
      simOUnaoDeficienciaInput.forEach(radio => radio.checked = false);
      tipodeficienciaInput.forEach(radio => radio.checked = false);
      necessidadeAcessibilidadeInput.forEach(radio => radio.checked = false);
      tentouAdaptacoesInput.forEach(radio => radio.checked = false);
      dificuldadesEnfrentadasInput.forEach(radio => radio.checked = false);
      segurançaInstituicaoInput.forEach(radio => radio.checked = false);
      impactoReformaInput.forEach(radio => radio.checked = false);


      maisInformacoesInput.forEach(radio => radio.checked = false);
      ondeConheceuONGInput.forEach(radio => radio.checked = false);

    } else {
      throw new Error(`Erro ao enviar o formulário: ${response.statusText}`);
    }

  } catch (error) {
    console.error('Erro ao enviar o formulário:', error);
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

const fazerLogin = async () => {
  let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
  let passwordLoginInput = document.querySelector('#passwordLoginInput')
  let usuarioLogin = usuarioLoginInput.value
  let passwordLogin = passwordLoginInput.value
  if (usuarioLogin && passwordLogin) {
      try {
          const loginEndpoint = '/login'
          const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
          const response = await axios.post(URLCompleta, { login: usuarioLogin, password: passwordLogin })
          // console.log(response.data)
          localStorage.setItem('token',response.data)
          usuarioLoginInput.value = ""
          passwordLoginInput.value = ""
      }
      catch(error){
          
      }
  }
  else {
      
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