import { useDispatch, TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/types'; // adjust the import path as needed
// eslint-disable-next-line react-refresh/only-export-components
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { setOrganizations, setLocations, setNetworks, setSecurity } from '@/store'; // Assume these action creators exist

export function StorageTab() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const organizations = useSelector(state => state.organizations);
  const locations = useSelector(state => state.locations);
  const networks = useSelector(state => state.networks);
  const security = useSelector(state => state.security);

  const handleExport = () => {
    const data = {
      organizations,
      locations,
      networks,
      security
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'network_data_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Export Successful",
      description: "Your data has been exported successfully.",
    });
  };


  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result as string);
          if (validateImportedData(importedData)) {
            dispatch(setOrganizations(importedData.organizations));
            dispatch(setLocations(importedData.locations));
            dispatch(setNetworks(importedData.networks));
            dispatch(setSecurity(importedData.security));
            toast({
              title: "Import Successful",
              description: "Your data has been imported successfully.",
            });
          } else {
            console.log("Invalid data structure.")
            throw new Error("Invalid data structure");
          }
        } catch (error) {
          console.log("Error...")
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "There was an error importing the data. Please check the file format.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const validateImportedData = (data) => {
    // Add more thorough validation as needed
    return (
      data &&
      Array.isArray(data.organizations) &&
      Array.isArray(data.locations) &&
      Array.isArray(data.networks)
    );
  };

  return (
    <div className="space-y-2">
      
      
      <div className='flex space-x-2'>
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>Save this plan to be shared with others.</CardDescription>
          </CardHeader>
          <CardContent>
          <Button className='' onClick={handleExport}>Export to JSON</Button>
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Import</CardTitle>
            <CardDescription>Import an existing plan to view and edit.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="max-w-xs mx-auto"
            />
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      </div>
    </div>
  );
}