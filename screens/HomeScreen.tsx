import React from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Appbar, Button, Dialog, Portal, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as MediaLibrary from "expo-media-library";

import { LOCAL_MEDIA_ALBUM_NAME } from "../constants";

// Screens
import CameraScreen from "./CameraScreen";
import CompareScreen from "./CompareScreen";
import ProjectScreen from "./ProjectScreen";
import TestScreen from "./TestScreen";

// Comps
import { ProjectCard } from "../components/Project";

// DB
import { getManyProjects, insertProject } from "../db";
import { IProject, ScreenStackParamList } from "../types";

// Navigation
const Stack = createStackNavigator<ScreenStackParamList>();

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
      <Stack.Screen name="CompareScreen" component={CompareScreen} />
      <Stack.Screen name="ProjectScreen" component={ProjectScreen} />
      <Stack.Screen name="TestScreen" component={TestScreen} />
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
  const [dialog, setDialog] = React.useState(false);
  const [newProject, setNewProject] = React.useState("");
  const [projects, setProjects] = React.useState<IProject[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleCloseModal = () => {
    setNewProject("");
    setDialog(false);
  };

  const handleGetProjects = async () => {
    setRefreshing(true);
    setProjects(await getManyProjects());
    setRefreshing(false);
  };

  const handleSaveProject = async () => {
    try {
      // do nothing if no project name
      if (newProject === "") return;

      // do db work
      const id = (await insertProject(newProject)) as number;
      handleCloseModal();
      navigation.navigate("ProjectScreen", { id });

      // await handleGetProjects();
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    (async () => {
      // Check / Obtain permissions on mount
      const {
        status: mediaStatus
      } = await MediaLibrary.requestPermissionsAsync();

      setCameraRollPermission(mediaStatus === "granted");
    })();

    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      handleGetProjects();
    });

    return unsubscribe;
  }, [navigation]);

  return cameraRollPermission === undefined ? (
    <View />
  ) : cameraRollPermission === false ? (
    <Text>Permission to save images to your device has been denied.</Text>
  ) : (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="" subtitle="" />
        <Appbar.Action icon="plus" onPress={() => setDialog(true)} />
      </Appbar.Header>

      <FlatList
        data={projects}
        renderItem={({ item, index }) => <ProjectCard project={item} />}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleGetProjects}
        refreshing={refreshing}
        ListEmptyComponent={<Text>You have no projects</Text>}
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
                <Button mode="contained" onPress={handleSaveProject}>
                  Create
                </Button>
              </Dialog.Actions>
            </Dialog>
          </KeyboardAvoidingView>
        </Portal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    padding: 20,
    alignItems: "center"
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
