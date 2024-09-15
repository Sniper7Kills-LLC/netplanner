import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

import { deleteOrganization } from "@/store";
import { OrganizationForm } from "@/components/forms/organization"

import { useDispatch, TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/types'; // adjust the import path as needed
// eslint-disable-next-line react-refresh/only-export-components
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

import { IPv4CidrRange } from 'ip-num';

export function OrganizationTab() {
  const organizations = useSelector(state => state.organizations);

  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteOrganization(id));
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Define different organizations your network is connected to.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationForm />
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
            <p>This section is designed for you to define your organization's main network, along with any additional organizational networks you connect to.</p>
            <ol>
              <li>Define your Organization.</li>
              <li>Define organizations you VPN into.</li>
            </ol>
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      </div>
      
      
      <Card>
        <CardHeader>
          <CardTitle>Defined Organizations</CardTitle>
          <CardDescription>These are the organizations defined in this plan.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {organizations.map(org => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.id}</TableCell>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.network}</TableCell>
                  <TableCell>{org.cidr}</TableCell>
                  <TableCell>{IPv4CidrRange.fromCidr(`${org.network}/${org.cidr}`).getSize().toString()}</TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleDelete(org.id)}
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
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </div>
  )
}