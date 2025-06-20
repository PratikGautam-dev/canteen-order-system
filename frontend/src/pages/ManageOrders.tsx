import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  scheduledTime?: string;
}

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/all');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(
    (order) => filter === 'all' || order.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn ${
              filter === 'all' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`btn ${
              filter === 'pending' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('preparing')}
            className={`btn ${
              filter === 'preparing' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setFilter('ready')}
            className={`btn ${
              filter === 'ready' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Ready
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-6)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                {order.scheduledTime && (
                  <p className="text-sm text-gray-600">
                    Scheduled for: {new Date(order.scheduledTime).toLocaleString()}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Customer: {order.user.name} ({order.user.email})
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/chat?orderId=${order._id}`}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>Chat</span>
                </Link>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order._id, e.target.value as Order['status'])
                  }
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-gray-700"
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{item.quantity}x</span>
                      <span className="ml-2">{item.menuItem.name}</span>
                    </div>
                    <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
} 