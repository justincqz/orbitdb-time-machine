import { useState } from 'react';
import { isValidAddress } from 'orbit-db';

const useDBFormHandler: (history: any) => { 
  error: string | null, 
  address: string, 
  setAddress: React.Dispatch<string>, 
  submit: () => void } = (history) => {
  // Current address
  const [address, setAddress] = useState("orbitdb/");
  // Error message
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Handle submit
  function submit() {
    // Reset error message
    setErrorMessage(null);
    // Veryify address
    if (!isValidAddress(address)) {
      setErrorMessage(`Invalid address ${address}`);
      return;
    }
    // Set URL to address
    history.push(address);
  }

  return {
    error: errorMessage,
    address: address,
    setAddress: setAddress,
    submit: submit
  }
}

export default useDBFormHandler;
