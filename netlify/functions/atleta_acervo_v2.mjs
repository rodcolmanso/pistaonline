// api/v2/atleta/acervo
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      status: "Sucesso", 
      mensagem: "Acervo do Atleta V2 via ES6 (.mjs)" 
    }),
  };
};