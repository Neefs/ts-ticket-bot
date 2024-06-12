import { ChannelType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildSettings from "../../base/schemas/GuildSettings";

export default class TicketCategory extends SubCommand {
    constructor(client: CustomClient){
        super(client, {
            name: "ticketsettings.ticket-category"
        })
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const category = interaction.options.getChannel("category");
        const errorEmbed = new EmbedBuilder().setColor("Red");
        await interaction.deferReply({ ephemeral: true });
        if (category && category.type !== ChannelType.GuildCategory) {interaction.editReply({embeds: [errorEmbed.setDescription("❌ Please provide a valid category.")]})}
        if (!(await GuildSettings.exists({guildId: interaction.guildId}))){
            if(category){
                await GuildSettings.create({guildId: interaction.guildId, ticketSettings: {categoryId: category.id}});
                return interaction.editReply({content: `Set the ticket category to ${category}.`});
            }
            return interaction.editReply({embeds: [errorEmbed.setDescription("❌ No ticket category found.")]});
        }
        const settings = await GuildSettings.findOne({guildId: interaction.guildId});
        if (!settings) return interaction.editReply({embeds: [errorEmbed.setDescription("❌ No settings found.")]});
        if (category){
            settings.ticketSettings.categoryId = category.id;
            await settings.save();
            return interaction.editReply({content: `Set the ticket category to ${category}.`})
        }
        if (!settings.ticketSettings.categoryId) return interaction.editReply({embeds: [errorEmbed.setDescription("❌ No ticket category found.")]});
        return interaction.editReply({content: `Ticket category: ${"<#" + settings.ticketSettings.categoryId + ">"}`})
    }
}