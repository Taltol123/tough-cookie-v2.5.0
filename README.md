# Fix Expired Test Cases – tough-cookie 2.5.0

This branch contains a small fix to update expired cookie test cases in `parser.json`.

## Background

Three tests in the original `tough-cookie@2.5.0` release - `0002`, `COMMA0006`, and `COMMA0007` — fail due to hardcoded `Expires` values from the year 2019. Since those dates are now in the past, the corresponding cookies are considered expired and are discarded during parsing.

These tests passed at the time of the original release but fail today due to the passage of time, not due to a bug in the library.

## What Was Changed

The following Expires values in `parser.json` were updated to ensure the tests remain valid:

```json
"Expires": "Fri, 07 Aug 2019 08:04:19 GMT"
```

was replaced with:

```json
"Expires": "Fri, 07 Aug 9999 08:04:19 GMT"
```
This ensures the cookies are valid during testing, and the original test logic remains intact.

## How to Run the Tests

```bash
npm install
npm test
```

All tests should pass successfully.