import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../../base/classes/Command";
import CustomClient from "../../../base/classes/CustomClient";
import Category from "../../../base/enums/Category";

export default class TicketSettings extends Command {
    constructor(client:CustomClient){
        super(client, {
            name:"ticketsettings",
            description: "View or change the settings for the current guild",
            category: Category.Tickets,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            cooldown: 3,
            dm_permission: false,
            dev: false,
            options: [
                {
                    name: "admin-roles",
                    description: "The roles that can manage tickets",
                    type: ApplicationCommandOptionType.Subcommand,
                    options:[
                        {
                            name: "add",
                            description: "Add a role to the admin roles",
                            type: ApplicationCommandOptionType.Role,
                            required: false
                        },
                        {
                            name: "remove",
                            description: "Remove a role from the admin roles",
                            type: ApplicationCommandOptionType.Role,
                            required: false
                        }
                    ]
                },
                {
                    name: "support-roles",
                    description: "The roles that can view tickets",
                    type: ApplicationCommandOptionType.Subcommand,
                    options:[
                        {
                            name: "add",
                            description: "Add a role to the support roles",
                            type: ApplicationCommandOptionType.Role,
                            required: false
                        },
                        {
                            name: "remove",
                            description: "Remove a role from the support roles",
                            type: ApplicationCommandOptionType.Role,
                            required: false
                        }
                    ]
                },
                {
                    name: "ticket-category",
                    description: "The category where tickets will be created",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "category",
                            description: "The category where tickets will be created",
                            type: ApplicationCommandOptionType.Channel,
                            required: false
                        }
                    ]
                },
                {
                    name: "toggle", 
                    description: "Enable or disable the ticket system",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "value",
                            description: "The value to set",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true
                        }
                    ]
                },
                {
                    name: "ticket-limit",
                    description: "Set the ticket limit",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "value",
                            description: "The value to set",
                            type: ApplicationCommandOptionType.Integer,
                            required: false
                        }
                    ]
                }
            ]         
        })
    }
}