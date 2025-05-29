import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [activeAddressId, setActiveAddressId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setAddresses(data.addresses || []);
      setActiveAddressId(data.activeAddressId);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const addAddress = async (addressData) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      if (res.ok) await fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const updateAddress = async (id, addressData) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      if (res.ok) await fetchAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const setActiveAddress = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user/active-address`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addressId: id }),
      });
      if (res.ok) {
        setActiveAddressId(id);
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting active address:', error);
    }
  };

  return (
    <AddressContext.Provider value={{
      addresses,
      activeAddressId,
      loading,
      addAddress,
      updateAddress,
      deleteAddress,
      setActiveAddress,
    }}>
      {children}
    </AddressContext.Provider>
  );
};