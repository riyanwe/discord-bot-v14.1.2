const { EmbedBuilder } = require('discord.js');

module.exports = {
    config : {
        name : "ping",
        description : "test command"
    },
    userPermissions : ['SendMessage'],
    botPermissions : ['ViewChannels'],
    owner : true,
    run : async (client, message, args) => {
        message.reply({
            embeds : [
                new EmbedBuilder()
                    .setDescription(`🏓 Pong! ${client.ws.ping}ms.`)
                    .setColor("Green")
            ]
        })
    }
}