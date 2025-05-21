import './Address.css'
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';

function Address() {

    const [savedAddresses, setSavedAddresses] = useState([1, 2, 3, 4]);
    const [newAddress, setNewAddress] = useState(savedAddresses.length === 0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const formRef = useRef(null);

    const handleNewAddressBack = () => {
        if (newAddress) {
            setNewAddress(false);
        }
    }

    const handleNewAddress = (e) => {
        if (e.target.closest('.back-space')) {
            return;
        }
        setNewAddress(true);
    }

    const handleEdit = () => {
        setNewAddress(true);
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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

                <form className="new-address-form" style={{ display: `${newAddress ? 'flex' : 'none'}` }} ref={formRef}>
                    <select name="states" className='state-selector'>
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
                        <option value="andhrapradesh">Andhra Pradesh</option>
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
                        <input type="text" placeholder='City' />
                        <input type="text" placeholder='locality' />
                    </div>

                    <div className='address-partition-div'>
                        <input type="text" placeholder='Pincode' />
                        <input type='number' placeholder='Phone Number' />
                    </div>

                    <textarea type="text" className='address-field' placeholder='Address (Area and Street)'></textarea>

                    <div className='address-partition-div'>
                        <input type="text" placeholder='Landmark (Optional)' />
                        <input type="text" placeholder='Alternate Phone (Optional)' />
                    </div>

                    <button type="submit" className='save-address-btn'>Save</button>
                </form>
            </div>

            <div className="address-list">
                <div className="saved-address-header">
                    <h3><FontAwesomeIcon icon={faSave} /> Saved Addresses : </h3>
                </div>

                <div className="address-list-container">
                    {savedAddresses.map(i => (
                        <div className="address-list-item" key={i}>
                            <div className="address-list-header">
                                <h4>Address {i}</h4>
                                <input 
                                    type="checkbox" 
                                    checked={i === selectedAddress} 
                                    onChange={() => setSelectedAddress(i === selectedAddress ? null : i)}
                                />
                            </div>
                            <p>Street Address or Area, XYZ City, State - <b>123456</b></p>
                            <div className="address-list-btns">
                                <button className='address-list-btn' onClick={handleEdit}>Edit</button>
                                <button className='address-list-btn'>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </motion.div>
    )
}

export default Address;