import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { apiRequest } from '../utils/api';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: any[];
  yearlyRevenue: any[];
  topCustomers: any[];
  paymentMethodBreakdown: any[];
}

const RevenueAnalytics: React.FC = () => {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchRevenueData();
  }, [selectedYear]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/admin/analytics/revenue?year=${selectedYear}`);
      if (response.ok) {
        const apiData = await response.json();
        console.log('Revenue API Response:', apiData);
        
        // Transform backend data to frontend format
        // Backend returns: { _id: { month: 1 }, total: 500, count: 3 }
        // Transform to: { month: 1, total: 500, count: 3 }
        const monthlyRevenue = (apiData.yearlyByMonth || []).map((m: any) => ({
          month: m._id?.month || m.month,
          total: m.total || 0,
          count: m.count || 0
        }));
        
        const monthlyTotal = apiData.monthly?.total || 0;
        
        // Calculate total revenue from yearly data
        const yearlyTotal = monthlyRevenue.reduce((sum: number, m: any) => sum + (m.total || 0), 0);
        
        // Get all-time revenue by querying all completed payments
        const allPaymentsResponse = await apiRequest('/api/admin/payments?status=completed');
        let totalRevenue = yearlyTotal; // Default to current year
        if (allPaymentsResponse.ok) {
          const allPayments = await allPaymentsResponse.json();
          totalRevenue = allPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        }
        
        setData({
          totalRevenue,
          monthlyRevenue,
          yearlyRevenue: [{ year: selectedYear, total: yearlyTotal }],
          topCustomers: apiData.topCustomers || [],
          paymentMethodBreakdown: apiData.paymentMethods || []
        });
        
        console.log('Transformed Revenue Data:', {
          totalRevenue,
          monthlyCount: monthlyRevenue.length,
          topCustomersCount: apiData.topCustomers?.length || 0,
          monthlyRevenue: monthlyRevenue
        });
      } else {
        console.error('Failed to fetch revenue data');
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="list-container">
        <h1>Revenue Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="list-container">
        <h1>Revenue Analytics</h1>
        <p>No data available</p>
      </div>
    );
  }

  const currentMonthData = data.monthlyRevenue && data.monthlyRevenue.length > 0 
    ? data.monthlyRevenue[data.monthlyRevenue.length - 1] 
    : null;
  const previousMonthData = data.monthlyRevenue && data.monthlyRevenue.length > 1 
    ? data.monthlyRevenue[data.monthlyRevenue.length - 2] 
    : null;
  const monthGrowth = previousMonthData && currentMonthData
    ? ((currentMonthData.total - previousMonthData.total) / previousMonthData.total * 100).toFixed(1)
    : '0';

  const currentYearData = data.yearlyRevenue && data.yearlyRevenue.length > 0 
    ? data.yearlyRevenue.find(y => y.year === selectedYear) 
    : null;
  const previousYearData = data.yearlyRevenue && data.yearlyRevenue.length > 0 
    ? data.yearlyRevenue.find(y => y.year === selectedYear - 1) 
    : null;
  const yearGrowth = previousYearData && currentYearData
    ? ((currentYearData.total - previousYearData.total) / previousYearData.total * 100).toFixed(1)
    : '0';
    
  // Calculate total payments and average
  const totalPayments = data.monthlyRevenue?.reduce((sum, m) => sum + (m.count || 0), 0) || 0;
  const averageTransaction = totalPayments > 0 
    ? ((data.yearlyRevenue?.[0]?.total || 0) / totalPayments)
    : 0;

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const formatPaymentMethod = (method: string) => {
    const methodLabels: { [key: string]: string } = {
      'bank_transfer': 'Bank Transfer',
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card',
      'mobile_money': 'Mobile Money',
      'cash': 'Cash',
      'paypal': 'PayPal',
      'crypto': 'Cryptocurrency',
      'check': 'Check',
      'other': 'Other'
    };
    return methodLabels[method] || method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <div>
          <h1>Revenue Analytics</h1>
          <p>Track your business performance and revenue streams</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: '0.625rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.875rem',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            {[2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button onClick={fetchRevenueData} className="refresh-btn">
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Revenue */}
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          padding: '1.75rem',
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <DollarSign size={28} strokeWidth={2.5} />
            <span style={{ fontSize: '0.875rem', opacity: 0.95, fontWeight: '500' }}>Total Revenue</span>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            ${data.totalRevenue ? data.totalRevenue.toFixed(2) : '0.00'}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            All-time earnings
          </div>
        </div>

        {/* Current Month */}
        <div style={{
          background: 'white',
          padding: '1.75rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Calendar size={24} style={{ color: '#667eea' }} />
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>This Month</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            ${currentMonthData ? currentMonthData.total.toFixed(2) : '0.00'}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: Number(monthGrowth) >= 0 ? '#059669' : '#dc2626',
            fontWeight: '600'
          }}>
            {Number(monthGrowth) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(Number(monthGrowth))}% vs last month
          </div>
        </div>

        {/* This Year */}
        <div style={{
          background: 'white',
          padding: '1.75rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={24} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Year {selectedYear}</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            ${currentYearData && currentYearData.total ? currentYearData.total.toFixed(2) : '0.00'}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: Number(yearGrowth) >= 0 ? '#059669' : '#dc2626',
            fontWeight: '600'
          }}>
            {Number(yearGrowth) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(Number(yearGrowth))}% vs {selectedYear - 1}
          </div>
        </div>

        {/* Average Transaction */}
        <div style={{
          background: 'white',
          padding: '1.75rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <CreditCard size={24} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Avg Transaction</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            ${averageTransaction > 0 ? averageTransaction.toFixed(2) : '0.00'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {totalPayments} transactions
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Monthly Revenue Chart */}
        <div style={{
          background: 'white',
          padding: '1.75rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
            Monthly Revenue - {selectedYear}
          </h3>
          <div style={{ position: 'relative', height: '280px' }}>
            {!data.monthlyRevenue || data.monthlyRevenue.length === 0 ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#9ca3af'
              }}>
                No revenue data for {selectedYear}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '0.5rem' }}>
                {data.monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.total));
                  const heightPercentage = maxRevenue > 0 ? (month.total / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={index} style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{ 
                        width: '100%',
                        height: `${heightPercentage}%`,
                        minHeight: month.total > 0 ? '24px' : '4px',
                        background: month.total > 0 
                          ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
                          : '#e5e7eb',
                        borderRadius: '6px 6px 0 0',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      title={`$${month.total.toFixed(2)}`}
                      >
                        {month.total > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '-24px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#667eea',
                            whiteSpace: 'nowrap'
                          }}>
                            ${month.total > 999 ? (month.total / 1000).toFixed(1) + 'k' : month.total.toFixed(0)}
                          </div>
                        )}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '500',
                        color: '#6b7280'
                      }}>
                        {getMonthName(month.month)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{
          background: 'white',
          padding: '1.75rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
            Payment Methods
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!data.paymentMethodBreakdown || data.paymentMethodBreakdown.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>
                No payment data
              </p>
            ) : (
              data.paymentMethodBreakdown.map((method, index) => {
                const colors = ['#667eea', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
                const color = colors[index % colors.length];
                const totalYearRevenue = data.yearlyRevenue?.[0]?.total || 1; // Avoid division by zero
                const percentage = ((method.total / totalYearRevenue) * 100).toFixed(1);
                
                return (
                  <div key={method._id || index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        color: '#1f2937'
                      }}>
                        {formatPaymentMethod(method._id)}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color }}>
                        ${method.total.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      background: '#f3f4f6', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        background: color,
                        borderRadius: '4px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280',
                      marginTop: '0.25rem'
                    }}>
                      {percentage}% • {method.count} transactions
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div style={{
        background: 'white',
        padding: '1.75rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
          Top Customers by Revenue
        </h3>
        {!data.topCustomers || data.topCustomers.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>
            No customer data available
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.topCustomers.map((customer, index) => (
              <div key={customer._id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: index === 0 ? '#fefce8' : '#f9fafb',
                borderRadius: '8px',
                border: index === 0 ? '2px solid #fde047' : '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: index === 0 ? '#fbbf24' : '#667eea',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1.125rem'
                }}>
                  {index === 0 ? '👑' : `#${index + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {customer.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {customer.paymentCount} payments • {customer.projectCount || 0} projects
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: '#059669'
                  }}>
                    ${customer.totalRevenue.toFixed(2)}
                  </div>
                  {customer.outstandingBalance > 0 && (
                    <div style={{ 
                      fontSize: '0.8125rem', 
                      color: '#dc2626',
                      fontWeight: '500'
                    }}>
                      ${customer.outstandingBalance.toFixed(2)} pending
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;
