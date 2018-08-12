const {  
	charTypes,
	pw, 
	LOWERCASE, 
	NUMBERS, 
	SYMBOLS, 
	UPPERCASE,
	VALID_TYPE_CHOICES
} = require('../pw');

describe('pw', () => {
	
	it('should create a password of length 10 all uppercase', () => {
		const length = 10;
		const password = pw([ UPPERCASE ], 10);
		expect(password.length).toBe(10);
		password.split('').forEach(letter => {
			expect(charTypes[UPPERCASE]).toContain(letter);
		});
	});

	it('should take from all char sets', () => {
		const types = [ LOWERCASE, NUMBERS, SYMBOLS, NUMBERS ];
		const password = pw(types, 40);
		const counts = {};
		types.forEach(key => counts[key] = 0);
		password.split('').forEach(letter => {
			types.forEach(type => {
				if (charTypes[type].includes(letter)) {
					counts[type]++;
				}
			});
		});
		types.forEach(type => {
			expect(counts[type]).toBeGreaterThan(0);
		});
	});
});