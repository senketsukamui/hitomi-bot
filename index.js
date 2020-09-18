const token = process.env.BOT_TOKEN;

const Discord = require("discord.js");

const Danbooru = require("danbooru");

const client = new Discord.Client();

const booru = new Danbooru();

const prefix = "!";

let interval = null;

let seconds = 900;

const sendPost = (tagsString, channel) => {
  booru
    .posts({ tags: tagsString, limit: 1, random: true })
    .then((posts) => {
      const img = posts[0];
      const attachment = new Discord.Attachment(img.large_file_url);
      channel.send(img.tag_string_character, attachment);
    })
    .catch((error) => {
      console.log(error);
      channel.send(`Произошла ошибка ${error.code}`);
    });
};

client.on("message", (msg) => {
  if (!msg.content.startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  const currentChannel = msg.channel;
  if (command === "start") {
    const tags = "azur_lane";
    currentChannel.send(`Начинаю с тегами ${tags}`);
    interval = setInterval(() => {
      sendPost(tags, currentChannel);
    }, seconds * 1000);
  }

  if (command === "change") {
    const tags = args.join(" ");
    currentChannel.send(`Теги изменены на ${tags}`);
    clearInterval(interval);
    interval = setInterval(() => {
      sendPost(tags, currentChannel);
    }, seconds * 1000);
  }

  if (command === "interval") {
    clearInterval(interval);
    interal = setInterval(() => {
      sendPost(tags, currentChannel);
    }, args[1] * 1000);
  }
  if (command === "send") {
    sendPost(args.join(" "), currentChannel);
  }
});

client.login(token);
