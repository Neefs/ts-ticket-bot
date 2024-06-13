import { Schema, model } from "mongoose";

interface Ticket {
    guildId: string;
    channelId: string;
    creatorId: string;
    claimedId: string;
    state: string;
    users: string[];
}

export default model<Ticket>("Ticket", new Schema<Ticket>({
    guildId: String,
    channelId: String,
    creatorId: String,
    claimedId: String,
    state: String,
    users: [String],
}, {
    timestamps: true
}))