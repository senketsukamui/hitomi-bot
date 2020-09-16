require("dotenv").config();

const token = process.env.DB_TOKEN;

const Discord = require("discord.js");

const Danbooru = require("danbooru");

const client = new Discord.Client();

const booru = new Danbooru();

const prefix = "!";

let interval = null;

const tags = "azur_lane";

const channelId = "755514265355681879";

client.on("ready", () => {
  interval = setInterval(() => {
    sendPost(tags);
  }, 900 * 1000);
});

const sendPost = (tagsString) => {
  booru
    .posts({ tags: tagsString, limit: 1, random: true })
    .then((posts) => {
      const img = posts[0];
      const channel = client.channels.cache.get(channelId);
      const attachment = new Discord.MessageAttachment(img.large_file_url);
      channel.send(img.tag_string_character, attachment);
    })
    .catch((error) => {
      console.log(error);
    });
};

const changeGlobalTags = (newTags) => {
  tags = newTags;
};

client.on("message", (msg) => {
  if (!msg.content.startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  if (command === "interval") {
    clearInterval(interval);
    interal = setInterval(() => {
      sendPost(tags);
    }, args[1] * 1000);
  }
  if (command === "send") {
    sendPost(args.join(" "));
  }
});

client.login(token);