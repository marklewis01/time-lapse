import { DarkTheme, DefaultTheme, Theme } from "react-native-paper";

export const darkGrey = "#222";
export const primary = "#F1A208";

export const customDefaultTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: primary,
    accent: "#F1C808",
    text: darkGrey,
    onBackground: darkGrey,
    onSurface: darkGrey
  }
};

export const customDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#BD7200",
    accent: "#FCBB3C",
    onBackground: primary,
    onSurface: primary,
    surface: darkGrey,
    text: primary
  }
};
