const fs = require('fs');
const inquirer = require('inquirer');

// constants
//// type choices
const UPPERCASE = 'uppercase',
	LOWERCASE= 'lowercase',
	NUMBERS = 'numbers',
	SYMBOLS = 'symbols';
const VALID_TYPE_CHOICES = [ UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS ];
const DEFAULT_TYPE_CHOICES = [UPPERCASE, LOWERCASE, NUMBERS];

// length
const DEFAULT_LENGTH = 20;

// config path
const CONFIG_PATH = './.config.json';

// validate arguments at some point

// help display
if (process.argv.includes('--help')) {
	console.log(`
pw - a super simple password generating wizard.

By default it will bring up a wizard to generate a password and then will display said generated password.

The wizard contains two questions:
	Character Types: The types of characters that make up the password. Choices are: uppercase, lowercase, numbers, and symbols.
	Length: The length of the password

Options:
	--help\tBrings up this display
`);
	process.exit(0);
}


//config
let config = {
	types: DEFAULT_TYPE_CHOICES,
	length: DEFAULT_LENGTH
};

if (fs.existsSync(CONFIG_PATH)) {
	try {
		const obj = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
		console.log('um', obj);
	} catch (e) {
		if (e instanceof SyntaxError) {
			console.log('Invalid syntax');
		} else {
			throw e;
		}
	}
	
} else {
	console.log('No config file found. Run `pw --config to update prefernces`.');	
}

if (process.argv.includes('--config')) {
	
	process.exit(0);
}

const promt = async () => inquirer.prompt([
	{
		type: 'checkbox',
		message: `Character types (default is ${DEFAULT_TYPE_CHOICES.join(', ')})`,
		name: 'types',
		default: DEFAULT_TYPE_CHOICES,
		choices: VALID_TYPE_CHOICES	
	},
	{
		type: 'input',
		message: 'Length',
		name: 'length',
		default: DEFAULT_LENGTH,
		validate: input => /^\d*$/.test(input)
	}

]);

const prompt = promt();
prompt.then(answer => {
	const charsTypes = {
		[UPPERCASE]: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
		[LOWERCASE]: 'abcdefghijklmnopqrstuvwxyz'.split(''),
		[NUMBERS]: '0123456789'.split(''),
		[SYMBOLS]: '~`!@#$%^&*()-_=+{}[]|\\:;"\'<>,.?/'.split('')
	};
	let valid = [];
	answer.types.forEach(type => {
		valid = valid.concat(charsTypes[type]);	
	});
	let pw = '';
	for (let i = 0; i < answer.length; i++) {
		const index = Math.floor(Math.random() * valid.length);
		pw += valid[index];
	}
	console.log(pw);
});