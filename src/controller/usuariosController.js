const model = require("../model/usuariosService");
const bcrypt = require("bcrypt");

const UsuariosController = {
  GetAll: async (request, response) => {
    try {
      const data = await model.GetAll();
      response.status(200).json(data);
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error.message);
      response.status(401).send({ message: "Falha ao executar a ação!" });
    }
  },

  GetById: async (request, response) => {
    try {
      const id = request.params.id;
      const data = await model.GetById(id);
      response.status(200).send(data);
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error.message);
      response.status(401).send({ message: "Falha ao executar a ação!" });
    }
  },

  Create: async (request, response) => {
    try {
      const { nome, email, senha } = request.body;
      // gera o hash da senha
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);
      await model.Create(nome, email, senhaHash);
      response.status(201).send({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error.message);
      response.status(500).send({ message: "Falha ao criar usuário!" });
    }
  },

Erase: async (request, response) => {
  try {
    const id = request.params.id;
    const senha = request.body.senha; 
    await model.Erase(id, senha);
    response.status(200).send({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
    response.status(500).send({ message: error.message });
  }
},


  updatesenha: async (request, response) => {
    try {
      const { email, novaSenha } = request.body;
      await model.updatesenha(email, novaSenha);
      response.status(200).send({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error.message);
      response.status(500).send({ message: "Falha ao atualizar senha!" });
    }
  },

  recuperarsenha: async (request, response) => {
    try {
      const { email, novaSenha } = request.body;
      await model.recuperarsenha(email, novaSenha);
      response.status(200).send({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      response.status(500).send({ message: error.message });
    }
  },
};

module.exports = UsuariosController;
