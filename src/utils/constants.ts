export const env = {
  isDevMode: import.meta.env.DEV,
  isProdMode: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,

  // Custom env vars
  apiBaseUrl: `${import.meta.env.VITE_API_URL}`,

  // Solana vars
  solanaRpcUrl: `${import.meta.env.VITE_SOLANA_RPC_URL}`,
  solanaProgramId: `${import.meta.env.VITE_SOLANA_PROGRAM_ID}`,
  solanaOfferId: parseInt(`${import.meta.env.VITE_SOLANA_OFFER_ID}`),
};

console.assert(env.apiBaseUrl.toLowerCase().startsWith('https://'), 'ENV: API_URL invalid!');
console.assert(env.solanaRpcUrl.toLowerCase().startsWith('https://'), 'ENV: SOLANA_RPC_URL invalid!');
console.assert(env.solanaProgramId.length > 40, 'ENV: SOLANA_PROGRAM_ID invalid!');
console.assert(env.solanaOfferId >= 1, 'ENV: SOLANA_OFFER_ID invalid!');

export const API_URL = {
  // {url}/{walletId}
  solanaWalletWhitelist: `${env.apiBaseUrl}/solana/kyc-status`,
};
