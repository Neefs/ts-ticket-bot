import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildSettings from "../../base/schemas/GuildSettings";
import Ticket from "../../base/schemas/Ticket";
import TicketStates from "../../base/enums/TicketStates";

export default class New extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "new",
            description: "Create a new ticket",
            category: Category.Tickets,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 10,
            dev: false,
            options: []
        })
    }

    async Execute(interaction: ChatInputCommandInteraction){
        await interaction.deferReply({ephemeral: true});
        if (!interaction.guild) return;
        const errorEmbed = new EmbedBuilder().setColor("Red").setTitle("Error");
        const settings = await GuildSettings.findOne({guildId: interaction.guildId});
        if (!settings || !(await GuildSettings.exists({guildId: interaction.guildId}))){
            return interaction.editReply({embeds: [errorEmbed.setDescription("❌ Tell the server administrator to set up the ticket system first")]})
        }
        if (!settings.ticketSettings.enabled){
            return interaction.editReply({embeds: [errorEmbed.setDescription("❌ The ticket system is disabled")]})
        }
        const categoryId = settings.ticketSettings.categoryId;
        if (!categoryId){
            return interaction.editReply({embeds: [errorEmbed.setDescription("❌ The ticket category is not set")]})
        }
        const category = interaction.guild.channels.cache.get(categoryId);
        let supportRoles = [], adminRoles = [];
        for(const role of settings.ticketSettings.supportRoles){
            const r = interaction.guild.roles.cache.get(role);
            if (r) supportRoles.push(r);
        }
        for(const role of settings.ticketSettings.adminRoles){
            const r = interaction.guild.roles.cache.get(role);
            if (r) adminRoles.push(r);
        }
        const ticket = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: category?.id,
        })
        let overwrites = [
            {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            },
            {
                id: interaction.guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel]
            },
        ]
        for (const role of supportRoles){
            overwrites.push({
                id: role.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            })
        }
        for (const role of adminRoles){
            overwrites.push({
                id: role.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            })
        }
        await ticket.permissionOverwrites.set(overwrites);
        
        await Ticket.create({
            guildId: interaction.guildId,
            channelId: ticket.id,
            creatorId: interaction.user.id,
            state: TicketStates.Open
        
        })

        await interaction.editReply({embeds: [new EmbedBuilder().setColor("Green").setTitle("Success").setDescription(`✅ Ticket created at ${ticket}`)]})
        await ticket.send({
            content: interaction.user.toString(),
            embeds: [new EmbedBuilder().setColor("Green").setTitle("Ticket").setDescription("Thank you for creating a ticket. An admin will be with you shortly")]
        })
        

    }
}