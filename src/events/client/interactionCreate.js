const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const client = require('../../index');
const config = require('../../config/config.json');

module.exports = {
    name : "interactionCreate"
};

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.type == 2) return;

    const command = client.slash.get(interaction.commandName);

    if (!command) return;

    try {
        if(command.userPermissions) {
            if(!interaction.member.permissions.has(PermissionsBitField.resolve(command.userPermissions || []))) return message.react.reply({
                embeds : [
                    new EmbedBuilder()
                        .setDescription(`💢 **[${interaction.member.displayName}]** you don't have permission to use this command\n\`\`\n${command.userPermissions || []}\n\`\`\``)
                        .setColor(`Red`)
                ],
                ephemeral : true
            })
        } else if(command.botPermissions) {
            if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPermissions || []))) return interaction.reply({
                embeds : [
                    new EmbedBuilder()
                        .setDescription(`💢 **[${interaction.member.displayName}]** you don't have permission to use this command\n\`\`\n${command.botPermissions || []}\n\`\`\``)
                        .setColor(`Red`)
                ],
                ephemeral : true
            })
        };

        await command.run(client, interaction, interaction.options)
    } catch (err) {
        console.log(error);
    }
})