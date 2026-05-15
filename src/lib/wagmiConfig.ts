import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, phantomWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, createStorage, noopStorage, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

// Only injected wallets — no WalletConnect, no projectId calls, no eth.merkle.io CORS errors
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, phantomWallet],
    },
  ],
  {
    appName: 'LinkBlockAssets',
    projectId: 'none',
  }
);

export const wagmiConfig = createConfig({
  chains: [mainnet],
  ssr: true,
  connectors,
  // Disable localStorage persistence — each user session starts fresh
  // This prevents one user's wallet from appearing for another user
  storage: createStorage({ storage: noopStorage }),
  transports: {
    [mainnet.id]: http('https://cloudflare-eth.com'),
  },
});
