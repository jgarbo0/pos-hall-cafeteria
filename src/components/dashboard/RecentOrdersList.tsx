
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RecentOrder {
  id: string;
  customerName: string;
  items: number;
  total: number;
  discount?: number;
  status: string;
  time: string;
}

interface RecentOrdersListProps {
  orders: RecentOrder[];
}

const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ orders }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Latest incoming orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{order.customerName}</p>
                  <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex text-xs text-muted-foreground mt-1">
                  <p>Order #{order.id}</p>
                  <span className="mx-1">•</span>
                  <p>{order.items} items</p>
                  <span className="mx-1">•</span>
                  <p>{order.time}</p>
                  {order.discount && order.discount > 0 && (
                    <>
                      <span className="mx-1">•</span>
                      <p className="text-green-600">Discount: ${order.discount.toFixed(2)}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersList;
