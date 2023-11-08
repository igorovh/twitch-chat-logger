import { config } from '../config';
import { Webhook } from 'discord-webhook-node';

const queues = {};
const channels = {};

config.forEach(channel => {
    channels[channel.channel] = new Webhook(channel.webhook);
    queues[channel.channel] = [];
});

export const addToQueue = (channel, message) => queues[channel].push(message);

const CHARACTERS_MAX = 1900;
setInterval(() => {
    Object.keys(queues).forEach(channel => {
        let builder = '';
        const queue = queues[channel];

        const sentMessagesIds = [];
        for(let i = 0; i < queue.length; i++) {
            const message = queue[i];
            const formattedMessage = `${new Date(message.date).toLocaleString()} | ${message.username}: ${message.content}`
            if(builder.length + formattedMessage.length <= CHARACTERS_MAX) {
                builder += formattedMessage + '\n';
                sentMessagesIds.push(message.id);
            } else break;
        }
        queues[channel] = queue.filter(message => !sentMessagesIds.includes(message.id));

        if(builder.length > 0) {
            const webhook = channels[channel];
            webhook.send(`\`\`\`${builder}\`\`\``);
            console.info(`Sent ${sentMessagesIds.length} messages to ${channel} logger.`);
        }
    })
}, 2000);