import React from "react";
import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import * as MediaLibrary from "expo-media-library";

import { LOCAL_MEDIA_ALBUM_NAME } from "../constants";

// Screens
import CameraScreen from "./CameraScreen";

// Comps
import { ProjectCard } from "../components/Project";
import { FlatList } from "react-native-gesture-handler";

// Navigation
const Stack = createStackNavigator();

// TS
type Props = {
  navigation: any; // TODO: find correct type which extends DrawerActions
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        title: ""
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
}

/*
 * ================================
 * Temp Home Screen comp
 * ================================
 */

const Home = ({ navigation }: any) => {
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

  // React.useEffect(() => {
  //   console.log("adding listener");

  //   MediaLibrary.addListener(() => {
  //     console.log("file");
  //   });

  //   return () => MediaLibrary.removeAllListeners();
  // }, []);

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

      <FlatList
        data={projects}
        renderItem={({ item, index }) => <ProjectCard />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};
