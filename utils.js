const fs = require('fs');

const validateConfig = (config, rules) => {
	const error = (message) => {
		console.error(`Configuration error: ${message}`);
		process.exit(1);		
	};
	Object.keys(config).forEach(key => {
		if (!(key in rules)) {
			error(`Illegal key, ${key}, in config.`);
		}
	});
	Object.keys(rules).forEach(key => {
		rules[key].forEach(rule => {
			const message = rule(config[key]);
			if (message) {
				error(message);
			}
		});
	});
} ;

const readConfig = (path, validation) => {
	let config;
	try {
		config = JSON.parse(fs.readFileSync(path));
		validateConfig(config, validation);
	} catch (e) {
		if (e instanceof SyntaxError) {
			console.log('Invalid syntax');
			process.exit(1);
		} else {
			throw e;
		}
	}
	return config;
};

const removeConfig = (path) => {
	if (fs.existsSync(path)) {
		fs.unlinkSync(path);
	}
};

const writeConfig = (path, config) => {
	fs.writeFileSync(path, JSON.stringify(config));	
};

const showHelp = () => {
	console.log(`
pw - a super simple password generating wizard.

By default it will bring up a wizard to generate a password and then will display said generated password.

The wizard contains two questions:
	Character Types: The types of characters that make up the password. Choices are: uppercase, lowercase, numbers, and symbols.
	Length: The length of the password

Options:
	--help\tBrings up this display
	--config\tSave options as new defaults
	--reset\tRestore original defaults
	--version\tDisplays the current version
`);
};

module.exports = { readConfig, removeConfig, showHelp, validateConfig, writeConfig };
