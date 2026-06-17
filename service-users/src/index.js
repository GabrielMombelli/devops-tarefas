// Microserviço de Usuários
// Porta: 3002

const express = require("express");
const { tracingMiddleware } = require("./tracing");
const usersController = require("./usersController");
const logger = require("./logger");

const app = express();
const PORT = process.env.PORT || 3002;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-trace-id");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(tracingMiddleware);

// Rotas de Usuários
app.get("/users", usersController.getAll);
app.get("/users/:id", usersController.getById);
app.post("/users", usersController.create);
app.delete("/users/:id", usersController.remove);

// 404
app.use((req, res) => {
  logger.warn("Rota não encontrada", { path: req.path });
  res.status(404).json({ error: "Rota não encontrada" });
});

// Erro global
app.use((err, req, res, next) => {
  logger.error("Erro não tratado", { error: err.message });
  res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  logger.info(`service-users iniciado na porta ${PORT}`);
});

module.exports = app;
