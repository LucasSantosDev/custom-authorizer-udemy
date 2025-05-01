# Custom Authorizer

## Lambda (hello-world)

Versão do Node: `Node.JS 22`

Mudar o timeout da lambda para 10 segundos

```bash
export const handler = async (event) => {
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' }),
  };
  return response;
};
```

---

## ApiGateway (custom-authorizer-http)

Cria a seguinte rota dentro do APIGateway e vincula-lá ao lambda `hello-world`

```bash
GET /hello-world
```

---

## SecretsManager (dev/CustomAuthorizer/Credentials)

Valor do segredo (em json):

```json
{"CLIENT_ID":"123","CLIENT_PASSWORD":"12345"}
```

---

## Lambda (custom-authorizer-http)

Versão do Node: `Node.JS 22`

Mudar o timeout da lambda para 10 segundos

> Implementar os arquivos:
- index-http.mjs (`dentro da lambda salvar como index.mjs`)
- secrets-manager.mjs
- authorizer.mjs

> Permissão da role do Custom Lambda Authorizer

```json
{
 "Effect": "Allow",
 "Action": ["secretsmanager:GetSecretValue"],
 "Resource": [
   "ARN_SECRETS_MANAGER"
 ]
}
```

---

## Authorizer (custom-authorizer-http)

> Dentro do APIGateway, configurar um autorizador e vinculá-lo a execução da rota `/hello-world`

![image](https://github.com/user-attachments/assets/526c790a-bd75-4b69-9d45-2d3529dc21d5)

---

## Lambda (custom-authorizer-rest)

Versão do Node: `Node.JS 22`

Mudar o timeout da lambda para 10 segundos

> Implementar os arquivos:
- index-rest.mjs (`dentro da lambda salvar como index.mjs`)
- secrets-manager.mjs
- authorizer.mjs

> Permissão da role do Custom Lambda Authorizer

```json
{
 "Effect": "Allow",
 "Action": ["secretsmanager:GetSecretValue"],
 "Resource": [
   "ARN_SECRETS_MANAGER"
 ]
}
```

---

## Authorizer (custom-authorizer-rest)

> Dentro do APIGateway, configurar um autorizador e vinculá-lo a execução da rota `/hello-world`

![image](https://github.com/user-attachments/assets/524a982b-245b-4454-aa81-3e3615aa3a00)

---

