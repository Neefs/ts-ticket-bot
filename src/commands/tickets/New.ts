import { PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

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
}