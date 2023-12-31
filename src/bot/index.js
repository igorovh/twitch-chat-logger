import tmi from 'tmi.js';
import { getChannels } from '../config';
import { addToQueue } from '../discord/queue';

const channels = getChannels();
export const client = new tmi.Client({
	channels: channels,
});
client.connect();
console.info('Bot has connected to', channels.join(', '), '.');

client.on('message', (channel, tags, message) => {
	addToQueue(channel.replace('#', ''), {
		id: message.id,
		date: Date.now(),
		username: tags['display-name'],
		content: message,
	});
});

export const joinChannel = (channel) => {
	client.join(channel);
	console.info('Joined new channel:', channel);
};
