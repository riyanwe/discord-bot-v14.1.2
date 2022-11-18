const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const client = require('../../index');
const config = require('../../config/config.json');

module.exports = {
    name : "messageCreate"
};

client.on('messageCreate', async message => {
    let prefix = config.global.prefix;
    if (message.channel.type !== 0) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args .shift().toLowerCase();
    if(cmd.length == 0) return;

    let command = client.commands.get(cmd);

    if(!command) return message.reply(`💢 **[${message.member.displayName}]** its an invalid command`);

    if(command) {
        if(command.userPermissions) {
            if(!message.member.permissions.has(PermissionsBitField.resolve(command.userPermissions || []))) return message.react.reply({
                embeds : [
                    new EmbedBuilder()
                        .setDescription(`💢 **[${message.member.displayName}]** you don't have permission to use this command\n\`\`\n${command.userPermissions || []}\n\`\`\``)
                        .setColor(`Red`)
                ]
            })
        }

        if(command.botPermissions) {
            if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPermissions || []))) return message.reply({
                embeds : [
                    new EmbedBuilder()
                        .setDescription(`💢 **[${message.member.displayName}]** you don't have permission to use this command\n\`\`\n${command.botPermissions || []}\n\`\`\``)
                        .setColor(`Red`)
                ]
            })
        }

        if(command.owner, command.owner == true) {
            if(!config.developer.owner) return;

            const allowedUser = [];

            config.developers.owner.forEach(user => {
                const fetchOwner = message.guild.member.cache.get(user);
                if(!fetchOwner) return allowedUser.push(`**[Unknown#0000]**`)
                allowedUser.push(`${fetchOwner.user.tag}`);
            });

            if(!config.developer.owner.some(ID => message.member.id.includes(ID))) return message.reply({
                embeds : [
                    new EmbedBuilder()
                    .setDescription(`💢 **[${message.member.displayName}]** only owner can use this command!\n\`\`\n${allowedUser.join(",")}\n\`\`\``)
                    .setColor(`Red`)
                ]
            })
        }

        try {
            command.run(client, message, args);
        } catch (err) {
            console.log(err);
        }
    }
})