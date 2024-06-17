import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Ticket from "../../base/schemas/Ticket";
import Category from "../../base/enums/Category";
import TicketStates from "../../base/enums/TicketStates";

export default class Close extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "close",
            description: "Close a ticket",
            category: Category.Tickets,
            dm_permission: false,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 5,
            dev: false, 
            options: []
        })
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const errorEmbed = new EmbedBuilder().setColor("Red").setTitle("Error");
        if (!(await Ticket.exists({ channelId: interaction.channelId }))) {
            return await interaction.editReply({ embeds: [errorEmbed.setDescription("This is not a ticket channel")]});
        }
        const ticket = await Ticket.findOne({ channelId: interaction.channelId });
        if (!ticket) { return await interaction.editReply({ embeds: [errorEmbed.setDescription("This is not a ticket channel")] });}
        if (ticket.state === TicketStates.Closed) {
            return await interaction.editReply({ embeds: [errorEmbed.setDescription("This ticket is already closed")] });
        }
        const ticketOwner = await this.client.users.fetch(ticket.creatorId as string);

        try {
            await ticketOwner.send({ embeds: [new EmbedBuilder().setColor("Gold").setTitle("Ticket Closed").setDescription("Your ticket has been closed. If you need further assistance, feel free to open a new ticket.")] });
        } catch{}

        const rawButtons = [
            new ButtonBuilder()
                .setCustomId("view-transcript")
                .setLabel("View Transcript")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("archive")
                .setLabel("Archive")
                .setStyle(ButtonStyle.Danger),
            
        ]
        const buttons: any = new ActionRowBuilder().addComponents(...rawButtons);

        ticket.state = TicketStates.Closed;
        await ticket.save();
        
        await interaction.editReply("Ticket closed successfully")

        await interaction.channel?.send({
            embeds: [new EmbedBuilder().setColor("Gold").setTitle("Ticket Closed").setDescription("This ticket has been closed. What would you like to do next?")],
            components: [buttons]
        });
    }
}