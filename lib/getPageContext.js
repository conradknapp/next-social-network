import { SheetsRegistry } from "jss";
import {
  createMuiTheme,
  createGenerateClassName
} from "@material-ui/core/styles";
import { teal, orange } from "@material-ui/core/colors";

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       light: purple[300],
//       main: purple[500],
//       dark: purple[700]
//     },
//     secondary: {
//       light: green[300],
//       main: green[500],
//       dark: green[700]
//     }
//   }
// });

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#52c7b8",
      main: "#009688",
      dark: "#00675b",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ffd95b",
      main: "#ffa726",
      dark: "#c77800",
      contrastText: "#000"
    },
    openTitle: teal["700"],
    protectedTitle: orange["700"],
    type: "light"
  }
});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName()
  };
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}