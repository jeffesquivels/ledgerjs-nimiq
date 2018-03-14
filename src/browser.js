const LedgerjsNimiq = module.exports;

LedgerjsNimiq.Transport = require("@ledgerhq/hw-transport-u2f").default;
LedgerjsNimiq.Api = require("@ledgerhq/hw-app-nim").default;

module.exports = LedgerjsNimiq;
