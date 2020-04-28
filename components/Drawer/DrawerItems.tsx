import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  Drawer,
  Switch,
  TouchableRipple,
  Text,
  Colors,
  useTheme,
  Button
} from "react-native-paper";

type Props = {
  toggleTheme: () => void;
  toggleRTL: () => void;
  isRTL: boolean;
  isDarkTheme: boolean;
};

const DrawerItemsData = [
  { label: "Inbox", icon: "inbox", key: 0 },
  { label: "Starred", icon: "star", key: 1 },
  { label: "Sent mail", icon: "send", key: 2 },
  { label: "Colored label", icon: "palette", key: 3 },
  { label: "A very long title that will be truncated", icon: "delete", key: 4 }
];

const DrawerItems = ({ toggleTheme, toggleRTL, isRTL, isDarkTheme }: Props) => {
  const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);

  const _setDrawerItem = (index: number) => setDrawerItemIndex(index);

  const { colors } = useTheme();

  return (
    <View style={[styles.drawerContent, { backgroundColor: colors.surface }]}>
      <Drawer.Section title="Example items">
        {DrawerItemsData.map((props, index) => (
          <Drawer.Item
            {...props}
            key={props.key}
            theme={
              props.key === 3
                ? { colors: { primary: Colors.tealA200 } }
                : undefined
            }
            active={drawerItemIndex === index}
            onPress={() => _setDrawerItem(index)}
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
        {/* <TouchableRipple onPress={toggleRTL}> */}
        <View style={styles.preference}>
          <Text>RTL</Text>
          <View pointerEvents="none">
            <Switch value={isRTL} />
          </View>
        </View>
        {/* </TouchableRipple> */}
      </Drawer.Section>

      <View style={styles.logoutSection}>
        <Button
          mode="contained"
          icon="logout"
          style={styles.logoutButton}
          onPress={() => console.log("logout pressed")}
        >
          Logout
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
