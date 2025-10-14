import { IExecDataProtector } from '@iexec/dataprotector';
import { useState } from 'react';
import './App.css';
import loader from './assets/loader.gif';
import successIcon from './assets/success.png';
import { checkCurrentChain, checkIsConnected } from './utils/utils.ts';

const iExecDataProtectorClient = new IExecDataProtector(window.ethereum);

function App() {
  const [errorMessage, setErrorMessage] = useState('');

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
    await checkCurrentChain();
    try {
      setProtectDataSuccess(false);
      setIsLoadingProtectData(true); // Show loader
      const protectedDataResponse =
        await iExecDataProtectorClient.core.protectData({
          data: {
            // A binary "file" field must be used if you use the app provided by iExec
            file: new TextEncoder().encode(
              'DataProtector Sharing > Sandbox test!'
            ),
          },
          name: 'DataProtector Sharing Sandbox - Test protected data',
        });
      console.log('protectedDataResponse', protectedDataResponse);

      console.log('Protected data address:', protectedDataResponse.address);
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
    await checkCurrentChain();
    try {
      setResultFromCompletedTaskSuccess(false);
      setIsLoadingGetResultFromCompletedTask(true); // Show loader
      const taskResult =
        await iExecDataProtectorClient.core.getResultFromCompletedTask({
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

  return (
    <>
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
