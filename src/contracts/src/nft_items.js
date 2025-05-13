const {
  Keypair,
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction
} = require('@solana/web3.js');
const {
  Metadata,
  MetadataProgram
} = require('@metaplex-foundation/mpl-token-metadata');
const {
  Token,
  TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const fs = require('fs');
require('dotenv').config();

// Connection to Solana network (devnet for testing)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

/**
 * Create a new NFT for a game item
 * @param {Keypair} payer - The account paying for the transaction
 * @param {Object} itemData - The item data including name, description, attributes, etc.
 * @param {string} imageUri - URI to the image of the NFT
 * @returns {Promise<{mintAddress: PublicKey, metadata: PublicKey}>} The NFT addresses
 */
async function createItemNFT(payer, itemData, imageUri) {
  try {
    // Generate a new token mint
    const mintAccount = Keypair.generate();
    
    // Create and initialize the token mint
    const token = await Token.createMint(
      connection,
      payer,
      payer.publicKey,
      null, // Freeze authority - none
      0, // Decimals - 0 for NFTs
      TOKEN_PROGRAM_ID
    );
    
    // Create the token account for the payer
    const tokenAccount = await token.getOrCreateAssociatedAccountInfo(payer.publicKey);
    
    // Mint exactly 1 token (NFT)
    await token.mintTo(
      tokenAccount.address,
      payer.publicKey,
      [],
      1
    );
    
    // Disable future minting
    await token.setAuthority(
      token.publicKey,
      null,
      'MintTokens',
      payer.publicKey,
      []
    );
    
    // Create metadata account
    const metadataAccount = await createMetadata(
      connection,
      payer,
      token.publicKey,
      payer.publicKey,
      payer.publicKey,
      itemData.name,
      itemData.symbol || 'WCAT',
      itemData.description || '',
      imageUri,
      getItemAttributes(itemData)
    );
    
    console.log(`Created NFT for item: ${itemData.name}`);
    console.log(`Mint Address: ${token.publicKey.toString()}`);
    console.log(`Metadata Address: ${metadataAccount.toString()}`);
    
    return { mintAddress: token.publicKey, metadata: metadataAccount };
  } catch (error) {
    console.error('Error creating item NFT:', error);
    throw error;
  }
}

/**
 * Create metadata for an NFT
 * @param {Connection} connection - Solana connection
 * @param {Keypair} payer - The account paying for the transaction
 * @param {PublicKey} mintKey - Mint address of the token
 * @param {PublicKey} mintAuthorityKey - Mint authority
 * @param {PublicKey} updateAuthorityKey - Update authority
 * @param {string} name - Name of the NFT
 * @param {string} symbol - Symbol of the NFT
 * @param {string} description - Description of the NFT
 * @param {string} uri - URI to the metadata
 * @param {Array} attributes - Array of attributes
 * @returns {Promise<PublicKey>} The metadata address
 */
async function createMetadata(
  connection,
  payer,
  mintKey,
  mintAuthorityKey,
  updateAuthorityKey,
  name,
  symbol,
  description,
  uri,
  attributes
) {
  // Find the metadata program address for the mint
  const metadataAccount = await MetadataProgram.findMetadataAccount(mintKey);
  
  // Create the JSON metadata
  const metadataJson = {
    name,
    symbol,
    description,
    seller_fee_basis_points: 0, // No fees for in-game items
    image: uri,
    attributes,
    properties: {
      files: [{ uri, type: 'image/png' }],
      category: 'image',
      creators: [
        {
          address: payer.publicKey.toString(),
          share: 100
        }
      ]
    }
  };
  
  // Create the metadata instruction
  const createMetadataIx = MetadataProgram.createMetadataInstruction(
    {
      metadata: metadataAccount[0],
      mint: mintKey,
      mintAuthority: mintAuthorityKey,
      payer: payer.publicKey,
      updateAuthority: updateAuthorityKey
    },
    {
      createMetadataAccountArgs: {
        data: {
          name,
          symbol,
          uri, // URI to the JSON metadata
          sellerFeeBasisPoints: 0,
          creators: [
            {
              address: payer.publicKey,
              verified: true,
              share: 100
            }
          ]
        },
        isMutable: true
      }
    }
  );
  
  // Create and send transaction
  const tx = new Transaction().add(createMetadataIx);
  await sendAndConfirmTransaction(connection, tx, [payer], { commitment: 'confirmed' });
  
  return metadataAccount[0];
}

/**
 * Convert item data to NFT attributes
 * @param {Object} itemData - The item data
 * @returns {Array} The NFT attributes
 */
function getItemAttributes(itemData) {
  const attributes = [];
  
  // Add basic attributes
  if (itemData.type) {
    attributes.push({ trait_type: 'Type', value: itemData.type });
  }
  
  if (itemData.rarity) {
    attributes.push({ trait_type: 'Rarity', value: itemData.rarity });
  }
  
  if (itemData.level) {
    attributes.push({ trait_type: 'Level', value: itemData.level.toString() });
  }
  
  // Add game-specific attributes
  if (itemData.stats) {
    for (const [stat, value] of Object.entries(itemData.stats)) {
      attributes.push({ trait_type: stat.charAt(0).toUpperCase() + stat.slice(1), value: value.toString() });
    }
  }
  
  return attributes;
}

/**
 * Create a batch of game item NFTs
 * @param {Keypair} payer - The account paying for the transaction
 * @param {Array} items - Array of item data
 * @returns {Promise<Array>} Array of created NFT addresses
 */
async function createGameItemBatch(payer, items) {
  const results = [];
  
  for (const item of items) {
    try {
      // For each item, create an NFT
      const result = await createItemNFT(
        payer,
        item,
        item.imageUri || `https://warriorcats.xyz/assets/items/${item.type}/${item.id}.png`
      );
      
      results.push({
        id: item.id,
        name: item.name,
        mintAddress: result.mintAddress.toString(),
        metadata: result.metadata.toString()
      });
    } catch (error) {
      console.error(`Error creating NFT for item ${item.name}:`, error);
    }
  }
  
  // Save the results to a file
  fs.writeFileSync(
    './nft_items.json',
    JSON.stringify(results, null, 2)
  );
  
  return results;
}

// Export functions
module.exports = {
  createItemNFT,
  createMetadata,
  getItemAttributes,
  createGameItemBatch
}; 