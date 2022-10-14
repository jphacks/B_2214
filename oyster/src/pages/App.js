import { MantineProvider } from '@mantine/core';

function App({ children }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  );
}

export default App;
