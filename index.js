const inquirer = require('inquirer');

inquirer.prompt([
	{
		type: 'checkbox',
		message: 'Character types (default is uppercase, lowercase, symbols)',
		name: 'types',
		default: ['uppercase', 'lowercase', 'numbers'],
		choices: [
			'uppercase', 'lowercase', 'numbers', 'symbols'
		]	
	},
	{
		type: 'input',
		message: 'Length',
		name: 'length',
		default: 20,
		validate: input => /^\d*$/.test(input)
	}

]).then(answer => {
	console.log(answer);
	const charsTypes = {
		'uppercase': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
		'lowercase': 'abcdefghijklmnopqrstuvwxyz'.split(''),
		'numbers': '0123456789'.split(''),
		'symbols': '~`!@#$%^&*()-_=+{}[]|\\:;"\'<>,.?/'.split('')
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