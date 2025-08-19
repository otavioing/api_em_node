const {Router} = require('express');
const {SolicitarCriacao, Solicitarexclusao, RecuperarSenha} = require('../model/emailusersService');

const rota = Router();

rota.post("/solicitar-criacao", SolicitarCriacao);
rota.post("/solicitar-exclusao", Solicitarexclusao);
rota.post("/recuperar-senha", RecuperarSenha);

module.exports = rota;