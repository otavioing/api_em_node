const { banco } = require("./database");

const {
  enviaremailcriacao,
  enviaremailexclusao,
  enviaremailrecuperacao,
  enviarEmailLogin,
} = require("../utils/emailService");

const SolicitarCriacao = async (request, response) => {
  try {
    const { nome, email, senha } = request.body;

    const codigo = Math.floor(100000 + Math.random() * 900000);

    await enviaremailcriacao(email, nome, codigo);

    // Retorna o código (se estiver em dev/teste)
    response.status(200).send({
      message: "Código de verificação enviado para o email",
      codigo, // em produção, talvez você **não envie isso no response**
      dados: { nome, email, senha }, // temporário, ou salva em cache
    });
  } catch (error) {
    console.error("Erro ao enviar código:", error.message);
    response
      .status(500)
      .send({ message: "Erro ao solicitar criação de conta" });
  }
};

const Solicitarexclusao = async (request, response) => {
  try {
    const { email } = request.body;

        const [result] = await banco.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    if (result.length === 0) {
      return response.status(404).send({ message: "Email não encontrado" });
    }
    const codigo = Math.floor(100000 + Math.random() * 900000);

    await enviaremailexclusao(email, result[0].nome, codigo);

    // Retorna o código (se estiver em dev/teste)
    response.status(200).send({
      message: "Código de verificação enviado para o email", codigo
    });
  } catch (error) {
    console.error("Erro ao enviar código:", error.message);
    response
      .status(500)
      .send({ message: "Erro ao solicitar exclusão de conta"});
  }
};

const RecuperarSenha = async (req, res) => {
  const { email } = req.body;
  try {
    const [result] = await banco.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    if (result.length === 0) {
      return res.status(404).send({ message: "Email não encontrado" });
    }
    const codigo = Math.floor(100000 + Math.random() * 900000); // Ex: 654321
    // Aqui você pode salvar esse código temporariamente no banco ou só validar depois (simples)
    await enviaremailrecuperacao(email, result[0].nome, codigo);
    // Envia o código também no response (só enquanto você não tiver banco ou cache pra ele)
    res.status(200).send({ message: "Código enviado para o email", codigo });
  } catch (err) {
    console.error("Erro ao recuperar senha:", err.message);
    res.status(500).send({ message: "Erro interno" });
  }
};

const UAParser = require("ua-parser-js");

const enviarEmailnotificacaoLogin = async (request, response) => {
  const { email } = request.body;
  const ip = request.headers["x-forwarded-for"] || request.socket.remoteAddress;
  const userAgent = request.headers["user-agent"];
  const parser = new UAParser(userAgent);
  const navegador = parser.getBrowser(); // { name: 'Edge', version: '140.0.0.0' }
  const sistema = parser.getOS();        // { name: 'Windows', version: '10' }

  try {
    const [result] = await banco.query(
      "SELECT nome FROM usuarios WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return response.status(404).send({ message: "Email não encontrado" });
    }

    const { nome } = result[0];

    // Aqui você pode formatar como quiser
    const navegadorInfo = `${navegador.name} ${navegador.version} - ${sistema.name} ${sistema.version}`;

    await require("../utils/emailService").enviarEmailLogin(email, nome, ip, navegadorInfo);

    response.status(200).send({ message: "Aviso de login enviado para o email" });
  } catch (error) {
    console.error("Erro ao enviar aviso de login:", error.message);
    response.status(500).send({ message: "Erro ao enviar aviso de login" });
  }

};

module.exports = {
  SolicitarCriacao,
  Solicitarexclusao,
  RecuperarSenha,
  enviarEmailnotificacaoLogin,
};
