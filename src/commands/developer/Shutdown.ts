import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Shutdown extends Command {
    constructor(client: CustomClient){
        super(client, {
            name: "shutdown",
            description: "Shutdown the bot",
            category: Category.Developer,
            default_member_permissions: PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 0,
            dev: true,
            options: []
        })
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: "Shutting down...", ephemeral: true });
        console.log("Shutting down from shutdown command...");
        process.exit(0);
    }
}