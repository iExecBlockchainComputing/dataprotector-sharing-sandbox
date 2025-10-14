const IEXEC_CHAIN_ID = '0x86'; // 134

export function checkIsConnected() {
  if (!window.ethereum) {
    console.log('Please install MetaMask');
    throw new Error('No Ethereum provider found');
  }
}

export async function checkCurrentChain(selectedChainId?: number) {
  const currentChainId = await window.ethereum.request({
    method: 'eth_chainId',
    params: [],
  });

  const targetChainId = selectedChainId ? `0x${selectedChainId.toString(16)}` : IEXEC_CHAIN_ID;

  if (currentChainId !== targetChainId) {
    const chain = SUPPORTED_CHAINS.find(c => c.id === selectedChainId);
    if (!chain) {
      throw new Error(`Chain with ID ${selectedChainId} not supported`);
    }

    console.log(`Please switch to ${chain.name} chain`);
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: targetChainId,
            chainName: chain.name,
            nativeCurrency: {
              name: chain.tokenSymbol,
              symbol: chain.tokenSymbol,
              decimals: 18,
            },
            rpcUrls: chain.rpcUrls || ['https://bellecour.iex.ec'],
            blockExplorerUrls: [chain.blockExplorerUrl],
          },
        ],
      });
      console.log(`Switched to ${chain.name} chain`);
    } catch (err) {
      console.error(`Failed to switch to ${chain.name} chain:`, err);
      throw err;
    }
  }
}

export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: 'Bellecour',
    slug: 'bellecour',
    color: '#F4942566',
    //icon: iexecLogo,
    blockExplorerUrl: 'https://blockscout-bellecour.iex.ec',
    subgraphUrl: 'https://thegraph.iex.ec/subgraphs/name/bellecour/poco-v5',
    bridge: 'https://bridge-bellecour.iex.ec/',
    bridgeInformation:
      'Move your xRLC in your wallet between bellecour and Ethereum Mainnet with our bridge.',
    //wagmiNetwork: wagmiNetworks.bellecour,
    tokenSymbol: 'xRLC',
    rpcUrls: ['https://bellecour.iex.ec'],
  },
  {
    id: 42161,
    name: 'Arbitrum',
    slug: 'arbitrum-mainnet',
    color: '#F4942566',
    //icon: arbitrumIcon,
    blockExplorerUrl: 'https://arbiscan.io/',
    subgraphUrl:
      'https://thegraph.arbitrum.iex.ec/api/subgraphs/id/B1comLe9SANBLrjdnoNTJSubbeC7cY7EoNu6zD82HeKy',
    //wagmiNetwork: wagmiNetworks.arbitrum,
    tokenSymbol: 'RLC',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    slug: 'arbitrum-sepolia-testnet',
    color: '#28A0F080',
    //icon: arbitrumIcon,
    blockExplorerUrl: 'https://sepolia.arbiscan.io/',
    subgraphUrl: {
      poco: 'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/2GCj8gzLCihsiEDq8cYvC5nUgK6VfwZ6hm3Wj8A3kcxz',
      dataprotector:
        'https://thegraph.arbitrum-sepolia-testnet.iex.ec/api/subgraphs/id/5YjRPLtjS6GH6bB4yY55Qg4HzwtRGQ8TaHtGf9UBWWd',
    },
    //wagmiNetwork: wagmiNetworks.arbitrumSepolia,
    tokenSymbol: 'RLC',
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
  },
];
