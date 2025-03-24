
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ServicePackage, TableItem, HallBooking } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Define form schema
const formSchema = z.object({
  customerName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  customerPhone: z.string().min(6, { message: "Phone number is required" }),
  date: z.date({ required_error: "Please select a date" }),
  startTime: z.string({ required_error: "Please select start time" }),
  endTime: z.string({ required_error: "Please select end time" }),
  purpose: z.string().min(2, { message: "Purpose is required" }),
  attendees: z.coerce.number().min(1, { message: "Attendees must be at least 1" }),
  tableId: z.string().optional(),
  packageId: z.string().optional(),
  additionalServices: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HallBookingFormProps {
  tables: TableItem[];
  packages: ServicePackage[];
  onSubmit: (booking: HallBooking) => void;
}

// Available additional services
const additionalServices = [
  { id: "photography", label: "Photography", price: 50 },
  { id: "videography", label: "Videography", price: 80 },
  { id: "music", label: "Music System", price: 40 },
  { id: "projector", label: "Projector", price: 30 },
  { id: "microphone", label: "Microphone Set", price: 20 },
];

// Time slots
const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const HallBookingForm = ({ tables, packages, onSubmit }: HallBookingFormProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      purpose: "",
      attendees: 1,
      additionalServices: [],
    }
  });

  // Calculate total whenever selections change
  React.useEffect(() => {
    let total = 0;
    
    // Add package price
    if (selectedPackage) {
      const packageObj = packages.find(p => p.id === selectedPackage);
      if (packageObj) {
        total += packageObj.price;
      }
    }
    
    // Add additional services
    selectedServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) {
        total += service.price;
      }
    });
    
    setTotalAmount(total);
  }, [selectedPackage, selectedServices, packages]);

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  const handlePackageChange = (packageId: string) => {
    setSelectedPackage(packageId);
    form.setValue('packageId', packageId);
  };

  const onFormSubmit = (data: FormValues) => {
    // Create a new booking object
    const newBooking: HallBooking = {
      id: `BK${Math.floor(1000 + Math.random() * 9000)}`, // Generate a random ID
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      date: format(data.date, 'yyyy-MM-dd'),
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      attendees: data.attendees,
      tableId: data.tableId ? parseInt(data.tableId) : undefined,
      packageId: data.packageId,
      additionalServices: selectedServices,
      status: 'pending',
      notes: data.notes,
      totalAmount: totalAmount
    };
    
    onSubmit(newBooking);
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-lg font-semibold">New Hall Booking</h2>
        <p className="text-sm text-gray-500">Create a new booking for the hall</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+252..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Booking Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Purpose</FormLabel>
                    <FormControl>
                      <Input placeholder="Wedding, Meeting, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="attendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Attendees</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tableId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table (optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a table" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No table needed</SelectItem>
                      {tables
                        .filter(table => table.status === 'available')
                        .map((table) => (
                          <SelectItem key={table.id} value={table.id.toString()}>
                            {table.name} ({table.seats} seats)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only available tables are shown
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <FormLabel>Package Selection</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === pkg.id ? 'ring-2 ring-primary' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePackageChange(pkg.id)}
                  >
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-sm text-gray-500 mb-2">{pkg.description}</div>
                    <div className="font-semibold">${pkg.price.toFixed(2)}</div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                          <Info className="h-3 w-3 mr-1" />
                          View details
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{pkg.name}</AlertDialogTitle>
                          <AlertDialogDescription>
                            <p className="mb-2">{pkg.description}</p>
                            <div className="font-medium mt-4 mb-2">Includes:</div>
                            <ul className="list-disc pl-5 space-y-1">
                              {pkg.items.map((item, idx) => (
                                <li key={idx} className="text-sm">{item}</li>
                              ))}
                            </ul>
                            <div className="font-semibold mt-4">${pkg.price.toFixed(2)}</div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handlePackageChange(pkg.id)}>
                            Select Package
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <FormLabel>Additional Services</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {additionalServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={service.id} 
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={(checked) => 
                        handleServiceToggle(service.id, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={service.id} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {service.label} (${service.price})
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special requirements or notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <SheetClose asChild>
            <Button type="submit" className="w-full">Create Booking</Button>
          </SheetClose>
        </form>
      </Form>
    </div>
  );
};

export default HallBookingForm;
