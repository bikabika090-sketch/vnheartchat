
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

require("dotenv").config();
const config = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
  .setName("chat")
  .setDescription("Mo menu de nhap noi dung chat");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [command.toJSON()] }
    );
    console.log("Slash command /chat da dang ky");
  } catch (err) {
    console.error(err);
  }
})();

client.once("ready", () => {
  console.log(`Bot ${config.botName} da online!`);
});

client.on("interactionCreate", async interaction => {

  if (interaction.isChatInputCommand() && interaction.commandName === "chat") {

    if (!interaction.member.roles.cache.has(config.allowedRoleId)) {
      return interaction.reply({
        content: "Ban khong co quyen",
        ephemeral: true
      });
    }

    const modal = new ModalBuilder()
      .setCustomId("chatModal")
      .setTitle("Nhap noi dung muon gui");

    const input = new TextInputBuilder()
      .setCustomId("chatInput")
      .setLabel("Noi dung")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === "chatModal") {

    const text = interaction.fields.getTextInputValue("chatInput");

    await interaction.reply({
      content: text
    });
  }

});

client.login(process.env.TOKEN);
