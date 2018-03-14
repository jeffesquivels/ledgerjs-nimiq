Some scripts to demo and test Nimiq Ledger integration and a script to create a browserified version of the library.
Note that the libary works the same for both the Ledger Nano S and Blue device. No special handling is required for either.

### Building

Install the dependencies:
```
$ yarn install
```

Create a browserified file containing Ledgerjs U2F transport and Ledger Nimiq API:
```
$ yarn run browserify
```

You can find the browserified file at `./browser/ledgerjs-nimiq.js`

Minify it:
```
$ yarn run uglify
```

You can find the minified file at `./browser/ledgerjs-nimiq-min.js`

### Running the Electron demo

Make sure to disable browser support in the app settings
```
$ yarn electron
```

The relevant code is contained in `./electron/index.html`

### Running the browser demo

- Make sure to enable browser support in the app settings
- Build the browserified file as described above.
- Run `python HttpsServer.py`
- In Chrome open `https://localhost:4443/browser/index.html`

The relevant code is contained in `./browser/index.html`

### Usage of LedgerJS Nimiq library

```javascript
// u2f is used in browser applications
import Transport from "@ledgerhq/hw-transport-u2f";
// node hid is used in native applications
// import Transport from "@ledgerhq/hw-transport-node-hid";
import Api from "@ledgerhq/hw-app-nim";

let _api = null;
let _appVersion = null;

function open() {
  const openTimeout = 30 * 1000;
  const exchangeTimeout = 30 * 1000;
  return Transport.create(openTimeout).then((transport) => {
    // transport.setDebugMode(true);
    transport.setExchangeTimeout(exchangeTimeout);
    _api = new Api(transport);
    return _api;
  });
}

function connect() {
  if (_api === null) {
    return open().then(api => {
      return api.getAppConfiguration().then(result => {
        _appVersion = result.version;
        return api;
      });
    });
  } else {
    return _api;
  }
}

function getPublicKey() {
  const bip32Path = "44'/148'/0'";
  const verifyKeyPair = true;
  const confirmAddress = false;
  return connect().then(api => {
    return api.getPublicKey(bip32Path, verifyKeyPair, confirmAddress).then(result => {
        return result.publicKey;
      });
  });
}
```

### Note on the browserified file

When using the browserified file the Transport and Api objects are available from the global variable `LedgerjsNimiq`:

```javascript
const Transport = LedgerjsNimiq.Transport;
const Api = LedgerjsNimiq.Api;
```

### Known Limitations

- The U2F transport currently [contains a bug](https://github.com/LedgerHQ/ledgerjs/issues/94) that makes it not possible to use exchange timeouts of greater than 30 seconds.
- Although Firefox now supports U2F the LedgerJS U2F transport does not support Firefox.
