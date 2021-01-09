const Discord = require('discord.js');
const client = new Discord.Client();

const guildID = process.env.DVCW_GUILD_ID || '';
const token = process.env.DVCW_TOKEN || '';
const notifyChannel = process.env.DVCW_CHANNEL || '';

if (!guildID) {
	console.log("DVCW_GUILD_ID is empty.")
	process.exit(1)
}

if (!token) {
	console.log("DVCW_TOKEN is empty.")
	process.exit(1)
}

if (!notifyChannel) {
	console.log("DVCW_CHANNEL is empty.")
	process.exit(1)
}

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
			if (channel.guild.id == guildID && channel.type === 'text' && channel.name === c) {
				channel.send(m)
			}
		})
	};
});

client.on('voiceStateUpdate', (oldState, newState) => {
	console.log('voiceStateUpdate');
	console.log("OLD", oldState);
	console.log("NEW", newState);

	if (newState.guild.id !== guildID) {
		return
	}

	if (oldState.channelID === newState.channelID) {
		if (!oldState.streaming && newState.streaming) {
			console.log("Start streaming")
			const c = client.channels.cache.get(newState.channelID)
			const u = client.users.cache.get(newState.id)
			sendMessage(notifyChannel, `:movie_camera: ${ u.username } が配信を開始しました`)
		} else if (oldState.streaming && !newState.streaming) {
			const c = client.channels.cache.get(newState.channelID)
			const u = client.users.cache.get(newState.id)
			sendMessage(notifyChannel, `:stop_button: ${ u.username } が配信を終了しました`)
		}
	} else {
		if (newState.channelID !== null) {
			// Join
			const c = client.channels.cache.get(newState.channelID)
			const u = client.users.cache.get(newState.id)
			sendMessage(notifyChannel, `:microphone2: ${ u.username } が ボイスチャンネル(${c.name}) に参加しました`)
		} else {
			// Leave
			const c = client.channels.cache.get(oldState.channelID)
			const u = client.users.cache.get(newState.id)
			sendMessage(notifyChannel, `:wave: ${ u.username } が ボイスチャンネル(${c.name}) を退室しました`)
		}
	}
})

client.on('presenceUpdate', (member, oldPresence) => {
	console.log('presenceUpdate');
	console.log({member: member, oldPresence: oldPresence});
})

client.login(token);
