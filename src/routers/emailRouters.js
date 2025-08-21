const {Router} = require('express');
const {SolicitarCriacao, Solicitarexclusao, RecuperarSenha, enviarEmailnotificacaoLogin} = require('../model/emailusersService');

const rota = Router();

rota.post("/solicitar-criacao", SolicitarCriacao);
rota.post("/solicitar-exclusao", Solicitarexclusao);
rota.post("/recuperar-senha", RecuperarSenha);
rota.post("/enviar-email-login", enviarEmailnotificacaoLogin);

module.exports = rota;