import './Address.css';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useContext } from 'react';
import { AddressContext } from '../../../context/AddressContext';

function Address() {
  const { addresses, activeAddressId, addAddress, updateAddress, deleteAddress, setActiveAddress, loading } = useContext(AddressContext);
  const [newAddress, setNewAddress] = useState(addresses.length === 0);
  const [editingAddress, setEditingAddress] = useState(null);
  const formRef = useRef(null);

  const handleNewAddressBack = () => {
    if (newAddress) {
      setNewAddress(false);
    }
  };

  const handleNewAddress = (e) => {
    if (e.target.closest('.back-space')) {
      return;
    }
    setNewAddress(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setNewAddress(true);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = (id) => {
    deleteAddress(id);
  };

  const handleSetActive = (id) => {
    setActiveAddress(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      state: formData.get('states'),
      city: formData.get('city'),
      locality: formData.get('locality'),
      zip: formData.get('pincode'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      landmark: formData.get('landmark') || '',
      alternatePhone: formData.get('alternatePhone') || '',
    };

    if (editingAddress) {
      await updateAddress(editingAddress._id, addressData);
    } else {
      await addAddress(addressData);
    }
    setNewAddress(false);
    setEditingAddress(null);
    e.target.reset();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='address-container'
    >
      <div className="address-header">
        <h1>Address :</h1>
        <p>Manage your address details</p>
      </div>

      <div className="new-address-container">
        <div className="new-address-header" onClick={handleNewAddress}>
          <h3><FontAwesomeIcon icon={faPlus} /> Add New Address</h3>
          <FontAwesomeIcon className='back-space' onClick={handleNewAddressBack} icon={faBackspace} style={{ display: `${newAddress ? 'block' : 'none'}` }} />
        </div>

        <form className="new-address-form" style={{ display: `${newAddress ? 'flex' : 'none'}` }} ref={formRef} onSubmit={handleSubmit}>
          <select name="states" className='state-selector' defaultValue={editingAddress?.state || 'state'} required>
            <option value="state">Select State</option>
            <option value="gujarat">Gujarat</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="punjab">Punjab</option>
            <option value="haryana">Haryana</option>
            <option value="karnataka">Karnataka</option>
            <option value="tamilnadu">Tamil Nadu</option>
            <option value="kerala">Kerala</option>
            <option value="uttarpradesh">Uttar Pradesh</option>
            <option value="bihar">Bihar</option>
            <option value="westbengal">West Bengal</option>
            <option value="odisha">Odisha</option>
            <option value="andhrapradesh}">Andhra Pradesh</option>
            <option value="telangana">Telangana</option>
            <option value="jharkhand">Jharkhand</option>
            <option value="chhattisgarh">Chhattisgarh</option>
            <option value="assam">Assam</option>
            <option value="tripura">Tripura</option>
            <option value="meghalaya">Meghalaya</option>
            <option value="manipur">Manipur</option>
            <option value="nagaland">Nagaland</option>
            <option value="sikkim">Sikkim</option>
            <option value="arunachalpradesh">Arunachal Pradesh</option>
            <option value="mizoram">Mizoram</option>
            <option value="himachalpradesh">Himachal Pradesh</option>
            <option value="uttarakhand">Uttarakhand</option>
            <option value="jammuandkashmir">Jammu and Kashmir</option>
            <option value="ladakh">Ladakh</option>
            <option value="delhi">Delhi</option>
            <option value="puducherry">Puducherry</option>
            <option value="chandigarh">Chandigarh</option>
            <option value="damananddiu">Daman and Diu</option>
            <option value="dadraandnagarhaveli">Dadra and Nagar Haveli</option>
            <option value="andamanandnicobar">Andaman and Nicobar Islands</option>
            <option value="lakshadweep">Lakshadweep</option>
          </select>

          <div className='address-partition-div'>
            <input type="text" name="city" placeholder='City' defaultValue={editingAddress?.city || ''} required />
            <input type="text" name="locality" placeholder='locality' defaultValue={editingAddress?.locality || ''} required />
          </div>

          <div className='address-partition-div'>
            <input type="text" name="pincode" placeholder='Pincode' defaultValue={editingAddress?.zip || ''} required />
            <input type='number' name="phone" placeholder='Phone Number' defaultValue={editingAddress?.phone || ''} required />
          </div>

          <textarea type="text" name="address" className='address-field' placeholder='Address (Area and Street)' defaultValue={editingAddress?.address || ''} required></textarea>

          <div className='address-partition-div'>
            <input type="text" name="landmark" placeholder='Landmark (Optional)' defaultValue={editingAddress?.landmark || ''} />
            <input type="text" name="alternatePhone" placeholder='Alternate Phone (Optional)' defaultValue={editingAddress?.alternatePhone || ''} />
          </div>

          <button type="submit" className='save-address-btn'>Save</button>
        </form>
      </div>

      <div className="address-list">
        <div className="saved-address-header">
          <h3><FontAwesomeIcon icon={faSave} /> Saved Addresses : </h3>
        </div>

        <div className="address-list-container">
          {addresses.length === 0 ? (
            <p>No addresses saved yet.</p>
          ) : (
            addresses.map(address => (
              <div className="address-list-item" key={address._id}>
                <div className="address-list-header">
                  <h4>Address {address._id}</h4>
                  <input
                    type="checkbox"
                    checked={activeAddressId && activeAddressId.toString() === address._id.toString()}
                    onChange={() => handleSetActive(address._id)}
                  />
                </div>
                <p>{address.address}, {address.locality}, {address.city}, {address.state} - <b>{address.zip}</b></p>
                <div className="address-list-btns">
                  <button className='address-list-btn' onClick={() => handleEdit(address)}>Edit</button>
                  <button className='address-list-btn' onClick={() => handleDelete(address._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Address;