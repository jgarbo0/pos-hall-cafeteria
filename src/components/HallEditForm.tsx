
import React from 'react';
import { Hall, AvailabilityRange } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(2, { message: "Hall name must be at least 2 characters" }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }),
  type: z.string().min(1, { message: "Type is required" }),
  availabilityRange: z.enum(['day', 'week', 'month']),
  description: z.string().optional(),
});

interface HallEditFormProps {
  hall: Hall;
  onSave: (hall: Hall) => void;
  onCancel: () => void;
}

const HallEditForm: React.FC<HallEditFormProps> = ({ hall, onSave, onCancel }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: hall.name,
      capacity: hall.capacity,
      type: hall.type,
      availabilityRange: hall.availabilityRange,
      description: hall.description || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedHall: Hall = {
      ...hall,
      ...values,
    };
    onSave(updatedHall);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Edit Hall Details</h2>
            <p className="text-sm text-muted-foreground">Update information for {hall.name}</p>
          </div>
          <div className="w-24 h-24 overflow-hidden rounded-lg">
            <img
              src={hall.image}
              alt={hall.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hall Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Hall Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Capacity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hall Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Guest, Family, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availabilityRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How far in advance this hall can be booked
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any details about the hall"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HallEditForm;
