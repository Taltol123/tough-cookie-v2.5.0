# CVE-2023-26136 Fix for tough-cookie 2.5.0

This project demonstrates the **Prototype Pollution** vulnerability (CVE-2023-26136) in version `2.5.0` of the [`tough-cookie`](https://github.com/salesforce/tough-cookie) library.

## Vulnerability Summary

The vulnerability allows an attacker to create a cookie with the domain `__proto__`.
If the library does not properly validate domain names, this can result in **modifying the prototype of base objects** — leading to **unexpected behavior or even security exploits**.

---

## Exploit Script

The `index.js` file simulates setting a malicious cookie with domain `__proto__` and checks whether the object prototype was polluted.

## How to Run

```bash
npm install tough-cookie@2.5.0 && node index.js
```

Expected output:
```
EXPLOITED SUCCESSFULLY
```

```bash
npm install ./tough-cookie-2.5.0-PATCHED.tgz && node index.js
```

Expected output:
```
EXPLOIT FAILED
```

## Test Execution

## How to Run
```bash
npm test
```

## Output
> vows test/*_test.js    

·································· ·········································· ······ ························ ··············· ··························································· ········································· ······························································································································································································································································································· ··············· ········ ················································································································ · ········ ·····  
  ✓ OK » 657 honored (9.477s)   


Three test cases were removed from the test suite: 0002, COMMA0006, and COMMA0007.
These tests failed because the Expires attribute contains a hardcoded date that is already in the past (Fri, 07 Aug 2019).
Since the cookie is considered expired upon parsing, the cookie is not stored, and the test fails. 
Because these failures are not related to the patched vulnerability, the tests were excluded from the run.

```

## Files

You can find all related files in the shared Drive folder:

**[Google Drive Link](https://drive.google.com/drive/folders/1ucY8CuuR2KLek1yfZvKlja-73hBkc9-p?usp=sharing)**

| File Name                          | Description                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| `index.js`                        | The exploit script that demonstrates the vulnerability.                    |
| `changes.diff`                    | Diff file showing changes compared to the tough-cookie 2.5.0 git tag.
| `tough-cookie-2.5.0-PATCHED.tgz`  | Tarball of the patched package version with the vulnerability fixed.       |
| `CI Tools Experience.txt`               | A list of all the CI tools I have used in the past and my level of expertise with each. |

---

## Patch Summary

The patch replaces all plain object initializations (`{}`) with `Object.create(null)`.
This creates an object **without a prototype**, making it safe from prototype pollution.

Patch Details (`diff` explained)
**File:** `lib/memstore.js`

| Before                          | After                                     |
|---------------------------------|-------------------------------------------|
| `this.idx = {}`                 | `this.idx = Object.create(null)`         |
| `this.idx[domain] = {}`         | `this.idx[domain] = Object.create(null)` |
| `this.idx[domain][path] = {}`   | `this.idx[domain][path] = Object.create(null)` |

This change was made in:
- `MemoryCookieStore` constructor
- `putCookie()`
- `removeAllCookies()`

These ensure that cookie storage dictionaries are no longer vulnerable to pollution via special object properties.

