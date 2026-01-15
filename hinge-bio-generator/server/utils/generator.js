const axios = require('axios');
const { PROMPT_ANSWERS } = require('./prompts');

const tryAI = async (prompt, userParams) => {
  if (!process.env.HUGGINGFACE_API_KEY) return null;
  
  try {
    const { location, keyInterests, desiredVibe, tone, gender } = userParams;
    const aiPrompt = `Write a Hinge bio answer for: "${prompt}"\nProfile: ${gender}, ${location}, loves ${keyInterests?.join(' & ')}, ${desiredVibe}, ${tone}\nRules: Natural, 1-2 sentences, show personality`;
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct',
      { inputs: aiPrompt },
      { headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}` }, timeout: 5000 }
    );
    
    if (response.data?.[0]?.generated_text) {
      const text = response.data[0].generated_text.replace(aiPrompt, '').trim();
      if (text.length > 20) {
        return { answer: text, source: 'AI', model: 'Phi-3' };
      }
    }
  } catch (error) {
    // AI failed, will use template
  }
  return null;
};

const generateTemplate = (prompt, userParams) => {
  const { desiredVibe } = userParams;
  const vibe = desiredVibe?.toLowerCase() || 'default';
  
  const promptData = PROMPT_ANSWERS[prompt];
  const answers = promptData?.[vibe] || promptData?.default || ['Something meaningful', 'Genuine connection', 'Authentic experiences'];
  
  // Randomly select from available answers
  const randomIndex = Math.floor(Math.random() * answers.length);
  const answer = answers[randomIndex];
  
  return { answer, source: 'Template', model: 'Fast Template' };
};

const generateAnswers = async (userParams, selectedPrompts) => {
  const result = {};
  const metadata = {};
  
  for (const prompt of selectedPrompts) {
    // Try AI first, fallback to template
    const aiResult = await tryAI(prompt, userParams);
    const finalResult = aiResult || generateTemplate(prompt, userParams);
    
    result[prompt] = finalResult.answer;
    metadata[prompt] = { source: finalResult.source, model: finalResult.model };
  }
  
  return { promptAnswers: result, metadata };
};

module.exports = { generateAnswers };