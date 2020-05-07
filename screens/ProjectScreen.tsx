import * as React from "react";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Colors,
  Dialog,
  Divider,
  IconButton,
  Menu,
  Portal,
  ProgressBar,
  Surface,
  TextInput
} from "react-native-paper";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as MediaLibrary from "expo-media-library";
import * as Haptics from "expo-haptics";

// db
import {
  deleteProject,
  getOneProject,
  getProjectImages,
  updateProjectName
} from "../db";

// TS
import { IImage, IProject, ScreenStackParamList } from "../types";
type ProjectScreenNavigationProp = StackNavigationProp<
  ScreenStackParamList,
  "ProjectScreen"
>;
type ProjectScreenRouteProp = RouteProp<ScreenStackParamList, "ProjectScreen">;

type Props = {
  navigation: ProjectScreenNavigationProp;
  route: ProjectScreenRouteProp;
};

const IMAGES_PER_ROW = 3;
const IMAGE_PADDING = 5;

const windowWidth = Dimensions.get("window").width;
const imageWidth =
  (windowWidth - 2 * IMAGE_PADDING * IMAGES_PER_ROW) / IMAGES_PER_ROW;

export default ({ navigation, route }: Props) => {
  const [dialog, setDialog] = React.useState<"delete" | "projectName" | null>(
    null
  );
  const [images, setImages] = React.useState<IImage[]>([]);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [menu, setMenu] = React.useState(false);
  const [newName, setNewName] = React.useState<string>();
  const [project, setProject] = React.useState<IProject>();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [selectMode, setSelectMode] = React.useState(false);

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

  const handleDeleteProjectDialog = () => {
    setDialog("delete");
    setMenu(false);
  };

  const handleEditProjectNameDialog = () => {
    setDialog("projectName");
    setMenu(false);
    setNewName(project?.name);
  };
  const handleEditProjectName = async () => {
    if (!newName || newName === "") return;

    await updateProjectName(route.params.id, newName);
    setDialog(null);
  };

  const handleGoToCompareScreen = () => {
    // get uri's. Will return array of URI's, chronologically ordered (due to filter on ID)
    const selectedImages = images
      .filter((image) => selected.includes(image.id))
      .map((obj) => obj.uri);

    navigation.navigate("CompareScreen", { images: selectedImages });
  };

  const handleSetSelectMode = async (id: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prevState) => prevState.concat(id));
    setSelectMode(true);
  };
  const handleSecondImage = (id: number) => {
    // do nothing if not in selectMode
    if (!selectMode) return;

    // unselect if already selected
    if (selected.includes(id)) {
      return setSelected((prevState) => prevState.filter((x) => x !== id));
    }

    // only allow max array length of 2
    if (selected.length >= 2) return;

    setSelected((prevState) => prevState.concat(id));
  };
  const handleCancelSelectMode = () => {
    setSelectMode(false);
    setSelected([]);
  };

  const handleTakePhoto = () => {
    if (!project) return; // TODO: make Snack for error message

    navigation.navigate("Camera", { projectId: project.id });
  };

  React.useEffect(() => {
    // initial load
    handleGetProject();

    // add listeners on screen focus
    navigation.addListener("focus", () => {
      // add listener for file changes
      MediaLibrary.addListener(() => {
        handleGetProject();
      });
    });

    // unsubscribe
    return () => MediaLibrary.removeAllListeners();
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (selectMode) {
          handleCancelSelectMode();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [selectMode])
  );

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
            onPress={handleEditProjectNameDialog}
            title="Rename Project"
          />
          <Divider />
          <Menu.Item
            onPress={handleDeleteProjectDialog}
            title="Delete Project"
          />
        </Menu>
      </Appbar.Header>
      <Surface style={styles.toolbar}>
        {selectMode ? (
          <View style={styles.toolbarActions}>
            <Text style={{ marginLeft: 15 }}>
              {selected.length + " selected"}
            </Text>
            {selectMode && (
              <Button onPress={handleCancelSelectMode}>Cancel</Button>
            )}
          </View>
        ) : (
          <Button onPress={() => setSelectMode(true)}>Select Images</Button>
        )}
        <Button
          disabled={selected.length < 2}
          mode={selected.length < 2 ? "text" : "contained"}
          onPress={handleGoToCompareScreen}
        >
          Compare
        </Button>
      </Surface>

      <View
        style={{
          justifyContent: "center",
          flex: 1
        }}
      >
        {loadingImages ? (
          <ProgressBar />
        ) : (
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    margin: IMAGE_PADDING,
                    maxWidth: imageWidth
                  }
                ]}
                onPress={() => handleSecondImage(item.id)}
                onLongPress={() => handleSetSelectMode(item.id)}
                disabled={selected.length >= 2 && !selected.includes(item.id)}
              >
                <Image
                  style={[
                    {
                      height: imageWidth,
                      width: imageWidth
                    },
                    selectMode && styles.toSelect,
                    selected.includes(item.id) && styles.isSelected,
                    selected.length >= 2 &&
                      !selected.includes(item.id) &&
                      styles.cannotSelect
                  ]}
                  source={{ uri: item.uri }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            numColumns={IMAGES_PER_ROW}
            keyExtractor={(item) => (item.id * IMAGES_PER_ROW).toString()}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ marginBottom: 30 }}
          />
        )}
      </View>

      {dialog === "projectName" && (
        <Portal>
          <Dialog visible={true} onDismiss={() => setDialog(null)}>
            <Dialog.Title>Rename Project?</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Project Name"
                value={newName}
                onChangeText={(v) => setNewName(v)}
                mode="outlined"
              />
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-between" }}>
              <Button onPress={() => setDialog(null)}>Cancel</Button>
              <Button mode="contained" onPress={handleEditProjectName}>
                Update
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
      {dialog === "delete" && (
        <Portal>
          <Dialog visible={true} onDismiss={() => setDialog(null)}>
            <Dialog.Title>Delete Project?</Dialog.Title>
            <Dialog.Content>
              <Text>
                Are you sure you want to delete this project? This cannot be
                undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-between" }}>
              <Button onPress={() => setDialog(null)}>Cancel</Button>
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
        <Appbar.Action icon="camera" onPress={handleTakePhoto} />
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
  bottomAppBar: {
    justifyContent: "center"
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    height: 100
  },
  cannotSelect: {
    opacity: 0.5
  },
  isSelected: {
    borderWidth: 4,
    borderColor: "red"
  },
  toSelect: {
    borderWidth: 4,
    borderColor: "lightgrey"
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
  },
  toolbarActions: {
    flexDirection: "row",
    alignItems: "center"
  }
});
