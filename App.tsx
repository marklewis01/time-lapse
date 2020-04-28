import React from "react";
import { AsyncStorage, I18nManager } from "react-native";
import { Updates } from "expo";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
  Theme,
  Colors
} from "react-native-paper";
import { InitialState, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Custom comps
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import DrawerItems from "./components/Drawer/DrawerItems";

// Local Storage Settings
const PERSISTENCE_KEY = "NAVIGATION_STATE";
const PREFERENCES_KEY = "APP_PREFERENCES";

// Context
const PreferencesContext = React.createContext<any>(null);

const Stack = createStackNavigator();
// Drawer
const DrawerContent = () => {
  return (
    <PreferencesContext.Consumer>
      {(preferences) => (
        <DrawerItems
          toggleTheme={preferences.toggleTheme}
          toggleRTL={preferences.toggleRtl}
          isRTL={preferences.rtl}
          isDarkTheme={preferences.theme === customDarkTheme}
        />
      )}
    </PreferencesContext.Consumer>
  );
};
const Drawer = createDrawerNavigator<{ Home: undefined }>();

const customDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.green700,
    accent: Colors.lime600
  }
};

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.green400,
    accent: Colors.lime900
  }
};

// App
export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [theme, setTheme] = React.useState<Theme>(customDefaultTheme);
  const [rtl, setRtl] = React.useState<boolean>(I18nManager.isRTL);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);

        const state = JSON.parse(savedStateString || "");

        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || "");

        if (preferences) {
          // eslint-disable-next-line react/no-did-mount-set-state
          setTheme(
            preferences.theme === "dark" ? customDarkTheme : customDefaultTheme
          );

          if (typeof preferences.rtl === "boolean") {
            setRtl(preferences.rtl);
          }
        }
      } catch (e) {
        // ignore error
      }
    };

    restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      try {
        await AsyncStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: theme === customDarkTheme ? "dark" : "light",
            rtl
          })
        );
      } catch (e) {
        // ignore error
      }

      if (I18nManager.isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        Updates.reloadFromCache();
      }
    };

    savePrefs();
  }, [rtl, theme]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () =>
        setTheme((theme) =>
          theme === customDefaultTheme ? customDarkTheme : customDefaultTheme
        ),
      toggleRtl: () => setRtl((rtl) => !rtl),
      rtl,
      theme
    }),
    [rtl, theme]
  );

  if (!isReady) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <PreferencesContext.Provider value={preferences}>
        <NavigationContainer
          initialState={initialState}
          onStateChange={(state) =>
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
          }
        >
          <Drawer.Navigator drawerContent={() => <DrawerContent />}>
            <Drawer.Screen name="Home" component={HomeScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
