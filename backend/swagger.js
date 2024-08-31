const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Save for Tomorrow",
      version: "1.0.0",
      description: "API para gerenciar projetos e participantes",
    },
    components: {
      schemas: {
        Orientador: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identificador único do orientador",
            },
            nome: {
              type: "string",
              description: "Nome do orientador",
            },
            email: {
              type: "string",
              format: "email",
              description: "E-mail do orientador",
            },
            instituicao: {
              type: "string",
              description: "Instituição do orientador",
            },
          },
        },
        Participante: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identificador único do participante",
            },
            nome: {
              type: "string",
              description: "Nome do participante",
            },
            email: {
              type: "string",
              format: "email",
              description: "E-mail do participante",
            },
            colegio: {
              type: "string",
              description: "Colégio do participante",
            },
            cidade: {
              type: "string",
              description: "Cidade do participante",
            },
            projeto_id: {
              type: "integer",
              description: "ID do projeto associado",
            },
          },
        },
        Projeto: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identificador único do projeto",
            },
            nome: {
              type: "string",
              description: "Nome do projeto",
            },
            descricao: {
              type: "string",
              description: "Descrição do projeto",
            },
            data_inicio: {
              type: "string",
              format: "date",
              description: "Data de início do projeto",
            },
            data_fim: {
              type: "string",
              format: "date",
              description: "Data de fim do projeto",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/orientadores/*.js","./routes/participantes/*.js","./routes/projetos/*.js"], // Ajustar o caminho se necessário
};

const specs = swaggerJsdoc(options);

module.exports = specs;