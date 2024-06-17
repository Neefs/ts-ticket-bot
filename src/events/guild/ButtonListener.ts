import { ButtonInteraction, Events } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class ButtonListener extends Event {
    constructor(client: CustomClient){
        super(client, {
            name: Events.InteractionCreate,
            description: "Button Listener Event",
            once: false
        })
    }

    async Execute(interaction: ButtonInteraction){
        if (!interaction.isButton()) return;
        const buttonId = interaction.customId;
        if (buttonId === "view-transcript") {
            await interaction.reply({content: "Not currently supported. If this is a feature you would like make a feature request.", ephemeral: true })
        } else if (buttonId === "archive") {
            await interaction.reply({content: "Not implemented yet", ephemeral: true })
        }
        
    }
}