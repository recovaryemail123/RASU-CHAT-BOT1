const { getState, setState } = require("./botstate");

module.exports.config = {
    name: "botmode",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Rashed",
    description: "Turn bot auto-reply on/off (admin only)",
    commandCategory: "system",
    usages: "on / off",
    cooldowns: 3,
    envConfig: {}
};

module.exports.run = async function ({ api, event, args }) {
    try {
        console.log("[BOTMODE DEBUG] Command triggered, args:", args);
        const { threadID, messageID, senderID } = event;
        const cmd = (args[0] || "").toLowerCase();

        if (cmd === "off") {
            setState({ on: false, allowedUser: senderID });
            console.log("[BOTMODE DEBUG] Set to OFF");
            return api.sendMessage("🔴 Bot off kora hoyeche.", threadID, messageID);
        }
        if (cmd === "on") {
            setState({ on: true, allowedUser: null });
            console.log("[BOTMODE DEBUG] Set to ON");
            return api.sendMessage("🟢 Bot on kora hoyeche.", threadID, messageID);
        }
        return api.sendMessage("Lekho: botmode on OR botmode off", threadID, messageID);
    } catch (err) {
        console.log("[BOTMODE DEBUG] ERROR:", err);
        return event && api ? api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID) : null;
    }
};
