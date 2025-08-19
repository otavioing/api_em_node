const express = require("express");

const OpenAI = require("openai");

// Configura cliente OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const pergunta = async (req, res) => {
     try {
    const { pergunta } = req.body;

    if (!pergunta) {
      return res.status(400).json({ error: "Pergunta não enviada" });
    }

    const resposta = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você será o assistente de um site" },
        { role: "user", content: pergunta }
      ]
    });

    res.json({ resposta: resposta.choices[0].message.content });
    // console.log(resposta.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao conversar com a IA" });
  }
}

module.exports ={ pergunta }