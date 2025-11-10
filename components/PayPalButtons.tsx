import React, { useEffect, useRef } from 'react';

// This is required for TypeScript to recognize the `paypal` object on the window
declare global {
    interface Window {
        paypal: any;
    }
}

interface PayPalButtonsProps {
    amount: string;
    onPaymentSuccess: () => void;
    onPaymentError: (err: any) => void;
}

export const PayPalButtons: React.FC<PayPalButtonsProps> = ({ amount, onPaymentSuccess, onPaymentError }) => {
    const paypalRef = useRef<HTMLDivElement>(null);
    const onPaymentSuccessRef = useRef(onPaymentSuccess);
    const onPaymentErrorRef = useRef(onPaymentError);

    // Keep the refs updated with the latest callbacks on each render
    useEffect(() => {
        onPaymentSuccessRef.current = onPaymentSuccess;
        onPaymentErrorRef.current = onPaymentError;
    });

    useEffect(() => {
        let buttons: any;
        
        // Ensure PayPal script is loaded and the ref is attached to the div
        if (window.paypal && paypalRef.current) {
            // First, clear any existing button from the DOM.
            paypalRef.current.innerHTML = '';
            
            buttons = window.paypal.Buttons({
                createOrder: (data: any, actions: any) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount,
                                currency_code: 'USD'
                            },
                        }],
                    });
                },
                onApprove: async (data: any, actions: any) => {
                    // This function is called when the payment is approved by the user.
                    try {
                        const order = await actions.order.capture();
                        console.log('Payment successful:', order);
                        onPaymentSuccessRef.current();
                    } catch (err) {
                        onPaymentErrorRef.current(err);
                    }
                },
                onError: (err: any) => {
                    onPaymentErrorRef.current(err);
                },
            });
            
            buttons.render(paypalRef.current).catch((err: any) => {
                // Handle any errors that occur during button rendering
                console.error('PayPal button render error:', err);
                onPaymentErrorRef.current(err);
            });
        }

        // Cleanup function: This is called when the component unmounts or the effect re-runs.
        return () => {
            if (buttons && typeof buttons.close === 'function') {
                buttons.close().catch((err: any) => {
                    console.error('Failed to close PayPal Buttons:', err);
                });
            }
        };

    // The effect should only re-run if the amount changes. Callbacks are handled via refs.
    }, [amount]);

    return <div ref={paypalRef}></div>;
};