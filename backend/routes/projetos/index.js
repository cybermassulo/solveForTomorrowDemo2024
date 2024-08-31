require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const Joi = require("joi");

// Configuração do banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
const projetoSchema = Joi.object({
  titulo: Joi.string().required(),
  descricao: Joi.string().required(),
});

// Middleware de validação
const validateProject = (req, res, next) => {
  const { error } = projetoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
/**
 * @swagger
 * tags:
 *   name: Projetos
 *   description: API para gerenciar projetos
 */

// Buscar todos os projetos
/**
 * @swagger
 * /projetos:
 *   get:
 *     summary: Retorna todos os projetos
 *     tags: [Projetos]
 *     responses:
 *       200:
 *         description: Lista de projetos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Projeto'
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM projetos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
});

// Criar um novo projeto
/**
 * @swagger
 * /projetos:
 *   post:
 *     summary: Cria um novo projeto
 *     tags: [Projetos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Projeto'
 *     responses:
 *       201:
 *         description: Projeto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Projeto'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar projeto
 */
router.post("/", validateProject, async (req, res) => {
  const { titulo, descricao, ...outrosCampos } = req.body;

  try {
    const [result] = await pool.execute(
      "INSERT INTO projetos (titulo, descricao, ...) VALUES (?, ?, ...)",
      [titulo, descricao, ...outrosCampos]
    );

    const newProject = {
      id: result.insertId,
      ...req.body,
    };

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar projeto" });
  }
});

// Buscar um projeto por ID
/**
 * @swagger
 * /projetos{id}:
 *   get:
 *     summary: Retorna um projeto por ID
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do projeto
 *     responses:
 *       200:
 *         description: Projeto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Projeto'
 *       404:
 *         description: Projeto não encontrado
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute("SELECT * FROM projetos WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar projeto" });
  }
});

// Atualizar um projeto
/**
 * @swagger
 * /projetos/{id}:
 *   put:
 *     summary: Atualiza um projeto
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do projeto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Projeto'
 *     responses:
 *       200:
 *         description: Projeto atualizado com sucesso
 *       404:
 *         description: Projeto não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, ...outrosCampos } = req.body;
  try {
    const [result] = await pool.execute(
      "UPDATE projetos SET titulo = ?, descricao = ?, ... WHERE id = ?",
      [titulo, descricao, outrosCampos, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    res.json({ message: "Projeto atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar projeto" });
  }
});

// Deletar um projeto
/**
 * @swagger
 * /projetos/{id}:
 *   delete:
 *     summary: Deleta um projeto
 *     tags: [Projetos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do projeto
 *     responses:
 *       204:
 *         description: Projeto deletado com sucesso
 *       404:
 *         description: Projeto não encontrado
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute("DELETE FROM projetos WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar projeto" });
  }
});

module.exports = router;
