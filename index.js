require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/coaxnova-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
app.command("/coaxnova-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/coaxnova-ping - Check bot latency
/coaxnova-catfact - Get a cat fact`
  });
});
app.command("/coaxnova-catfact", async ({ ack, respond }) => {
    await ack();
    try {
        const response = await axios.get("https://catfact.ninja/fact");
        await respond({ text: `Cat Fact:\n${response.data.fact}` });
    } catch (err) {  
        await respond({ text: "Failed to fetch a cat fact." });
    } 
});

app.command("/coaxnova-intro", async ({ ack, respond }) => {
    await ack();
    try {
        await respond({
            response_type: 'in_channel',
            text: "🌟 Hello! I'm Coaxnova, your custom Slack assistant! 🤖"
        });
    } catch (error) {
        console.error('Error handling /coaxnova-intro command:', error);
    }
});

app.command("/coaxnova-joke", async ({ ack, respond }) => {
    await ack();
    try {
        await respond({
            text: "Why don't scientists trust atoms? Because they make up everything!"
        });
    } catch (err) {
        await respond({ text: "Failed to send a joke." });
    }
});

// Array of interesting space facts
const spaceFacts = [
  "One day on Venus is longer than one entire year on Venus.",
  "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons.",
  "Space is completely silent because there is no atmosphere for sound waves to travel through.",
  "Footprints left by astronauts on the Moon will probably stay there for at least 100 million years.",
  "The sun makes up 99.86% of all the mass in our entire solar system."
];

// Handle the /coaxnova-space command
app.command("/coaxnova-space", async ({ ack, respond }) => {
  await ack();
  try {
    // Pick a random fact from our array
    const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    
    await respond({
      text: `🌌 *Space Fact:* ${randomFact}`
    });
  } catch (error) {
    console.error('Error handling /coaxnova-space:', error);
    await respond({ text: "🚀 Failed to launch space fact. Try again later!" });
  }
});

// Start your app
(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡ CoaxNova Bolt app is running!');
})();
