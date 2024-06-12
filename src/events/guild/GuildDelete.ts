import { Events, Guild } from "discord.js";
import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import GuildSettings from "../../base/schemas/GuildSettings";

export default class GuildDelete extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildDelete,
            description: "GuildDelete event",
            once: false
        })
    }

    async Execute(guild: Guild) {
        console.log(`Left guild: ${guild.name}`);
        try {
            await GuildSettings.deleteOne({ guildId: guild.id });
        } catch (err) {
            console.error(err);
        }
    }
}