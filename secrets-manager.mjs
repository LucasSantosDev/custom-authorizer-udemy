import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

class SecretsManager {
 constructor() {
   this.client = new SecretsManagerClient({ region: 'us-east-2' });
 }


 /**
  * Recupera o segredo a partir do nome no Secrets Manager.
  * Faz cache do resultado no process.env para evitar múltiplas chamadas.
  * Também injeta os campos do segredo (JSON) diretamente como variáveis de ambiente.
  */
 async getSecret(secretName) {
   // Chave de cache para saber se já buscamos esse segredo anteriormente
   const cacheKey = `CACHED_SECRET_${secretName.toUpperCase()}`;


   // Verifica se já está em cache (armazenado em process.env)
   if (process.env[cacheKey]) {
     console.log("Secret was in the cache");


     // Retorna o segredo parseado direto do cache
     return JSON.parse(process.env[cacheKey]);
   }


   // Comando que busca o segredo pelo nome no Secrets Manager
   const command = new GetSecretValueCommand({ SecretId: secretName });
   const { SecretString } = await this.client.send(command);


   // Se o segredo vier vazio, lança erro
   if (!SecretString) {
     throw new Error("SecretString is undefined");
   }


   console.log("Secret was fetched from secrets manager");


   let parsedSecret;


   // Tenta fazer parse do JSON recebido
   try {
     parsedSecret = JSON.parse(SecretString);
   } catch {
     throw new Error("SecretString is not a valid JSON");
   }


   // Injeta cada chave do segredo como variável de ambiente
   for (const [key, value] of Object.entries(parsedSecret)) {
     process.env[key.toUpperCase()] = value;
   }


   // Também armazena o JSON completo como string no cache
   process.env[cacheKey] = JSON.stringify(parsedSecret);


   // Retorna o objeto com as chaves/valores do segredo
   return parsedSecret;
 }
}


export default SecretsManager;
