import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faCreditCard,
    faDownload,
    faList,
    faLock,
    faQuestionCircle,
    faShieldAlt,
    faSpinner,
    faCheck,
    faMobileAlt,
    faMapMarkedAlt,
    faUser,
    faCalendar,
    faTicket,
    faUniversity,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PaymentPage.css';
import { useAuth } from '../../context/AuthContext';
import sbi from './sbi.png';
import hdfc from './hdfc.png';
import icici from './icici.png';
import axis from './axis.png';

const PaymentMethods = {
    CARD: 'card',
    NETBANKING: 'netbanking',
    UPI: 'upi',
};

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, logout } = useAuth();

    const [userDetails, setUserDetails] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!token) {
                console.warn('No token available, redirecting to signin');
                toast.error('Please log in to view your details');
                setTimeout(() => navigate('/signin'), 3000);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched user data:', data);
                    setUserDetails({
                        firstname: data.firstname || '',
                        lastname: data.lastname || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        street: data.street || '',
                        city: data.city || '',
                        state: data.state || '',
                        zip: data.zip || '',
                    });
                } else {
                    console.error('Failed to fetch user details, status:', response.status);
                    toast.error(`Failed to fetch user details: ${response.status} ${response.statusText}`);
                    if (response.status === 401) {
                        toast.error('Unauthorized: Please log in again');
                        logout();
                    }
                }
            } catch (error) {
                console.error('Error fetching user details:', error.message);
                toast.error('Error fetching user details. Check console for details.');
            }
        };
        fetchUserDetails();
    }, [token, navigate, logout]);

    const [currentStep, setCurrentStep] = useState('details');
    const [paymentMethod, setPaymentMethod] = useState(PaymentMethods.CARD);
    const [cardDetails, setCardDetails] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: '',
        saveCard: true,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [editableUserDetails, setEditableUserDetails] = useState({
        ...userDetails,
        isEditing: false,
        detailsConfirmed: false,
    });
    const [selectedBank, setSelectedBank] = useState(null);

    const popularBanks = [
        { name: 'State Bank of India (SBI)', logo: sbi },
        { name: 'HDFC Bank', logo: hdfc },
        { name: 'ICICI Bank', logo: icici },
        { name: 'Axis Bank', logo: axis },
    ];

    const otherBanks = [
        'Allahabad Bank',
        'Andhra Bank',
        'Bank of Baroda',
        'Bank of India',
        'Bank of Maharashtra',
        'Canara Bank',
        'Central Bank of India',
        'Corporation Bank',
        'Dena Bank',
        'IDBI Bank',
        'Indian Bank',
        'Indian Overseas Bank',
        'Oriental Bank of Commerce',
        'Punjab & Sind Bank',
        'Punjab National Bank',
        'Syndicate Bank',
        'UCO Bank',
        'Union Bank of India',
        'United Bank of India',
        'Vijaya Bank',
        'Yes Bank',
        'Kotak Mahindra Bank',
    ];

    useEffect(() => {
        setEditableUserDetails((prev) => ({
            ...prev,
            ...userDetails,
            isEditing: false,
            detailsConfirmed: false,
        }));
    }, [userDetails]);

    const product = location.state?.product || { price: 99, title: 'Adventure Experience', description: 'Outdoor activity package' };
    const participants = location.state?.participants || 2;
    const selectedDate = location.state?.selectedDate || new Date();
    const calculateSubtotal = () => (product.price || 0) * (participants || 1);
    const calculateTotal = () => calculateSubtotal();

    const handlePaymentMethodSelect = (method) => setPaymentMethod(method);

    const handleCardInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCardDetails((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateCardDetails = () => {
        const newErrors = {};
        if (!cardDetails.name.trim()) newErrors.name = 'Cardholder name is required';
        if (!cardDetails.number.trim()) {
            newErrors.number = 'Card number is required';
        } else if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
            newErrors.number = 'Must be 16 digits';
        }
        if (!cardDetails.expiry.trim()) {
            newErrors.expiry = 'Expiry date is required';
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
            newErrors.expiry = 'Use MM/YY format';
        }
        if (!cardDetails.cvv.trim()) {
            newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
            newErrors.cvv = 'Must be 3-4 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditUserDetails = () => {
        setEditableUserDetails((prev) => ({ ...prev, isEditing: true }));
    };

    const handleSaveUserDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: editableUserDetails.firstname,
                    lastname: editableUserDetails.lastname,
                    street: editableUserDetails.street,
                    city: editableUserDetails.city,
                    state: editableUserDetails.state,
                    zip: editableUserDetails.zip,
                }),
            });
            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Updated user data:', updatedUser);
                setUserDetails({
                    ...userDetails,
                    firstname: updatedUser.firstname || '',
                    lastname: updatedUser.lastname || '',
                    street: updatedUser.street || '',
                    city: updatedUser.city || '',
                    state: updatedUser.state || '',
                    zip: updatedUser.zip || '',
                });
                setEditableUserDetails((prev) => ({ ...prev, isEditing: false }));
                toast.success('Billing details updated.');
            } else {
                console.error('Failed to update user details, status:', response.status);
                toast.error(`Failed to update user details: ${response.status} ${response.statusText}`);
                if (response.status === 401) {
                    toast.error('Unauthorized: Please log in again');
                    logout();
                }
            }
        } catch (error) {
            console.error('Error updating user details:', error.message);
            toast.error('Error updating user details. Check console for details.');
        }
    };

    const handleUserDetailsChange = (e) => {
        const { name, value } = e.target;
        setEditableUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirmDetails = () => {
        setEditableUserDetails((prev) => ({ ...prev, detailsConfirmed: true }));
        setCurrentStep('payment');
    };

    const handlePayment = (e) => {
        e.preventDefault();
        if (paymentMethod === PaymentMethods.CARD && !validateCardDetails()) {
            toast.error('Please fix card details.');
            return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setCurrentStep('confirmation');
        }, 1500);
    };

    const handleBack = () => {
        if (currentStep === 'payment') setCurrentStep('details');
        else if (currentStep === 'confirmation') setCurrentStep('payment');
        else navigate(-1);
    };

    const handleDownloadTicket = () => toast.success('Ticket downloaded.');
    const handleViewBookingDetails = () => navigate('/bookings');

    return (
        <motion.div
            className="payment-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Header */}
            <header className='payment-header'>
                <div>
                    <button className="back-button" onClick={handleBack}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Back</span>
                    </button>
                    <h1>Payment</h1>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <div>
                    {/* Payment Form */}
                    <div className="payment-form-wrapper">
                        {/* Progress Indicator */}
                        <div className="payment-form">
                            <div className="progress-container">
                                <div className="progress-step">
                                    <div className={`progress-step-number ${currentStep !== 'details' ? 'completed' : ''}`}>
                                        {currentStep !== 'details' ? <FontAwesomeIcon icon={faCheck} /> : 1}
                                    </div>
                                    <span className="progress-step-text">Details</span>
                                </div>
                                <div className="progress-line">
                                    <div
                                        className="progress-line-fill"
                                        style={{ width: currentStep === 'details' ? '0%' : '100%' }}
                                    />
                                </div>
                                <div className="progress-step">
                                    <div
                                        className={`progress-step-number ${currentStep === 'payment' ? '' : currentStep === 'confirmation' ? 'completed' : 'inactive'
                                            }`}
                                    >
                                        {currentStep === 'confirmation' ? <FontAwesomeIcon icon={faCheck} /> : 2}
                                    </div>
                                    <span className="progress-step-text">Payment</span>
                                </div>
                                <div className="progress-line">
                                    <div
                                        className="progress-line-fill"
                                        style={{ width: currentStep === 'confirmation' ? '100%' : '0%' }}
                                    />
                                </div>
                                <div className="progress-step">
                                    <div className={`progress-step-number ${currentStep === 'confirmation' ? '' : 'inactive'}`}>
                                        3
                                    </div>
                                    <span className="progress-step-text">Confirm</span>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* User Details */}
                            {currentStep === 'details' && (
                                <motion.div
                                    key="user-details"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="payment-form"
                                >
                                    <h2 className="form-heading">Your Details</h2>
                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <div>
                                                <label className="form-label" htmlFor="fullName">
                                                    Full Name
                                                </label>
                                                {!editableUserDetails.isEditing && (
                                                    <button
                                                        type="button"
                                                        onClick={handleEditUserDetails}
                                                        className="text-primary"
                                                    >
                                                        Change
                                                    </button>
                                                )}
                                            </div>
                                            {editableUserDetails.isEditing ? (
                                                <div className="space-y-3">
                                                    <input
                                                        id="firstname"
                                                        name="firstname"
                                                        type="text"
                                                        className="form-input input-focus"
                                                        value={editableUserDetails.firstname}
                                                        onChange={handleUserDetailsChange}
                                                    />
                                                    <input
                                                        id="lastname"
                                                        name="lastname"
                                                        type="text"
                                                        className="form-input input-focus"
                                                        value={editableUserDetails.lastname}
                                                        onChange={handleUserDetailsChange}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50">
                                                    {`${editableUserDetails.firstname} ${editableUserDetails.lastname}`}
                                                </div>
                                            )}
                                        </div>

                                        <div className="details-grid">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="email">
                                                    Email
                                                </label>
                                                <div className="bg-gray-50">
                                                    {editableUserDetails.email}
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="phone">
                                                    Phone
                                                </label>
                                                <div className="bg-gray-50">
                                                    {editableUserDetails.phone}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div>
                                                <label className="form-label">Billing Address</label>
                                                {!editableUserDetails.isEditing && (
                                                    <button
                                                        type="button"
                                                        onClick={handleEditUserDetails}
                                                        className="text-primary"
                                                    >
                                                        Change
                                                    </button>
                                                )}
                                            </div>
                                            {editableUserDetails.isEditing ? (
                                                <div className="space-y-3">
                                                    <input
                                                        name="street"
                                                        type="text"
                                                        className="form-input input-focus"
                                                        placeholder="Street Address"
                                                        value={editableUserDetails.street}
                                                        onChange={handleUserDetailsChange}
                                                    />
                                                    <div className="address-grid">
                                                        <input
                                                            name="city"
                                                            type="text"
                                                            className="form-input input-focus"
                                                            placeholder="City"
                                                            value={editableUserDetails.city}
                                                            onChange={handleUserDetailsChange}
                                                        />
                                                        <input
                                                            name="state"
                                                            type="text"
                                                            className="form-input input-focus"
                                                            placeholder="State"
                                                            value={editableUserDetails.state}
                                                            onChange={handleUserDetailsChange}
                                                        />
                                                    </div>
                                                    <input
                                                        name="zip"
                                                        type="text"
                                                        className="form-input input-focus"
                                                        style={{ width: '50%' }}
                                                        placeholder="ZIP Code"
                                                        value={editableUserDetails.zip}
                                                        onChange={handleUserDetailsChange}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50">
                                                    <p>{editableUserDetails.street}</p>
                                                    <p>
                                                        {editableUserDetails.city}, {editableUserDetails.state} {editableUserDetails.zip}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {editableUserDetails.isEditing && (
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleSaveUserDetails}
                                                    className="submit-button"
                                                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-6">
                                            <button
                                                type="button"
                                                className="submit-button"
                                                onClick={handleConfirmDetails}
                                                disabled={editableUserDetails.isEditing}
                                            >
                                                Confirm Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Payment Methods */}
                            {currentStep === 'payment' && (
                                <motion.div
                                    key="payment-methods"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="payment-form">
                                        <h2 className="form-heading">Select Payment Method</h2>
                                        <div className="payment-method-grid">
                                            <div
                                                className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodSelect('card')}
                                            >
                                                <FontAwesomeIcon icon={faCreditCard} className="text-2xl text-primary mb-2" />
                                                <span className="font-medium">Credit/Debit Card</span>
                                            </div>
                                            <div
                                                className={`payment-method-card ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodSelect('netbanking')}
                                            >
                                                <FontAwesomeIcon icon={faUniversity} className="text-2xl text-green-600 mb-2" />
                                                <span className="font-medium">NetBanking</span>
                                            </div>
                                            <div
                                                className={`payment-method-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                                                onClick={() => handlePaymentMethodSelect('upi')}
                                            >
                                                <FontAwesomeIcon icon={faMobileAlt} className="text-2xl text-secondary mb-2" />
                                                <span className="font-medium">UPI</span>
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {paymentMethod === 'card' && (
                                            <motion.div
                                                key="card-form"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="payment-form"
                                            >
                                                <h2 className="form-heading">Card Details</h2>
                                                <form onSubmit={handlePayment}>
                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="cardName">
                                                            Cardholder Name
                                                        </label>
                                                        <input
                                                            id="cardName"
                                                            name="name"
                                                            type="text"
                                                            className="form-input input-focus"
                                                            style={{ borderColor: errors.name ? '#EF4444' : '' }}
                                                            placeholder="John Doe"
                                                            value={cardDetails.name}
                                                            onChange={handleCardInputChange}
                                                        />
                                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="form-label" htmlFor="cardNumber">
                                                            Card Number
                                                        </label>
                                                        <div className="input-group">
                                                            <FontAwesomeIcon icon={faCreditCard} className="input-icon-left" />
                                                            <input
                                                                id="cardNumber"
                                                                name="number"
                                                                type="text"
                                                                className="form-input with-left-icon with-right-icon input-focus"
                                                                style={{ borderColor: errors.number ? '#EF4444' : '' }}
                                                                placeholder="1234 5678 9012 3456"
                                                                value={cardDetails.number}
                                                                onChange={handleCardInputChange}
                                                            />
                                                            <div className="input-icon-right">
                                                                <FontAwesomeIcon icon={faCcVisa} style={{ color: '#1A1F71', marginRight: '0.25rem' }} />
                                                                <FontAwesomeIcon icon={faCcMastercard} style={{ color: '#EB001B' }} />
                                                            </div>
                                                        </div>
                                                        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                                                    </div>

                                                    <div className="form-row">
                                                        <div className="form-col">
                                                            <label className="form-label" htmlFor="expiryDate">
                                                                Expiry Date
                                                            </label>
                                                            <input
                                                                id="expiryDate"
                                                                name="expiry"
                                                                type="text"
                                                                className="form-input input-focus"
                                                                style={{ borderColor: errors.expiry ? '#EF4444' : '' }}
                                                                placeholder="MM/YY"
                                                                value={cardDetails.expiry}
                                                                onChange={handleCardInputChange}
                                                            />
                                                            {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                                                        </div>
                                                        <div className="form-col">
                                                            <label className="form-label" htmlFor="cvv">
                                                                CVV
                                                            </label>
                                                            <div className="input-group">
                                                                <input
                                                                    id="cvv"
                                                                    name="cvv"
                                                                    type="text"
                                                                    className="form-input with-right-icon input-focus"
                                                                    style={{ borderColor: errors.cvv ? '#EF4444' : '' }}
                                                                    placeholder="123"
                                                                    value={cardDetails.cvv}
                                                                    onChange={handleCardInputChange}
                                                                />
                                                                <FontAwesomeIcon
                                                                    icon={faQuestionCircle}
                                                                    className="input-icon-right"
                                                                    style={{ color: '#9CA3AF', cursor: 'help' }}
                                                                    title="3-digit code on back"
                                                                />
                                                            </div>
                                                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="checkbox-container">
                                                        <input
                                                            type="checkbox"
                                                            id="saveCard"
                                                            name="saveCard"
                                                            checked={cardDetails.saveCard}
                                                            onChange={handleCardInputChange}
                                                        />
                                                        <label htmlFor="saveCard" className="text-sm text-gray-600">
                                                            Save card for future payments
                                                        </label>
                                                    </div>

                                                    <button type="submit" className="submit-button" disabled={isProcessing}>
                                                        {isProcessing ? (
                                                            <>
                                                                <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '0.5rem' }} />
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            `Pay $${calculateTotal().toFixed(2)}`
                                                        )}
                                                    </button>

                                                    <p className="text-center text-sm text-gray-500 mt-4">
                                                        <FontAwesomeIcon icon={faLock} style={{ marginRight: '0.25rem' }} />
                                                        Secure payment
                                                    </p>
                                                </form>
                                            </motion.div>
                                        )}

                                        {paymentMethod === 'netbanking' && (
                                            <motion.div
                                                key="netbanking-form"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="payment-form netbanking-section"
                                            >
                                                <h2 className="form-heading">NetBanking</h2>
                                                <p className="text-gray-600 mb-4">Choose your bank for a secure payment experience.</p>

                                                <div className="mb-6 popular-banks-container">
                                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Banks</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {popularBanks.map((bank) => (
                                                            <div
                                                                key={bank.name}
                                                                className={`bank-card ${selectedBank === bank.name ? 'selected' : ''}`}
                                                                onClick={() => setSelectedBank(bank.name)}
                                                            >
                                                                <img
                                                                    src={`${bank.logo}`}
                                                                    alt={`${bank.name} Logo`}
                                                                    className="bank-logo"
                                                                />

                                                                <span>{bank.name}</span>
                                                                {selectedBank === bank.name && (
                                                                    <FontAwesomeIcon icon={faCheckCircle} className="selected-icon" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mb-6 other-banks-container">
                                                    <label className="form-label" htmlFor="otherBanks">
                                                        Other Banks
                                                    </label>
                                                    <div className="custom-select-wrapper">
                                                        <select
                                                            id="otherBanks"
                                                            className="form-input custom-select"
                                                            value={selectedBank || ''}
                                                            onChange={(e) => setSelectedBank(e.target.value)}
                                                        >
                                                            <option value="">Select a bank</option>
                                                            {otherBanks.map((bank) => (
                                                                <option key={bank} value={bank}>
                                                                    {bank}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <span className="select-arrow">▼</span>
                                                    </div>
                                                </div>

                                                <button
                                                    className="submit-button netbanking-pay-button"
                                                    onClick={handlePayment}
                                                    disabled={!selectedBank || isProcessing}
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '0.5rem' }} />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        `Proceed to Pay $${calculateTotal().toFixed(2)}`
                                                    )}
                                                </button>
                                            </motion.div>
                                        )}

                                        {paymentMethod === 'upi' && (
                                            <motion.div
                                                key="upi-form"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="payment-form"
                                            >
                                                <h2 className="form-heading">UPI</h2>
                                                <div className="upi-container">
                                                    <div className="qr-code">
                                                        <span className="text-gray-500">UPI QR Code</span>
                                                    </div>
                                                    <p className="text-gray-600 mb-2">Scan with any UPI app</p>
                                                    <p className="font-medium">Or</p>
                                                    <div className="upi-input-container">
                                                        <label className="form-label" htmlFor="upiId">
                                                            Enter UPI ID
                                                        </label>
                                                        <div className="upi-input-wrapper">
                                                            <input
                                                                id="upiId"
                                                                type="text"
                                                                className="form-input input-focus upi-input"
                                                                placeholder="yourname@upi"
                                                            />
                                                            <button
                                                                onClick={handlePayment}
                                                                disabled={isProcessing}
                                                                className="upi-button"
                                                            >
                                                                {isProcessing ? (
                                                                    <FontAwesomeIcon icon={faSpinner} spin />
                                                                ) : (
                                                                    'Pay Now'
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {/* Confirmation */}
                            {currentStep === 'confirmation' && (
                                <motion.div
                                    key="confirmation"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="payment-form"
                                >
                                    <div className="confirmation-content">
                                        <div className="success-icon">
                                            <FontAwesomeIcon icon={faCheck} className="text-white text-2xl" />
                                        </div>
                                        <h2 className="confirmation-title">Payment Successful!</h2>
                                        <p className="confirmation-subtitle">Your booking is confirmed.</p>
                                    </div>

                                    <div className="ticket-container">
                                        <div className="ticket-header">
                                            <div className="company-branding">
                                                <div className="logo-placeholder"></div>
                                                <h2>Wandercall</h2>
                                            </div>
                                        </div>

                                        <div className="ticket-body">
                                            <div className="hologram-sticker"></div>
                                            <div className="ticket-qr">
                                                <span className="qr-code">

                                                </span>
                                                <div className="scan-text">Scan for verification</div>
                                            </div>

                                            <div className="ticket-details">
                                                <div className="detail-row">
                                                    <FontAwesomeIcon icon={faTicket} className="detail-icon" />
                                                    <div>
                                                        <span className="detail-label">Ticket ID: </span>
                                                        <span className="detail-value">ADV-{Math.floor(Math.random() * 100000)}</span>
                                                    </div>
                                                </div>

                                                <div className="detail-row">
                                                    <FontAwesomeIcon icon={faCalendar} className="detail-icon" />
                                                    <div>
                                                        <span className="detail-label">Event Date: </span>
                                                        <span className="detail-value">{selectedDate.toLocaleDateString()} • 10:00 AM</span>
                                                    </div>
                                                </div>

                                                <div className="detail-row">
                                                    <FontAwesomeIcon icon={faUser} className="detail-icon" />
                                                    <div>
                                                        <span className="detail-label">Participants: </span>
                                                        <span className="detail-value">{participants} {participants > 1 ? 'Persons' : 'Person'}</span>
                                                    </div>
                                                </div>

                                                <div className="detail-row">
                                                    <FontAwesomeIcon icon={faMapMarkedAlt} className="detail-icon" />
                                                    <div>
                                                        <span className="detail-label">Location: </span>
                                                        <span className="detail-value">Central Adventure Park</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ticket-footer">
                                            <div className="security-code">
                                                <span>SECURITY CODE:</span>
                                                <span>{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                            </div>
                                            <div className="terms-text">
                                                Valid photo ID required • No refunds after 48 hours • Subject to terms at wandercall.com
                                            </div>
                                        </div>

                                        <div className="ticket-watermark">WANDERCALL</div>
                                    </div>

                                    <div className="info-box">
                                        <h3 className="info-box-title">Important Information</h3>
                                        <div className="info-list">
                                            <p className="info-item">Arrive 15 minutes early.</p>
                                            <p className="info-item">Bring a valid ID.</p>
                                            <p className="info-item">Wear comfortable clothing.</p>
                                            <p className="info-item">Present this ticket at entry.</p>
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <button
                                            type="button"
                                            className="action-button secondary"
                                            onClick={handleDownloadTicket}
                                        >
                                            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '0.5rem' }} />
                                            Download Ticket
                                        </button>
                                        <button
                                            type="button"
                                            className="action-button primary"
                                            onClick={handleViewBookingDetails}
                                        >
                                            <FontAwesomeIcon icon={faList} style={{ marginRight: '0.5rem' }} />
                                            View Booking Details
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h2 className="summary-heading">Order Summary</h2>
                        <div className="product-info">
                            <div className="product-image">
                                <img
                                    src="https://images.unsplash.com/photo-1540397106260-e24a507a08ea"
                                    alt={product.title}
                                />
                            </div>
                            <div className="product-details">
                                <h3>{product.title}</h3>
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="booking-details">
                            <div className="detail-row">
                                <span className="detail-label">Date:</span>
                                <span className="detail-value">{selectedDate.toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Time:</span>
                                <span className="detail-value">10:00 AM</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Participants:</span>
                                <span className="detail-value">{participants}</span>
                            </div>
                        </div>

                        <div className="price-breakdown">
                            <div className="price-row">
                                <span className="detail-label">Subtotal:</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="price-row">
                                <span className="detail-label">Taxes:</span>
                                <span>$0.00</span>
                            </div>
                            <div className="price-total">
                                <span>Total:</span>
                                <span className="price-total-value">${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="cancellation-policy">
                            <h3 className="cancellation-title">Cancellation Policy</h3>
                            <p className="cancellation-text">Free cancellation up to 48 hours before.</p>
                        </div>

                        <div className="secure-payment-notice">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            <span>Secure payment processing</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-text">
                    <p>© 2025 Wandercall Experiences. All rights reserved.</p>
                </div>
            </footer>

            <ToastContainer position="top-right" autoClose={3000} />
        </motion.div>
    );
};

export default PaymentPage;