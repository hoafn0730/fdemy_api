const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: 'AIzaSyCVow2f9OcpR_GRse_T5KR3RtyUjP04zB4',
});

const genContent = async (content, messages, context) => {
    // build content history + message cuối
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `Dưới đây là một số thông tin về các bài học trong website:\n\n"${context}"\n\nHãy dùng thông tin này để trả lời các câu hỏi liên quan.`,
                },
            ],
        },
        ...messages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        })),
    ];

    // Thêm message mới nhất (người dùng vừa gửi)
    contents.push({
        role: 'user',
        parts: [{ text: content }],
    });

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
    });

    return response.text;
};

module.exports.genai = { genContent };
