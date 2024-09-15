import { useEffect, useMemo } from 'react';
import { useDispatch, TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/types'; // adjust the import path as needed
// eslint-disable-next-line react-refresh/only-export-components
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
import {
  Card,
  CardContent,
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
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  initializeConnections, 
  toggleConnection, 
  selectConnectionStatus,
  selectIsInitialized
} from '@/store';

export function SecurityTab() {
  const dispatch = useDispatch();
  const organizations = useSelector(state => state.organizations);
  const locations = useSelector(state => state.locations);
  const networks = useSelector(state => state.networks);
  const isInitialized = useSelector(selectIsInitialized);

  useEffect(() => {
    if (!isInitialized && networks.length > 0) {
      dispatch(initializeConnections({ networkIds: networks.map(n => n.id) }));
    }
  }, [dispatch, networks, isInitialized]);

  const networkInfo = useMemo(() => {
    return networks.reduce((acc, network) => {
      const location = locations.find(loc => loc.id === network.location);
      const organization = organizations.find(org => org.id === location?.organization);
      acc[network.id] = {
        organizationName: organization?.name || 'Unknown Organization',
        locationName: location?.name || 'Unknown Location'
      };
      return acc;
    }, {});
  }, [networks, locations, organizations]);

  const handleCheckboxChange = (network1Id, network2Id) => {
    dispatch(toggleConnection({ network1Id, network2Id }));
  };

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  return (
    <div className='space-y-2'>
      <Card className="w-full">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            {/* <CardDescription>Use the following matrix to describe which networks can communicate with each other.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <p>Use the following matrix to describe which networks can communicate with each other.</p>
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Security Matrix</CardTitle>
            {/* <CardDescription>Define different organizations your network is connected to.</CardDescription> */}
          </CardHeader>
          <CardContent>
          <Table aria-label="Network Security Matrix">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Network</TableHead>
            {networks.map(network => (
              <TableHead key={network.id} className="text-center">
                <div className="text-xs text-gray-500">{networkInfo[network.id].organizationName}</div>
                <div className="text-xs text-gray-500">{networkInfo[network.id].locationName}</div>
                <div>{network.name}</div>
                <div className="text-xs">{network.network}/{network.cidr}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {networks.map(network1 => (
            <TableRow key={network1.id}>
              <TableCell className="font-medium">
                <div className="text-xs text-gray-500">{networkInfo[network1.id].organizationName}</div>
                <div className="text-xs text-gray-500">{networkInfo[network1.id].locationName}</div>
                <div>{network1.name}</div>
                <div className="text-xs">{network1.network}/{network1.cidr}</div>
              </TableCell>
              
              {networks.map(network2 => (
                <TableCell key={network2.id} className="text-center">
                  {network1.id !== network2.id && (
                    <Checkbox
                      checked={useSelector(state => 
                        selectConnectionStatus(state, network1.id, network2.id)
                      )}
                      onCheckedChange={() => handleCheckboxChange(network1.id, network2.id)}
                      aria-label={`Toggle connection between ${network1.name} and ${network2.name}`}
                    />
                  )}
                </TableCell>
              ))}
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
  );
}