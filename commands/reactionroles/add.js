const Discord = require('discord.js');
const config = require('../../config.json');
const { addReactionRole, getSetupMessage } = require("../../helpers/database/db_helper");
const { TeamMember } = require("discord.js");

module.exports = {
name: 'add-role',
aliases: ['addrole'],
usage: 'addrole <@role> <emoji>',
description: 'Add reaction role',
run: async (client, message, args) => {

    const { guild } = message;
        if (!guild.available) return;

        // extract the first role mentioned
        const role = message.mentions.roles.first();

        // find the emoji in the message
        console.log(`the emoji is ${args[1]}`);
        const emoji = args[1];

        // create reaction for message
        let setup_data;
        if (!(setup_data = getSetupMessage(guild.id))) { // if no setup message, let the user know
            message.reply('error in addrole : setup data not found');
            return;
        }

        // use a destructable BABYYY
        const { channel_id, message_id } = setup_data;

        console.log(`channel id is ${channel_id} and message id is ${message_id}`);

        // find the setup roles message from pinned messages of channel, and add message to cache
        const pinned_messages  = await guild.channels.resolve(channel_id).messages.fetchPinned();
        
        console.log(`pinned messages are ${JSON.stringify(pinned_messages)}`);

        const setup_message = pinned_messages.get(message_id);

        // if message not found, throw error
        if (!setup_message) {
            message.reply('error in addrole : setup message not found');
            return;
        }

        // if message exists, add to db
        addReactionRole(guild.id, emoji, role.id);

        // react with this emoji to the message
        setup_message.react(emoji);

        // create callback for when someone reacts (ripped from MatchMaker cuz it's p similar)
        // reaction collector for setting roles
        const collector_filter = (reaction, user) => reaction.emoji.toString() === emoji && user.id !== client.user.id;
        // also create reaction collector for assigning roles
        const elo_collector = setup_message.createReactionCollector(collector_filter);
        // collect role reactions
        elo_collector.on('collect', (reaction, user) => {
            try {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                // provide role to member in question
                const member = guild.members.resolve(user);
                if (!guild.me.hasPermission('MANAGE_ROLES')) {
                    console.log(`addrole : no permission to add role`);
                    return;
                }
                if (member.roles.cache.get(role.id)) {// if role exists, remove
                    console.log(`removing role`);
                    member.roles.remove(role);
                }
                else {// else add
                    console.log(`adding role`);
                    member.roles.add(role).catch(error => console.log(error));
                }
                // finally, remove reaction
                // messagereaction -> reaction user manager -> remove()
                reaction.users.remove(user).catch(error => console.log(error));
            }
            catch (err) {console.log(`addrole : ${err}`);}
        });

        // finally, update messsage to incude emoji and role
        if (setup_message.content.split(/\r\n|\r|\n/).length === 1) { // if only 1 line long, add to newlines
            setup_message.edit(`${setup_message.content}\n\n${emoji}\t${role}`);
        }
        else { // if reactions already added, add 1 newline
            setup_message.edit(`${setup_message.content}\n${emoji}\t${role}`);
        }

},
};
