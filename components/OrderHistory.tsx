import React, { useState, useEffect } from 'react';
import { User, Order, OrderStatus } from '../types';
import { backend } from '../services/backend';

interface OrderHistoryProps {
    user: User;
    onBack: () => void;
}

const statusMap = {
    [OrderStatus.Processing]: { index: 0, text: 'Processing' },
    [OrderStatus.Shipped]: { index: 1, text: 'Shipped' },
    [OrderStatus.Delivered]: { index: 2, text: 'Delivered' },
    [OrderStatus.Returned]: { index: 3, text: 'Returned' },
};

const OrderStatusTracker: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const currentStatusIndex = statusMap[status]?.index ?? -1;
    const statuses = Object.values(statusMap);

    return (
        <div className="flex items-center justify-between w-full my-6">
            {statuses.map((s, index) => (
                <React.Fragment key={s.text}>
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            index <= currentStatusIndex ? 'bg-peacock-emerald border-peacock-emerald text-white' : 'bg-white border-gray-300'
                        }`}>
                            &#10003;
                        </div>
                        <p className={`mt-2 text-xs font-semibold ${
                            index <= currentStatusIndex ? 'text-peacock-dark' : 'text-gray-400'
                        }`}>{s.text}</p>
                    </div>
                    {index < statuses.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 ${
                             index < currentStatusIndex ? 'bg-peacock-emerald' : 'bg-gray-300'
                        }`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};


const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md mb-6 transition-all duration-300">
            <div className="p-4 md:p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex flex-wrap justify-between items-center">
                    <div className="mb-2 md:mb-0">
                        <p className="font-bold text-peacock-dark">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                     <div className="mb-2 md:mb-0">
                        <p className="text-gray-500 text-sm">Total</p>
                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                             order.status === OrderStatus.Delivered ? 'bg-green-100 text-green-800' :
                             order.status === OrderStatus.Shipped ? 'bg-blue-100 text-blue-800' :
                             'bg-yellow-100 text-yellow-800'
                        }`}>{order.status}</span>
                        <svg className={`w-5 h-5 ml-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50/50">
                    <h4 className="font-bold mb-4 text-peacock-dark">Order Details</h4>
                    <OrderStatusTracker status={order.status} />
                     {order.trackingNumber && (
                        <p className="text-sm text-center mb-4">
                            Tracking: <a href="#" className="text-peacock-sapphire font-semibold hover:underline">{order.trackingNumber}</a>
                        </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="font-semibold mb-2">Items</h5>
                            {order.items.map(item => (
                                <div key={`${item.product.id}-${item.action}`} className="flex items-center space-x-3 mb-2 text-sm">
                                    <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-12 h-16 object-cover rounded"/>
                                    <div>
                                        <p className="font-medium text-gray-800">{item.product.name}</p>
                                        <p className="text-gray-500 capitalize">{item.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h5 className="font-semibold mb-2">Shipping Address</h5>
                             <address className="not-italic text-sm text-gray-600">
                                {order.shippingDetails.fullName}<br/>
                                {order.shippingDetails.address}<br/>
                                {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zipCode}<br/>
                                {order.shippingDetails.country}
                            </address>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ user, onBack }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        let isMounted = true;
        const fetchOrders = async () => {
            const userOrders = await backend.getOrdersForUser(user.email);
            if (isMounted) {
                setOrders(userOrders);
            }
        };
        
        fetchOrders();
        // Set up an interval to poll for order status changes from the backend
        const intervalId = setInterval(fetchOrders, 2000);

        // Clean up interval on component unmount
        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [user.email]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="text-peacock-sapphire hover:underline mb-6 font-medium">&larr; Back to Shopping</button>
                <h1 className="text-3xl font-bold font-serif mb-8 text-peacock-dark">Your Order History</h1>
                {orders.length > 0 ? (
                    orders.map(order => <OrderCard key={order.id} order={order} />)
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-peacock-dark">You have no orders yet.</h2>
                        <p className="text-gray-500 mt-2">Start shopping to see your orders here.</p>
                        <button onClick={onBack} className="mt-6 bg-peacock-magenta text-white py-2 px-6 rounded-full font-bold transition-colors hover:bg-peacock-sapphire">
                            Explore Collections
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};