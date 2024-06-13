import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import SubCommand from "../../../base/classes/SubCommand"
import GuildSettings from "../../../base/schemas/GuildSettings";

export default class TicketSettingsTicketLimit extends SubCommand{
    constructor(client:CustomClient){
        super(client, {
            name: "ticketsettings.ticket-limit"
        })
    }


    async Execute(interaction: ChatInputCommandInteraction){
        const limit = interaction.options.getInteger("value");
        await interaction.deferReply({ ephemeral: true });
        const errorEmbed = new EmbedBuilder().setColor("Red");
        const settings = await GuildSettings.findOne({guildId: interaction.guildId});
        if (!settings) return interaction.editReply({embeds: [errorEmbed.setDescription("❌ No settings found.")]});
        if (limit !== null && limit < 1) return interaction.editReply({embeds: [errorEmbed.setDescription("❌ The ticket limit must be greater than 0.")]});
        if (!(await GuildSettings.exists({guildId: interaction.guildId}))){
            if(limit){
                await GuildSettings.create({guildId: interaction.guildId, ticketSettings: {ticketLimit: limit}});
                return interaction.editReply({content: `Set the ticket limit to ${limit}.`});
            }
            await GuildSettings.create({guildId: interaction.guildId, ticketSettings: {ticketLimit: 1}});
            return interaction.editReply({embeds: [errorEmbed.setDescription("❌ No ticket limit found defaulting to 1")]});
        }
        console.log(limit)
        if (limit){
            settings.ticketSettings.ticketLimit = limit;
            await settings.save();
            return interaction.editReply({content: `Set the ticket limit to ${limit}.`})
        }
        if (!settings.ticketSettings.ticketLimit) return interaction.editReply({embeds: [errorEmbed.setDescription("❌ No ticket limit found.")]});
        return interaction.editReply({content: `Ticket limit: ${settings.ticketSettings.ticketLimit}`})

    }
}