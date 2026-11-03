const swaggerJsdoc = require("swagger-jsdoc");
const config = require("./env");

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Foodora API",
      version: "1.0.0",
      description: "API documentation for the Foodora backend",
    },

    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
