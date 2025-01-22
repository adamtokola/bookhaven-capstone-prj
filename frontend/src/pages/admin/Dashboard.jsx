import { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
} from '@mui/material';
import BooksManager from './BooksManager';
import UsersManager from './UsersManager';
import CategoriesManager from './CategoriesManager';
import ReportsManager from './ReportsManager';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Dashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            aria-label="admin dashboard tabs"
          >
            <Tab label="Books" />
            <Tab label="Users" />
            <Tab label="Categories" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <BooksManager />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <UsersManager />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <CategoriesManager />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <ReportsManager />
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default Dashboard; 