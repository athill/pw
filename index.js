const fs = require('fs');
const inquirer = require('inquirer');

const  {
	pw,
	LOWERCASE,
	NUMBERS,
	SYMBOLS,
	UPPERCASE,
	VALID_TYPE_CHOICES
} = require('./pw');

const { readConfig, removeConfig, showHelp, writeConfig } = require('./utils');

// defaults
const DEFAULT_TYPE_CHOICES = [UPPERCASE, LOWERCASE, NUMBERS];
const DEFAULT_LENGTH = 40;

// config path
const CONFIG_PATH = './.config.json';

let hasWizard = true;

//// arguments
const args = {
	'--save': (configPath, config) => {
		writeConfig(configPath, config);
	},
	'--help': () => {
		showHelp();
		process.exit(0);
	},
	'--reset': (configPath) => {
		removeConfig(configPath);
	},
	'--version': () => {
		const pkg = require('./package.json');
		console.log(pkg.version);
		process.exit(0);
	},
	'--cli': () => {
		hasWizard = false;
	}
};

// validate arguments
process.argv.slice(2).forEach(arg => {
	if (!(arg in args)) {
		console.error(`Invalid argument ${arg}.`);
		console.log('Use `pw --help` for help.');
		process.exit(1);
	}
});

// helper
const arg = (arg, ...others) => {
	if (process.argv.includes(arg)) {
		args[arg](...others);
	}
};

// help display
arg('--help');

// version
arg('--version');

// skip wizard
arg('--cli');

//config
const configValidation = {
	'types': [
		value => !value && '`types` is required.',
		value => !Array.isArray(value) && '`types` must be an array.',
		values => {
			for (let i = 0; i < values.length; i++) {
				const value = values[i];
				return !VALID_TYPE_CHOICES.includes(value) &&
					`\`types\` value ${value} is not valid. Valid values are ${VALID_TYPE_CHOICES.join(', ')}`;
			}
		}
	],
	'length': [
		value => !value && '`length` is required.' ,
		value => (!Number.isInteger(parseInt(value)) || value <= 0) && '`length` must be an non-negative integer.'
	]
};

let config = {
	types: DEFAULT_TYPE_CHOICES,
	length: DEFAULT_LENGTH
};

arg('--reset', CONFIG_PATH);

// load config
if (fs.existsSync(CONFIG_PATH)) {
	config = readConfig(CONFIG_PATH, configValidation);
} else {
	console.log('No config file found. Run `pw --config` to update prefernces.');
}

// wizard
const promt =  () => inquirer.prompt([
	{
		type: 'checkbox',
		message: `Character types (default is ${config.types.join(', ')})`,
		name: 'types',
		default: config.types,
		choices: VALID_TYPE_CHOICES
	},
	{
		type: 'input',
		message: 'Length',
		name: 'length',
		default: config.length,
		validate: input => /^\d*$/.test(input)
	}
]);


// main
if (hasWizard) {
	const prompt = promt();
	prompt.then(answer => {
		arg('--save', CONFIG_PATH, answer);
		console.log(pw(answer.types, answer.length));
	});
} else {
	console.log(pw(DEFAULT_TYPE_CHOICES, DEFAULT_LENGTH));
}
