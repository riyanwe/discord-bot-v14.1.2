const client = require('../index.js');
const config = require('../config/config.json');
const { PermissionsBitField, REST, Routes } = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const { validateHeaderValue } = require('http');

module.exports = (client) => {
    console.log("------------------------------------------------".yellow);

    const slash = [];

    fs.readdirSync('./src/slashCommands/').forEach(dir => {
        const commands = fs.readdirSync(`./src/slashCommands/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of commands) {
            let pull = require(`../slashCommands/${dir}/${file}`);

            if(pull.name) {
                client.slash.set(pull.name, pull);
                console.log(`[HANDLER - SLASH] Loaded a file : ${pull.name}`.green);

                slash.push({
                    name : pull.name,
                    description : pull.description,
                    type : pull.type,
                    options : pull.options ? pull.options : null,
                    defaulPermission : pull.defaulPermission ? pull.defaulPermission : null,
                    defaultUserPermissions : pull.defaultUserPermissions ? PermissionsBitField.resolve(pull.defaultUserPermissions).toString() : null
                });
            } else{
                console.log(`[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value.`.red)
                continue;
            }
        }
    });

    if(!config.client.clientID) {
        console.log("[CRUSH] You have to provide your client ID in config file".red + "\n");
        return process.exit();
    };

    const rest = new REST({ version: '10'}).setToken(config.client.authToken);
    
    (async () => {
        try {
            if(config.handler.guildID) {
                await rest.put(Routes.applicationGuildCommands(config.client.clientID, config.handler.guildID),
                    { body : slash}
                );

                const GUILD = await client.guilds.resolve(config.handler.guildID);

                console.log("------------------------------------------------".magenta);
                console.log(`[HANDLER - SLASH] Slash commands has been registered successfuly to the guild : ${GUILD || "ERR : GUILD_NOT_FOUND"}`.magenta.bold + "\n")
                console.log("------------------------------------------------".magenta);
            } else {
                await rest.put(
                    Routes.applicationCommands(config.client.clientID),
                    { body : slash }
                );

                console.log("------------------------------------------------".magenta);
                console.log(`[HANDLER - SLASH] Slash commands has been registered successfuly to all the guilds`.magenta)
                console.log("------------------------------------------------".magenta);
            }
        } catch (err) {
            console.log(err);
        }
    })();
}