import { CreateCollectionResponse, IExecDataProtector, ProtectedData } from '@iexec/dataprotector';
import { useState } from 'react';
import './App.css';
import loader from './assets/loader.gif';
import successIcon from './assets/success.png';

const iExecDataProtectorClient = new IExecDataProtector(window.ethereum);

function App() {
  const [protectedData, setProtectedData] = useState<ProtectedData | Record<string, never>>({});
  const [collection, setCollection] = useState<CreateCollectionResponse | Record<string, never>>({});
  const [protectedDataAddressInput, setProtectedDataAddressInput] = useState('');
  const [collectionIdInput, setCollectionIdInput] = useState('');
  const [protectedDataPriceInput, setProtectedDataPriceInput] = useState('');
  const [isLoadingProtectData, setIsLoadingProtectData] = useState(false);
  const [protectDataSuccess, setProtectDataSuccess] = useState(false);
  const [isLoadingCreateCollection, setIsLoadingCreateCollection] = useState(false);
  const [createCollectionSuccess, setCreateCollectionSuccess] = useState(false);
  const [isLoadingAddProtectedDataToCollection, setIsLoadingAddProtectedDataToCollection] = useState(false);
  const [addProtectedDataToCollectionSuccess, setAddProtectedDataToCollectionSuccess] = useState(false);
  const [isLoadingSetProtectedDataForSale, setIsLoadingSetProtectedDataForSale] = useState(false);
  const [setProtectedDataForSaleSuccess, setSetProtectedDataForSaleSuccess] = useState(false);
   const [isLoadingBuyProtectedData, setIsLoadingBuyProtectedData] = useState(false);
  const [buyProtectedDataSuccess, setBuyProtectedDataSuccess] = useState(false);


  const protectData = async () => {
    try {
      setProtectDataSuccess(false);
      setIsLoadingProtectData(true); // Show loader
      const protectedDataResponse = await iExecDataProtectorClient.core.protectData({
        data: { test: 'data protector sandbox test protected data' },
        name: 'data protector sandbox test protected data'
      });
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
      const collectionResponse = await iExecDataProtectorClient.sharing.createCollection();
      setCollection(collectionResponse);
      setCollectionIdInput(collectionResponse.collectionId.toString());
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
      await iExecDataProtectorClient.sharing.addToCollection({
        protectedData: protectedDataAddressInput,
        collectionId: +collectionIdInput
      });
      setIsLoadingAddProtectedDataToCollection(false); // hide loader
      setAddProtectedDataToCollectionSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingAddProtectedDataToCollection(false); // hide loader
      console.log(e);
    }
    
  };
  const setProtectedDataForSale = async () => {
    try {
      setSetProtectedDataForSaleSuccess(false);
      setIsLoadingSetProtectedDataForSale(true); // Show loader
      await iExecDataProtectorClient.sharing.setProtectedDataForSale({
        protectedData: protectedDataAddressInput,
        priceInNRLC: +protectedDataPriceInput
      });
      setIsLoadingSetProtectedDataForSale(false); // hide loader
      setSetProtectedDataForSaleSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingSetProtectedDataForSale(false); // hide loader
      console.log(e);
    }
  };
  const buyProtectedData = async () => {
    try {
      setBuyProtectedDataSuccess(false);
      setIsLoadingBuyProtectedData(true); // Show loader
      await iExecDataProtectorClient.sharing.buyProtectedData({
        protectedData: protectedDataAddressInput,
      });
      setIsLoadingBuyProtectedData(false); // hide loader
      setBuyProtectedDataSuccess(true); // show success icon
    } catch (e) {
      setIsLoadingBuyProtectedData(false); // hide loader
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
  

  return (
    <><div>
      <div><h2>Create Test Protected Data</h2></div>
      <div>
        {isLoadingProtectData ? <img src={loader} alt="loading" height='30px' /> : <button onClick={protectData}>Create Test Protected Data</button>}
        {protectDataSuccess ? <div>
  <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <img src={successIcon} alt="success" height='30px' style={{ verticalAlign: 'middle' }} /> 
    Successful creation
  </label>
</div>:<></>}
      </div>
      <hr/>
    </div>
      <div>
        <div><h2>Create Collection</h2></div>
        <div>
          {isLoadingCreateCollection ? <img src={loader} alt="loading" height='30px' /> : <button onClick={createCollection}>Create Collection</button>}
        {createCollectionSuccess ? <div>
  <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <img src={successIcon} alt="success" height='30px' style={{ verticalAlign: 'middle' }} /> 
    Successful creation
  </label>
</div>:<></>}
        
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
           {isLoadingAddProtectedDataToCollection ? <img src={loader} alt="loading" height='30px' /> : <button onClick={addToCollection}>Add Protected Data To Collection</button>}
        {addProtectedDataToCollectionSuccess ? <div>
  <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <img src={successIcon} alt="success" height='30px' style={{ verticalAlign: 'middle' }} /> 
    Protected Data Added to Collection
  </label>
</div>:<></>}
        
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
           {isLoadingSetProtectedDataForSale ? <img src={loader} alt="loading" height='30px' /> : <button onClick={setProtectedDataForSale}>Set Protected Data For Sale</button>}
        {setProtectedDataForSaleSuccess ? <div>
  <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <img src={successIcon} alt="success" height='30px' style={{ verticalAlign: 'middle' }} /> 
    Protected Data Set for Sale
  </label>
</div>:<></>}
        
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
         {isLoadingBuyProtectedData ? <img src={loader} alt="loading" height='30px' /> :  <button onClick={buyProtectedData}>Buy Protected Data</button>}
        {buyProtectedDataSuccess ? <div>
  <label style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <img src={successIcon} alt="success" height='30px' style={{ verticalAlign: 'middle' }} /> 
    You Now Own The Protected Data
  </label>
</div>:<></>}
        </div>
      </div>
    </>
  );
}

export default App;
