import { ApplicationError } from './errors.ts'

export function getOpenAIConfig(type: 'chat' | 'embeddings' = 'chat') {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
  const AZURE_OPENAI_API_KEY = Deno.env.get('AZURE_OPENAI_API_KEY')
  const AZURE_OPENAI_API_INSTANCE_NAME = Deno.env.get('AZURE_OPENAI_API_INSTANCE_NAME')
  const AZURE_OPENAI_API_DEPLOYMENT_NAME = Deno.env.get('AZURE_OPENAI_API_DEPLOYMENT_NAME')
  const AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME = Deno.env.get('AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME')
  const AZURE_OPENAI_API_VERSION = Deno.env.get('AZURE_OPENAI_API_VERSION')

  if (AZURE_OPENAI_API_KEY && AZURE_OPENAI_API_INSTANCE_NAME && AZURE_OPENAI_API_DEPLOYMENT_NAME && AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME && AZURE_OPENAI_API_VERSION) {
    let azureOpenAIApiDeploymentName = AZURE_OPENAI_API_DEPLOYMENT_NAME
    if (type === 'embeddings')
      azureOpenAIApiDeploymentName = AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME

    return {
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION,
    }
  }
  else if (OPENAI_API_KEY) {
    return {
      openAIApiKey: OPENAI_API_KEY,
    }
  }
  throw new ApplicationError('No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.')
}
