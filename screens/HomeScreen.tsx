import React from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View
} from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
  Paragraph
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as MediaLibrary from "expo-media-library";

// Screens
import CameraScreen from "./CameraScreen";
import CompareScreen from "./CompareScreen";
import ProjectScreen from "./ProjectScreen";

// Comps
import { ProjectCard } from "../components/Project";

// DB
import { getManyProjects, insertProject } from "../db";
import { IProject, ScreenStackParamList } from "../types";

// Navigation
const Stack = createStackNavigator<ScreenStackParamList>();

// Images
import ArrowSvg from "../assets/right-curve-arrow.png";

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
  const theme = useTheme();

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
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Appbar.Header>
        <Appbar.Action
          color={theme.colors.onBackground}
          icon="menu"
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="" subtitle="" />
        <Appbar.Action
          color={theme.colors.onBackground}
          icon="plus"
          onPress={() => setDialog(true)}
        />
      </Appbar.Header>
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleGetProjects}
        refreshing={refreshing}
        ListEmptyComponent={
          <View
            style={{
              paddingVertical: 15,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-end"
            }}
          >
            <View
              style={{
                marginTop: 20,
                maxWidth: 250,
                alignItems: "center"
              }}
            >
              <Paragraph style={{ textAlign: "center" }}>
                You don't have any projects yet. Click this button to create
                your first project.
              </Paragraph>
            </View>
            <Image
              source={ArrowSvg}
              style={{ marginRight: 20, marginLeft: 5 }}
            />
          </View>
        }
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
                <Button
                  mode="contained"
                  onPress={handleSaveProject}
                  color={theme.colors.onBackground}
                >
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
