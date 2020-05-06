import * as React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  findNodeHandle
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Colors,
  Dialog,
  IconButton,
  Menu,
  Portal,
  ProgressBar,
  Provider
} from "react-native-paper";
import moment from "moment";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenStackParamList } from "../types";

// db
import { deleteProject, getOneProject, getProjectImages } from "../db";

import { IImage, IProject } from "../types";

type ProjectScreenNavigationProp = StackNavigationProp<
  ScreenStackParamList,
  "ProjectScreen"
>;
type ProjectScreenRouteProp = RouteProp<ScreenStackParamList, "ProjectScreen">;

type Props = {
  navigation: ProjectScreenNavigationProp;
  route: ProjectScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  const [dialog, setDialog] = React.useState(false);
  const [images, setImages] = React.useState<IImage[]>([]);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [project, setProject] = React.useState<IProject>();

  const [menu, setMenu] = React.useState(false);
  const touchableRef = React.createRef();

  const handleGetProject = async () => {
    // get from project table
    const project = await getOneProject(route.params.id);
    setProject(project);

    // get associated images
    const images = await getProjectImages(route.params.id, "ASC");
    setImages(images);
    setLoadingImages(false);
  };

  const handleDeleteProject = async () => {
    deleteProject(route.params.id);
    navigation.navigate("HomeScreen");
  };

  const handleDeleteConfirmation = () => {
    setDialog(true);
    setMenu(false);
  };

  const handleTakePhoto = () => {
    if (!project) return; // TODO: make Snack for error message

    console.log("photo time");
    navigation.navigate("Camera", { projectId: project.id });
  };

  React.useEffect(() => {
    // lookup project details
    handleGetProject();
  }, []);

  return project ? (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title={project.name} subtitle="" />
        <Menu
          visible={menu}
          onDismiss={() => setMenu(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              color="white"
              size={20}
              onPress={() => setMenu(true)}
            />
          }
        >
          <Menu.Item
            onPress={handleDeleteConfirmation}
            title="Delete Project"
          />
        </Menu>
      </Appbar.Header>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20
        }}
      >
        <Button mode="contained" onPress={handleTakePhoto}>
          Take Photo
        </Button>
      </View>
      <View
        style={{
          flex: 1
        }}
      >
        {loadingImages ? (
          <ProgressBar />
        ) : (
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <Image
                key={item.id}
                style={styles.image}
                source={{ uri: item.uri }}
                resizeMode="cover"
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
      {dialog && (
        <Portal>
          <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
            <Dialog.Title>Delete Project?</Dialog.Title>
            <Dialog.Content>
              <Text>
                Are you sure you want to delete this project? This cannot be
                undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-between" }}>
              <Button onPress={() => setDialog(false)}>Cancel</Button>
              <Button
                mode="contained"
                onPress={handleDeleteProject}
                color={Colors.red800}
              >
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}

      <Appbar style={styles.bottomAppBar}>
        <Appbar.Action icon="delete" onPress={() => console.log("delete")} />
      </Appbar>
    </SafeAreaView>
  ) : (
    <React.Fragment>
      <ActivityIndicator animating={true} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomAppBar: {},
  image: {
    width: 100,
    height: 100
  }
});
