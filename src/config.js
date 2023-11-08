import fs from 'fs';

// export const config = await Bun.file('../config.json').json(); // Bad file descriptor error
export const config = JSON.parse(fs.readFileSync('./config.json'));

export const getChannels = () => config.map(log => log.channel);