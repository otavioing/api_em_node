const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const senhaemail = process.env.MAIL_PASS;
const email = process.env.EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail", // ou outro serviço de email
  auth: {
    user: email,
    pass: senhaemail,
  },
});

const enviaremailcriacao = async (email, nome, codigo) => {
  const info = await transporter.sendMail({
    from: `"App" <${email}>`,
    to: email,
    subject: "Confirme sua Conta",
    text: `Seu código de recuperação é: ${codigo}`,
    html: `
<main>
            <h1><b>Olá ${nome} seu código de verificação é: ${codigo}</b></h1>
</main>
    `,
  });

  console.log("Email de criação de conta enviado:", info.messageId);
};

const enviaremailexclusao = async (email, nome, codigo) => {
  const info = await transporter.sendMail({
    from: `"App" <${email}>`,
    to: email,
    subject: "Confirmação de Exclusão",
    text: `Seu código de recuperação é: ${codigo}`,
    html: `
<main>

            <h2><b>Olá ${nome} seu código de verificação é: ${codigo}</b></h2>

            <p>Se você não solicitou a exclusão da sua conta, altere sua senha imediatamente <br> Se você não conseguir redefinir sua senha, entre em contato com o suporte.</p>
            
</main>
    `,
  });

  console.log("Email de criação de conta enviado:", info.messageId);
};

const enviaremailrecuperacao = async (email, nome, codigo) => {
    const info = await transporter.sendMail({
    from: `"App" <${email}>`,
    to: email,
    subject: "Recuperação de Senha",
    text: `Seu código de recuperação é: ${codigo}`,
    html: `
    <main>
            <h1><b>Olá ${nome} seu código de verificação é: ${codigo}</b></h1>
</main>`
  });

  console.log("Email de recuperação de senha enviado:", info.messageId);
};

module.exports = {
  enviaremailcriacao,
  enviaremailexclusao,
  enviaremailrecuperacao,
};