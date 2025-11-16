import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CartItem, ShippingDetails } from '../types';
import { T_AND_C_TEXT } from '../constants';
import { PayPalButtons } from './PayPalButtons';

interface CheckoutProps {
    items: CartItem[];
    onBack: () => void;
    onPaymentSuccess: (details: ShippingDetails) => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';
type PaymentMethod = 'creditcard' | 'paypal';

export const Checkout: React.FC<CheckoutProps> = ({ items, onBack, onPaymentSuccess }) => {
    const [step, setStep] = useState<CheckoutStep>('shipping');
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditcard');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
    const [cardError, setCardError] = useState('');

    const onPaymentSuccessRef = useRef(onPaymentSuccess);
    useEffect(() => {
        onPaymentSuccessRef.current = onPaymentSuccess;
    }, [onPaymentSuccess]);

    const shippingDetailsRef = useRef(shippingDetails);
    useEffect(() => {
        shippingDetailsRef.current = shippingDetails;
    }, [shippingDetails]);

    const subtotal = items.reduce((sum, item) => sum + (item.action === 'buy' ? item.product.buyPrice : item.product.rentPrice) * item.quantity, 0);
    const taxes = subtotal * 0.08;
    const total = subtotal + taxes;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handleCreditCardPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setCardError('');

        // Basic validation for demonstration
        if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
            setCardError('Please enter a valid 16-digit card number.');
            return;
        }
        if (!/^\d{2}\s?\/\s?\d{2}$/.test(cardDetails.expiry)) {
            setCardError('Please enter a valid expiry date (MM / YY).');
            return;
        }
        if (!/^\d{3,4}$/.test(cardDetails.cvc)) {
            setCardError('Please enter a valid CVC.');
            return;
        }

        setIsProcessing(true);
        // Simulate API call to a real payment gateway
        setTimeout(() => {
            setIsProcessing(false);
            setStep('confirmation');
            onPaymentSuccessRef.current(shippingDetails);
        }, 2000);
    }

    const handlePaypalSuccess = useCallback(() => {
        setStep('confirmation');
        onPaymentSuccessRef.current(shippingDetailsRef.current);
    }, []);

    const handlePaypalError = useCallback((err: any) => {
        console.error("PayPal transaction failed", err);
        alert("There was an error with your PayPal payment. Please try again.");
    }, []);

    const renderShipping = () => (
        <form onSubmit={handleShippingSubmit}>
            <h2 className="text-2xl font-bold font-serif mb-2">Shipping Information</h2>
            <p className="text-sm text-gray-500 mb-6">Guest checkout is enabled&mdash;share a contact email so we can send confirmation details.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                 <input name="fullName" value={shippingDetails.fullName} onChange={handleInputChange} className="p-2 border rounded-md" placeholder="Full Name" required />
                 <input type="email" name="email" value={shippingDetails.email ?? ''} onChange={handleInputChange} className="p-2 border rounded-md" placeholder="Email Address" required />
                 <input name="address" value={shippingDetails.address} onChange={handleInputChange} className="p-2 border rounded-md sm:col-span-2" placeholder="Address" required />
                 <input name="city" value={shippingDetails.city} onChange={handleInputChange} className="p-2 border rounded-md" placeholder="City" required />
                 <input name="state" value={shippingDetails.state} onChange={handleInputChange} className="p-2 border rounded-md" placeholder="State / Province" required />
                 <input name="zipCode" value={shippingDetails.zipCode} onChange={handleInputChange} className="p-2 border rounded-md" placeholder="ZIP / Postal Code" required />
                 <input name="country" value={shippingDetails.country} onChange={handleInputChange} className="p-2 border rounded-md" placeholder="Country" required />
            </div>
            <div className="mt-8">
                <h3 className="text-xl font-bold font-serif mb-2">Terms & Conditions</h3>
                <div className="h-32 p-3 border rounded-md overflow-y-scroll bg-gray-50 text-sm text-gray-600">
                    {T_AND_C_TEXT}
                </div>
                 <div className="mt-4 flex items-center">
                    <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 text-peacock-magenta border-gray-300 rounded focus:ring-peacock-magenta"/>
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">I have read and agree to the terms and conditions.</label>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button type="submit" disabled={!termsAccepted} className="bg-peacock-magenta text-white py-2 px-8 rounded-full font-bold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-peacock-sapphire">
                    Continue
                </button>
            </div>
        </form>
    );

    const renderPayment = () => (
        <div>
            <h2 className="text-2xl font-bold font-serif mb-6">Payment</h2>
            <div className="mb-6 flex border border-gray-200 rounded-lg p-1">
                <button onClick={() => setPaymentMethod('creditcard')} className={`w-1/2 py-2 rounded-md transition-colors ${paymentMethod === 'creditcard' ? 'bg-peacock-magenta text-white' : 'text-gray-600'}`}>Credit Card</button>
                <button onClick={() => setPaymentMethod('paypal')} className={`w-1/2 py-2 rounded-md transition-colors ${paymentMethod === 'paypal' ? 'bg-peacock-magenta text-white' : 'text-gray-600'}`}>PayPal</button>
            </div>

            {paymentMethod === 'creditcard' && (
                <form onSubmit={handleCreditCardPayment}>
                    <div className="space-y-4">
                        <input className="w-full p-2 border rounded-md" placeholder="Card Number (e.g., 4111111111111111)" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} />
                        <div className="flex space-x-4">
                             <input className="w-1/2 p-2 border rounded-md" placeholder="MM / YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} />
                             <input className="w-1/2 p-2 border rounded-md" placeholder="CVC" value={cardDetails.cvc} onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})} />
                        </div>
                    </div>
                    {cardError && <p className="text-red-500 text-sm mt-2">{cardError}</p>}
                    <div className="mt-8">
                        <button type="submit" disabled={isProcessing} className="w-full bg-peacock-magenta text-white py-3 rounded-full font-bold transition-colors hover:bg-peacock-sapphire disabled:bg-gray-400">
                            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </button>
                    </div>
                </form>
            )}

            {paymentMethod === 'paypal' && (
                <div className="py-4">
                    <p className="text-center text-gray-600 p-4 bg-gray-100 rounded-md mb-4">You will be redirected to PayPal to complete your payment securely.</p>
                    <PayPalButtons 
                        amount={total.toFixed(2)}
                        onPaymentSuccess={handlePaypalSuccess}
                        onPaymentError={handlePaypalError}
                    />
                </div>
            )}
        </div>
    );

    const renderConfirmation = () => (
         <div className="text-center py-10 animate-fade-in">
            <svg className="w-24 h-24 text-peacock-emerald mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 className="text-3xl font-bold font-serif text-peacock-dark mb-2">Thank You!</h2>
            <p className="text-gray-600">Your order has been placed successfully.</p>
            <p className="text-gray-600">You can track its status in your Order History.</p>
            <button onClick={onBack} className="mt-8 bg-peacock-magenta text-white py-2 px-8 rounded-full font-bold transition-colors hover:bg-peacock-sapphire">
                Continue Shopping
            </button>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-lg shadow-lg min-h-[500px]">
                    {step === 'shipping' && renderShipping()}
                    {step === 'payment' && renderPayment()}
                    {step === 'confirmation' && renderConfirmation()}
                </div>
                {step !== 'confirmation' && (
                    <div className="bg-gray-100 p-8 rounded-lg">
                        <h3 className="text-xl font-bold font-serif mb-4">Order Summary</h3>
                        <div className="space-y-3">
                        {items.map((item) => (
                            <div key={`${item.product.id}-${item.action}`} className="flex justify-between">
                                <span className="text-gray-600">{item.product.name} ({item.action})</span>
                                <span className="font-medium">${item.action === 'buy' ? item.product.buyPrice.toFixed(2) : item.product.rentPrice.toFixed(2)}</span>
                            </div>
                        ))}
                        </div>
                        <hr className="my-4"/>
                         <div className="space-y-2">
                             <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                             <div className="flex justify-between"><span className="text-gray-600">Taxes</span><span>${taxes.toFixed(2)}</span></div>
                             <div className="flex justify-between font-bold text-lg"><span >Total</span><span>${total.toFixed(2)}</span></div>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};
