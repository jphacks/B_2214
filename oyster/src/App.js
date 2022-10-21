import { MantineProvider } from '@mantine/core';

import { lightTheme } from './styles/theme'

function App({ children }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={lightTheme}>
      {children}
    </MantineProvider>
  );
}

export default App;
