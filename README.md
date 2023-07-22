# PKPSuiWallet
NOTE: This repo has been integrated into the [LIT-Protocol/js-sdk](https://github.com/LIT-Protocol/js-sdk)
merged at [PR#185](https://github.com/LIT-Protocol/js-sdk/pull/185)

## Getting Started
```
yarn add @lit-protocol/pkp-sui
```

### test
First you need to create config.json file
```json
{
  "PRIVATE_KEY": "<your private key. If there is a leading 0x, delete it>",
  "CONTROLLER_AUTHSIG": {
    "sig": "",
    "derivedVia": "",
    "signedMessage": "",
    "address": ""
  },
  "PKP_PUBKEY": "<your pubkey>"
}
```

Then you can type `yarn start <test-number>` or `yarn dev <test-number>` to select the test case you want to run. At the moment, we have the following

before minting nft, you need to prefund testnet sui to your wallet.

```
/**
 * Test cases:
 * 1 = create a wallet
 * 2 = create a wallet and mint nft
 * 3 = create a PKP wallet
 * 4 = create a PKP wallet and mint nft
 */
```
