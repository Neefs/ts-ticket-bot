import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import CustomClient from "../../../base/classes/CustomClient";
import SubCommand from "../../../base/classes/SubCommand";
import GuildSettings from "../../../base/schemas/GuildSettings";

export default class TicketSettingsSupportRoles extends SubCommand{
    constructor(client: CustomClient){
        super(client, {
            name: "ticketsettings.support-roles"
        })
    }

    async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const add = interaction.options.getRole("add");
        const remove = interaction.options.getRole("remove");
        
        const notFoundEmbed = new EmbedBuilder().setColor("Red").setDescription("❌ No support roles found.")
        await interaction.deferReply({ ephemeral: true });
        if (!(await GuildSettings.exists({guildId: interaction.guildId}))){
            if(add){
                await GuildSettings.create({guildId: interaction.guildId, ticketSettings: {supportRoles: [add.id]}});
                return interaction.editReply({content: `Added ${add} to the support roles.`});
            }
            return interaction.editReply({embeds: [notFoundEmbed]});
        }
        const settings = await GuildSettings.findOne({guildId: interaction.guildId});
        if (!settings) return interaction.editReply({embeds: [notFoundEmbed]});
      
        if (add){
            if (settings.ticketSettings.supportRoles.includes(add.id)) return interaction.editReply({content: "That role is already an support role."})
                settings.ticketSettings.supportRoles.push(add.id);
            await settings.save();
            return interaction.editReply({content: `Added ${add} to the support roles.`})
        }
        if (remove){
            if (!settings.ticketSettings.supportRoles.includes(remove.id)) return interaction.editReply({content: "That role is not an support role."})
                settings.ticketSettings.supportRoles = settings?.ticketSettings.supportRoles.filter(role => role !== remove.id);
            await settings.save();
            return interaction.editReply({content: `Removed ${remove} from the support roles.`})
        }
        if (!settings?.ticketSettings.supportRoles.length) return interaction.editReply({embeds: [notFoundEmbed]});
        return interaction.editReply({content: `Support roles: ${"<@&" + settings.ticketSettings.supportRoles.join(">, <@&")}>`})
        
    }
}