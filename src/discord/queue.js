import { config } from '../config';
import { Webhook } from 'discord-webhook-node';

const queues = {};
const channels = {};

export const addChannel = (channel, webhook) => {
	channels[channel] = new Webhook(webhook);
	queues[channel] = [];
	console.info('Registered new channel:', channel);
};

config.forEach((channel) => addChannel(channel.channel, channel.webhook));

export const addToQueue = (channel, message) => queues[channel].push(message);

const CHARACTERS_MAX = 1900;
setInterval(() => {
	Object.keys(queues).forEach((channel) => {
		let builder = '';
		const queue = queues[channel];

		const sentMessagesIds = [];
		for (let i = 0; i < queue.length; i++) {
			const message = queue[i];
			const formattedMessage = `${new Date(message.date).toLocaleString('pl-PL')} | ${message.username}: ${
				message.content
			}`;
			if (builder.length + formattedMessage.length <= CHARACTERS_MAX) {
				builder += formattedMessage + '\n';
				sentMessagesIds.push(message.id);
			} else break;
		}
		queues[channel] = queue.filter((message) => !sentMessagesIds.includes(message.id));

		if (builder.length > 0) {
			const webhook = channels[channel];
			//webhook.send(`\`\`\`${builder}\`\`\``);
			console.log(builder);
		}
	});
}, 2000);
