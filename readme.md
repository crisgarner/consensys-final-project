# Description

This app allows people to create a profile with some basic information and a small bio in order to receive donations. They get an unique link with their address and can share it to other users or just get listed with all the other profiles.

A user can see the profile and make a donation throught the smartcontract.

## Getting Started

Clone the project on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need truffle, ganache, truffle-hdwallet-provider, openzeppelin-solidity, dotenv and chai in order to run the project

```
npm install -g truffle
npm install -g ganache-cli
npm install
cd client
npm install
```

### Installing and Testing

Run ganache application or the ganache-cli in order to start testing

```
ganache-cli -p 8545
```

Compile the project

```
truffle compile 
```

End with running the tests. The application uses Chai as an assertion library 

```
truffle test 
```

## Deployment

With ganache runing just migrate the project and you will be ready.

```
truffle migrate 
``` 

## Starting the client

Once the ganache is running you just need to start the client and start using the app with metamask in your favorite browser. Run the following commands:

```
cd client
npm start
``` 
## Authors

* **Cristian Espinoza** - *Initial work* - [Crisgarner](https://github.com/crisgarner)
