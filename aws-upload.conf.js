module.exports = {
	credentials: 'aws-credentials.json',
	bucketName: 'jurnie.com',
	patterns: [
		'index.html',
		'**/*.js',
		'**/*.html',
		'**/*.css',
		'assets/*.*',
		'assets/favicon/*.*',
		'node_modules/**/*.*'
	]
};
