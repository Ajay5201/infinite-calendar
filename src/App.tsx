import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import InfiniteCalendar from './components/InfiniteCalendar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      50: '#e3f2fd',
      800: '#1565c0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InfiniteCalendar />
    </ThemeProvider>
  );
};

export default App;