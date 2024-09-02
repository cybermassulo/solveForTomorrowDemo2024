require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger.js");
const orientadoresRouter = require("./routes/orientadores");
const participantesRouter = require("./routes/participantes");
const projetosRouter = require("./routes/projetos");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
// Rota para documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
// Outras rotas da sua aplicação...
app.use(cors({
  origin: 'http://localhost:3000' // URL do frontend
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/orientadores", orientadoresRouter);
app.use("/participantes", participantesRouter);
app.use("/projetos", projetosRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
