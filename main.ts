import { PKPSuiWallet } from "./pkp-sui";
import { LitLogger } from "./utils";
import { CONTROLLER_AUTHSIG, PKP_PUBKEY, PRIVATE_KEY } from "./config.json";
import {
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
  testnetConnection,
  TransactionBlock,
} from "@mysten/sui.js";

const logger = new LitLogger("[SuiTest/main.ts]", true);

// get arguments from command line
const args = process.argv.slice(2);

/**
 * Test cases:
 * 1 = create a wallet
 * 2 = create a wallet and send a transaction
 * 3 = create a PKP wallet
 * 4 = create a PKP wallet and send a transaction
 */
if (args.length === 0) {
  console.log("\nUsage: node main.js <test case number>\n");
  console.log(" Test cases:");
  console.log(" 1 = create a wallet");
  console.log(" 2 = create a wallet and send a transaction");
  console.log(" 3 = create a PKP wallet");
  console.log(" 4 = create a PKP wallet and send a transaction");
  console.log("");
  process.exit(0);
}

// const TEST_CASE = 1;
const TEST_CASE = parseInt(args[0]);

const testCaseMap = {
  1: testPrivateKeyWallet,
  2: testPrivateKeyWalletAndSendTransaction,
  3: testPKPWallet,
  4: testPKPWalletAndSendTransaction,
};

async function testPrivateKeyWallet() {
  const wallet = await createAddress();
  console.log("PrivateKey Wallet:", await wallet.getAddress());
}

async function testPrivateKeyWalletAndSendTransaction() {
  const wallet = await createAddress();
  const tx = await sendTransaction(wallet);

  console.log("PrivateKey Wallet:", await wallet.getAddress());
  console.log("Transaction:", tx);
  printExplorerLink(tx);
}

async function testPKPWallet() {
  const wallet = await createPKPWallet();
  logger.log("wallet:", wallet);
  const address = await wallet.getAddress();
  logger.log("address:", address);
  await wallet.init();
}

async function testPKPWalletAndSendTransaction() {
  const wallet = await createPKPWallet();
  logger.log("wallet:", wallet);

  const address = await wallet.getAddress();
  logger.log("address:", address);
  const tx = await sendTransaction(wallet);

  console.log("Transaction:", tx);
  printExplorerLink(tx);
}

/**
 * ========== STARTS HERE ==========
 * Main function to create a wallet and send a transaction
 */
(async () => {
  try {
    await testCaseMap[TEST_CASE]();
  } catch (e) {
    logger.throwError(e.message);
  }
})();

/**
 * Creates a new address from a mnemonic
 * @returns
 */
async function createAddress(): Promise<RawSigner> {
  const privateKey = PRIVATE_KEY;
  const privateKeyBuffer = Buffer.from(privateKey, "hex");

  const keypaair = Ed25519Keypair.fromSecretKey(privateKeyBuffer);

  const provider = new JsonRpcProvider(testnetConnection);
  const wallet = new RawSigner(keypaair, provider);
  return wallet;
}

// copy from @suiet/core
export default function getMintExampleNftTxBlock(
  objectPackageId: string
): TransactionBlock {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${objectPackageId}::nft::mint`,
    arguments: [
      tx.pure("Suiet NFT"),
      tx.pure("Suiet Sample NFT"),
      tx.pure(
        "https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4"
      ),
    ],
  });
  return tx;
}

/**
 * sends a transaction to the blockchain using the wallet
 * @param { OfflineSigner } wallet
 */
async function sendTransaction(wallet: RawSigner | PKPSuiWallet) {
  const txb = getMintExampleNftTxBlock("0x5ea6aafe995ce6506f07335a40942024106a57f6311cb341239abf2c3ac7b82f");
  const result = await wallet.signAndExecuteTransactionBlock({
    transactionBlock: txb,
  });
  return result;
}

/**
 * Creates a PKP wallet
 * @returns { PKPCosmosWallet } wallet
 */
async function createPKPWallet() {
  logger.log("...creating a PKP Wallet");

  const wallet = new PKPSuiWallet(
    {
      controllerAuthSig: CONTROLLER_AUTHSIG,
      pkpPubKey: PKP_PUBKEY,
      debug: true,
    },
    new JsonRpcProvider(testnetConnection)
  );

  return wallet;
}

/**
 * Prints the explorer link for the transaction
 * @param { any } transaction
 * @returns { void }
 */
async function printExplorerLink(transaction: any): Promise<void> {
  const explorerLink = `https://suiexplorer.com/txblock/${transaction.digest}?network=testnet`;
  console.log("Explorer link:", explorerLink);
}
