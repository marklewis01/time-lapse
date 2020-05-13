import React from "react";
import { AsyncStorage, I18nManager, Image, View } from "react-native";
import { Updates } from "expo";
import {
  Button,
  Dialog,
  Portal,
  Provider as PaperProvider,
  Text,
  Theme
} from "react-native-paper";
import { InitialState, NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions
} from "@react-navigation/drawer";
import Constants from "expo-constants";

// Custom comps
import HomeScreen from "./screens/HomeScreen";
import DrawerItems from "./components/Drawer/DrawerItems";

// DB
import {
  getManyProjects,
  createProjectTable,
  createImagesTable,
  resetTables
} from "./db";

// TS
import { RootDialog, HandleRootDialog } from "./types";

// Theme
import { customDefaultTheme, customDarkTheme } from "./theme.style";

// Context
const PreferencesContext = React.createContext<any>(null);

import logo from "./assets/icon.png";

interface DrawerContentProps
  extends DrawerContentComponentProps<DrawerContentOptions> {
  handleDialog: HandleRootDialog;
}

// Drawer
const DrawerContent = (props: DrawerContentProps) => (
  <PreferencesContext.Consumer>
    {(preferences) => (
      <DrawerItems
        handleDialog={props.handleDialog}
        toggleTheme={preferences.toggleTheme}
        toggleRTL={preferences.toggleRtl}
        isRTL={preferences.rtl}
        isDarkTheme={preferences.theme === customDarkTheme}
        {...props}
      />
    )}
  </PreferencesContext.Consumer>
);
const Drawer = createDrawerNavigator<{ Home: undefined }>();

// Local Storage Settings
const PERSISTENCE_KEY = "NAVIGATION_STATE";
const PREFERENCES_KEY = "APP_PREFERENCES";

// App
export default function App() {
  const [dialog, setDialog] = React.useState<RootDialog>();
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();
  const [rtl, setRtl] = React.useState<boolean>(I18nManager.isRTL);
  const [theme, setTheme] = React.useState<Theme>(customDefaultTheme);

  const handleDialog: HandleRootDialog = (s) => {
    setDialog(s);
  };

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString: any = await AsyncStorage.getItem(
          PERSISTENCE_KEY
        );

        const state = JSON.parse(savedStateString || "");

        // not certain if required, but during development, if app
        // starts with only 'Camera' in route history, going 'back'
        // throws error and user cannot escape Camera screen.
        const saferNavState =
          state.routes[0].state.routes.length === 0 &&
          state.routes[0].state.routes[0].name === "Camera"
            ? ""
            : state;

        setInitialState(saferNavState);
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
    // TODO: move this to SQLite instead of localStorage
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

  // local db
  React.useEffect(() => {
    (async () => {
      try {
        // check if tables exists
        const projects = await getManyProjects();

        if (!projects.length) {
          await createProjectTable();
          await createImagesTable();
        }
      } catch (e) {
        await createProjectTable();
        await createImagesTable();
      }
    })();
  }, []);

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
          <Drawer.Navigator
            drawerContent={(props) => DrawerContent({ handleDialog, ...props })}
            initialRouteName="Home"
          >
            <Drawer.Screen name="Home" component={HomeScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
        {dialog && (
          <Portal>
            <AboutModal handleDialog={handleDialog} />
          </Portal>
        )}
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}

const AboutModal = ({ handleDialog }: { handleDialog: HandleRootDialog }) => {
  const handleReset = () => {
    return resetTables()
      .then(() => console.log("Reset successfully"))
      .catch((e) => console.error(e));
  };

  return (
    <Dialog visible={true} onDismiss={() => handleDialog(undefined)}>
      <View style={{ padding: 15 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={logo}
            style={{
              resizeMode: "contain",
              width: 100,
              height: 100
            }}
          />
          <Text>Time Lapse</Text>
        </View>
        <Dialog.Content style={{ marginVertical: 30, alignItems: "center" }}>
          <Text>Version: {Constants.manifest.version}</Text>
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: "space-between" }}>
          <Button color="red" onPress={handleReset}>
            Reset App
          </Button>

          <Button onPress={() => handleDialog(undefined)}>Close</Button>
        </Dialog.Actions>
      </View>
    </Dialog>
  );
};
