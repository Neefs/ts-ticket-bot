import { Channel, Events, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Ticket from "../../base/schemas/Ticket";
import TicketStates from "../../base/enums/TicketStates";

export default class TicektDelete extends Event{
    constructor(client: CustomClient){
        super(client, {
            name: Events.ChannelDelete,
            description: "Ticket Delete Event",
            once: false
        })
    }

    async Execute(channel: Channel){
        if (!(channel instanceof TextChannel)) return;
        if (!(await Ticket.exists({ channelId: channel.id }))) return;
        await Ticket.updateOne({ channelId: channel.id }, { state: TicketStates.Archived });
    }
}