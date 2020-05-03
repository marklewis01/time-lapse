import React from "react";
import { Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as MediaLibrary from "expo-media-library";

import { LOCAL_MEDIA_ALBUM_NAME } from "../constants";

// Screens
import CameraScreen from "./CameraScreen";
import TestScreen from "./TestScreen";

// Comps
import { ProjectCard } from "../components/Project";
import { FlatList } from "react-native-gesture-handler";

// Navigation
const Stack = createStackNavigator();

export default function HomeScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        title: ""
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Test Screen"
        component={TestScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

/*
 * ================================
 * Temp Home Screen comp
 * ================================
 */

const Home = () => {
  const navigation = useNavigation();

  const [cameraRollPermission, setCameraRollPermission] = React.useState<
    boolean
  >();
  const [projects, setProjects] = React.useState<MediaLibrary.Asset[] | null>(
    null
  );

  React.useEffect(() => {
    // on load, check to see if any photos
    // Check / Obtain permissions on mount
    (async () => {
      const {
        status: mediaStatus
      } = await MediaLibrary.requestPermissionsAsync();

      setCameraRollPermission(mediaStatus === "granted");
    })();
  }, []);

  React.useEffect(() => {
    if (cameraRollPermission) {
      (async () => {
        const album = await MediaLibrary.getAlbumAsync(LOCAL_MEDIA_ALBUM_NAME);
        if (album) {
          const projects = await MediaLibrary.getAssetsAsync({
            album: album.id
          });

          setProjects(projects.assets);
        }
      })();
    }
  }, [cameraRollPermission]);

  return cameraRollPermission === undefined ? (
    <View />
  ) : cameraRollPermission === false ? (
    <Text>Permission to save images to your device has been denied.</Text>
  ) : (
    <View>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="" subtitle="" />
        <Appbar.Action
          icon="plus"
          onPress={() => navigation.navigate("Camera")}
        />
      </Appbar.Header>

      <View style={{ marginVertical: 20 }}>
        <Button onPress={() => navigation.navigate("Test Screen")}>
          Go to Test Screen
        </Button>
      </View>

      <FlatList
        data={projects}
        renderItem={({ item, index }) => <ProjectCard />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
