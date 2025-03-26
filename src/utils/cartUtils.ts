
import { Customer, CartItem } from '@/types';
import { toast } from 'sonner';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getCustomerName = (customerId: string, customers: Customer[] = []) => {
  if (customerId === 'Walk-in Customer') return 'Walk-in Customer';
  const customer = customers.find(c => c.id === customerId);
  return customer ? customer.name : 'Walk-in Customer';
};

export const displayOrderCustomerName = (customerName?: string): string => {
  return customerName && customerName.trim() !== '' ? customerName : 'Walk-in Customer';
};

export const printReceipt = (
  orderNumber: string, 
  items: CartItem[], 
  customerName: string, 
  orderType: 'Dine In' | 'Take Away',
  tableNumber: number,
  globalDiscount: number,
  discountType: 'percentage' | 'fixed',
  itemDiscounts: Record<string, number>,
  rawSubtotal: number,
  discountAmount: number,
  tax: number,
  total: number
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Pop-up blocked. Please allow pop-ups for this site.');
    return;
  }
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Order #${orderNumber}</title>
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
          <div><strong>Order #:</strong> ${orderNumber}</div>
          <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
          <div><strong>Type:</strong> ${orderType}</div>
          ${orderType === 'Dine In' ? `<div><strong>Table:</strong> ${tableNumber}</div>` : ''}
          <div><strong>Customer:</strong> ${customerName}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              ${discountAmount > 0 ? '<th>Discount</th>' : ''}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => {
              const itemDiscount = itemDiscounts[item.id] || 0;
              const hasDiscount = itemDiscount > 0 || globalDiscount > 0;
              const discountValue = itemDiscount > 0 ? itemDiscount : (discountType === 'percentage' ? globalDiscount : 0);
              const itemTotal = item.price * item.quantity;
              const discountedTotal = hasDiscount ? 
                (discountType === 'percentage' ? 
                  itemTotal * (1 - (discountValue / 100)) : 
                  itemTotal - (globalDiscount / items.length)) : 
                itemTotal;
              
              return `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  ${discountAmount > 0 ? 
                    `<td>${discountValue}${discountType === 'percentage' ? '%' : 'USD'}</td>` : 
                    ''}
                  <td>$${discountedTotal.toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div><strong>Subtotal:</strong> $${rawSubtotal.toFixed(2)}</div>
          ${discountAmount > 0 ? 
            `<div><strong>Discount:</strong> -$${discountAmount.toFixed(2)}</div>` : 
            ''}
          <div><strong>Tax:</strong> $${tax.toFixed(2)}</div>
          <div><strong>Total:</strong> $${total.toFixed(2)}</div>
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
};
