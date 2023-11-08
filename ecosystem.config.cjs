/* eslint-disable no-undef */
module.exports = {
	apps: [
		{
			name: 'SKCT_Graduation', // Name of your application
			script: 'index.js',
			instances: 1, // Number of instances to be started
			autorestart: true, // Restart the application automatically if it crashes
			watch: false, // Watch for file changes and restart the application
			max_memory_restart: '1G', // Restart the application if it uses more than 1GB of memory
			env: {
				NODE_ENV: 'production',
				PORT: 80,
			},
		},
	],
};
