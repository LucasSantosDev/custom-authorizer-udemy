import {
 tokenIsValid,
 getToken,
 nextHandle,
 unAuthorized
} from './authorizer.mjs';


/**
* Handler do Lambda Authorizer.
* Recebe o evento do API Gateway, extrai o token, valida e retorna a política de acesso.
*/
export async function handler(event, context, callback) {
 // Extrai o ARN do recurso sendo acessado e os headers da requisição
 const { routeArn: resource, headers } = event;


 // Extrai o token do cabeçalho "Authorization"
 const token = getToken(headers, 'authorization');


 // Valida o token comparando com os dados do Secrets Manager
 const isValid = await tokenIsValid(token);


 // Se for válido, retorna política de acesso permitindo a requisição
 if (isValid) {
   return callback(null, nextHandle(resource));
 }


 // Se inválido, retorna resposta de acesso negado
 return callback(unAuthorized());
}
