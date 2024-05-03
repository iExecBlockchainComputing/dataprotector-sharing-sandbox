import { CreateCollectionResponse, IExecDataProtector, ProtectedData } from '@iexec/dataprotector';
import { useState } from 'react';
import './App.css';
import loader from './assets/loader.gif';
import successIcon from './assets/success.png';

const iExecDataProtectorClient = new IExecDataProtector(window.ethereum);

function App() {
  //For CreateProtectedData
  const [protectedData, setProtectedData] = useState<ProtectedData | Record<string, never>>({});
  const [protectedDataAddressInput, setProtectedDataAddressInput] = useState('');
  const [isLoadingProtectData, setIsLoadingProtectData] = useState(false);
  const [protectDataSuccess, setProtectDataSuccess] = useState(false);
  //For CreateCollection
  const [collection, setCollection] = useState<CreateCollectionResponse | Record<string, never>>({});
  const [collectionIdInput, setCollectionIdInput] = useState('');
  const [isLoadingCreateCollection, setIsLoadingCreateCollection] = useState(false);
  const [createCollectionSuccess, setCreateCollectionSuccess] = useState(false);
  //For AddToCollection
  const [isLoadingAddProtectedDataToCollection, setIsLoadingAddProtectedDataToCollection] = useState(false);
  const [addProtectedDataToCollectionSuccess, setAddProtectedDataToCollectionSuccess] = useState(false);
  //For SetProtectDataToRenting
  const [protectedDataPriceInput, setProtectedDataPriceInput] = useState('');
  const [isLoadingSetProtectedDataToRenting, setIsLoadingSetProtectedDataToRenting] = useState(false);
  const [setProtectedDataToRentingSuccess, setSetProtectedDataToRentingSuccess] = useState(false);
  //For RentProtectedData
  const [isLoadingRentProtectedData, setIsLoadingRentProtectedData] = useState(false);
  const [isLoadingConsumeProtectedData, setIsLoadingConsumeProtectedData] = useState(false);
  const [rentProtectedDataSuccess, setRentProtectedDataSuccess] = useState(false);
  //For ConsumeProtectedData
  const [consumeProtectedDataSuccess, setConsumeProtectedDataSuccess] = useState(false);
  const [content, setContent] = useState('');
  //For GetResultFromCompletedTask
  const [taskId, setTaskId] = useState('');
  const [isLoadingGetResultFromCompletedTask, setIsLoadingGetResultFromCompletedTask] = useState(false);
  const [getResultFromCompletedTaskSuccess, setResultFromCompletedTaskSuccess] = useState(false);

  const protectData = async () => {
    try {
      setProtectDataSuccess(false);
      setIsLoadingProtectData(true); // Show loader
      const protectedDataResponse = await iExecDataProtectorClient.core.protectData({
        data: { file: 'data protector sandbox test protected data' }, // field "file" must be used if you use the iExec iDapp build for demo
        name: 'data protector sandbox test protected data',
      });
      console.log('protectedDataResponse: ', protectedDataResponse);

      setProtectedData(protectedDataResponse);
      setProtectedDataAddressInput(protectedDataResponse.address);
      setIsLoadingProtectData(false); // hide loader
      setProtectDataSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingProtectData(false); // hide loader
      console.log(e);
    }
  };

  const createCollection = async () => {
    try {
      setCreateCollectionSuccess(false);
      setIsLoadingCreateCollection(true); // Show loader
      const createCollectionResponse = await iExecDataProtectorClient.sharing.createCollection();
      console.log(createCollectionResponse);

      setCollection(createCollectionResponse);
      setCollectionIdInput(createCollectionResponse.collectionId.toString());
      setIsLoadingCreateCollection(false); // hide loader
      setCreateCollectionSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingCreateCollection(false); // hide loader
      console.log(e);
    }
  };

  const addToCollection = async () => {
    try {
      setAddProtectedDataToCollectionSuccess(false);
      setIsLoadingAddProtectedDataToCollection(true); // Show loader
      const addToCollectionResult = await iExecDataProtectorClient.sharing.addToCollection({
        protectedData: protectedDataAddressInput,
        collectionId: +collectionIdInput,
        addOnlyAppWhitelist: '0x334dc0bb08fb32a4e9917197e5e626de4b6b9b87', //AppWhitelist Managed by iExec Team
      });
      console.log('addToCollectionResult: ', addToCollectionResult);

      setIsLoadingAddProtectedDataToCollection(false); // hide loader
      setAddProtectedDataToCollectionSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingAddProtectedDataToCollection(false); // hide loader
      console.log(e);
    }
  };

  const setProtectedDataToRenting = async () => {
    try {
      setSetProtectedDataToRentingSuccess(false);
      setIsLoadingSetProtectedDataToRenting(true); // Show loader
      const setProtectedDataToRentingResult = await iExecDataProtectorClient.sharing.setProtectedDataToRenting({
        protectedData: protectedDataAddressInput,
        price: +protectedDataPriceInput,
        duration: 60 * 60 * 24 * 30,
      });
      console.log('setProtectedDataToRentingResult: ', setProtectedDataToRentingResult);

      setIsLoadingSetProtectedDataToRenting(false); // hide loader
      setSetProtectedDataToRentingSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingSetProtectedDataToRenting(false); // hide loader
      console.log(e);
    }
  };

  const rentProtectedData = async () => {
    try {
      setRentProtectedDataSuccess(false);
      setIsLoadingRentProtectedData(true); // Show loader
      const rentProtectedDataResult = await iExecDataProtectorClient.sharing.rentProtectedData({
        protectedData: protectedDataAddressInput,
        price: +protectedDataPriceInput,
        duration: 60 * 60 * 24 * 30,
      });
      console.log('rentProtectedDataResult', rentProtectedDataResult);

      setIsLoadingRentProtectedData(false); // hide loader
      setRentProtectedDataSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingRentProtectedData(false); // hide loader
      console.log(e);
    }
  };

  const consumeProtectedData = async () => {
    try {
      setConsumeProtectedDataSuccess(false);
      setIsLoadingConsumeProtectedData(true); // Show loader
      const consumeProtectedDataResult = await iExecDataProtectorClient.sharing.consumeProtectedData({
        protectedData: protectedDataAddressInput,
        app: '0xF248000F0E99e9203FdBE509019f008F9c169705', //An iDapp from the AppWhitelist Managed by iExec Team
        onStatusUpdate: (status) => {
          console.log('[consumeProtectedData] status', status);
        },
      });
      console.log('consumeProtectedDataResult: ', consumeProtectedDataResult);

      setContent(consumeProtectedDataResult.contentAsObjectURL);
      setIsLoadingConsumeProtectedData(false); // hide loader
      setConsumeProtectedDataSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingConsumeProtectedData(false); // hide loader
      console.log(e);
    }
  };

  const getResultFromCompletedTask = async () => {
    try {
      setResultFromCompletedTaskSuccess(false);
      setIsLoadingGetResultFromCompletedTask(true); // Show loader
      const taskResult = await iExecDataProtectorClient.sharing.getResultFromCompletedTask({
        taskId,
        onStatusUpdate: (status) => {
          console.log('[getResultFromCompletedTask] status', status);
        },
      });
      console.log('getResultFromCompletedTask: ', taskResult);

      setContent(taskResult.contentAsObjectURL);
      setIsLoadingGetResultFromCompletedTask(false); // hide loader
      setResultFromCompletedTaskSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingGetResultFromCompletedTask(false); // hide loader
      console.log(e);
    }
  };

  const handleProtectedDataAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProtectedDataAddressInput(event.target.value);
  };

  const handleCollectionIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCollectionIdInput(event.target.value);
  };

  const handleProtectedDataPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProtectedDataPriceInput(event.target.value);
  };

  const handleTaskIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskId(event.target.value);
  };

  function download() {
    const element = document.createElement('a');
    element.setAttribute('href', content);
    element.setAttribute('download', 'ProtectedDataFile.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return (
    <>
      <div>
        <h2>Create Test Protected Data</h2>
        {isLoadingProtectData ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={protectData}>Create Test Protected Data</button>
        )}
        {protectDataSuccess ? (
          <div>
            <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <img src={successIcon} alt="success" height="30px" style={{ verticalAlign: 'middle' }} />
              Successful creation
            </label>
          </div>
        ) : (
          <></>
        )}
        <hr />
      </div>

      <div>
        <h2>Create Collection</h2>
        {isLoadingCreateCollection ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={createCollection}>Create Collection</button>
        )}
        {createCollectionSuccess ? (
          <div>
            <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <img src={successIcon} alt="success" height="30px" style={{ verticalAlign: 'middle' }} />
              Successful creation
            </label>
          </div>
        ) : (
          <></>
        )}
        <hr />
      </div>

      <div>
        <h2>Add Protected Data To Collection</h2>
        <div>
          <label>
            Protected Data Address:{' '}
            <input
              name="Protected Data Address"
              value={protectedData.address}
              style={{ width: '350px' }}
              onChange={handleProtectedDataAddressChange}
            />
          </label>
        </div>
        <div>
          <label>
            Collection Id:{' '}
            <input name="Collection Id" value={collection.collectionId} onChange={handleCollectionIdChange} />
          </label>
        </div>
        {isLoadingAddProtectedDataToCollection ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={addToCollection}>Add Protected Data To Collection</button>
        )}
        {addProtectedDataToCollectionSuccess ? (
          <div>
            <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <img src={successIcon} alt="success" height="30px" style={{ verticalAlign: 'middle' }} />
              Protected Data Added to Collection
            </label>
          </div>
        ) : (
          <></>
        )}
        <hr />
      </div>

      <div>
        <div>
          <h2>Set Protected Data To Renting</h2>
          <label>
            Protected Data Address:{' '}
            <input
              name="Protected Data Address"
              value={protectedData.address}
              style={{ width: '350px' }}
              onChange={handleProtectedDataAddressChange}
            />
          </label>
        </div>
        <div>
          <label>
            Price of Protected Data:{' '}
            <input name="Protected Data Price" defaultValue="0" onChange={handleProtectedDataPriceChange} />
          </label>
        </div>
        {isLoadingSetProtectedDataToRenting ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={setProtectedDataToRenting}>Set Protected Data to Renting</button>
        )}
        {setProtectedDataToRentingSuccess ? (
          <div>
            <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <img src={successIcon} alt="success" height="30px" style={{ verticalAlign: 'middle' }} />
              Protected Data Set to Renting
            </label>
          </div>
        ) : (
          <></>
        )}
        <hr />
      </div>

      <div>
        <h2>Rent Protected Data</h2>
        <div>
          <label>
            Protected Data Address:{' '}
            <input
              name="Protected Data Address"
              value={protectedData.address}
              style={{ width: '350px' }}
              onChange={handleProtectedDataAddressChange}
            />
          </label>
        </div>
        {isLoadingRentProtectedData ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={rentProtectedData}>Rent Protected Data</button>
        )}
        {rentProtectedDataSuccess ? (
          <div>
            <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <img src={successIcon} alt="success" height="30px" style={{ verticalAlign: 'middle' }} />
              You are Now Renting The Protected Data
            </label>
          </div>
        ) : (
          <></>
        )}
        <hr />
      </div>

      <div>
        <h2>Consume Your Own Protected Data</h2>
        {isLoadingConsumeProtectedData ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={consumeProtectedData}>Consume Protected Data</button>
        )}
        {consumeProtectedDataSuccess && (
          <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <img src={successIcon} alt="success" height="30px" style={{ verticalAlign: 'middle' }} />
            You can now visualize the rented Protected Data:{' '}
            <button
              type="button"
              onClick={() => {
                download();
              }}
            >
              Download File
            </button>
          </label>
        )}
      </div>

      <div>
        <h3>Or if you have a completed Task ID</h3>
        <div>
          <label>
            Completed Task ID:{' '}
            <input name="Completed Task ID" value={taskId} style={{ width: '500px' }} onChange={handleTaskIdChange} />
          </label>
        </div>
        {isLoadingGetResultFromCompletedTask ? (
          <img src={loader} alt="loading" height="30px" />
        ) : (
          <button onClick={getResultFromCompletedTask}>Get Result From Completed Task</button>
        )}
        {getResultFromCompletedTaskSuccess && (
          <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <img src={successIcon} alt="success" height="30px" style={{ verticalAlign: 'middle' }} />
            You can now visualize the rented Protected Data:{' '}
            <button
              type="button"
              onClick={() => {
                download();
              }}
            >
              Download File
            </button>
          </label>
        )}
      </div>
    </>
  );
}

export default App;
