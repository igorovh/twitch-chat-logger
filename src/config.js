export const config = await Bun.file('./config.json').json();

export const getChannels = () => config.map(log => log.channel);