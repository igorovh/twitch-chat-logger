import readline from 'readline';
import { addChannel } from './discord/queue';
import { addChannelToConfig, getChannels } from './config';
import { joinChannel } from './bot';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const commands = {
	help: () => {
		console.info(`* add <channel> <webhook> - to add channel to logger system.
* list - view all added channels.`);
	},
	add: (args) => {
		if (args.length < 2) {
			console.warn('Wrong arguments. Use "add <channel> <webhook>".');
			return;
		}
		const username = args[0];
		const webhook = args[1];
		addChannel(username, webhook);
		addChannelToConfig(username, webhook);
		joinChannel(username);
	},
	list: () => {
		console.info(`Channels:\n ${getChannels().join(', ')}.`);
	},
	// quit: () => {
	// 	process.quit();
	// },
};

console.info('Type "help" for more informations.');
const waitForInput = () => {
	rl.question('> ', (args) => {
		if (args.length > 0) {
			args = args.split(' ');
			let command = args.shift();
			command = commands[command];
			if (command) command(args);
		}
		waitForInput();
	});
};
waitForInput();
