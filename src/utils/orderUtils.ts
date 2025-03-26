
import { format, parse, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Order } from '@/types';
import { toast } from 'sonner';

export const formatTimestamp = (timestamp: string): string => {
  try {
    return format(new Date(timestamp), 'MMM dd, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return timestamp;
  }
};

export const displayOrderCustomerName = (customerName?: string): string => {
  return customerName && customerName.trim() !== '' ? customerName : 'Walk-in Customer';
};

export const createPrintPreview = (currentOrder: Order) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Pop-up blocked. Please allow pop-ups for this site.');
    return;
  }
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Order #${currentOrder.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; font-size: 18px; }
          .header { text-align: center; margin-bottom: 20px; }
          .order-info { margin-bottom: 20px; }
          .order-info div { margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          .totals { margin-top: 20px; text-align: right; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          @media print {
            .no-print { display: none; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Doob Café</h1>
          <p>Order Receipt</p>
        </div>
        
        <div class="order-info">
          <div><strong>Order #:</strong> ${currentOrder.orderNumber}</div>
          <div><strong>Date:</strong> ${formatTimestamp(currentOrder.timestamp)}</div>
          <div><strong>Type:</strong> ${currentOrder.orderType}</div>
          ${currentOrder.tableNumber ? `<div><strong>Table:</strong> ${currentOrder.tableNumber}</div>` : ''}
          <div><strong>Status:</strong> ${currentOrder.status}</div>
          <div><strong>Payment:</strong> ${currentOrder.paymentStatus || 'Paid'}</div>
          <div><strong>Customer:</strong> ${currentOrder.customerName || 'Walk-in Customer'}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${currentOrder.items.map(item => `
              <tr>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div><strong>Subtotal:</strong> $${currentOrder.subtotal.toFixed(2)}</div>
          <div><strong>Tax:</strong> $${currentOrder.tax.toFixed(2)}</div>
          <div><strong>Total:</strong> $${currentOrder.total.toFixed(2)}</div>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()">Print Receipt</button>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
  
  return printWindow;
};

export const calculateOrderSummary = (orders: Order[]) => {
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  
  const totalOrders = orders.length;
  const paidOrders = orders.filter(order => order.paymentStatus === 'paid').length;
  const pendingOrders = orders.filter(order => order.paymentStatus === 'pending').length;
  
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const todaySales = orders
    .filter(order => format(new Date(order.timestamp), 'yyyy-MM-dd') === todayString)
    .reduce((sum, order) => sum + order.total, 0);
  
  return {
    totalOrders,
    paidOrders,
    pendingOrders,
    totalSales,
    todaySales
  };
};

export const filterOrders = (orders: Order[], activeTab: string, dateRange: string, searchTerm: string) => {
  const today = new Date();
  
  let filtered = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });
  
  if (dateRange !== 'all') {
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.timestamp.split(' ')[0]);
      
      if (dateRange === 'today') {
        return format(orderDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      }
      
      if (dateRange === 'week') {
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);
        return isWithinInterval(orderDate, { start: weekStart, end: weekEnd });
      }
      
      if (dateRange === 'month') {
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        return isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
      }
      
      return true;
    });
  }
  
  if (searchTerm.trim() !== '') {
    const searchLower = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(order => 
      order.orderNumber.toLowerCase().includes(searchLower) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
      order.orderType.toLowerCase().includes(searchLower) ||
      order.total.toString().includes(searchLower)
    );
  }
  
  return filtered;
};
