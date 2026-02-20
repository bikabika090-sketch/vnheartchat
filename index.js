const { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes 
} = require("discord.js");

const config = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const command = new SlashCommandBuilder()
  .setName("chat")
  .setDescription("Bot vnheart chat nhu nguoi")
  .addStringOption(option =>
    option
      .setName("noidung")
      .setDescription("Noi dung muon bot gui")
      .setRequired(true)
  );

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [command.toJSON()] }
    );
    console.log("✅ Slash command /chat da dang ky");
  } catch (err) {
    console.error(err);
  }
})();

client.once("ready", () => {
  console.log(`🤖 Bot ${config.botName} da online!`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "chat") return;

  if (!interaction.member.roles.cache.has(config.allowedRoleId)) {
    return interaction.reply({ 
      content: "❌ Ban khong co quyen", 
      ephemeral: true 
    });
  }

  const text = interaction.options.getString("noidung");

  await interaction.deferReply({ ephemeral: true });
  await interaction.deleteReply();
  await interaction.channel.send(text);
});

client.login(process.env.TOKEN);
