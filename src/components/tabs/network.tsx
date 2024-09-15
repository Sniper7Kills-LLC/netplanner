import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

import { IPv4CidrRange } from 'ip-num';

import { useDispatch, TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/types'; // adjust the import path as needed
// eslint-disable-next-line react-refresh/only-export-components
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
import { NetworkForm } from "../forms/network";
import { deleteNetwork } from "@/store";

export function NetworkTab() {

  const organizations = useSelector(state => state.organizations);
  const locations = useSelector(state => state.locations);
  const networks = useSelector(state => state.networks);

  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteNetwork(id));
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle>Networks</CardTitle>
            <CardDescription>Define the networks devices will actually use.</CardDescription>
          </CardHeader>
          <CardContent>
            <NetworkForm />
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>

        <Card className="w-1/3">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          <CardContent>
            <p>These are the networks that are behind a router. These are the networks that client devices will actually connect to.</p>
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      </div>
      {organizations.map(org => (
        <Card className="w-full">
        <CardHeader>
          <CardTitle>{org.name} - {org.network}/{org.cidr}</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
        <Accordion type="multiple">
          {locations.filter(loc => loc.organization === org.id).map(loc => (
              <AccordionItem key={loc.id} value={loc.id}>
                <AccordionTrigger>{loc.name} - {loc.network}/{loc.cidr}</AccordionTrigger>
                <AccordionContent className="ml-8">
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Network</TableHead>
                        <TableHead>CIDR</TableHead>
                        <TableHead>Total IP's</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {networks.filter(network => network.location === loc.id).map(network => (
                        <TableRow key={network.id}>
                          <TableCell className="font-medium">{network.id}</TableCell>
                          <TableCell>{network.name}</TableCell>
                          <TableCell>{network.network}</TableCell>
                          <TableCell>{network.cidr}</TableCell>
                          <TableCell>{(IPv4CidrRange.fromCidr(`${network.network}/${network.cidr}`).getSize().valueOf() - BigInt(2)).toString()}</TableCell>
                          <TableCell>
                            <Button 
                              onClick={() => handleDelete(network.id)}
                              variant="destructive"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
      ))}
    </div>
  )
}