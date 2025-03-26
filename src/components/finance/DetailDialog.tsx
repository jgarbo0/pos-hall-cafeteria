import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction, ExpenseCategory } from '@/types/finance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DetailDialogProps {
  showDetailModal: boolean;
  setShowDetailModal: (show: boolean) => void;
  detailType: string;
  detailTitle: string;
  transactions: Transaction[];
  weeklyChartData: any[];
  dailyExpenseData: any[];
  hallBookingFinanceData: any[];
  selectedHallBooking: string | null;
  hallBookingIncomes: any[];
  isLoadingHallData: boolean;
  expenseCategories: ExpenseCategory[];
  hallDetailModalOpen: boolean;
  setHallDetailModalOpen: (open: boolean) => void;
  totalHallIncome: number;
  totalHallExpense: number;
}

const DetailDialog: React.FC<DetailDialogProps> = ({
  showDetailModal,
  setShowDetailModal,
  detailType,
  detailTitle,
  transactions,
  weeklyChartData,
  dailyExpenseData,
  hallBookingFinanceData,
  selectedHallBooking,
  hallBookingIncomes,
  isLoadingHallData,
  expenseCategories,
  hallDetailModalOpen,
  setHallDetailModalOpen,
  totalHallIncome,
  totalHallExpense
}) => {
  const [revenueFilter, setRevenueFilter] = useState<'all' | 'food-sales' | 'hall-rental'>('all');
  
  // Filter income transactions for revenue detail view
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  const filteredIncomeTransactions = incomeTransactions.filter(transaction => {
    if (revenueFilter === 'all') return true;
    if (revenueFilter === 'food-sales') return transaction.category === 'Food Sales';
    if (revenueFilter === 'hall-rental') return transaction.category === 'Hall Rental';
    return true;
  });
  
  // Calculate totals by category for the revenue view
  const revenueByCategoryData = React.useMemo(() => {
    const categoryMap: Record<string, number> = {};
    
    incomeTransactions.forEach(transaction => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = 0;
      }
      categoryMap[transaction.category] += transaction.amount;
    });
    
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));
  }, [incomeTransactions]);

  return (
    <>
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:max-w-[625px] md:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>{detailTitle}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] w-full">
            <div className="p-4">
              {detailType === 'revenue' && (
                <div className="space-y-4">
                  <p>Detailed revenue breakdown by channel and time period.</p>
                
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Revenue Sources</h3>
                    <Select value={revenueFilter} onValueChange={(value: any) => setRevenueFilter(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="food-sales">Food Sales</SelectItem>
                        <SelectItem value="hall-rental">Hall Rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenueByCategoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {revenueByCategoryData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === 0 ? '#4ade80' : '#9b87f5'} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Revenue']}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Income']} />
                          <Line type="monotone" dataKey="income" stroke="#4ade80" name="Income" />
                          <Legend />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-6 mb-2">Detailed Transactions</h3>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredIncomeTransactions.length > 0 ? (
                          filteredIncomeTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{format(new Date(transaction.date), 'dd MMM yyyy')}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.category}</TableCell>
                              <TableCell>{transaction.paymentMethod || 'N/A'}</TableCell>
                              <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                                {formatCurrency(transaction.amount)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No transactions found with the selected filter.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Food Sales Total</p>
                      <p className="text-lg font-bold">{formatCurrency(
                        incomeTransactions
                          .filter(t => t.category === 'Food Sales')
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Hall Rental Total</p>
                      <p className="text-lg font-bold">{formatCurrency(
                        incomeTransactions
                          .filter(t => t.category === 'Hall Rental')
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}</p>
                    </div>
                  </div>
                </div>
              )}

              {detailType === 'weekly-expense' && (
                <div className="space-y-4">
                  <p>Breakdown of expenses by category for the current week.</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {(detailType === 'most-sales' || detailType === 'most-rented' || 
                detailType === 'least-selling-item' || detailType === 'favorite-item' || 
                detailType === 'most-recurring-expense' || detailType === 'dhaweeye') && (
                <div className="space-y-4">
                  <p>Detailed metrics and historical performance.</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Array.from({length: 12}, (_, i) => ({
                        month: `Month ${i+1}`,
                        value: Math.floor(Math.random() * 1000) + 500
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Total Units</p>
                      <p className="text-lg font-bold">1,245</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Average Price</p>
                      <p className="text-lg font-bold">$24.99</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Growth</p>
                      <p className="text-lg font-bold text-green-500">+12.4%</p>
                    </div>
                  </div>
                </div>
              )}

              {detailType === 'monthly-expense' && (
                <div className="space-y-4">
                  <p>Compare current month expenses with previous month.</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        {name: 'Food & Drink', current: 450, previous: 520},
                        {name: 'Grocery', current: 300, previous: 380},
                        {name: 'Shopping', current: 280, previous: 320},
                        {name: 'Dhaweeye', current: 200, previous: 270},
                        {name: 'Utilities', current: 180, previous: 190},
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="current" fill="#4ade80" name="Current Month" />
                        <Bar dataKey="previous" fill="#9ca3af" name="Previous Month" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {detailType === 'daily-expense' && (
                <div className="space-y-4">
                  <p>Daily breakdown of expenses by category.</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyExpenseData} stackOffset="sign">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Food & Drink" stackId="a" fill="#4ade80" />
                        <Bar dataKey="Grocery" stackId="a" fill="#9b87f5" />
                        <Bar dataKey="Shopping" stackId="a" fill="#f472b6" />
                        <Bar dataKey="Dhaweeye" stackId="a" fill="#fb923c" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {detailType === 'transactions' && (
                <div className="space-y-4">
                  <p>Complete list of all transactions with advanced filtering.</p>
                  <div className="flex gap-2 mb-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="food">Food & Drink</SelectItem>
                        <SelectItem value="grocery">Grocery</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="transportation">Dhaweeye</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[400px] overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {transactions.concat(transactions).map((transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{format(new Date(transaction.date), 'dd MMM yyyy')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{transaction.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{transaction.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <span className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailType === 'transaction-detail' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-lg font-bold">Apr 10, 2024</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-lg font-bold">$425.99</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-lg font-bold">Food & Drink</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-lg font-bold">Card</p>
                    </div>
                  </div>
                  <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3 mt-4">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-md">Restaurant supplies for this week's special menu. Includes specialty ingredients and packaging materials.</p>
                  </div>
                </div>
              )}

              {detailType === 'net-income' && (
                <div className="space-y-4">
                  <p>Net income analysis over time with income/expense breakdown.</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Array.from({length: 12}, (_, i) => ({
                        month: `Month ${i+1}`,
                        income: Math.floor(Math.random() * 2000) + 1000,
                        expense: Math.floor(Math.random() * 1000) + 500,
                        net: Math.floor(Math.random() * 1000) + 200,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#4ade80" name="Income" />
                        <Line type="monotone" dataKey="expense" stroke="#f87171" name="Expense" />
                        <Line type="monotone" dataKey="net" stroke="#60a5fa" name="Net Income" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Total Income</p>
                      <p className="text-lg font-bold text-green-500">$12,450.75</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Total Expenses</p>
                      <p className="text-lg font-bold text-red-500">$7,235.60</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Net Profit</p>
                      <p className="text-lg font-bold text-blue-500">$5,215.15</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={hallDetailModalOpen} onOpenChange={setHallDetailModalOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {selectedHallBooking === 'all' 
                ? 'Hall Booking Finance Details' 
                : 'Booking Details'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full">
            <div className="p-4">
              {selectedHallBooking === 'all' ? (
                <div className="space-y-4">
                  <p>Financial breakdown for all hall bookings.</p>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={hallBookingFinanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, '']} />
                        <Area
                          type="monotone"
                          dataKey="income"
                          stackId="1"
                          stroke="#4ade80"
                          fill="#4ade8033"
                          name="Income"
                        />
                        <Area
                          type="monotone"
                          dataKey="expense"
                          stackId="2"
                          stroke="#ef4444"
                          fill="#ef444433"
                          name="Expense"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Total Bookings</p>
                      <p className="text-lg font-bold">{hallBookingIncomes.length}</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Total Revenue</p>
                      <p className="text-lg font-bold text-green-500">{formatCurrency(totalHallIncome)}</p>
                    </div>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                      <p className="text-sm font-medium">Net Profit</p>
                      <p className="text-lg font-bold text-blue-500">{formatCurrency(totalHallIncome - totalHallExpense)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isLoadingHallData ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                    </div>
                  ) : (
                    <>
                      {hallBookingIncomes.find(b => b.id === selectedHallBooking) ? (
                        <div>
                          {(() => {
                            const booking = hallBookingIncomes.find(b => b.id === selectedHallBooking);
                            if (!booking) return null;
                            
                            return (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                                  <p className="text-sm font-medium">Date</p>
                                  <p className="text-lg font-bold">{format(new Date(booking.date), 'dd MMM yyyy')}</p>
                                </div>
                                <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                                  <p className="text-sm font-medium">Amount</p>
                                  <p className="text-lg font-bold text-green-500">{formatCurrency(booking.amount)}</p>
                                </div>
                                <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                                  <p className="text-sm font-medium">Customer</p>
                                  <p className="text-lg font-bold">{booking.customerName}</p>
                                </div>
                                <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3">
                                  <p className="text-sm font-medium">Attendees</p>
                                  <p className="text-lg font-bold">{booking.attendees}</p>
                                </div>
                              </div>
                            );
                          })()}
                          
                          <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-3 mt-4">
                            <p className="text-sm font-medium">Purpose</p>
                            <p className="text-md">
                              {hallBookingIncomes.find(b => b.id === selectedHallBooking)?.purpose || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p>Booking details not found.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setHallDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DetailDialog;
