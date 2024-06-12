import { Events, Guild } from "discord.js";
import Event from "../../base/classes/Event";
import CustomClient from "../../base/classes/CustomClient";
import GuildSettings from "../../base/schemas/GuildSettings";

export default class GuildCreate extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.GuildCreate,
            description: "GuildJoin event",
            once: false
        })
    }


    async Execute(guild: Guild){
        try {
            if (await GuildSettings.exists({ guildId: guild.id })) return;
            await GuildSettings.create({ guildId: guild.id });
        } catch (err){
            console.error(err);
        }
    }
}