const {Router} = require('express');
const {GetAll, GetById, Login, Erase, Create, updatesenha, recuperarsenha} = require('../model/usuariosService');
const myController = require("../controller/usuariosController");

const rota = Router()
const autenticarJWT = require("../utils/authMiddleware");


rota.get("/", myController.GetAll); 
rota.get("/:id", autenticarJWT, myController.GetById);
rota.post("/", myController.Create);
rota.post("/login", Login);
rota.put("/updatesenha", autenticarJWT, myController.updatesenha);
rota.post("/recuperarsenha", myController.recuperarsenha);
rota.delete("/:id", autenticarJWT, myController.Erase);

module.exports = rota;