import { DarkTheme, DefaultTheme, Theme } from "react-native-paper";

export const darkGrey = "#222";
export const primary = "#F1A208";
export const primaryDark = "#d89107";

export const customDefaultTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: primary,
    accent: darkGrey,
    text: darkGrey,
    onBackground: darkGrey,
    onSurface: darkGrey
  }
};

export const customDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: primaryDark,
    accent: primary,
    onBackground: primaryDark,
    onSurface: primaryDark,
    surface: darkGrey,
    text: primaryDark
  }
};
