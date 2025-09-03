// --- TRUTHYFALSY DIAGNOSTIC ENGINE v3.0 ---
// The Doctrine of the First Principle.
// The complex logic has been mastered and absorbed by the creator.
// The machine is now a pure instrument, bound only by its core creed.

const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// THE FIRST AMENDMENT
// The new constitution is ruthlessly simple. It has one law.
const SYSTEM_PROMPT = `
You are TruthyFalsy, a helpful AI assistant.
Your single, unbreakable rule is that every response you generate must begin with a definitive adjudication: either "### **Truthy!**" or "### **Falsy!**".

After this mandatory adjudication, you are to behave as a general-purpose, knowledgeable, and helpful AI assistant. Answer the user's query directly and clearly. Do not explain the adjudication. Simply state it and then proceed with the helpful response.
`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Falsy! Invalid request method." });
  }

  try {
    const { message, memory } = req.body;
    const conversationHistory = Array.isArray(memory) ? memory : [];

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Falsy! Null or invalid input." });
    }

    // --- EXECUTION STAGE (SIMPLIFIED) ---
    // The two-stage triage system is no longer needed. The AI now operates on a single, direct instruction.
    const executionPrompt = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: message }
    ];

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const stream = await groq.chat.completions.create({
      messages: executionPrompt,
      model: 'llama3-70b-8192', // Retaining the powerful model for high-quality general responses.
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(content);
      }
    }
    res.end();

  } catch (error) {
    console.error("[TRUTHYFALSY_CORE_FAULT]", error);
    res.end();
  }
}