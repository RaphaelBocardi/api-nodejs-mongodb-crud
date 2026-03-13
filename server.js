const mongoose = require("mongoose");
const express = require("express");
const app = express();
const data = require("./data.json");

mongoose.connect("mongodb://localhost:27017/univesp")
  .then(() => console.log("Conectado ao MongoDB!"))
  .catch(err => console.error("Erro de conexão:", err));

// Aqui você define o que é um "Cliente" para o Banco
const Client = mongoose.model('Client', {
  name: String,
  email: String,
  phone: String
});

app.use(express.json());

app.get("/clients", async function(req, res) {
  try {
    const clients = await Client.find(); // Agora busca no banco real
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

app.get("/clients/:id", async function(req, res) {
  try {
    const { id } = req.params;
    const client = await Client.findById(id); // Busca no banco pelo ID do Mongo
    
    if (!client) return res.status(404).json({ error: "Cliente não encontrado" });
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "ID inválido ou erro no servidor" });
  }
});

app.post("/clients", async function(req, res) {
  try {
    const { name, email, phone} = req.body;
    const newClient = new Client({ name, email, phone});
    await newClient.save(); // Salva no MongoDB
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cadastrar cliente" });
  }
});

app.put("/clients/:id", async function(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    
    const updatedClient = await Client.findByIdAndUpdate(
      id, 
      { name, email, phone }, 
      { new: true } // Isso faz o Mongo retornar o cliente já atualizado
    );

    if (!updatedClient) return res.status(404).json({ error: "Cliente não encontrado" });
    
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar" });
  }
});

app.delete("/clients/:id", async function(req, res) {
  try {
    const { id } = req.params;
    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) return res.status(404).json({ error: "Cliente não encontrado" });

    res.json({ message: "Cliente removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar" });
  }
});

// Não esqueça da última linha que faz o servidor ligar!
app.listen(3000, () => console.log("Server is running on port 3000"));
