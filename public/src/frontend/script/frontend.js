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

    return valor; 
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

  
  try {
    const formularioEndPoint = '/formularioIntituicao'

    const URLcompleta = `${protocolo}${baseURL}${formularioEndPoint}`


    const response = await axios.post(URLcompleta, formularioData);

    if (response.status === 200) {
      console.log('Formulário enviado com sucesso:', response.data);


      nomeinstituicaoInput.value = '';
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
  let nomeInput = document.querySelector('#nome')
  let sobrenomeInput = document.querySelector('#sobrenome')
  let emailInput = document.querySelector('#email')
  let passwordInput = document.querySelector('#senha')
  
  let nome = nomeInput.value
  let sobrenome = sobrenomeInput.value
  let email = emailInput.value
  let password = passwordInput.value
  
  if (nome && sobrenome && email && password) {
    try {
      const cadastroEndpoint = '/signup'
      const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
      await axios.post(URLCompleta, { nome: nome, sobrenome: sobrenome, email: email, password: password })


      window.location.href = "/public/src/login.html"
      
    }
    catch (error) {
      alert("Erro ao realizar o cadastro");
    }
  }
  else {
    alert("Preencha todos os dados");
  }
}

const fazerLogin = async () => {
  let emailInput= document.querySelector('#email')
  let senhaInput = document.querySelector('#senha')
  
  let email = emailInput.value
  let senha = senhaInput.value

  if (email && senha) {
    try {
      const loginEndpoint = '/login'
      const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
      const response = await axios.post(URLCompleta, { email: email, password: senha })
      
      const token = response.data.token; 
      localStorage.setItem('token', token);
      
  

      window.location.href = "/index.html"
    }
    catch (error) {
      
    }
  }
  else {
    alert("Preencha todos os campos");
  }

}






document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname === "/public/src/eventos.html") {
    await loadPages(); 
  }
});


async function loadPages() {
  try {
    const response = await fetch("http://localhost:3000/pages"); 
    if (response.ok) {
      const pages = await response.json(); 

      // Decodificar o token para verificar se o usuário é admin
      const token = localStorage.getItem('token');
      let isAdmin = false;
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        isAdmin = payload.isAdmin; 
      }

      const container = document.querySelector(".container");
      let currentRow = container.querySelector(".row:last-child");
      if (!currentRow) {
        currentRow = document.createElement("div");
        currentRow.classList.add("row");
        container.appendChild(currentRow);
      }

      let columnCount = currentRow.children.length;

      pages.forEach((page) => {
        // Botões de editar e deletar, visíveis apenas para admin
        const adminButtons = isAdmin
          ? `
            <button class="btn btn-sm btn-warning" onclick="loadPageData('${page.slug}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deletarPagina('${page.slug}')">Deletar</button>
          `
          : '';

        const columnHTML = `
          <div class="col-12 col-sm-8 col-md-6 col-lg-3 mb-4">
            <div class="foto-container">
              <a href="http://localhost:3000/pages/${page.slug}" target="_blank">
                <img src="${page.imageDisplayUrl}" alt="${page.title}" class="img-fluid" />
                <div class="titulo">${page.title}</div>
              </a>
              ${adminButtons} <!-- Botões inseridos aqui -->
            </div>
          </div>
        `;

        if (columnCount >= 4) {
          const newRow = document.createElement("div");
          newRow.classList.add("row");
          container.appendChild(newRow);
          currentRow = newRow;
          columnCount = 0;
        }

        currentRow.insertAdjacentHTML("beforeend", columnHTML);
        columnCount++;
      });

      // Exibir o botão de "Adicionar Evento" apenas para admins
      if (isAdmin) {
        const addEventHTML = `
          <div class="col-12 col-sm-8 col-md-6 col-lg-3 mb-4">
            <div class="foto-container">
              <a onclick=$('#novoEventoModalLabel').modal('show');>
                <img src="https://t4.ftcdn.net/jpg/01/26/10/59/360_F_126105961_6vHCTRX2cPOnQTBvx9OSAwRUapYTEmYA.jpg" alt="Adicionar evento" class="img-fluid" />
                <div class="titulo">Adicionar Evento</div>
              </a>
            </div>
          </div>
        `;
        
        // Verifica se a última linha está cheia antes de adicionar o botão
        if (columnCount >= 4) {
          const newRow = document.createElement("div");
          newRow.classList.add("row");
          container.appendChild(newRow);
          newRow.insertAdjacentHTML("beforeend", addEventHTML);
        } else {
          currentRow.insertAdjacentHTML("beforeend", addEventHTML);
        }
      }

    } else {
      console.error("Erro ao carregar as páginas");
    }
  } catch (error) {
    console.error("Erro ao buscar páginas:", error);
  }
}

function saveLog(message) {
  const currentLogs = JSON.parse(localStorage.getItem("errorLogs")) || [];
  currentLogs.push({
    message,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("errorLogs", JSON.stringify(currentLogs));
}

const selectedImages = []; 

function handleFileSelect(event) {
  console.log("Função handleFileSelect chamada!");
  const imageContainer = document.getElementById("imagePreview2");
  const files = Array.from(event.target.files); 
  if (files.length === 0) {
    imageContainer.innerHTML = "<p>Nenhuma imagem selecionada.</p>";
    return;
  }

  files.forEach((file) => {
    
    if (!selectedImages.some((img) => img.name === file.name)) {
      selectedImages.push(file);
    } else {
      console.warn(`O arquivo "${file.name}" já foi adicionado.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(`${file.name} não é uma imagem válida.`);
      return;
    }

    
    const imgWrapper = document.createElement("div");
    const img = document.createElement("img");
    const removeBtn = document.createElement("button");

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      img.alt = file.name;
    };
    reader.readAsDataURL(file);

    img.style.maxWidth = "100px";
    img.style.margin = "5px";

    removeBtn.textContent = "Remover";
    removeBtn.onclick = () => {
      
      const index = selectedImages.findIndex((img) => img.name === file.name);
      if (index > -1) {
        selectedImages.splice(index, 1);
      }

      
      imageContainer.removeChild(imgWrapper);

     
      if (imageContainer.children.length === 0) {
        document.getElementById("images").value = ""; 
        imageContainer.innerHTML = "<p>Nenhuma imagem selecionada.</p>";
      }
    };

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(removeBtn);
    imageContainer.appendChild(imgWrapper);
  });
}


const inputFile = document.getElementById("images");
if (inputFile) {
  console.log("Input de arquivos encontrado, chamando handleFileSelect diretamente para teste...");
  inputFile.addEventListener("change", handleFileSelect);
} else {
  console.error("Input de arquivos NÃO encontrado! Verifique o ID no HTML.");
}




document.getElementById("images").addEventListener("change", (event) => {
  const files = Array.from(event.target.files); 

  
  files.forEach((file) => {
    if (!selectedImages.some((img) => img.name === file.name)) {
      selectedImages.push(file);
    }
  });

});

const token = localStorage.getItem("token");

async function criarPagina() {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const place = document.getElementById("place").value;
  const eventDetails = document.getElementById("eventDetails").value;
  const objetivos = document.getElementById("objetivos").value;
  const atividadesDescription = document.getElementById("atividadesDescription").value;
  const images = document.getElementById("images").files;
  const imageCapa = document.getElementById("imagesCapa").files[0];

  console.log(imageCapa)

  const depoimentos = [];
  document
    .querySelectorAll("#testimonialFields .testimonial-field")
    .forEach((testimonialGroup) => {
      const texto = testimonialGroup.querySelector("textarea").value;
      const autor = testimonialGroup.querySelector("input").value;
      depoimentos.push({ texto, autor });
    });

    if (
      !title ||
      !date ||
      !place ||
      !eventDetails ||
      !objetivos ||
      !atividadesDescription ||
      images.length === 0 ||
      !imageCapa ||
      depoimentos.length === 0 
    ) {
      alert("Por favor, preencha todos os campos obrigatórios e envie ao menos uma imagem a imagem de capa e um depoimento.");
      return;
    }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("date", date);
  formData.append("place", place);
  formData.append("eventDetails", eventDetails);
  formData.append("objetivos", objetivos);
  formData.append("atividadesDescription", atividadesDescription);
  formData.append("depoimentos", JSON.stringify(depoimentos));
 
  
  formData.append("imagesCapa", imageCapa);


  // Adiciona as imagens ao FormData
  selectedImages.forEach((image) => {
    formData.append("images[]", image);
  });

  try {
    const response = await fetch("http://localhost:3000/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("Resposta do servidor:", data);
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}


function addTestimonialField() {
  const testimonialFields = document.getElementById("testimonialFields");
  const index = testimonialFields.children.length;

  const testimonialGroup = document.createElement("div");
  testimonialGroup.classList.add("testimonial-field");
  testimonialGroup.innerHTML = `
    <div class="mb-3">
      <label>Texto do Depoimento:</label>
      <textarea name="depoimentos[${index}][texto]" class="form-control" required></textarea>
    </div>
    <div class="mb-3">
      <label>Autor:</label>
      <input type="text" name="depoimentos[${index}][autor]" class="form-control" required />
    </div>
    <button type="button" class="btn btn-danger btn-sm" onclick="removeTestimonialField(this)">Remover</button>
  `;

  testimonialFields.appendChild(testimonialGroup);
}

function removeTestimonialField(button) {
  const testimonialField = button.closest(".testimonial-field");
  testimonialField.remove();
}


// Função para adicionar novos depoimentos no modal
function addTestimonialFieldModal() {
  const testimonialFields = document.getElementById("testimonialFieldsModal");
  const index = testimonialFields.children.length;

  const testimonialGroup = document.createElement("div");
  testimonialGroup.classList.add("testimonial-field-modal");
  testimonialGroup.innerHTML = `
    <div class="mb-3">
      <label>Texto do Depoimento:</label>
      <textarea name="depoimentos[${index}][texto]" class="form-control" required></textarea>
    </div>
    <div class="mb-3">
      <label>Autor:</label>
      <input type="text" name="depoimentos[${index}][autor]" class="form-control" required />
    </div>
    <button type="button" class="btn btn-danger btn-sm" onclick="removeTestimonialFieldModal(this)">Remover</button>
  `;

  testimonialFields.appendChild(testimonialGroup);
}

// Função para remover depoimentos no modal
function removeTestimonialFieldModal(button) {
  const testimonialField = button.closest(".testimonial-field-modal");
  testimonialField.remove();
}



function extractPageDataFromHTML(htmlContent) {
  // Cria um documento DOM a partir da string HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  
  const title = doc.querySelector("h1")?.textContent?.trim() || ""; // Título da página
  const tituloEvent = doc.querySelector("section.titulo_evento p")?.textContent?.trim() || "";
  const [date, place] = tituloEvent.split(" e ").map((str) => str.trim());  // Data e Local extraídos do parágrafo
  const eventDetails = doc.querySelector("section.py-5 p")?.textContent?.trim() || "";  // Detalhes do evento (primeiro <p> dentro da seção)
  const objetivos = doc.querySelectorAll("section.py-5 .subsection-title + p")[0]?.textContent?.trim() || "";  // Objetivos (primeiro <p> depois do subtítulo Objetivos)
  const atividadesDescription = doc.querySelectorAll("section.py-5 .subsection-title + p")[1]?.textContent?.trim() || "";  // Atividades (segundo <p> depois do subtítulo Atividades)

  // Extração de depoimentos
  const depoimentos = [];
  const depoimentoElements = doc.querySelectorAll(".card-body-realizacoes");  
  depoimentoElements.forEach((depoimentoElement) => {
    const texto = depoimentoElement.querySelector(".card-text")?.textContent?.trim() || "";  
    const autor = depoimentoElement.querySelector(".card-title")?.textContent?.trim() || "";  
    if (texto && autor) {
      depoimentos.push({ texto, autor });
    }
  });

  // Extração das imagens
  const imagesUrls = [];
  const imageElements = doc.querySelectorAll(".carousel-item img");  
  imageElements.forEach((imgElement) => {
    let imgSrc = imgElement.src || imgElement.getAttribute('data-src');  
    if (imgSrc) {
     
      if (imgSrc.startsWith('http://127.0.0.1:5500')) {
        
        imgSrc = imgSrc.replace('http://127.0.0.1:5500', 'http://localhost:3000');
      }
      
      if (imgSrc.startsWith('http://localhost:3000/')) {
        imagesUrls.push(imgSrc.replace('http://localhost:3000/', ''));  
      }
    }
  });

  
  return {
    title,
    date,
    place,
    eventDetails,
    objetivos,
    atividadesDescription,
    depoimentos,
    imagesUrls
  };
}

// Função para carregar os dados da página
async function loadPageData(slug) {
  try {
    const response = await fetch(`http://localhost:3000/pages/${slug}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar a página: ${response.status}`);
    }

    const htmlContent = await response.text();
    const pageData = extractPageDataFromHTML(htmlContent);

   
    console.log(pageData);


    document.getElementById("titleModal").value = pageData.title;
    document.getElementById("dateModal").value = pageData.date;
    document.getElementById("placeModal").value = pageData.place;
    document.getElementById("eventDetailsModal").value = pageData.eventDetails;
    document.getElementById("objetivosModal").value = pageData.objetivos;
    document.getElementById("atividadesDescriptionModal").value = pageData.atividadesDescription;

    
    const testimonialFields = document.getElementById("testimonialFieldsModal");
    testimonialFields.innerHTML = ''; 

    pageData.depoimentos.forEach((depoimento, index) => {
      const testimonialGroup = document.createElement("div");
      testimonialGroup.classList.add("testimonial-field");
      testimonialGroup.innerHTML = `
        <label>Texto do Depoimento:</label>
        <textarea name="depoimentos[${index}][texto]" required>${depoimento.texto}</textarea>
        <label>Autor:</label>
        <input type="text" name="depoimentos[${index}][autor]" required value="${depoimento.autor}" />
        <button type="button" onclick="removeTestimonialField(this)">Remover</button>
      `;
      testimonialFields.appendChild(testimonialGroup);
    });

   
    const imageContainer = document.getElementById("imagePreview");
    imageContainer.innerHTML = ""; 

    pageData.imagesUrls.forEach((url) => {
      const img = document.createElement("img");

      
      img.src = `http://localhost:3000/${url}`; 

      img.alt = "Imagem da Página";
      img.classList.add("image-preview");
      img.style.maxWidth = '100px';  
      img.style.margin = '5px';      

      imageContainer.appendChild(img);
    });


    const updateButton = document.getElementById("updateButton");
    updateButton.onclick = () => updatePage(slug);

    
    $('#editPageModal').modal('show');

  } catch (error) {
    console.error("Erro ao carregar a página:", error);
  }
}

const selectedImagesModal = []; 

function handleFileSelectModal(event) {
  console.log("Função handleFileSelect chamada!");
  const imageContainer = document.getElementById("imagePreviewNovos");
  const files = event.target.files;




  if (files.length === 0) {
    imageContainer.innerHTML = "<p>Nenhuma imagem selecionada.</p>";
    return;
  }

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith("image/")) {
      alert(`${file.name} não é uma imagem válida.`);
      return;
    }

    const imgWrapper = document.createElement("div");
    const img = document.createElement("img");
    const removeBtn = document.createElement("button");

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      img.alt = file.name;
    };
    reader.readAsDataURL(file);

    img.style.maxWidth = "100px";
    img.style.margin = "5px";

    removeBtn.textContent = "Remover";
    removeBtn.onclick = () => {
     
      const index = selectedImagesModal.findIndex((img) => img.name === file.name);
      if (index > -1) {
        selectedImagesModal.splice(index, 1);
      }

    
      imageContainer.removeChild(imgWrapper);

      
      if (imageContainer.children.length === 0) {
        document.getElementById("imagesModal").value = "";
        imageContainer.innerHTML = "<p>Nenhuma imagem selecionada.</p>";
      }
    };

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(removeBtn);
    imageContainer.appendChild(imgWrapper);
  });
}


const inputFileModal = document.getElementById("imagesModal");
if (inputFileModal) {
  console.log("Input de arquivos modal encontrado, chamando handleFileSelect diretamente para teste...");
  inputFileModal.addEventListener("change", handleFileSelectModal);
} else {
  console.error("Input de arquivos NÃO encontrado! Verifique o ID no HTML.");
}


document.getElementById("imagesModal").addEventListener("change", (event) => {
  const files = Array.from(event.target.files); 

  // Adiciona cada novo arquivo ao array, garantindo que não duplique
  files.forEach((file) => {
    if (!selectedImagesModal.some((img) => img.name === file.name)) {
      selectedImagesModal.push(file);
    }
  });

});


async function updatePage(slug) {
  const title = document.getElementById("titleModal").value;
  const date = document.getElementById("dateModal").value;
  const place = document.getElementById("placeModal").value;
  const eventDetails = document.getElementById("eventDetailsModal").value;
  const objetivos = document.getElementById("objetivosModal").value;
  const atividadesDescription = document.getElementById("atividadesDescriptionModal").value;

  // Captura os depoimentos existentes (já carregados)
  const existingTestimonials = [];
  document.querySelectorAll("#testimonialFieldsModal .testimonial-field").forEach((testimonialGroup) => {
    const texto = testimonialGroup.querySelector("textarea").value;
    const autor = testimonialGroup.querySelector("input").value;
    existingTestimonials.push({ texto, autor });
  });

  // Captura os depoimentos novos (adicionados dinamicamente)
  const newTestimonials = [];
  document.querySelectorAll("#testimonialFieldsModal .testimonial-field-modal").forEach((testimonialGroup) => {
    const texto = testimonialGroup.querySelector("textarea").value;
    const autor = testimonialGroup.querySelector("input").value;
    newTestimonials.push({ texto, autor });
  });

 
  const allTestimonials = [...existingTestimonials, ...newTestimonials];
  
  if (
    !title ||
    !date ||
    !place ||
    !eventDetails ||
    !objetivos ||
    !atividadesDescription ||
    allTestimonials.length === 0
  
  ) {
    alert("Por favor, preencha todos os campos obrigatórios e envie ao menos uma imagem e a imagem de capa.");
    return;
  }
  
  const formData = new FormData();

  // Adiciona os campos de texto ao FormData
  formData.append("title", title);
  formData.append("date", date);
  formData.append("place", place);
  formData.append("eventDetails", eventDetails);
  formData.append("objetivos", objetivos);
  formData.append("atividadesDescription", atividadesDescription);

  // Adiciona todos os depoimentos (existentes + novos) no FormData
  allTestimonials.forEach((depoimento, index) => {
    formData.append(`depoimentos[${index}][texto]`, depoimento.texto);
    formData.append(`depoimentos[${index}][autor]`, depoimento.autor);
  });

  // Coleta as imagens existentes (já carregadas no backend)
  const existingImages = Array.from(document.querySelectorAll("#imagePreview img")).map((img) => {
    return img.src.replace("http://localhost:3000/", ""); // Remove o domínio da URL, deixando o caminho relativo
  });

  // Adiciona as imagens existentes ao FormData
  existingImages.forEach((img) => formData.append("existingImages[]", img));

  // Coleta as novas imagens enviadas pelo usuário
  selectedImagesModal.forEach((image) => {
    formData.append("images[]", image);
  });

  
  try {
    const response = await fetch(`http://localhost:3000/pages/${slug}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      location.reload();
      const result = await response.json();
      console.log("Página atualizada com sucesso:", result);
    } else {
      const error = await response.json();
      console.error("Erro ao atualizar a página:", error);
    }
  } catch (error) {
    console.error("Erro ao enviar a atualização da página:", error);
  }
}

async function deletarPagina(slug) {
  const confirmar = confirm("Tem certeza de que deseja excluir esta página?");
  if (!confirmar) return;

  try {
    const response = await fetch(`http://localhost:3000/pages/${slug}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir a página");
    }

    const data = await response.json();
    console.log(data.message);
    alert("Página excluída com sucesso!");

    
    location.reload();
  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro ao tentar excluir a página.");
  }
}

