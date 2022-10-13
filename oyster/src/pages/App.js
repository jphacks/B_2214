import { MantineProvider} from "@mantine/core"
import TopPage from "../components";


function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS >
      <TopPage/>
    </MantineProvider>
  );
}

export default App;
