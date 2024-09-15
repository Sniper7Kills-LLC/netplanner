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
import { Input } from "@/components/ui/input";
import { addOrganization } from '@/store';
import { IPv4CidrRange } from 'ip-num';


import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  network: z.string().ip('Invalid IP address'),
  cidr: z.coerce.number().gte(8, 'Max CIDR is /8').lte(30, 'Min CIDR is /30')
});


export function OrganizationForm() {

  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      network: "",
      cidr: 8
    },
  });
  
  const organizations = useSelector(state => state.organizations);
  const { toast } = useToast()

  function validNetwork(values) {
    const newRange = IPv4CidrRange.fromCidr(`${values.network}/${values.cidr}`);
    
    for (const org of organizations) {
      const existingRange = IPv4CidrRange.fromCidr(`${org.network}/${org.cidr}`);
      if (newRange.isOverlapping(existingRange) || existingRange.contains(newRange)) {
        return false;
      }
    }
    return true;
  }

  function onSubmit(values) {
    if (validNetwork(values)) {
      dispatch(addOrganization(values));
      form.reset();
    }else{
      toast({
        variant: "destructive",
        title: "Overlapping network!",
        description: "The organization's network you are trying to add is overlapping with another network!",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex space-x-2">
          <div className="w-2/5">
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
                    The name of the organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="w-2/5">
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
                    The network of the organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-1/5">
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
          <Button variant="default" type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}