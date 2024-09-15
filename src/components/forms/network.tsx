import { useMemo } from 'react';
import { useDispatch, TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/types'; // adjust the import path as needed
// eslint-disable-next-line react-refresh/only-export-components
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { addNetwork } from '@/store';
import { IPv4CidrRange } from 'ip-num';

import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  organization: z.string().min(1, 'Please select an organization'),
  location: z.string().min(1, 'Please select an location'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  network: z.string().ip({ version: 'v4', message: 'Invalid IPv4 address' }),
  cidr: z.coerce.number().int().gte(8, 'Max CIDR is /8').lte(30, 'Min CIDR is /30')
});

export const selectOrganizations = (state) => state.organizations;
export const selectLocations = (state) => state.locations;

export function NetworkForm() {
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "null",
      location: "null",
      name: "",
      network: "",
      cidr: 24
    },
  });
  const organizations = useSelector(selectOrganizations);
  const locations = useSelector(selectLocations);
  const networks = useSelector(state => state.networks);
  const { toast } = useToast()

  const selectOrganizationById = useMemo(() => 
    (organizationId) => organizations?.find(org => org.id === organizationId),
  [organizations]);

  const selectLocationById = useMemo(() => 
    (locationId) => locations?.find(loc => loc.id === locationId),
  [locations]);

  const validNetwork = (values) => {
    const newRange = IPv4CidrRange.fromCidr(`${values.network}/${values.cidr}`);
    const organization = selectOrganizationById(values.organization);
    const location = selectLocationById(values.location);

    if (!organization) {
      console.error('Organization not found');
      return false;
    }

    const organizationRange = IPv4CidrRange.fromCidr(`${organization.network}/${organization.cidr}`);

    if (!organizationRange.contains(newRange)) {
      return false;
    }

    if (!location) {
      console.error('Location not found');
      return false;
    }

    const locationRange = IPv4CidrRange.fromCidr(`${location.network}/${location.cidr}`);

    if (!locationRange.contains(newRange)) {
      return false;
    }
    
    for (const net of networks) {
      const existingRange = IPv4CidrRange.fromCidr(`${net.network}/${net.cidr}`);
      if (newRange.isOverlapping(existingRange) || existingRange.contains(newRange)) {
        return false;
      }
    }
    
    return true;
  };

  const onSubmit = (values) => {
    if (validNetwork(values)) {
      dispatch(addNetwork(values));
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Invalid network!",
        description: "The network's network you are trying to add is either not within the organization's network or overlapping with another network!",
      })
    }
  };

  if (!organizations) {
    return <div>Loading organizations...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex space-x-2">
          <div className='w-2/6'>
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Select an Organization</SelectItem>
                        {organizations.map(org => (
                          <SelectItem key={org.id} value={org.id}>{org.name} - {org.network}/{org.cidr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the organization for this network.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='w-2/6'>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Select a Location</SelectItem>
                        {locations.filter(loc => loc.organization === form.watch().organization).map(loc => (
                          <SelectItem key={loc.id} value={loc.id}>{loc.name} - {loc.network}/{loc.cidr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the location for this network.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-2/6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Co." {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the network.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="w-1/6">
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <FormControl>
                    <Input placeholder="10.0.0.0" {...field} />
                  </FormControl>
                  <FormDescription>
                    The network of the network.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-1/6">
            <FormField
              control={form.control}
              name="cidr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIDR</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="8" {...field} />
                  </FormControl>
                  <FormDescription>
                    The network CIDR.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}