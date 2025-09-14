import React from "react";
import Profile from "../components/Dashboard/Profile";
import Lending from "../components/Dashboard/Lending";
import Borrow from "../components/Dashboard/Borrow";
import { useLocation } from 'react-router-dom';
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
// We no longer need the icons, so the import below is removed.

const Accounts = () => {
  const location = useLocation();
  const { value = 'profile' } = location.state || {};

  // --- SIMPLIFIED DATA STRUCTURE (NO ICONS) ---
  const data = [
    {
      label: "Profile",
      value: "profile",
      component: <Profile />,
    },
    {
      label: "Borrow",
      value: "borrow",
      component: <Borrow />,
    },
    {
      label: "Lending",
      value: "lending",
      component: <Lending />,
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <Tabs value={value}>
        {/* --- CLEANER TAB HEADER --- */}
        <TabsHeader
          className="rounded-lg border border-blue-gray-50 bg-transparent p-1"
          indicatorProps={{
            className: "bg-gray-900/10 shadow-md",
          }}
        >
          {data.map(({ label, value: tabValue }) => (
            <Tab key={tabValue} value={tabValue} className="text-blue-gray-900 font-semibold">
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value: tabValue, component }) => (
            <TabPanel key={tabValue} value={tabValue} className="mt-6 p-0">
              {component}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default Accounts;