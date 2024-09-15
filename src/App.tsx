// import { useState } from 'react'
import './App.css'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { OrganizationTab } from './components/tabs/organization'
import { LocationTab } from './components/tabs/location'
import { NetworkTab } from './components/tabs/network'
import { SecurityTab } from './components/tabs/security'
import { StorageTab } from './components/tabs/storage'
///

///

function App() {

  return (
    <>
      <div className="text-center">
      <Tabs defaultValue="organizations" className="">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="storage">Import / Export Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="organizations">
          <OrganizationTab />
        </TabsContent>
        <TabsContent value="locations">
          <LocationTab />
        </TabsContent>
        <TabsContent value="networks">
          <NetworkTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="storage">
          <StorageTab />
        </TabsContent>
      </Tabs>
      </div>
      
    </>
  )
}

export default App
