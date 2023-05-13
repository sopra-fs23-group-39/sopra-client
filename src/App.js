import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { ThemeProvider } from "styled-components";
import {theme} from "styles/mui/customMui";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header height="100"/>
      <AppRouter/>
    </ThemeProvider>
  );
};

export default App;
