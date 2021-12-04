module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity('/help', { type: 'PLAYING' });
		console.log('server date n time:', new Date().toString())
	},
};
