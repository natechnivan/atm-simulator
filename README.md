<h1 align="center">Welcome to atm-simulator 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> ATM Keeto
App simulates ATM operations.

## Install

```sh
npm install
```
## Build
```sh
npm run build
```

## Usage

```sh

## ATM Commands Supported

* `login [name]` - Logs in as this customer and creates the customer if not exist

* `deposit [amount]` - Deposits this amount to the logged in customer

* `withdraw [amount]` - Withdraws this amount from the logged in customer

* `transfer [target] [amount]` - Transfers this amount from the logged in customer to the target customer

* `logout` - Logs out of the current customer

Please run command npm run start first before running atm commands
ex: 
npm run start
login alice -> it will login alice account
npm run start
deposit 100 -> it will deposit 100 to alice account
```

## Tests

### Run tests
```bash
npm run test
```

### Creating new tests

If you need to add more test cases to the project just create a new file in `/test/` and run the command.

## Author

👤 **Chetan Navin**


## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_