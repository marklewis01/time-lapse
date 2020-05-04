import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Paragraph,
  Portal,
  TextInput
} from "react-native-paper";
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
        title: "",
        headerShown: false
      }}
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Test Screen" component={TestScreen} />
    </Stack.Navigator>
  );
}

/*
 * ================================
 * Temp Home Screen comp
 * ================================
 */

const Home = () => {
  const navigation = useNavigation<any>();

  const [cameraRollPermission, setCameraRollPermission] = React.useState<
    boolean
  >();
  const [projects, setProjects] = React.useState<MediaLibrary.Asset[] | null>(
    null
  );
  const [newProject, setNewProject] = React.useState("");
  const [dialog, setDialog] = React.useState(false);

  const handleCloseModal = () => {
    setNewProject("");
    setDialog(false);
  };

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
        <Appbar.Action icon="plus" onPress={() => setDialog(true)} />
      </Appbar.Header>
      <FlatList
        data={projects}
        renderItem={({ item, index }) => <ProjectCard />}
        keyExtractor={(item, index) => index.toString()}
      />
      {dialog && (
        <Portal>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
              <Dialog.Title>Create a new project?</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Project Name"
                  value={newProject}
                  onChangeText={(text) => setNewProject(text)}
                  mode="outlined"
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={handleCloseModal}>Cancel</Button>
                <Button mode="contained" onPress={handleCloseModal}>
                  Create
                </Button>
              </Dialog.Actions>
            </Dialog>
          </KeyboardAvoidingView>
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    // margin: "auto",
    // backgroundColor: "white",
    // borderRadius: 20,
    padding: 20,
    alignItems: "center"
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
