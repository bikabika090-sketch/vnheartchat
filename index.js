const { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes 
} = require("discord.js");

const config = require("./config.json");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
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

  await interaction.reply({
    content: text
  });
});

client.login(process.env.TOKEN);


// ===== Button + Modal Chat (no slash log) =====
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require('discord.js');

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isButton() && interaction.customId === 'open_chat_modal') {
      const modal = new ModalBuilder()
        .setCustomId('chat_modal')
        .setTitle('VNHEART Chat');

      const input = new TextInputBuilder()
        .setCustomId('chat_content')
        .setLabel('Nội dung')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);
      return interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'chat_modal') {
      const content = interaction.fields.getTextInputValue('chat_content');
      // TODO: xử lý nội dung chat ở đây (gọi AI / xử lý logic cũ)
      return interaction.reply({ content: `Đã nhận nội dung: ${content}`, ephemeral: true });
    }
  } catch (e) {
    console.error('Button/Modal error:', e);
  }
});
// ===== End Button + Modal Chat =====


// Gửi nút Chat vào kênh (chạy 1 lần khi bot online nếu muốn)
async function sendChatButton(channel) {
  const row = new (require('discord.js').ActionRowBuilder)().addComponents(
    new (require('discord.js').ButtonBuilder)()
      .setCustomId('open_chat_modal')
      .setLabel('Mở Chat')
      .setStyle((require('discord.js').ButtonStyle).Primary)
  );
  await channel.send({ content: 'Nhấn nút để chat:', components: [row] });
}
// Ví dụ: gọi sendChatButton(client.channels.cache.get('CHANNEL_ID'))
