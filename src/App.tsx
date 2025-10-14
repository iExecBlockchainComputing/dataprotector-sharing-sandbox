import { useState } from 'react';
import './App.css';
import loader from './assets/loader.gif';
import successIcon from './assets/success.png';
import { checkIsConnected, SUPPORTED_CHAINS } from './utils/utils.ts';
import { getDataProtectorCoreClient } from './externals/dataProtectorClient';
import { useWalletConnection } from './hooks/useWalletConnection';

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const { isConnected, address, chainId } = useWalletConnection();

  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0].id);

  // protectData()
  const [isLoadingProtectData, setIsLoadingProtectData] = useState(false);
  const [protectDataSuccess, setProtectDataSuccess] = useState(false);

  // getResultFromCompletedTask()
  const [taskId, setTaskId] = useState('');
  const [
    isLoadingGetResultFromCompletedTask,
    setIsLoadingGetResultFromCompletedTask,
  ] = useState(false);
  const [getResultFromCompletedTaskSuccess, setResultFromCompletedTaskSuccess] =
    useState(false);
  const [content, setContent] = useState('');

  const protectData = async () => {
    setErrorMessage('');
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage('Please install MetaMask');
      return;
    }
    try {
      await switchToChain(selectedChain);
    } catch (error) {
      console.error('Failed to switch chain:', error);
      setErrorMessage(`Failed to switch to chain ${selectedChain}`);
      return;
    }

    try {
      setProtectDataSuccess(false);
      setIsLoadingProtectData(true); // Show loader
      const client = await getDataProtectorCoreClient();
      const protectedDataResponse =
        await client.protectData({
          data: {
            // A binary "file" field must be used if you use the app provided by iExec
            file: new TextEncoder().encode(
              'DataProtector Core - Test protected data!'
            ),
          },
          name: `DataProtector Core - Test protected data on ${SUPPORTED_CHAINS.find(c => c.id === selectedChain)?.name || 'Unknown Chain'}`,
        });
      console.log('protectedDataResponse', protectedDataResponse);

      console.log('Protected data address:', protectedDataResponse.address);
      console.log('Created on chain:', selectedChain);
      setIsLoadingProtectData(false); // hide loader
      setProtectDataSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingProtectData(false); // hide loader
      console.error(e);
    }
  };

  const getResultFromCompletedTask = async () => {
    setErrorMessage('');
    try {
      checkIsConnected();
    } catch (err) {
      setErrorMessage('Please install MetaMask');
      return;
    }
    try {
      await switchToChain(selectedChain);
    } catch (error) {
      console.error('Failed to switch chain:', error);
      setErrorMessage(`Failed to switch to chain ${selectedChain}`);
      return;
    }

    try {
      setResultFromCompletedTaskSuccess(false);
      setIsLoadingGetResultFromCompletedTask(true); // Show loader
      const client = await getDataProtectorCoreClient();
      const taskResult =
        await client.getResultFromCompletedTask({
          taskId,
          // The consuming app provided by iExec will store its result in a file named "content"
          path: 'content',
          onStatusUpdate: (status: unknown) => {
            console.log('[getResultFromCompletedTask] status', status);
          },
        });
      const decodedText = new TextDecoder().decode(taskResult.result);
      console.log('decodedText', decodedText);
      setContent(decodedText);
      setIsLoadingGetResultFromCompletedTask(false); // hide loader
      setResultFromCompletedTaskSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingGetResultFromCompletedTask(false); // hide loader
      console.error(e);
    }
  };

  const handleTaskIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskId(event.target.value);
  };

  const handleChainChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newChainId = Number(event.target.value);
    setSelectedChain(newChainId);

    // Switch MetaMask to the selected chain
    try {
      await switchToChain(newChainId);
    } catch (error) {
      console.error('Failed to switch chain:', error);
      setErrorMessage(`Failed to switch to chain ${newChainId}`);
    }
  };

  const switchToChain = async (chainId: number) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    // Find the chain configuration
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    if (!chain) {
      throw new Error(`Chain with ID ${chainId} not supported`);
    }

    const chainIdHex = `0x${chainId.toString(16)}`;

    try {
      // Switch to existing chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: unknown) {
      // If chain doesn't exist in MetaMask (error 4902), add it
      if ((switchError as { code?: number }).code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdHex,
              chainName: chain.name,
              nativeCurrency: {
                name: chain.tokenSymbol,
                symbol: chain.tokenSymbol,
                decimals: 18,
              },
              rpcUrls: chain.rpcUrls,
              blockExplorerUrls: [chain.blockExplorerUrl],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  };

  return (
    <>
      <div>
        <h2>Chain Selection
          <select onChange={handleChainChange} style={{ marginLeft: '10px' }}>
            {SUPPORTED_CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>{chain.name}</option>
            ))}
          </select>
        </h2>
        <div style={{ marginTop: '5px', fontSize: '12px', color: '#888' }}>
          Selected chain: {SUPPORTED_CHAINS.find(c => c.id === selectedChain)?.name} (ID: {selectedChain})
        </div>
        <div style={{ marginTop: '5px', fontSize: '12px', color: '#888' }}>
          Wallet Status: {isConnected ? 'Connected' : 'Not connected'}
        </div>
        {address && (
          <div style={{ marginTop: '2px', fontSize: '12px', color: '#888' }}>
            Address: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
        {chainId && (
          <div style={{ marginTop: '2px', fontSize: '12px', color: '#888' }}>
            Current MetaMask Chain: {SUPPORTED_CHAINS.find(c => c.id === chainId)?.name || `Unknown (${chainId})`}
          </div>
        )}
      </div>
      <div>
        <h2>Create Test Protected Data</h2>
        {isLoadingProtectData ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={protectData}>Create Test Protected Data</button>
        )}
        {protectDataSuccess && (
          <div style={{ marginTop: '4px' }}>
            <img
              src={successIcon}
              alt="success"
              height="30px"
              style={{ verticalAlign: 'middle' }}
            />
            Successful creation
          </div>
        )}
        {errorMessage && (
          <div style={{ marginTop: '10px', maxWidth: 300, color: 'red' }}>
            {errorMessage}
          </div>
        )}
        <hr style={{ marginTop: '30px' }} />
      </div>

      <div>
        <h3>Or if you have a completed Task ID</h3>
        <div>
          <label>
            Completed Task ID:{' '}
            <input
              name="Completed Task ID"
              value={taskId}
              style={{ width: '500px' }}
              onChange={handleTaskIdChange}
            />
          </label>
        </div>
        <div style={{ marginTop: '4px' }}>
          {isLoadingGetResultFromCompletedTask ? (
            <img src={loader} alt="loading" height="30px" />
          ) : (
            <button onClick={getResultFromCompletedTask}>
              Get Result From Completed Task
            </button>
          )}
        </div>
        {getResultFromCompletedTaskSuccess && (
          <div>
            <div style={{ marginTop: '4px' }}>
              <img
                src={successIcon}
                alt="success"
                height="30px"
                style={{ verticalAlign: 'middle' }}
              />
              The content of the rented Protected Data is:{' '}
            </div>
            <div
              style={{
                display: 'inline-block',
                marginTop: '4px',
                border: '1px solid blue',
                padding: '4px 6px',
                borderRadius: '4px',
              }}
            >
              {content}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
