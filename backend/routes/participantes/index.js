require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Configuração do banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

/**
 * @swagger
 * tags:
 *   name: Participantes
 *   description: API para gerenciar participantes
 */

// Buscar todos os participantes
/**
 * @swagger
 * /participantes:
 *   get:
 *     summary: Retorna todos os participantes
 *     tags: [Participantes]
 *     responses:
 *       200:
 *         description: Lista de participantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participante'
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM participantes");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar participantes" });
  }
});

// **Criar um novo participante**
/**
 * @swagger
 * /participantes:
 *   post:
 *     summary: Cria um novo participante
 *     tags: [Participantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Participante'
 *     responses:
 *       201:
 *         description: Participante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participante'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", async (req, res) => {
  try {
    const { nome, email, colegio, cidade, projeto_id } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO participantes (nome, email, colegio, cidade, projeto_id) VALUES (?, ?, ?, ?, ?)",
      [nome, email, colegio, cidade, projeto_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar participante" });
  }
});

// **Buscar um participante por ID**
/**
 * @swagger
 * /participantes/{id}:
 *   get:
 *     summary: Busca um participante por ID
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do participantes
 *     responses:
 *       200:
 *         description: participante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/participante'
 *       404:
 *          description: Participantes não encontrado
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM participantes WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Participante não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar participante" });
  }
});

// **Atualizar um participante**
/**
 * @swagger
 * /participantes/{id}:
 *   put:
 *     summary: Atualiza um participante
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do participante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Participante'
 *     responses:
 *       200:
 *         description: Participante atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participante'
 *       404:
 *         description: Participante não encontrado
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", async (req, res) => {
  try {
    const { nome, email, colegio, cidade, projeto_id } = req.body;
    const [result] = await pool.execute(
      "UPDATE participantes SET nome = ?, email = ?, colegio = ?, cidade = ?, projeto_id = ? WHERE id = ?",
      [nome, email, colegio, cidade, projeto_id, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Participante não encontrado" });
    }
    res.json({ message: "Participante atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar participante" });
  }
});

// **Deletar um participante**
/**
 * @swagger
 * /participantes/{id}:
 *   delete:
 *     summary: Deleta um participante
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do participante
 *     responses:
 *       204:
 *         description: Participante deletado com sucesso
 *       404:
 *         description: Participante não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM participantes WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Participante não encontrado" });
    }
    res.json({ message: "Participante deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar participante" });
  }
});

module.exports = router;
