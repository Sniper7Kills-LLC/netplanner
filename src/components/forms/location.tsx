import { useMemo, useEffect } from 'react';
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
import { addLocation } from '@/store';
import { IPv4CidrRange } from 'ip-num';
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  organization: z.string().min(1, 'Please select an organization'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  network: z.string().ip({ version: 'v4', message: 'Invalid IPv4 address' }),
  cidr: z.coerce.number().int().gte(8, 'Max CIDR is /8').lte(30, 'Min CIDR is /30')
});

export const selectOrganizations = (state) => state.organizations;

export function LocationForm() {
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "",
      name: "",
      network: "",
      cidr: 16
    },
  });
  const organizations = useSelector(selectOrganizations);
  const locations = useSelector(state => state.locations);
  const { toast } = useToast()

  const selectOrganizationById = useMemo(() => 
    (organizationId) => organizations?.find(org => org.id === organizationId),
  [organizations]);

  const selectedOrganization = selectOrganizationById(form.watch('organization'));

  useEffect(() => {
    if (selectedOrganization) {
      form.setValue('network', selectedOrganization.network);
      form.setValue('cidr', selectedOrganization.cidr);
    }
  }, [selectedOrganization, form]);

  const validNetwork = (values) => {
    if (!selectedOrganization) return false;

    const newRange = IPv4CidrRange.fromCidr(`${values.network}/${values.cidr}`);
    const organizationRange = IPv4CidrRange.fromCidr(`${selectedOrganization.network}/${selectedOrganization.cidr}`);

    if (!organizationRange.contains(newRange)) {
      return false;
    }
    
    for (const loc of locations) {
      const existingRange = IPv4CidrRange.fromCidr(`${loc.network}/${loc.cidr}`);
      if (newRange.isOverlapping(existingRange) || existingRange.contains(newRange)) {
        return false;
      }
    }
    
    return true;
  };

  const onSubmit = (values) => {
    if (validNetwork(values)) {
      dispatch(addLocation(values));
      form.reset();
      toast({
        title: "Location Added",
        description: "The new location has been successfully added.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid network!",
        description: "The location's network you are trying to add is either not within the organization's network or overlapping with another network!",
      });
    }
  };

  const handleReset = () => {
    form.reset();
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map(org => (
                          <SelectItem key={org.id} value={org.id}>{org.name} - {org.network}/{org.cidr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the organization for this location.
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
                    The name of the location.
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
                    The network of the location.
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

        {selectedOrganization && (
          <div className="text-sm text-gray-500">
            Selected organization network: {selectedOrganization.network}/{selectedOrganization.cidr}
          </div>
        )}

        <div className="w-full flex space-x-2">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
        </div>
      </form>
    </Form>
  );
}