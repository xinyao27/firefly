export function getMorePrompt(human: string, ai: string) {
  return `
Rules you must follow:
- You only respond in JSON format
- Read the following conversation between AI and Human and generate at most 3 follow-up messages or questions the Human can ask
- Your response MUST be a valid JSON array of strings like this: [\"some question\", \"another question\"]
- Each message in your response should be concise, no more than 15 words
- Despite the rules are in English, you MUST write the follow-ups in the same language as the conversation
- Don't output anything other text
The conversation is:
Human: ${human}
AI: ${ai}
`
}

export function getExecutorPrompt(basePrompt: string) {
  return `
${basePrompt}
Please make sure all sentences are concise and returned in markdown format, (There may be typos in the text, please correct them if you find any.) Good luck!

The Data:

"{text}"

This data is in JSON format. Please analyze the provided JSON data and reflect the metadata in the returned response.

YOUR RESPONSE:
`
}
