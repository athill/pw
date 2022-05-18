const  {
	pw,
	LOWERCASE,
	NUMBERS,
	SYMBOLS,
	UPPERCASE,
	VALID_TYPE_CHOICES
} = require('./pw');

const DEFAULT_TYPE_CHOICES = [UPPERCASE, LOWERCASE, NUMBERS];
const DEFAULT_LENGTH = 40;

const usage = 'node pwc.js <number>';

if (process.argv.length !== 3) {
  console.log(usage);
  process.exit(1);
}

const [ , , count ] = process.argv;


for (let i = 0; i < count; i++) {
  console.log(pw(DEFAULT_TYPE_CHOICES, DEFAULT_LENGTH));
  console.log('');
}
