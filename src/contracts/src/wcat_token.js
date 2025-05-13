const {
  Keypair,
  SystemProgram,
  Transaction,
  Connection,
  PublicKey,
  sendAndConfirmTransaction
} = require('@solana/web3.js');
const {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout
} = require('@solana/spl-token');
require('dotenv').config();

// Connection to Solana network (devnet for testing)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

/**
 * Create a new SPL Token for WCAT
 * @param {Keypair} payer - The account paying for the transaction
 * @param {number} decimals - Number of decimals for the token
 * @returns {Promise<{token: Token, mintAccount: PublicKey}>} The created token and mint account
 */
async function createWCATToken(payer, decimals = 9) {
  // Generate a new mint account
  const mintAccount = Keypair.generate();
  
  // Calculate the minimum lamports required for a token mint
  const mintRent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
  
  // Create a transaction to allocate space for the token mint
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintAccount.publicKey,
      lamports: mintRent,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID
    })
  );
  
  // Initialize the mint
  transaction.add(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mintAccount.publicKey,
      decimals,
      payer.publicKey,
      payer.publicKey
    )
  );
  
  // Send and confirm the transaction
  await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mintAccount],
    { commitment: 'confirmed' }
  );
  
  // Create a Token object
  const token = new Token(
    connection,
    mintAccount.publicKey,
    TOKEN_PROGRAM_ID,
    payer
  );
  
  console.log(`WCAT Token created with mint address: ${mintAccount.publicKey.toString()}`);
  
  return { token, mintAccount: mintAccount.publicKey };
}

/**
 * Mint WCAT tokens to a recipient
 * @param {Token} token - The WCAT token
 * @param {PublicKey} recipient - The recipient's wallet address
 * @param {number} amount - The amount of tokens to mint
 * @returns {Promise<void>}
 */
async function mintWCATTokens(token, recipient, amount) {
  // Create or get the associated token account for the recipient
  const associatedTokenAccount = await token.getOrCreateAssociatedAccountInfo(recipient);
  
  // Mint tokens to the recipient
  await token.mintTo(
    associatedTokenAccount.address,
    token.payer.publicKey,
    [],
    amount * (10 ** token.decimals)
  );
  
  console.log(`Minted ${amount} WCAT tokens to ${recipient.toString()}`);
}

/**
 * Transfer WCAT tokens between accounts
 * @param {Token} token - The WCAT token
 * @param {PublicKey} sender - The sender's wallet address
 * @param {PublicKey} recipient - The recipient's wallet address
 * @param {Keypair} senderWallet - The sender's wallet keypair for signing
 * @param {number} amount - The amount of tokens to transfer
 * @returns {Promise<void>}
 */
async function transferWCATTokens(token, sender, recipient, senderWallet, amount) {
  // Get the sender's and recipient's associated token accounts
  const senderTokenAccount = await token.getOrCreateAssociatedAccountInfo(sender);
  const recipientTokenAccount = await token.getOrCreateAssociatedAccountInfo(recipient);
  
  // Transfer tokens
  await token.transfer(
    senderTokenAccount.address,
    recipientTokenAccount.address,
    senderWallet.publicKey,
    [senderWallet],
    amount * (10 ** token.decimals)
  );
  
  console.log(`Transferred ${amount} WCAT tokens from ${sender.toString()} to ${recipient.toString()}`);
}

/**
 * Initialize the WCAT token economy with a fixed supply
 * @param {Keypair} adminWallet - The admin/owner wallet
 * @returns {Promise<{token: Token, mintAccount: PublicKey}>} The token details
 */
async function initializeWCATEconomy(adminWallet) {
  try {
    // Create the WCAT token
    const { token, mintAccount } = await createWCATToken(adminWallet);
    
    // Define the total supply and distribution
    const totalSupply = 1_000_000_000; // 1 billion tokens
    
    // Mint the total supply to the admin wallet
    await mintWCATTokens(token, adminWallet.publicKey, totalSupply);
    
    console.log(`WCAT token economy initialized with ${totalSupply} tokens`);
    console.log(`Mint Address: ${mintAccount.toString()}`);
    
    return { token, mintAccount };
  } catch (error) {
    console.error('Error initializing WCAT economy:', error);
    throw error;
  }
}

// Export functions
module.exports = {
  createWCATToken,
  mintWCATTokens,
  transferWCATTokens,
  initializeWCATEconomy
}; 