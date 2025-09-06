// Chatbot functionality
const chatbotFab = document.getElementById('chatbotFab');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChatbotBtn = document.getElementById('closeChatbot');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChat');

let chatHistory = []; // Stores chat messages

// Function to toggle chatbot visibility
function toggleChatbot() {
    chatbotContainer.classList.toggle('open');
    if (chatbotContainer.classList.contains('open')) {
        if (chatHistory.length === 0) {
            appendMessage('Hello! Welcome to EastSide Agro Industry. How can I help you today?', 'bot');
        }
        chatInput.focus();
    }
}

// Function to append messages to the chat window
function appendMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    bubble.textContent = text;
    messageElement.appendChild(bubble);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Store message in history
    chatHistory.push({text, sender});
}

// Loading indicator functions
function showLoadingIndicator() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loadingIndicator';
    loadingElement.classList.add('loading-indicator');
    loadingElement.innerHTML = `
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
    `;
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideLoadingIndicator() {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) loadingElement.remove();
}

// Knowledge base
const knowledgeBase = {
    "EastSide Agro Industry": "EastSide Agro Industry is a leading coffee exporter, dedicated to delivering Ethiopia's finest coffee beans to global markets. We collaborate with local farmers to ensure high-quality, ethically sourced coffee, maintaining sustainability at every step from farm to cup.",
    "Why Choose EastSide Agro Industry": "We prioritize quality, traceability, and sustainability. By working closely with local farmers and using expert processing and packaging techniques, we ensure that every coffee batch meets international standards and delights customers worldwide.",
    "Services": "We provide premium coffee export services, including sourcing, processing, quality control, packaging, and global distribution. We also support clients with product selection, market insights, and logistics solutions.",
    "Custom Coffee": "Absolutely! We offer tailored coffee solutions, including specialty blends, single-origin selections, and custom packaging to meet client specifications.",
    "Export & Shipping": "Yes. We manage end-to-end export logistics, ensuring timely, safe, and compliant delivery of coffee to international markets.",
    "Quality Control": "We maintain rigorous quality checks at every stage—from bean selection and processing to final packaging—to ensure every batch meets the highest standards.",
    "Business Consulting": "We advise coffee businesses on sourcing strategies, export processes, sustainable farming practices, and market expansion to maximize growth and profitability.",
    "Sustainability & Ethical Sourcing": "We support sustainable farming practices, fair trade principles, and community-focused initiatives to promote ethical coffee production.",
    "Process": "Our process includes:\n1. Sourcing high-quality beans from trusted farmers\n2. Processing and drying using traditional and modern methods\n3. Quality assessment and cupping sessions\n4. Packaging for export\n5. Shipping and logistics to international markets",
    "Onboarding": "Onboarding is simple. We start by understanding your coffee requirements and preferences, then recommend suitable beans, packaging, and shipping options for your business.",
    "Team": "Our team consists of coffee experts, quality controllers, logistics specialists, and farmer liaisons, all committed to ensuring exceptional coffee products and smooth export operations.",
    "Interns & Contractors": "Yes, we occasionally collaborate with trained interns and external consultants to support quality control, logistics, and market research without compromising standards.",
    "Technology & Innovation": "We use modern technology in coffee processing, roasting, and packaging to maintain quality, enhance traceability, and ensure efficient export operations.",
    "Digital Tools & Data Management": "We leverage digital tools for inventory tracking, logistics management, and quality monitoring to deliver a seamless export experience for our clients."
};

// FAQ search
function searchFAQ(question) {
    const lowerQuestion = question.toLowerCase();
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (lowerQuestion.includes(key.toLowerCase())) {
            return value;
        }
    }
    return null;
}

// Send message function using serverless Groq function
async function sendMessage() {
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    appendMessage(prompt, 'user');
    chatInput.value = '';
    showLoadingIndicator();

    const lowerPrompt = prompt.toLowerCase();

    // Handle greetings and common phrases
    if (["hi","hello","hey"].some(g => lowerPrompt.includes(g))) {
        hideLoadingIndicator();
        appendMessage("Hello! Welcome to EastSide Agro Industry. How can I help you today? Questions to ask: What is EastSide Agro Industry? Why choose EastSide Agro Industry?", 'bot');
        return;
    }
    if (["thank","thanks"].some(t => lowerPrompt.includes(t))) {
        hideLoadingIndicator();
        appendMessage("You're welcome! Is there anything else I can help you with?", 'bot');
        return;
    }
    if (["bye","goodbye"].some(b => lowerPrompt.includes(b))) {
        hideLoadingIndicator();
        appendMessage("Goodbye! Feel free to reach out if you have more questions.", 'bot');
        return;
    }

    // Check FAQ first
    const faqResponse = searchFAQ(prompt);
    if (faqResponse) {
        hideLoadingIndicator();
        appendMessage(faqResponse, 'bot');
        return;
    }

    // Build messages array for the API
    const messages = [
        { 
            role: "system", 
            content: `You are a helpful customer service assistant for EastSide Agro Industry, a premium Ethiopian coffee exporter. Use the following information to answer accurately:\n\n${Object.entries(knowledgeBase).map(([key, value]) => `${key}: ${value}`).join("\n\n")}`
        },
        { role: "user", content: prompt }
    ];

    try {
        const res = await fetch('/api/groq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages })
        });

        hideLoadingIndicator();

        if (!res.ok) {
            const errorData = await res.json();
            console.error('API error:', errorData);
            appendMessage("Sorry, I'm having technical difficulties. Please try again later.", 'bot');
            return;
        }

        const data = await res.json();
        const botResponse = data.choices?.[0]?.message?.content || 
            "I couldn't generate a response. Please try rephrasing your question.";
        
        appendMessage(botResponse, 'bot');

    } catch (err) {
        console.error('Fetch error:', err);
        hideLoadingIndicator();
        appendMessage("I'm having trouble connecting to the server. Please check your connection and try again.", 'bot');
    }
}

// Event listeners
chatbotFab.addEventListener('click', toggleChatbot);
closeChatbotBtn.addEventListener('click', toggleChatbot);
sendChatBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });