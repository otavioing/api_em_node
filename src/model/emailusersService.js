const { banco } = require("./database");

const {
  enviaremailcriacao,
  enviaremailexclusao,
  enviaremailrecuperacao,
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
    const { nome, email, senha } = request.body;
    const foto = request.file ? `/uploads/${request.file.filename}` : null;

    const codigo = Math.floor(100000 + Math.random() * 900000);

    await enviaremailexclusao(email, nome, codigo);

    // Retorna o código (se estiver em dev/teste)
    response.status(200).send({
      message: "Código de verificação enviado para o email",
      codigo, // em produção, talvez você **não envie isso no response**
      dados: { nome, email, senha, foto }, // temporário, ou salva em cache
    });
  } catch (error) {
    console.error("Erro ao enviar código:", error.message);
    response
      .status(500)
      .send({ message: "Erro ao solicitar exclusão de conta" });
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


module.exports = {
  SolicitarCriacao,
  Solicitarexclusao,
  RecuperarSenha,
};
