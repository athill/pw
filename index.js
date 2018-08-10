const inquirer = require('inquirer');

const UPPERCASE = 'uppercase',
	LOWERCASE= 'lowercase',
	NUMBERS = 'numbers',
	SYMBOLS = 'symbols';

const VALID_TYPE_CHOICES = [ UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS ];
const DEFAULT_TYPE_CHOICES = [UPPERCASE, LOWERCASE, NUMBERS];

inquirer.prompt([
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
		default: 20,
		validate: input => /^\d*$/.test(input)
	}

]).then(answer => {
	const charsTypes = {
		const chars = 
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
		const index = Math.floor(Math.random() * Math.floor(valid.length));
		pw += valid[index];
	}
	console.log(pw);
});