// constants
//// type choices
const LOWERCASE= 'lowercase',
	NUMBERS = 'numbers',
	SYMBOLS = 'symbols',
	UPPERCASE = 'uppercase';
const VALID_TYPE_CHOICES = [ UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS ];

const charTypes = {
	[UPPERCASE]: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
	[LOWERCASE]: 'abcdefghijklmnopqrstuvwxyz'.split(''),
	[NUMBERS]: '0123456789'.split(''),
	[SYMBOLS]: '~`!@#$%^&*()-_=+{}[]|\\:;"\'<>,.?/'.split('')
};

// generate password
const pw = (types, length) => {
	let valid = [];

	types.forEach(type => {
		valid = valid.concat(charTypes[type]);	
	});
	let password = '';
	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * valid.length);
		password += valid[index];
	}
	return password;
};

module.exports = {  
	charTypes,
	pw, 
	LOWERCASE, 
	NUMBERS, 
	SYMBOLS, 
	UPPERCASE,
	VALID_TYPE_CHOICES
};

