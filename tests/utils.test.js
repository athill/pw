const fs = require('fs');

const {
	readConfig,
	removeConfig,
	validateConfig,
	writeConfig

} = require('../utils');

const { UPPERCASE, VALID_TYPE_CHOICES } = require('../pw');

describe('utils', () => {
	let consoleMock;
	let exitMock;
	let realProcess;

	const validConfig = {
		length: 2,
		types: [ UPPERCASE ]
	};	

	const path = './foo';

	const messages = {
		types: {
			required: '`types` is required.',
			array: '`types` must be an array.',
			values: `\`types\` value foo is not valid. Valid values are ${VALID_TYPE_CHOICES.join(', ')}`
		},
		length: {
			required: '`length` is required.',
			posint: '`length` must be an non-negative integer.'
		}
	};

	const rules = 	{
		'types': [
			value => { if (!value) return  messages.types.required; },
			value => { if (!Array.isArray(value)) return messages.types.array },
			values => {
				for (let i = 0; i < values.length; i++) {
					const value = values[i];
					if (!VALID_TYPE_CHOICES.includes(value)) {
						return `\`types\` value ${value} is not valid. Valid values are ${VALID_TYPE_CHOICES.join(', ')}`;
					}
				}
			}				
		],
		'length': [
			value => { if (!value) return messages.length.required },
			value => { if (!Number.isInteger(parseInt(value)) || !(value > 0)) return messages.length.posint }
		]
	};	

	beforeEach(() => {
		consoleMock = jest.spyOn(console, 'error');
		realProcess = process;
		exitMock = jest.fn();
		global.process = Object.assign({}, realProcess, { exit: exitMock });
	});

	afterEach(() => {
		consoleMock.mockRestore();
		exitMock.mockRestore();
		global.process = realProcess;
	});
	describe('validateConfig', () => {
		const wrap = message => `Configuration error: ${message}`;
		const override = overrides => Object.assign({}, validConfig, overrides);

		it('does not error out with valid config', () => {
			validateConfig(validConfig, rules);
			expect(consoleMock.mock.calls.length).toBe(0);
			expect(exitMock.mock.calls.length).toBe(0);
		});

		it('fails if a config key is not in rules', () => {
			const key = 'foo';
			const message = `Illegal key, ${key}, in config.`;
			const config = override({ [key]: key });
			validateConfig(config, rules);
			expect(consoleMock).toBeCalledWith(wrap(message));
			expect(exitMock).toBeCalledWith(1);
		});

		it('fails if a required key is not supplied', () => {
			const config = override({});
			delete config.length;
			validateConfig(config, rules);
			expect(consoleMock).toBeCalledWith(wrap(messages.length.required));
			expect(exitMock).toBeCalledWith(1);
		});

		it('fails if types is not an array', () => {
			const config = override({ types: 'foo'});
			delete config.length;
			validateConfig(config, rules);
			expect(consoleMock).toBeCalledWith(wrap(messages.types.array));
			expect(exitMock).toBeCalledWith(1);
		});

		it('fails if types has an invalid value', () => {
			const config = override({ types: ['foo']});
			validateConfig(config, rules);
			expect(consoleMock).toBeCalledWith(wrap(messages.types.values));
			expect(exitMock).toBeCalledWith(1);			
		});

		it('fails if length is not an integer', () => {
			const config = override({ length: 'foo'});
			delete config.length;
			validateConfig(config, rules);
			expect(consoleMock).toBeCalledWith(wrap(messages.length.posint));
			expect(exitMock).toBeCalledWith(1);
		});

		it('fails if length is not a positive integer', () => {
			const config = override({ length: 0});
			delete config.length;
			validateConfig(config, rules);
			expect(consoleMock).toBeCalledWith(wrap(messages.length.posint));
			expect(exitMock).toBeCalledWith(1);
		});

	});

	describe('removeConfig', () => {
		beforeEach(() => {
			fs.existsSync = jest.fn();
			fs.unlinkSync = jest.fn();
		});
		afterEach(() => {
			fs.existsSync.mockRestore();
			fs.unlinkSync.mockRestore();
		});

		it('unlinks if file exists', () => {
			fs.existsSync.mockReturnValueOnce(true);
			removeConfig(path);
			expect(fs.existsSync).toBeCalledWith(path);
			expect(fs.unlinkSync).toBeCalledWith(path);
		});

		it('unlinks if file exists', () => {
			fs.existsSync.mockReturnValueOnce(false);
			removeConfig(path);
			expect(fs.existsSync).toBeCalledWith(path);
			expect(fs.unlinkSync.mock.calls.length).toBe(0);
		});		
	});

	describe('writeConfig', () => {
		beforeEach(() => {
			fs.writeFileSync = jest.fn();
		});
		afterEach(() => {
			fs.writeFileSync.mockRestore();
		});		
		it('writes config', () => {
			writeConfig(path, validateConfig);
			expect(fs.writeFileSync).toBeCalledWith(path, JSON.stringify(validateConfig));
		});
	});

	// not sure why this doesn't work
	/*
	describe('readConfig', () => {
		beforeEach(() => {
			fs.readFileSync = jest.fn();
		});
		afterEach(() => {
			fs.readFileSync.mockRestore();
		});		
		it('reads config', () => {
			fs.readFileSync.mockReturnValueOnce(validateConfig);
			// readConfig(path, rules);
			// expect(fs.readFileSync).toBeCalledWith(path, rules);
		});
	});
	*/
});