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
 *   name: Orientadores
 *   description: API para gerenciar orientadores
 */

// **Buscar todos os orientadores**
/**
 * @swagger
 * /orientadores:
 *   get:
 *     summary: Retorna todos os orientadores
 *     tags: [Orientadores]
 *     responses:
 *       200:
 *         description: Lista de orientadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orientador'
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM orientadores");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar orientadores" });
  }
});

// **Buscar um novo orientador por iD**
/**
 * @swagger
 * /orientadores/{id}:
 *   get:
 *     summary: Busca um orientador por ID
 *     tags: [Orientadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do orientador
 *     responses:
 *       200:
 *         description: Orientador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orientador'
       404:
         description: Orientador não encontrado
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM orientadores WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Orientador não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar orientador" });
  }
});

// **Criar um novo orientador**
/**
 * @swagger
 * /orientadores:
 *   post:
 *     summary: Cria um novo orientador
 *     tags: [Orientadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orientador'
 *     responses:
 *       201:
 *         description: Orientador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orientador'
       400:
         description: Dados inválidos
 */
router.post("/", async (req, res) => {
  try {
    const { nome, email, instituicao } = req.body; // Inclui a coluna 'instituicao'
    const [result] = await pool.execute(
      "INSERT INTO orientadores (nome, email, instituicao) VALUES (?, ?, ?)",
      [nome, email, instituicao]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar orientador" });
  }
});

// **Atualizar um orientador**
/**
 * @swagger
 * /orientadores/{id}:
 *   put:
 *     summary: Atualiza um orientador
 *     tags: [Orientadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do orientador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orientador'
 *     responses:
 *       200:
 *         description: Orientador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orientador'
 *       404:
 *         description: Orientador não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put("/:id", async (req, res) => {
  try {
    const { nome, email, instituicao } = req.body;

    // Validação básica
    if (!nome || !email || !instituicao) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const [result] = await pool.execute(
      "UPDATE orientadores SET nome = ?, email = ?, instituicao = ? WHERE id = ?",
      [nome, email, instituicao, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Orientador não encontrado" });
    }

    res.json({ message: "Orientador atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar orientador" });
  }
});

// **Deletar um orientador**
/**
 * @swagger
 * /orientadores/{id}:
 *   delete:
 *     summary: Deleta um orientador
 *     tags: [Orientadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do orientador
 *     responses:
 *       204:
 *         description: Orientador deletado com sucesso
       404:
         description: Orientador não encontrado
 */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM orientadores WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Orientador não encontrado" });
    }
    res.json({ message: "Orientador deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar orientador" });
  }
});

module.exports = router;