const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const { TeraDood } = require("@kodingkeundev/teradood");

module.exports.config = {
    name: "autodownload",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Rashed",
    description: "Auto download video from any link (FB/TikTok/YouTube/TeraBox/etc)",
    commandCategory: "media",
    usages: "Just send a video link in the group",
    cooldowns: 5,
    envConfig: {}
};

module.exports.run = async function () {
    // Ei command prefix diye direct call korar dorkar nei
    return;
};

module.exports.handleEvent = function ({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body || typeof body !== "string") return;

    const linkMatch = body.match(/(https?:\/\/[^\s]+)/i);
    if (!linkMatch) return;
    const url = linkMatch[0];

    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);

    if (/terabox|1024tera|teraboxapp/i.test(url)) {
        api.sendMessage("⏳ TeraBox video download hocche...", threadID);
        TeraDood.terabox(url)
            .then(result => {
                if (!result || !result.downloadLink) {
                    return api.sendMessage("❌ TeraBox link theke download link paoa gelo na.", threadID, messageID);
                }
                api.sendMessage({
                    body: "✅ Ei je tomar TeraBox video!",
                    attachment: require("request")(result.downloadLink)
                }, threadID, null, messageID);
            })
            .catch(() => {
                api.sendMessage("❌ TeraBox theke download kora gelo na.", threadID, messageID);
            });
        return;
    }

    const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);
    api.sendMessage("⏳ Video download hocche, wait koro...", threadID);

    exec(`yt-dlp -f "mp4" -o "${filePath}" "${url}"`, (error) => {
        if (error || !fs.existsSync(filePath)) return;
        api.sendMessage({
            body: "✅ Ei je tomar video!",
            attachment: fs.createReadStream(filePath)
        }, threadID, () => fs.unlinkSync(filePath), messageID);
    });
};
