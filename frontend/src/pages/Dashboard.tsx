import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface SalesStats {
  totalOrders: number;
  totalRevenue: number;
}

interface PopularItem {
  name: string;
  totalOrdered: number;
}

interface PeakTime {
  _id: number;
  count: number;
}

export default function Dashboard() {
  const [salesStats, setSalesStats] = useState<SalesStats>({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [peakTimes, setPeakTimes] = useState<PeakTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [salesResponse, popularResponse, peakResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/orders/analytics/sales'),
        axios.get('http://localhost:5000/api/orders/analytics/popular'),
        axios.get('http://localhost:5000/api/orders/analytics/peak'),
      ]);

      setSalesStats(salesResponse.data);
      setPopularItems(popularResponse.data);
      setPeakTimes(peakResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="card bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100">
              <ShoppingBagIcon className="h-6 w-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {salesStats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-white p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${salesStats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Items */}
        <div className="card">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-accent-500" />
            <h2 className="text-xl font-semibold text-gray-900 ml-2">
              Popular Items
            </h2>
          </div>
          <div className="space-y-4">
            {popularItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="text-gray-600">
                  {item.totalOrdered} orders
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Times */}
        <div className="card">
          <div className="flex items-center mb-4">
            <ClockIcon className="h-6 w-6 text-accent-500" />
            <h2 className="text-xl font-semibold text-gray-900 ml-2">
              Peak Order Times
            </h2>
          </div>
          <div className="space-y-4">
            {peakTimes.map((time, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="font-medium text-gray-900">
                  {formatTime(time._id)}
                </span>
                <span className="text-gray-600">{time.count} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 