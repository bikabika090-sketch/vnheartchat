const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`🤖 Bot ${config.botName} da online!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === "chat") {
    if (!message.member.roles.cache.has(config.allowedRoleId)) {
      return message.reply("❌ Bạn không có quyền dùng lệnh này.");
    }

    const content = args.join(" ");
    if (!content) {
      return message.reply("❗ Dùng: /chat <nội dung>");
    }

    await message.delete().catch(() => {});

    message.channel.send({
      content: content
    });
  }
});

client.login(process.env.TOKEN);
