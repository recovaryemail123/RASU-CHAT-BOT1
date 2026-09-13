const OpenAI = require("openai");
const { getState } = require("./botstate");

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

module.exports.config = {
    name: "aichat",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Rashed",
    description: "AI chat like Meta AI - reply when mentioned or tagged",
    commandCategory: "ai",
    usages: "Mention/tag the bot with your question",
    cooldowns: 3,
    envConfig: {}
};

module.exports.run = async function () {
    return;
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, body, mentions, senderID } = event;

    const state = getState();
    if (!state.on && senderID !== state.allowedUser) return;

    if (!body || typeof body !== "string") return;

    const botID = api.getCurrentUserID();
    const isMentioned = mentions && mentions[botID];
    if (!isMentioned) return;

    const question = body.replace(/@\S+/g, "").trim();
    if (!question) return;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Tumi ekjon bondhur moto kotha bolo, Bangla o Banglish mix kore reply dao, choto o friendly answer dao." },
                { role: "user", content: question }
            ],
            max_tokens: 300
        });

        const reply = completion.choices[0].message.content;
        api.sendMessage(reply, threadID, messageID);
    } catch (err) {
        api.sendMessage("❌ AI reply dite pari nai, ektu por abar try koro.", threadID, messageID);
    }
};
