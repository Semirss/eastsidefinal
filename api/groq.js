// /api/groq.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

    if (!messages) {
        return res.status(400).json({ error: 'Missing messages' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY; // Keep this secret in Vercel
    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({ error: text });
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (err) {
        console.error('Error calling Groq API:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
