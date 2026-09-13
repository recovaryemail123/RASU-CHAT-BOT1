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
    const { threadID, messageID, senderID } = event;
    const cmd = (args[0] || "").toLowerCase();

    if (cmd === "off") {
        setState({ on: false, allowedUser: senderID });
        return api.sendMessage("🔴 Bot off kora hoyeche. Ekhon shudhu admin chara r kauke reply debe na.", threadID, messageID);
    }
    if (cmd === "on") {
        setState({ on: true, allowedUser: null });
        return api.sendMessage("🟢 Bot on kora hoyeche. Sobaike abar reply debe.", threadID, messageID);
    }
    return api.sendMessage("Lekho: botmode on  OR  botmode off", threadID, messageID);
};
