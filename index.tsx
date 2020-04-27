import * as React from "react";
import { registerRootComponent } from "expo";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import App from "./App";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "teal",
    accent: "yellow"
  }
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

registerRootComponent(Main);
