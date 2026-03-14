import { connectToDatabase } from './db.mjs'; // Ajuste o caminho se necessário

export const handler = async (event, context) => {
  try {
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DATABASE_STANDBY); // Nome do seu banco
    
    // Exemplo: buscando o primeiro atleta para testar
    const atleta = await db.collection("shooters").findOne({});

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(atleta),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao conectar ao MongoDB", details: error.message }),
    };
  }
};