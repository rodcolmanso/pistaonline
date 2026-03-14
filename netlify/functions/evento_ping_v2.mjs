// /api/v1/evento/ping
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      status: "Sucesso", 
      mensagem: "Evento Ping V2 via ES6 (.mjs)" 
    }),
  };
};