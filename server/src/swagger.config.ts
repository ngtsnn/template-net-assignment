import swaggerAutoGen from "swagger-autogen";
import env from "./shared/configs/env";

const doc = {
  info: {
    title: "Chatbot",
    description: "Chatbot API documentation",
    version: "1.0.0"
  },
  host: `${env.HOST}:${env.PORT}`,
  schemes: ["http"]
};

const outputFile = "./docs/swagger.json"; // Output file for the generated docs
const endpointsFiles = ["./routes/*.ts"]; // Endpoints files to be parsed

swaggerAutoGen(outputFile, endpointsFiles, doc);
