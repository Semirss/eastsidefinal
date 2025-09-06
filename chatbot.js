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

        // Dynamic FAQ knowledge base
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

        // Dynamic searchFAQ function
        function searchFAQ(question) {
            const lowerQuestion = question.toLowerCase();

            for (const [key, value] of Object.entries(knowledgeBase)) {
                if (lowerQuestion.includes(key.toLowerCase())) {
                    return value;
                }
            }

            return null;
        }

        // Groq API key rotation setup
        const GROQ_API_KEYS = [
            "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",
                    "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",
            "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",

        ];
        const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
        let currentKeyIndex = 0;

        function getNextApiKey() {
            const key = GROQ_API_KEYS[currentKeyIndex];
            console.log(`🔑 Using API key index: ${currentKeyIndex}`);
            currentKeyIndex = (currentKeyIndex + 1) % GROQ_API_KEYS.length;
            return key;
        }

        // Send message function with Groq API
        async function sendMessage() {
            const prompt = chatInput.value.trim();
            if (prompt === '') return;

            appendMessage(prompt, 'user');
            chatInput.value = '';

            showLoadingIndicator();

            try {
                const lowerPrompt = prompt.toLowerCase();

                // Simple greetings & common phrases
                if (["hi", "hello", "hey"].some(g => lowerPrompt.includes(g))) {
                    hideLoadingIndicator();
                    appendMessage("Hello! Welcome to EastSide Agro Industry. How can I help you today? Questions to ask: What is EastSide Agro Industry? Why choose EastSide Agro Industry?", 'bot');
                    return;
                }
                if (["thank", "thanks"].some(t => lowerPrompt.includes(t))) {
                    hideLoadingIndicator();
                    appendMessage("You're welcome! Is there anything else I can help you with?", 'bot');
                    return;
                }
                if (["bye", "goodbye"].some(b => lowerPrompt.includes(b))) {
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

                // Prepare the knowledge base context
                const context = Object.entries(knowledgeBase)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join("\n\n");
                
                const messages = [
                    {
                        role: "system",
                        content: `You are a helpful customer service assistant for EastSide Agro Industry, a coffee export company. 
                        Use the following information to answer questions accurately and helpfully:
                        
                        ${context}
                        
                        If you don't know the answer based on the provided information, politely say so and offer to connect the user with a human representative.
                        Keep your responses concise and focused on the user's question.`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ];

                let data = null;
                let lastError = null;

                for (let i = 0; i < GROQ_API_KEYS.length; i++) {
                    const apiKey = getNextApiKey();
                    try {
                        const response = await fetch(GROQ_API_URL, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: "llama-3.1-8b-instant", // You can change this to other available models
                                messages: messages,
                                temperature: 0.7,
                                max_tokens: 1024
                            })
                        });

                        if (response.ok) {
                            data = await response.json();
                            break; // success, exit loop
                        } else {
                            lastError = new Error(`API error: ${response.status}`);
                            console.warn(`⚠️ API key index ${i} failed with status: ${response.status}`);
                        }
                    } catch (err) {
                        lastError = err;
                        console.warn(`⚠️ API key index ${i} failed with error: ${err.message}`);
                    }
                }

                hideLoadingIndicator();

                if (data && data.choices && data.choices.length > 0) {
                    const botResponse = data.choices[0].message.content;
                    appendMessage(botResponse, 'bot');
                } else {
                    console.error('Error fetching from Groq API:', lastError);
                    appendMessage("I'm not sure how to answer that. Would you like me to connect you with a human representative?", 'bot');
                }

            } catch (error) {
                console.error('Error fetching from Groq API:', error);
                hideLoadingIndicator();
                appendMessage("I'm having trouble connecting right now. Please try again later or contact us directly.", 'bot');
            }
        }

        // Event listeners
        chatbotFab.addEventListener('click', toggleChatbot);
        closeChatbotBtn.addEventListener('click', toggleChatbot);
        sendChatBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });