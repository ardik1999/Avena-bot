const { Client, Message, MessageEmbed } = require("discord.js");
const config = require('../../config.json')
module.exports = {
  name: 'feedback',
  description: "feedback anything u want",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const owner = client.users.cache.get('388274270238932993');
    const owner2 = client.users.cache.get("826731079930871820")

    const query = args.join(" ");
    if(!query) return message.reply('Please tell me the feedback')

    const reportEmbed = new MessageEmbed()
    .setTitle(`New Feedback!`)
    .addField('Author', message.author.toString(), true)
    .addField('Guild', message.guild.name, true)
    .addField('Feedback Messages', query)
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    .setColor('BLUE')
    .setTimestamp();

    owner.send(reportEmbed)
    owner2.send(reportEmbed)
    message.channel.send(
      new MessageEmbed()
      .setDescription(`${config.semoji} Thanks For the feedback!`)
      .setColor('GREEN')
    )
  }
}
