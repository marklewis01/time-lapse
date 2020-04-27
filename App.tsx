import React from "react";
import {
  AsyncStorage,
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Updates } from "expo";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
  Theme,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph
} from "react-native-paper";
import { InitialState, NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import DrawerItems from "./components/Drawer/DrawerItems";

const PERSISTENCE_KEY = "NAVIGATION_STATE";
const PREFERENCES_KEY = "APP_PREFERENCES";

const PreferencesContext = React.createContext<any>(null);

const DrawerContent = () => {
  return (
    <PreferencesContext.Consumer>
      {(preferences) => (
        <DrawerItems
          toggleTheme={preferences.toggleTheme}
          toggleRTL={preferences.toggleRtl}
          isRTL={preferences.rtl}
          isDarkTheme={preferences.theme === DarkTheme}
        />
      )}
    </PreferencesContext.Consumer>
  );
};

const Drawer = createDrawerNavigator<{ Home: undefined }>();

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [theme, setTheme] = React.useState<Theme>(DefaultTheme);
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
          setTheme(preferences.theme === "dark" ? DarkTheme : DefaultTheme);

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
            theme: theme === DarkTheme ? "dark" : "light",
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
          theme === DefaultTheme ? DarkTheme : DefaultTheme
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
        <React.Fragment>
          <NavigationContainer
            initialState={initialState}
            onStateChange={(state) =>
              AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }
          >
            {Platform.OS === "web" ? (
              <Test />
            ) : (
              <Drawer.Navigator drawerContent={() => <DrawerContent />}>
                <Drawer.Screen name="Home" component={Test} />
              </Drawer.Navigator>
            )}
          </NavigationContainer>
        </React.Fragment>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />;

const Test = () => (
  <View>
    <Card>
      <Card.Title
        title="Card Title"
        subtitle="Card Subtitle"
        left={LeftContent}
      />
      <Card.Content>
        <Title>Card title</Title>
        <Paragraph>Card content</Paragraph>
      </Card.Content>
      <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  </View>
);
