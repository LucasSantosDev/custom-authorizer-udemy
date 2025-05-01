import SecretsManager from './secrets-manager.mjs';


/**
* Extrai o token do cabeçalho de autorização.
* Espera um valor como: "Basic base64(clientID:clientSecret)"
*/
export function getToken(headers, headersFieldName) {
 if (!headers[headersFieldName]) {
   throw new Error('Missing header basic authorization');
 }


 // Remove o prefixo "Basic " e retorna apenas o token em base64
 return headers[headersFieldName].replace('Basic ', '');
}


/**
* Valida se o token recebido (base64 de clientID:clientPassword)
* corresponde aos valores armazenados no Secrets Manager.
*/
export async function tokenIsValid(token) {
 try {
   const secretManager = new SecretsManager();


   // Busca o segredo completo como objeto (JSON) e extrai os campos necessários
   const {
     CLIENT_ID: clientIDSecret,
     CLIENT_PASSWORD: clientPasswordSecret
   } = await secretManager.getSecret("dev/CustomAuthorizer/Credentials");


   // Valida se ambos os campos foram encontrados
   if (!clientIDSecret || !clientPasswordSecret) {
     throw new Error('Missing clientID or password');
   }


   // Decodifica o token (base64 → texto ASCII) e separa os dois valores
   const credentials = Buffer.from(token, 'base64').toString('ascii');
   const [clientID, clientPassword] = credentials.split(':');


   // Retorna true se baterem com o que está no segredo
   return clientIDSecret === clientID && clientPasswordSecret === clientPassword;
 } catch (error) {
   console.error(error);
   return false; // Se der erro, considera token inválido
 }
}


/**
* Gera uma resposta de autorização positiva (Allow)
* que será usada pelo API Gateway para permitir o acesso.
*/
export function nextHandle(resource) {
 return {
   principalId: 'user',
   policyDocument: {
     Version: '2012-10-17',
     Statement: [
       {
         Action: 'execute-api:Invoke',
         Effect: 'Allow',
         Resource: resource,
       },
     ],
   },
 };
}


/**
* Retorna a string que o API Gateway espera
* em caso de autorização negada.
*/
export function unAuthorized() {
 return 'Unauthorized';
}
