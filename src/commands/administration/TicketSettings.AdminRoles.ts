import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildSettings from "../../base/schemas/GuildSettings";

export default class TicketSettingsAdminRoles extends SubCommand{
    constructor(client: CustomClient){
        super(client, {
            name: "ticketsettings.admin-roles"
        })
    }

    async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const add = interaction.options.getRole("add");
        const remove = interaction.options.getRole("remove");
        
        const notFoundEmbed = new EmbedBuilder().setColor("Red").setDescription("❌ No admin roles found.")
        await interaction.deferReply({ ephemeral: true });
        if (!(await GuildSettings.exists({guildId: interaction.guildId}))){
            if(add){
                await GuildSettings.create({guildId: interaction.guildId, ticketSettings: {adminRoles: [add.id]}});
                return interaction.editReply({content: `Added ${add} to the support roles.`});
            }
            await GuildSettings.create({guildId: interaction.guildId});
            return interaction.editReply({embeds: [notFoundEmbed]});
        }
        const settings = await GuildSettings.findOne({guildId: interaction.guildId});
        if (!settings) return interaction.editReply({embeds: [notFoundEmbed]});
      
        if (add){
            if (settings.ticketSettings.adminRoles.includes(add.id)) return interaction.editReply({content: "That role is already an admin role."})
                settings.ticketSettings.adminRoles.push(add.id);
            await settings.save();
            return interaction.editReply({content: `Added ${add} to the admin roles.`})
        }
        if (remove){
            if (!settings.ticketSettings.adminRoles.includes(remove.id)) return interaction.editReply({content: "That role is not an admin role."})
                settings.ticketSettings.adminRoles = settings?.ticketSettings.adminRoles.filter(role => role !== remove.id);
            await settings.save();
            return interaction.editReply({content: `Removed ${remove} from the admin roles.`})
        }
        if (!settings?.ticketSettings.adminRoles.length) return interaction.editReply({embeds: [notFoundEmbed]});
        return interaction.editReply({content: `Admin roles: ${"<@&" + settings.ticketSettings.adminRoles.join(">, <@&")}>`})
        
    }
}