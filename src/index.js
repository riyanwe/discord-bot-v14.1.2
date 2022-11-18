const { Client, Partials, Collection } = require('discord.js');
const color = require('colors');
const config = require('./config/config.json');

const client = new Client({
    intents : [
        "Guilds",
        "GuildMessages",
        "GuildPresences",
        "GuildMessageReactions",
        "DirectMessages",
        "MessageContent"
    ],
    partials : [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ]
});

if(!config.client.authToken) {
    console.log("[WARN!] Token tidak ada".yellow.bold + "\n")
    return process.exit();
};

client.commands = new Collection()
client.events = new Collection()
client.slash = new Collection()

module.exports = client;

["command", "event", "slash"].forEach(file => {
    require(`./handlers/${file}`)(client);
});

client.login(config.client.authToken)
    .catch((err) => {
        console.log("[CRUSH!] Ada kesalahan saat menyambungkan bot".yellow.bold + "\n");
        console.log("[CRUSH!] Error dari DiscordAPI :".yellow.bold + err);
        process.exit();
    });

process.on("unhandledRejection", async (err) => {
    console.log(`[ANTI - CRUSH] Unhandled Rejection : $(err)`.red.bold)
});