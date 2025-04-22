const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jws = require("jsonwebtoken");
const res = require("express/lib/response");
const multer = require("multer");
const path = require("path");
const { type } = require("os");
const { stringify } = require("querystring");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


async function conectarAoMongoDB() {
  await mongoose.connect('mongodb+srv://GabrielFernandes:gabriel@pimaosnamassa.jfekz.mongodb.net/?retryWrites=true&w=majority&appName=PImaosnamassa')
}

const pages = mongoose.Schema({
  imageDisplayUrl: { type: String, required: true},
  title: { type: String, required: true },
  date: { type: String, required: true },
  place: { type: String, required: true },
  eventDetails: { type: String, required: true },
  objetivos: { type: String, required: true },
  atividadesDescription: { type: String, required: true },
  imagesUrls: [{ type: String, required: true }],
  depoimentos: [
    {
      texto: { type: String, required: true },
      autor: { type: String, required: true },
    },
  ], // Array de depoimentos
  slug: { type: String, required: true },
});

const pagina = mongoose.model("Paginas", pages);

const formularioSchema = mongoose.Schema({
  nome: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: false },
  assunto: { type: String, required: true, unique: false },
  mensagem: { type: String, required: true, unique: false },
});

const Formulario = mongoose.model("Formulario", formularioSchema);

const usuarioSchema = mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model("Usuario", usuarioSchema);

const formularioBeneficiarioSchema = mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: String, required: true },
  endereco: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
  moradiaCondicao: { type: String, required: true },
  pessoasPorResidencia: { type: String, required: true },
  pessoaComDeficienciaNaResidencia: { type: String, required: true },
  tipoDeDeficiencia: { type: String, required: false },
  necessidadeAcessibilidade: { type: String, required: true },
  jaTentouAdaptacoes: { type: String, required: true },
  dificuldadesEnfrentadas: { type: String, required: false },
  segurancaEAcessibilidadeCasaAtual: { type: String, required: true },
  impactoReforma: { type: String, required: true },
  pa1: { type: String, required: true },
  pa2: { type: String, required: true },
  atualizacaoProjetos: { type: String, required: true },
  conheceAONGComo: { type: String, required: true },
});

const formularioBeneficiario = mongoose.model(
  "Formulario-beneficiario",
  formularioBeneficiarioSchema
);

const formularioInstituicaoSchema = mongoose.Schema({
  nomeInstituicao: { type: String, required: true },
  responsavelLegal: { type: String, required: true },
  CNPJ: { type: String, required: true },
  endereco: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
  tipoInstituicao: { type: String, required: true },
  descInstituicao: { type: String, required: true },
  pessoasInstituicaoAtende: { type: String, required: true },
  atendePessoaComDeficienciaNaInstitucao: { type: String, required: true },
  tipoDeDeficiencia: { type: String, required: false },
  necessidadeAcessibilidade: { type: String, required: true },
  jaTentouAdaptacoes: { type: String, required: true },
  dificuldadesEnfrentadas: { type: String, required: false },
  segurancaEAcessibilidadeInstituicao: { type: String, required: true },
  impactoReforma: { type: String, required: true },
  pa1: { type: String, required: true },
  pa2: { type: String, required: true },
  atualizacaoProjetos: { type: String, required: true },
  conheceAONGComo: { type: String, required: true },
});

const formularioInstituicao = mongoose.model("Formulario-instituicao", formularioInstituicaoSchema);


app.listen(3000, () => {
  try {
    conectarAoMongoDB();
    console.log("Server has started and Connection is ok!");
  } catch (error) {
    console.log("Erro", error);
  }
});

app.post("/formularioBeneficiario", async (req, res) => {
  try {
    // Capturando os dados do corpo da requisição
    const {
      nome,
      idade,
      endereco,
      telefone,
      email,
      moradiaCondicao,
      pessoasPorResidencia,
      pessoaComDeficienciaNaResidencia,
      tipoDeDeficiencia,
      necessidadeAcessibilidade,
      jaTentouAdaptacoes,
      dificuldadesEnfrentadas,
      segurancaEAcessibilidadeCasaAtual,
      impactoReforma,
      pa1,
      pa2,
      atualizacaoProjetos,
      conheceAONGComo,
    } = req.body;

    // Criando uma nova instância do modelo com os dados recebidos
    const novoFormulario = new formularioBeneficiario({
      nome,
      idade,
      endereco,
      telefone,
      email,
      moradiaCondicao,
      pessoasPorResidencia,
      pessoaComDeficienciaNaResidencia,
      tipoDeDeficiencia,
      necessidadeAcessibilidade,
      jaTentouAdaptacoes,
      dificuldadesEnfrentadas,
      segurancaEAcessibilidadeCasaAtual,
      impactoReforma,
      pa1: pa1,
      pa2: pa2,
      atualizacaoProjetos,
      conheceAONGComo: conheceAONGComo,
    });

    // Salvando o novo formulário no banco de dados
    const respMongo = await novoFormulario.save();

    console.log(respMongo);
    res
      .status(201)
      .json({ message: "Formulário enviado com sucesso!", data: respMongo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao enviar o formulário", error });
  }
});

app.post("/formularioIntituicao", async (req, res) => {
  try {
    const {
      nomeInstituicao,
      responsavelLegal,
      CNPJ,
      endereco,
      telefone,
      email,
      tipoInstituicao,
      descInstituicao,
      pessoasInstituicaoAtende,
      atendePessoaComDeficienciaNaInstitucao,
      tipoDeDeficiencia,
      necessidadeAcessibilidade,
      jaTentouAdaptacoes,
      dificuldadesEnfrentadas,
      segurancaEAcessibilidadeInstituicao,
      impactoReforma,
      pa1,
      pa2,
      atualizacaoProjetos,
      conheceAONGComo
    } = req.body;

    const novoformulario = new formularioInstituicao({
      nomeInstituicao,
      responsavelLegal,
      CNPJ,
      endereco,
      telefone,
      email,
      tipoInstituicao,
      descInstituicao,
      pessoasInstituicaoAtende,
      atendePessoaComDeficienciaNaInstitucao,
      tipoDeDeficiencia,
      necessidadeAcessibilidade,
      jaTentouAdaptacoes,
      dificuldadesEnfrentadas,
      segurancaEAcessibilidadeInstituicao,
      impactoReforma,
      pa1: pa1,
      pa2: pa2,
      atualizacaoProjetos,
      conheceAONGComo
    })

    // Salvando o novo formulário no banco de dados
    const respMongo = await novoformulario.save();

    console.log(respMongo);
    res
      .status(201)
      .json({ message: "Formulário enviado com sucesso!", data: respMongo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao enviar o formulário", error });
  }
})

app.post("/formulario", async (req, res) => {
  try {
    const nome = req.body.nome;
    const email = req.body.email;
    const assunto = req.body.assunto;
    const mensagem = req.body.mensagem;

    const novoformulario = new Formulario({
      nome: nome,
      email: email,
      assunto: assunto,
      mensagem: mensagem,
    });

    respMongo = await novoformulario.save();

    console.log(respMongo);
    res
      .status(201)
      .json({ message: "Formulário enviado com sucesso!", data: respMongo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao enviar o formulário", error });
  }
});





app.post('/signup', async (req, res) => {
  try {
    const nome = req.body.nome
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
    const password = req.body.password;


    const criptografada = await bcrypt.hash(password, 10);

   
    const usuario = new Usuario({
      nome: nome, 
      sobrenome: sobrenome,
      email: email,
      password: criptografada
    });
  

    const respMongo = await usuario.save();
    console.log("Usuário criado:", respMongo);


    res.status(201).json({ message: "Usuário cadastrado com sucesso", user: respMongo });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);


    res.status(409).json({ message: "Erro ao cadastrar usuário", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: "Credenciais inválidas!" });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas!" });
    }

    // Incluindo o isAdmin no payload do token
    const token = jws.sign(
      { login: usuario.login, isAdmin: usuario.isAdmin }, // Incluindo isAdmin no token
      "chave-secreta-super-segura",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
});



// Middleware para autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token

  if (!token) {
    return res.status(403).json({ message: "Acesso negado. Token não fornecido." });
  }

  jws.verify(token, "chave-secreta-super-segura", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido ou expirado." });
    }
    req.user = user; // Decodificação do token é armazenada em req.user
    next();
  });
}

// Rota para verificar se é admin
app.get("/verify-admin", authenticateToken, (req, res) => {
  if (req.user && req.user.isAdmin) {
    return res.status(200).json({ isAdmin: true });
  }
  return res.status(403).json({ isAdmin: false });
});

function verifyAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next(); // libera a rota
  }
  return res.status(403).json({ message: "Acesso negado. Admins apenas." });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const newName = `${Date.now()}-${file.originalname}`;
    cb(null, newName);
  },
});

const upload = multer({ storage });

app.post("/pages", authenticateToken, verifyAdmin, upload.fields([{ name: "images[]" }, { name: "imagesCapa", maxCount: 1 },]), async (req, res) => {
  try {
    console.log("Requisição recebida:", req.body); // Log da requisição
    console.log("Arquivos recebidos:", req.files); // Log dos arquivos

    const { title, date, place, eventDetails, objetivos, atividadesDescription, depoimentos, } = req.body;

    const imagesUrls = req.files["images[]"].map((file) => `uploads/${file.filename}`);
    const imageDisplayUrl = req.files["imagesCapa"] && req.files["imagesCapa"][0] ? `http://localhost:3000/uploads/${req.files["imagesCapa"][0].filename}` : "";

    if (
      !title?.trim() ||
      !date?.trim() ||
      !place?.trim() ||
      !eventDetails?.trim() ||
      !objetivos?.trim() ||
      !atividadesDescription?.trim() ||
      !imagesUrls.length ||
      !imageDisplayUrl
    ) {
      return res.status(400).json({ message: "Dados incompletos!" });
    }

    const parsedDepoimentos = depoimentos ? JSON.parse(depoimentos) : [];
    const newPage = new pagina({
      imageDisplayUrl,
      title,
      date,
      place,
      eventDetails,
      objetivos,
      atividadesDescription,
      imagesUrls,
      depoimentos: parsedDepoimentos,
      slug: title.toLowerCase().replace(/\s+/g, "-")
    });

    const respMongo = await newPage.save();
    res
      .status(201)
      .json({ message: "Página criada com sucesso!", data: respMongo });
  } catch (error) {
    console.error("Erro ao salvar a página:", error);
    res.status(500).json({ message: "Erro ao criar a página", error });
  }
});

app.get("/pages", async (req, res) => {
  try {
    const allPages = await pagina.find();
    res.status(200).json(allPages);
  } catch (error) {
    console.error("Erro ao buscar as páginas:", error);
    res.status(500).json({ message: "Erro ao buscar as páginas", error });
  }
});

app.get("/pages/:slug", async (req, res) => {
  try {
    const page = await pagina.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).send("Página não encontrada");

    // Gera as imagens do carrossel dinamicamente
    const carouselIndicators = page.imagesUrls
      .map(
        (url, index) => `
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="${index}"
            ${index === 0 ? 'class="active" aria-current="true"' : ""}
            aria-label="Slide ${index + 1}"
          ></button>
        `
      )
      .join("");

    const carouselItems = page.imagesUrls
      .map(
        (url, index) => `
          <div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="/${url}" class="d-block w-100" alt="Imagem ${index + 1}">
          </div>
        `
      )
      .join("");

    const depoimentosHtml = (page.depoimentos || [])
      .map(
        (depoimento) => `
          <div class="col-md-4">
            <div class="card shadow mb-4">
              <div class="card-body-realizacoes">
                <p class="card-text">"${depoimento.texto}"</p>
                <h5 class="card-title">${depoimento.autor}</h5>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
          <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="http://127.0.0.1:5500/public/styles/style.css" />
        <link
          rel="shortcut icon"
          href="http://127.0.0.1:5500/public/assets/favicon/MAOMASSA.png"
          type="image/x-icon"
        />

        <!-- Bootstrap CSS -->
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossorigin="anonymous"
        />

        <!-- Fontes do Google -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <title>Projeto ${page.title}</title>
        
      </head>
      <body>
      <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container-fluid">
          <a class="navbar-brand" href="http://127.0.0.1:5500/index.html"
            ><img
              src="http://127.0.0.1:5500/public/assets/favicon/MAOMASSA.png"
              alt="Foto da logo do mãos na massa"
          /></a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#myNav"
            aria-controls="myNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="myNav">
            <div class="navbar-nav ms-auto">
              <a
                class="nav-link me-2 corTexto p-3"
                aria-current="page"
                href="http://127.0.0.1:5500/public/src/quemsomos.html"
                >Quem Somos</a
              >
              <a
                class="nav-link active me-2 p-3"
                aria-current="page"
                href="http://127.0.0.1:5500/public/src/realizacoes.html"
                >Realizações</a
              >
              <a
                class="nav-link me-2 p-3"
                aria-current="page"
                href="http://127.0.0.1:5500/public/src/parcerias.html"
                >Parceiros</a
              >
              <a
                class="nav-link me-2 p-3"
                aria-current="page"
                href="http://127.0.0.1:5500/public/src/queroajuda.html"
                >Quero Ajuda</a
              >
              <a
                class="nav-link me-2 p-3"
                aria-current="page"
                href="http://127.0.0.1:5500/public/src/noticias.html"
                >Notícias</a
              >
              <a
                class="nav-link me-2 p-3"
                aria-current="page"
                href="http://127.0.0.1:5500/public/src/faq.html"
                >FAQ</a
              >
              <a
                class="nav-link me-2 p-3"
                aria-current="page"
                href="http://127.0.0.1:5500/public/src/contato.html"
                >Contato</a
              >
              <a
                class="nav-link me-2 ajude_agora p-3"
                href="http://127.0.0.1:5500/public/src/areadedoadores.html"
                >Ajude Agora</a
              >
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle login"
                  href="#"
                  id="navbarDropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    class="login_foto"
                    src="http://127.0.0.1:5500/public/assets/favicon/perfil-removebg-preview.png"
                    alt="login"
                  />
                </a>
                <div
                  class="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <a class="dropdown-item" href="login.html">Login</a>
                  <a class="dropdown-item data" href="http://127.0.0.1:5500/public/src/signup.html">Cadastrar</a>
                </div>
              </li>
            </div>
          </div>
        </div>
      </nav>
    <main class="corpo_evento">
      <script>
        (function (d) {
          var s = d.createElement("script");
          s.setAttribute("data-account", "DLmQUCAOoW");
          s.setAttribute("src", "https://cdn.userway.org/widget.js");
          (d.body || d.head).appendChild(s);

          s.onload = function () {
            const observer = new MutationObserver(() => {
              const userwayWidget = document.getElementByClass(
                "userway_buttons_wrapper"
              );
              if (userwayWidget) {
                userwayWidget.style.position = "fixed";
                userwayWidget.style.top = "50%";
                userwayWidget.style.left = "50%";
                userwayWidget.style.transform = "translate(-50%, -50%)";
                userwayWidget.style.zIndex = "1000";
              }
            });

            // Iniciar observação no body
            observer.observe(document.body, {
              childList: true,
              subtree: true,
            });
          };
        })(document);
      </script>
      <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
          <div class="vw-plugin-top-wrapper"></div>
        </div>
      </div>
      <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      <script>
        new window.VLibras.Widget("https://vlibras.gov.br/app");
      </script>

        <!-- Hero Section -->
        <section class="hero-section titulo_evento">
          <div class="container">
            <h1>${page.title}</h1>
            <p>${page.date} e ${page.place}</p>
          </div>
        </section>

        <!-- Detalhes do Evento -->
        <section class="py-5">
          <div class="container">
            <h2 class="section-title">Detalhes do Evento</h2>
            <p>${page.eventDetails}</p>
            <br />
            <div class="row">
              <div class="col-md-6">
                <h3 class="subsection-title">Objetivos</h3>
                <p>${page.objetivos}</p>
              </div>
              <div class="col-md-6">
                <h3 class="subsection-title">Atividades</h3>
                <p>${page.atividadesDescription}</p>
              </div>
            </div>
          </div>
        </section>

                <!-- Galeria de Imagens -->
        <section class="py-5">
          <div class="container">
            <h2 class="section-title">Galeria de Imagens</h2>
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                ${carouselIndicators}
              </div>
              <div class="carousel-inner">
                ${carouselItems}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Depoimentos -->
        <section class="py-5">
          <div class="container">
            <h2 class="section-title">Depoimentos</h2>
            <div class="row">
              ${depoimentosHtml}
            </div>
          </div>
        </section>
         <footer class="rodape py-4">
        <div class="container pt-5">
            <div class="row">
                <div class="col-md-3 mb-3 footer-section">
                    <p><b>Informações</b></p>
                    <a href="quemsomos.html">Quem Somos</a>
                    <a href="politica.html">Política de Privacidade</a>
                    <a href="realizacoes.html">Realizações</a>
                </div>
  
                <div class="col-md-3 mb-3 footer-section">
                    <p><b>Serviços ao Cliente</b></p>
                    <a href="contato.html">Fale Conosco</a>
                    <a href="areadedoadores.html">Trabalhe conosco</a>
                    <a href="noticias.html">Notícias</a>
                </div>
  
                <div class="col-md-3 mb-3 footer-section">
                    <p><b>Fale Conosco</b></p>
                    <p>📱 +55 (11) 973285665</p>
                    <p class="email-info">
                        ✉️ <span>maosnamassaong@gmail.com</span>
                    </p>
                    <p>De segunda a sexta, das 07:00 às 22:00</p>
                    <p>&copy; Mãos na massa. Direitos reservados</p>
                </div>
  
                <div class="col-md-3 mb-3 social-iconsAlinha">
                    <p><b>Siga-nos em nossas redes sociais!</b></p>
                    <div class="icons-container">
                        <a href="https://www.youtube.com/@projetomaosnamassa8265" target="_blank">
                            <img src="http://127.0.0.1:5500/public/assets/favicon/youtube.svg" alt="YouTube" width="30">
                        </a>
                        <a href="https://www.instagram.com/projeto_maosnamassa/" target="_blank">
                            <img src="http://127.0.0.1:5500/public/assets/favicon/instagram-alt.svg" alt="Instagram" width="30">
                        </a>
                        <a href="mailto:maosnamassaong@gmail.com" target="_blank">
                            <img src="http://127.0.0.1:5500/public/assets/favicon/gmail.svg" alt="Gmail" width="30">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    </main>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-Zenh87qX5JnK2JlH2Kyybwwa6YIK29sJgD60l1uLl4yzDYUNdyiQy5t5alST8wz7"
      crossorigin="anonymous"
    ></script>
    <script src="/public/src/frontend/script/frontend.js""></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
        `);
  } catch (error) {
    console.error("Erro ao buscar a página:", error);
    res.status(500).send("Erro ao buscar a página");
  }
});


// Rota para editar a página

app.put("/pages/:slug",authenticateToken, verifyAdmin, upload.array("images[]"), async (req, res) => {
  const { slug } = req.params;

  
  const {
    title,
    date,
    place,
    eventDetails,
    objetivos,
    atividadesDescription,
    existingImages,
  } = req.body;

  const depoimentos = req.body.depoimentos || [];

  try {
    // Combina imagens existentes e novas
    const updatedImages = [
      ...(existingImages ? (Array.isArray(existingImages) ? existingImages : [existingImages]) : []), // Imagens existentes
      ...req.files.map((file) => `uploads/${file.filename}`), 
    ];

   
    const updateData = {
      title,
      date,
      place,
      eventDetails,
      objetivos,
      atividadesDescription,
      imagesUrls: updatedImages,
      depoimentos: req.body.depoimentos || []
    };

    const updatedPage = await pagina.findOneAndUpdate(
      { slug }, // Critério de busca
      updateData, // Dados para atualizar
      { new: true, runValidators: true } // Retorna o documento atualizado e aplica validações
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Página não encontrada" });
    }

    res.status(200).json({ message: "Página atualizada com sucesso!", data: updatedPage });
  } catch (error) {
    console.error("Erro ao atualizar página:", error);
    res.status(500).json({ message: "Erro ao atualizar página", error });
  }
});

// Rota DELETE para excluir uma página
app.delete("/pages/:slug",authenticateToken, verifyAdmin, async (req, res) => {
  const { slug } = req.params;

  try {
    
    const deletedPage = await pagina.findOneAndDelete({ slug });

    if (!deletedPage) {
      return res.status(404).json({ message: "Página não encontrada" });
    }

    res.status(200).json({ message: "Página excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir página:", error);
    res.status(500).json({ message: "Erro ao excluir página", error });
  }
});

