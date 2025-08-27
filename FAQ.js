// Dynamic FAQ knowledge base
const knowledgeBase = {
    "EastSide Agro Industry": "EastSide Agro Industry is a leading coffee exporter, dedicated to delivering Ethiopia’s finest coffee beans to global markets. We collaborate with local farmers to ensure high-quality, ethically sourced coffee, maintaining sustainability at every step from farm to cup.",
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

    // Try to find the closest match in the knowledge base
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (lowerQuestion.includes(key.toLowerCase())) {
            return value;
        }
    }

    // No match found
    return null;
}
