# Lawpath tech test

## Purpose

This is a tech exercise for [Lawpath](https://lawpath.com.au/). It accepts an Australian postcode, suburb, and state through a React form, and queries the [Australia Post API](https://developers.auspost.com.au/#/apis/pac/reference/postcode-search) to validate them.

The React client cannot directly query this API, because:

- It does not allow cross-origin requests, and so cannot be used in the browser.
- The API key must be stored on a server we control, not distributed to all users.

Therefore, this app is structured in 2 parts: a [React front-end](client), and an [Express back-end](server) that proxies requests to the Australia Post API.

## Requirements

**You'll need an [Australia Post API key](https://developers.auspost.com.au/apis/pac/getting-started).**

Software requirements: [node](https://nodejs.dev/), [yarn](https://yarnpkg.com/), [ts-node](https://www.npmjs.com/package/ts-node).

## Downloading

Clone this repo:

```
git clone https://github.com/LeopoldTal/lawpath.git
cd lawpath
```

## Running the server

### Setup

First, install the server dependencies:

```
cd server
yarn
```

Add your Australia Post API key in [`server/.env`](server/.env). Alternately, you can also set the environment variable `AUS_POST_API_KEY`.

```toml
# Server-side config

# base address of the Australia Post API
AUS_POST_API_URL=https://digitalapi.auspost.com.au

# add your API key here:
AUS_POST_API_KEY=01234567-89ab-cdef-0123-456789abcdef
```

### Running

You can now run the server with

```
yarn start
```

### Tests

Run all the tests, and generate a coverage report:

```
yarn test
```

You can also run the tests interactively with `yarn test:watch`.

## Running the client

### Setup

Install the client dependencies:

```
cd client
yarn
```

### Running

Launch the client with

```
yarn start
```

### Tests

Run all the tests, and generate a coverage report. Note that the back end must be started manually before starting the end-to-end tests.

```
yarn test
```

You can also:

* Run the unit tests only: `yarn test:ci`
* Run the unit tests interactively :`yarn test:watch`
* Run the end-to-end tests only: `yarn test:e2e`
