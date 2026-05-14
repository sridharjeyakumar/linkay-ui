import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, phantomWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
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
  transports: {
    // Cloudflare's public ETH RPC — allows browser requests (no CORS block)
    [mainnet.id]: http('https://cloudflare-eth.com'),
  },
});
