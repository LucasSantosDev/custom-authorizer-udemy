import {
  SecretsManagerClient,
  GetSecretValueCommand,
  DescribeSecretCommand,
  PutSecretValueCommand,
  UpdateSecretVersionStageCommand
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-2" });

export async function handler(event) {
  const { SecretId, ClientRequestToken, Step } = event;

  if (!SecretId || !ClientRequestToken || !Step) {
    throw new Error("Evento incompleto: SecretId, ClientRequestToken e Step são obrigatórios.");
  }

  switch (Step) {
    case "createSecret":
      await createSecret(SecretId, ClientRequestToken);
      break;
    case "setSecret":
      // opcional: configurar em um sistema externo
      break;
    case "testSecret":
      // opcional: validar segredo
      break;
    case "finishSecret":
      await finishSecret(SecretId, ClientRequestToken);
      break;
    default:
      throw new Error(`Etapa não reconhecida: ${Step}`);
  }
}

async function createSecret(secretId, token) {
  try {
    // Verifica se já existe segredo para este token
    await client.send(new GetSecretValueCommand({
      SecretId: secretId,
      VersionStage: "AWSPENDING",
      VersionId: token
    }));
    console.log("Segredo AWSPENDING já existe.");
  } catch {
    // Gera novos valores para o segredo
    const newSecret = {
      CLIENT_ID: gerarId(),
      CLIENT_PASSWORD: gerarSenha()
    };

    // Salva os novos valores com a versão AWSPENDING
    await client.send(new PutSecretValueCommand({
      SecretId: secretId,
      ClientRequestToken: token,
      SecretString: JSON.stringify(newSecret),
      VersionStages: ["AWSPENDING"]
    }));

    console.log("Novo segredo salvo na versão AWSPENDING.");
  }
}

async function finishSecret(secretId, token) {
  const { VersionIdsToStages } = await client.send(
    new DescribeSecretCommand({ SecretId: secretId })
  );

  const currentVersion = Object.entries(VersionIdsToStages).find(
    ([, stages]) => stages.includes("AWSCURRENT")
  )?.[0];

  if (currentVersion !== token) {
    // Atualiza o stage para que esse novo valor vire o atual
    await client.send(new UpdateSecretVersionStageCommand({
      SecretId: secretId,
      VersionStage: "AWSCURRENT",
      MoveToVersionId: token,
      RemoveFromVersionId: currentVersion
    }));

    console.log("Versão atual do segredo foi atualizada.");
  } else {
    console.log("Esta versão já é a AWSCURRENT.");
  }
}

// Geradores fictícios
function gerarId() {
  return "CLIENT_" + Math.floor(Math.random() * 100000);
}

function gerarSenha() {
  return Math.random().toString(36).slice(-10);
}
