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
  title: { type: String, required: true },
  date: { type: String, required: true },
  place: { type: String, required: true },
  eventDetails: { type: String, required: true },
  objetivos: { type: String, required: true },
  atividadesDescription: { type: String, required: true },
  imagesUrls: [{ type: String, required: true}],
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
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
    const login = req.body.login;
    const password = req.body.password;


    const criptografada = await bcrypt.hash(password, 10);


    const usuario = new Usuario({
      login: login,
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
    const { login, password } = req.body;

    const usuario = await Usuario.findOne({ login });
    if (!usuario) {
      return res.status(401).json({ message: "Credenciais inválidas!" });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas!" });
    }

    const token = jws.sign(
      { login: usuario.login },
      "chave-secreta-super-segura",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
});

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

app.post("/pages", upload.array("images"), async (req, res) => {
  try {
    console.log("Requisição recebida:", req.body); // Log da requisição
    console.log("Arquivos recebidos:", req.files); // Log dos arquivos

    const { title, date, place,eventDetails,objetivos,atividadesDescription,depoimentos} = req.body;

    if (!title || !date || !place|| !eventDetails || !objetivos ||!atividadesDescription||req.files.length === 0) {
      return res.status(400).json({ message: "Dados incompletos!" });
    }

    const imagesUrls = req.files.map((file) => `uploads/${file.filename}`);
    const parsedDepoimentos = depoimentos ? JSON.parse(depoimentos) : [];
    const newPage = new pagina({
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

    // HTML estático da página com Bootstrap
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Projeto ${page.title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css">
      </head>
      <body>
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
        </html>
        `);
  } catch (error) {
    console.error("Erro ao buscar a página:", error);
    res.status(500).send("Erro ao buscar a página");
  }
});


// Rota para editar a página

app.put("/pages/:slug", upload.array("images"), async (req, res) => {
  const { slug } = req.params;

  // Desestruturando os dados do corpo da requisição
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
      ...req.files.map((file) => `uploads/${file.filename}`), // Novas imagens enviadas
    ];

    // Atualiza o documento com os dados e imagens combinadas
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
