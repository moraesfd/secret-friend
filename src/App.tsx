import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";
import { RouterComponent } from "./router";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default App;
