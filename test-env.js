require('dotenv').config();

console.log('Node.js environment variables:');
console.log(process.env);
console.log('OpenAI API Key:', process.env.VUE_APP_OPENAI_API_KEY);