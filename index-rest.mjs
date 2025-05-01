import {
  tokenIsValid,
  getToken,
  nextHandle,
  unAuthorized
} from './authorizer.mjs';

/**
 * Lambda Authorizer handler para API Gateway REST (modo "Token").
 * Recebe o token via `event.authorizationToken` e valida contra dados secretos da AWS.
 */
export async function handler(event, context, callback) {
  // Extrai o ARN completo do recurso chamado (usado na policy de autorização)
  const { methodArn: resource } = event;

  // Extrai o token do campo 'authorizationToken' do evento
  const token = getToken(event, 'authorizationToken');

  // Valida o token comparando com valores armazenados no Secrets Manager
  const isValid = await tokenIsValid(token);

  // Se o token for válido, permite o acesso ao recurso
  if (isValid) {
    return callback(null, nextHandle(resource));
  }

  // Caso contrário, retorna acesso não autorizado
  return callback(unAuthorized());
}
