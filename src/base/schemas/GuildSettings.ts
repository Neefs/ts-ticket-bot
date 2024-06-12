import { Schema, model } from "mongoose";

interface GuildSettings {
    guildId: string;
    ticketSettings: {
        enabled: boolean;
        categoryId: string;
        panelMessageId: string;
        adminRoles: string[];
        supportRoles: string[];
    }
}

export default model<GuildSettings>("GuildSettings", new Schema<GuildSettings>({
    guildId: String,
    ticketSettings: {
        enabled: Boolean,
        categoryId: String,
        panelMessageId: String,
        adminRoles: [String],
        supportRoles: [String],
    }
}, {
    timestamps: true
}))