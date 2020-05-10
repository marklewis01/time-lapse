import * as React from "react";
import { BackHandler, Platform, StyleSheet, View } from "react-native";
import {
  Drawer,
  Switch,
  TouchableRipple,
  Text,
  useTheme,
  Button
} from "react-native-paper";

import {
  DrawerContentComponentProps,
  DrawerContentOptions
} from "@react-navigation/drawer";

// TS
import { HandleRootDialog } from "../../types";

interface Props extends DrawerContentComponentProps<DrawerContentOptions> {
  handleDialog: HandleRootDialog;
  toggleTheme(): void;
  toggleRTL(): void;
  isRTL: boolean;
  isDarkTheme: boolean;
}

const DrawerItemsData = [
  { label: "Dashboard", icon: "home", navigation: "HomeScreen", key: 0 }
];

const DrawerItems = ({
  handleDialog,
  toggleTheme,
  toggleRTL,
  isRTL,
  isDarkTheme,
  navigation
}: Props) => {
  const { colors } = useTheme();
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);

  const handleAbout = () => handleDialog("about");

  // const handleLogout = () => {
  //   console.log("logout pressed");
  // };

  return (
    <View style={[styles.drawerContent, { backgroundColor: colors.surface }]}>
      <Drawer.Section title="Photo Lapse">
        {DrawerItemsData.map((props, index) => (
          <Drawer.Item
            {...props}
            key={index}
            // active={drawerItemIndex === index}
            onPress={() => {
              setDrawerItemIndex(index);
              navigation.navigate(props.navigation);
            }}
          />
        ))}
      </Drawer.Section>

      <Drawer.Section title="Preferences">
        <TouchableRipple onPress={toggleTheme}>
          <View style={styles.preference}>
            <Text>Dark Theme</Text>
            <View pointerEvents="none">
              <Switch value={isDarkTheme} />
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={toggleRTL}>
          <View style={styles.preference}>
            <Text>RTL</Text>
            <View pointerEvents="none">
              <Switch value={isRTL} />
            </View>
          </View>
        </TouchableRipple>
      </Drawer.Section>

      <Drawer.Section>
        {/* <TouchableRipple onPress={() => handleReset()}>
          <View style={styles.preference}>
            <Text>Factory Reset</Text>
          </View>
        </TouchableRipple> */}
        <TouchableRipple onPress={handleAbout}>
          <Drawer.Item label="About" />
        </TouchableRipple>
      </Drawer.Section>

      <View style={styles.logoutSection}>
        <Button
          mode="contained"
          icon="logout"
          style={styles.logoutButton}
          onPress={() => BackHandler.exitApp()}
        >
          Exit
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 22
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  logoutButton: {
    borderRadius: 0,
    padding: 10
  },
  logoutSection: {
    flex: 1,
    justifyContent: "flex-end"
  }
});

export default DrawerItems;
