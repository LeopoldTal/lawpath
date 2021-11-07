# Lawpath tech test — Back-end API

## Prerequisite

**You'll need an [Australia Post API key](https://developers.auspost.com.au/apis/pac/getting-started).**

You can either add the key to [`.env`](.env), or set the environment variable `AUS_POST_API_KEY`.

## Commands

* Install the dependencies: `yarn`
* Run: `yarn start`
* Run all tests: `yarn test`
* Run the tests interactively :`yarn test:watch`

## Routes

This API exposes only one route.

Route: `/validate-address`  
Method: `GET`  
Authentication: None

GET params:

- `postcode`: 4-digit Australian postcode, e.g. "3000"
- `suburb`: name of a surburb, e.g. "North Melbourne". Case-insensitive.
- `state`: abbreviation for an Australian state or territory, e.g. "ACT". Case-insensitive.

Response:

```
{ status: string; }
```

where `status` is one of:

* `valid` — valid address
* `missingRequiredFields` — some fields were blank
* `postcodeSuburbMismatch` — postcode and suburb don't match
* `suburbStateMismatch` — suburb and state don't match (but postcode matches suburb)
* `error` — got an error from the Auspost API

This project runs on [Express](http://expressjs.com/).
