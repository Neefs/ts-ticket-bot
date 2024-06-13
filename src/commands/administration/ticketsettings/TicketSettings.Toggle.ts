import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import SubCommand from "../../../base/classes/SubCommand";
import GuildSettings from "../../../base/schemas/GuildSettings";

export default class Toggle extends SubCommand{
    constructor(client:CustomClient){
        super(client, {
            name: "ticketsettings.toggle",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction){
        await interaction.deferReply({ephemeral: true})
        const value = interaction.options.getBoolean("value", true);
        const embed = new EmbedBuilder().setColor(value ? "Green" : "Red").setTitle("Ticket Settings").setDescription(`Ticket system has been ${value ? "enabled" : "disabled"}`)

        if (!(GuildSettings.exists({guildId: interaction.guildId}))){
            await GuildSettings.create({guildId: interaction.guildId, ticketSettings: {enabled: value}})
            return interaction.editReply({embeds: [embed]})

        }
        const settings = await GuildSettings.findOne({guildId: interaction.guildId});
        if(!settings) return interaction.editReply({embeds: [new EmbedBuilder().setColor("Red").setTitle("Error").setDescription("❌ An error occurred while trying to fetch the settings")]})
        settings.ticketSettings.enabled = value;
        await settings.save();
        return interaction.editReply({embeds: [embed]})
    }
}