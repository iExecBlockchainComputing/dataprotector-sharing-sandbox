import { CreateCollectionResponse, IExecDataProtector, ProtectedData } from '@iexec/dataprotector';
import { useState } from 'react';
import './App.css';

const iExecDataProtectorClient = new IExecDataProtector(window.ethereum);

function App() {
  const [protectedData, setProtectedData] = useState<ProtectedData | Record<string, never>>({});
  const [collection, setCollection] = useState<CreateCollectionResponse | Record<string, never>>({});
  const [protectedDataAddressInput, setProtectedDataAddressInput] = useState('');
  const [collectionIdInput, setCollectionIdInput] = useState('');
  const [protectedDataPriceInput, setProtectedDataPriceInput] = useState('');

  const protectData = async () => {
    const protectedDataResponse = await iExecDataProtectorClient.core.protectData({
      data: { test: 'data protector sandbox test protected data' },
      name: 'data protector sandbox test protected data'
    });
    setProtectedData(protectedDataResponse);
    setProtectedDataAddressInput(protectedDataResponse.address);
  };

  const createCollection = async () => {
    const collectionResponse = await iExecDataProtectorClient.sharing.createCollection();
    setCollection(collectionResponse);
    setCollectionIdInput(collectionResponse.collectionId.toString());
  };

  const addToCollection = async () => {
     await iExecDataProtectorClient.sharing.addToCollection({
      protectedData: protectedDataAddressInput,
      collectionId: +collectionIdInput
    });
    
  };
  const setProtectedDataForSale = async () => {
     await iExecDataProtectorClient.sharing.setProtectedDataForSale({
       protectedData: protectedDataAddressInput,
       priceInNRLC: +protectedDataPriceInput
    });
    
  };
const buyProtectedData = async () => {
     await iExecDataProtectorClient.sharing.buyProtectedData({
       protectedData: protectedDataAddressInput,       
    });
    
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

  return (
    <><div>
      <div><h2>Create Test Protected Data</h2></div>
      <div>
        <button onClick={protectData}>Create Test Protected Data</button>
      </div>
      <hr/>
    </div>
      <div>
        <div><h2>Create Collection</h2></div>
      <div>
        <button onClick={createCollection}>Create Collection</button>
        </div>
        <hr/>
        </div>
      <div>
        <div>
        <div><h2>Add Protected Data To Collection</h2></div>
        <div>
          <label>
            Protected Data Address:
            <input 
              name="Protected Data Address" 
              value={protectedData.address} 
              onChange={handleProtectedDataAddressChange} 
            />
          </label>
        </div>
        <div>
          <label>
            Collection Id:
            <input 
              name="Collection Id" 
              value={collection.collectionId} 
              onChange={handleCollectionIdChange} 
            />
          </label>
        </div>
        <button onClick={addToCollection}>Add Protected Data To Collection</button>
        </div>
        <hr/>
      </div>
      <div>
        <div>
        <div><h2>Set Protected Data For Sale</h2></div>
        <div>
          <label>
            Protected Data Address:
            <input 
              name="Protected Data Address" 
              value={protectedData.address} 
              onChange={handleProtectedDataAddressChange} 
            />
          </label>
        </div>
        <div>
          <label>
            Price of Protected Data:
            <input 
              name="Protected Data Price" 
              defaultValue='0' 
              onChange={handleProtectedDataPriceChange} 
            />
          </label>
        </div>
        <button onClick={setProtectedDataForSale}>Set Protected Data For Sale</button>
        </div>
        <hr/>
      </div>

      <div><div>
        <div><h2>Buy Protected Data</h2></div>
        <div>
          <label>
            Protected Data Address:
            <input 
              name="Protected Data Address" 
              value={protectedData.address} 
              onChange={handleProtectedDataAddressChange} 
            />
          </label>
        </div>
        <button onClick={buyProtectedData}>Buy Protected Data</button>
        </div>
      </div>
    </>
  );
}

export default App;
