const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const { banco } = require("./database");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const GetAll = async () => {
  try {
    const data = await banco.query("SELECT * FROM usuarios");
    return data[0];
  } catch (error) {
    console.log("Erro ao conectar ao banco de dados: ", error.message);
    throw new Error("Erro ao buscar usuários");
  }
};

const GetById = async (id) => {
  try {
    const data = await banco.query("SELECT * FROM usuarios WHERE id=?", [id]);
    return data[0];
  } catch (error) {
    console.log("Erro ao conectar ao banco de dados: ", error.message);
    throw new Error("Erro ao buscar usuário");
  }
};

const Erase = async (id, senha) => {
  try {
    // Busca usuário pelo id
    const [rows] = await banco.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw new Error("Usuário não encontrado!");
    }

    const usuario = rows[0];

    // Verifica senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error("Senha incorreta!");
    }

    // Deleta usuário
    await banco.query("DELETE FROM usuarios WHERE id = ?", [id]);

  } catch (error) {
    console.log("Erro ao conectar ao banco de dados: ", error.message);
    throw new Error(error.message || "Falha ao executar a ação!");
  }
};


const Create = async (nome, email, senhaHash) => {
  try {
    const data = await banco.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ( ?, ?, ?)",
      [nome, email, senhaHash] // aqui usamos a senha já criptografada
    );

    return data[0];
  } catch (error) {
    console.log("Erro ao conectar ao banco de dados: ", error.message);
    throw new Error("Falha ao executar a ação!");
  }
};

const Login = async (request, response) => {
  const { email, senha } = request.body;

  try {
    const [rows] = await banco.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return response.status(401).send({ message: "Email ou senha inválidos" });
    }

    const usuario = rows[0];

    // Compara senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return response.status(401).send({ message: "Email ou senha inválidos" });
    }

    // Remove senha da resposta
    delete usuario.senha;

    // Gera o token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email }, // payload
      process.env.JWT_SECRET, // chave secreta
      { expiresIn: process.env.JWT_EXPIRES || "1d" } // tempo de expiração
    );

    // Retorna o usuário e o token
    response.status(200).send({ usuario, token });
  } catch (error) {
    console.error("Erro ao verificar login:", error.message);
    response.status(500).send({ message: "Erro interno no servidor" });
  }
};

const updatesenha = async (email, novaSenha) => {
  try {
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(novaSenha, saltRounds);
    await banco.query("UPDATE usuarios SET senha = ? WHERE email = ?", [
      senhaHash,
      email,
    ]);
    if (result.affectedRows === 0) {
      throw new Error("Email não encontrado!");
    }
  } catch (error) {
    console.log("Erro ao conectar ao banco de dados: ", error.message);
    throw new Error("Falha ao atualizar a senha!");
  }
};

const recuperarsenha = async (email, novaSenha) => {
  try {
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

    const [result] = await banco.query(
      "UPDATE usuarios SET senha = ? WHERE email = ?",
      [senhaHash, email]
    );

    if (result.affectedRows === 0) {
      throw new Error("Email não encontrado!");
    }
  } catch (error) {
    console.log("Erro ao atualizar a senha: ", error.message);
    throw new Error("Falha ao atualizar a senha!");
  }
};

module.exports = {
  GetAll,
  GetById,
  Login,
  Erase,
  Create,
  updatesenha,
  recuperarsenha,
};
