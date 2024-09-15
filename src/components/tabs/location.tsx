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

import { useDispatch, TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/types'; // adjust the import path as needed
// eslint-disable-next-line react-refresh/only-export-components
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
import { deleteLocation } from "@/store";
import { LocationForm } from "@/components/forms/location";

import { IPv4CidrRange } from 'ip-num';

export function LocationTab() {
  const organizations = useSelector(state => state.organizations);
  const locations = useSelector(state => state.locations);

  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteLocation(id));
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle>Locations</CardTitle>
            <CardDescription>Define different locations that contain multiple networks.</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationForm />
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
            <p>This section is designed to identify different locations that will have networks assigned to them. These locations typically contain a router.</p>
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      </div>
      
      
      <Card>
        <CardHeader>
          <CardTitle>Defined Locations</CardTitle>
          <CardDescription>These are the locations for each organization defined in this plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple">
            {organizations.map(org => (
              <AccordionItem key={org.id} value={org.id}>
                <AccordionTrigger>{org.name} - {org.network}/{org.cidr}</AccordionTrigger>
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
                      {locations.filter(location => location.organization === org.id).map(location => (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">{location.id}</TableCell>
                          <TableCell>{location.name}</TableCell>
                          <TableCell>{location.network}</TableCell>
                          <TableCell>{location.cidr}</TableCell>
                          <TableCell>{IPv4CidrRange.fromCidr(`${location.network}/${location.cidr}`).getSize().toString()}</TableCell>
                          {/* <TableCell>{(IPv4CidrRange.fromCidr(`${location.network}/${location.cidr}`).getSize().valueOf() - BigInt(2)).toString()}</TableCell> */}
                          <TableCell>
                            <Button 
                              onClick={() => handleDelete(location.id)}
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
    </div>
  )
}