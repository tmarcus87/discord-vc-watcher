const Discord = require('discord.js');
const client = new Discord.Client();

const token = process.env.TOKEN || '';

let sendMessage = (c, m) => {
	console.log(`[ERROR][NotReady] Failed to send message(${m}) to channel(${c})`);
}

let getChannelById = (id) => {
	console.log(`[ERROR][NotReady] Failed to get channel(${id})`);
}

client.on('ready', () => {
	console.log("Ready!");
	console.log("CHANNEL", client)
	console.log("USER", client.users.cache)
	console.log("CHANNEL", client.channels.cache)
	sendMessage = (c, m) => {
		client.channels.cache.forEach(channel => {
			if (channel.type === 'text' && channel.name === c) {
				channel.send(m)
			}
		})
	};
});

client.on('voiceStateUpdate', (oldState, newState) => {
	console.log('voiceStateUpdate');
	console.log("OLD", oldState);
	console.log("NEW", newState);

	if (oldState.channelID === newState.channelID) {
		if (!oldState.streaming && newState.streaming) {
			console.log("Start streaming")
			const c = client.channels.cache.get(newState.channelID)
			sendMessage('activity', `:movie_camera: ${ client.users.cache.get(c.guild.ownerID).username } が配信を開始しました`)
		} else if (oldState.streaming && !newState.streaming) {
			const c = client.channels.cache.get(newState.channelID)
			sendMessage('activity', `:stop_button: ${ client.users.cache.get(c.guild.ownerID).username } が配信を終了しました`)
		}
	} else {
		if (newState.channelID !== null) {
			// Join
			const c = client.channels.cache.get(newState.channelID)
			sendMessage('activity', `:microphone2: ${ client.users.cache.get(c.guild.ownerID).username } が ボイスチャンネル(${c.name}) に参加しました`)
		} else {
			// Leave
			const c = client.channels.cache.get(oldState.channelID)
			sendMessage('activity', `:wave: ${ client.users.cache.get(c.guild.ownerID).username } が ボイスチャンネル(${c.name}) を退室しました`)
		}
	}
})

client.on('presenceUpdate', (member, oldPresence) => {
	console.log('presenceUpdate');
	console.log({member: member, oldPresence: oldPresence});
})

client.login(token);
