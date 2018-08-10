# pw

Super simple password generator wizard

## Usage

In the `pw` directory:
```bash
$ npm install # before first run
$ node .
```

I create a `~/bin/pw` file with contents such as the following:
```bash
#!/bin/bash

cd /path/to/pw
node . "@$"

```
Then add `~/bin` to your path if it's not already there and `chmod u+x ~/bin/pw` and you can start it via
```bash
$ pw
```
from anywhere.