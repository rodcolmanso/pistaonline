// require('dotenv').config();


const handler = async (event, context) => {

  try {
    
    const userContext= context.clientContext.user;
    

    console.log('FUNC PING function invoked');
    const datetime= new Date();
    
    switch (event.httpMethod){
      case 'POST':
        
        
        return {
          statusCode: 401,
          // // more keys you can return:
          headers: { "Access-Control-Allow-Origin": "*"
                   , "Access-Control-Allow-Headers": "*"
                   ,"Access-Control-Allow-Methods": "*"
                   ,"Content-Type": "application/json"
                  //  ,"Access-Control-Allow-Headers": "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization" 
                  },
            body: JSON.stringify({ message: 'NEEDS IMPLEMENTATION', 'null': ret }),
          // isBase64Encoded: true,
        }

        case 'GET':
        
        console.log('FUNCTION PING GET method invoked');

        console.log('User context: ', userContext);

        console.log("User userContext['https://tpmonline.com.br/roles']: ", userContext['https://tpmonline.com.br/roles']);
        
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("Full clientContext: ", context.clientContext);


context.clientContext


        return {
          statusCode: 200,
          body: JSON.stringify(context.clientContext),
          // // more keys you can return:
          headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*","Access-Control-Allow-Methods": "*"
                  //  ,"Access-Control-Allow-Headers": "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization" 
                  }
          // isBase64Encoded: true,
        }
    
    }
    
    
  } catch (error) {
    return { statusCode: 500, body: error.toString(),headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*","Access-Control-Allow-Methods": "*" }, }
  }
}

module.exports = { handler }
