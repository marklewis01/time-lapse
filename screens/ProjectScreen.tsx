import * as React from "react";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Checkbox,
  Caption,
  Colors,
  Dialog,
  Divider,
  IconButton,
  Menu,
  Paragraph,
  Portal,
  ProgressBar,
  Text,
  TextInput,
  useTheme
} from "react-native-paper";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

// db
import {
  deleteProject,
  getOneProject,
  getProjectImages,
  insertOneImage,
  updateProjectName
} from "../db";

// utils
import { saveImageToAlbum } from "../utils";

// Images
import ArrowSvg from "../assets/right-curve-arrow.png";

// TS
import {
  IImage,
  IProject,
  ProjectScreenDialog,
  ScreenStackParamList
} from "../types";
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
  (windowWidth - 2 * IMAGE_PADDING * IMAGES_PER_ROW - 2 * IMAGE_PADDING) /
  IMAGES_PER_ROW;

export default ({ navigation, route }: Props) => {
  const [dialog, setDialog] = React.useState<ProjectScreenDialog>();
  const [deleteLocalImages, setDeleteLocalImages] = React.useState(false);
  const [images, setImages] = React.useState<IImage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [menu, setMenu] = React.useState(false);
  const [newName, setNewName] = React.useState<string>();
  const [project, setProject] = React.useState<IProject>();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [selectMode, setSelectMode] = React.useState(false);

  const theme = useTheme();

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
    setLoading(true);

    if (deleteLocalImages) {
      const deleted: boolean = await MediaLibrary.deleteAssetsAsync(
        images.map((i) => i.asset_id)
      );
      // TODO: handle if delete = false (ie error)
    }

    await deleteProject(route.params.id);

    navigation.navigate("HomeScreen");
  };

  const handleDeleteProjectDialog = () => {
    setDialog("delete");
    setDeleteLocalImages(false);
    setMenu(false);
  };

  const handleEditProjectNameDialog = () => {
    setDialog("name");
    setMenu(false);
    setNewName(project?.name);
  };
  const handleEditProjectName = async () => {
    if (!newName || newName === "") return;

    await updateProjectName(route.params.id, newName);
    handleGetProject();
    setDialog(undefined);
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

  const handleGetImage = async (s: "album" | "camera") => {
    setDialog(undefined);
    if (!project) return;

    if (s === "album") {
      let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      // on click, if selected, set state
      const result = await ImagePicker.launchImageLibraryAsync();
      if (result.cancelled) return;

      // save image to project
      const asset = await saveImageToAlbum(result.uri);

      // write to db
      await insertOneImage(project.id, asset[0]);

      // update screen
      handleGetProject();
    } else {
      // camera
      navigation.navigate("Camera", { projectId: project.id });
    }
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
          color={theme.colors.onSurface}
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          color={theme.colors.onSurface}
          title={project.name}
          subtitle=""
        />
        <Menu
          visible={menu}
          onDismiss={() => setMenu(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              color={theme.colors.onSurface}
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

      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingVertical: 2 * IMAGE_PADDING,
          paddingHorizontal: IMAGE_PADDING
        }}
      >
        {loadingImages ? (
          <ProgressBar />
        ) : images.length ? (
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
                      width: imageWidth,
                      borderWidth: 4
                    },
                    {
                      borderColor: selected.includes(item.id)
                        ? theme.colors.primary
                        : selectMode
                        ? theme.colors.backdrop
                        : undefined
                    },
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
        ) : (
          <View
            style={{
              flex: 1,
              paddingVertical: 15,
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end"
            }}
          >
            <View
              style={{
                marginBottom: 20,
                maxWidth: 250,
                alignItems: "center"
              }}
            >
              <Paragraph style={{ textAlign: "center" }}>
                You don't have any images yet. Click this button to add images
                from your device library or by taking a photo.
              </Paragraph>
            </View>
            <Image
              source={ArrowSvg}
              style={{
                marginRight: 10,
                marginLeft: 5,
                transform: [{ scaleY: -1 }]
              }}
            />
          </View>
        )}
      </View>

      <Appbar style={styles.bottomAppBar}>
        {selectMode ? (
          <Button
            disabled={selected.length < 2}
            mode={selected.length < 2 ? "text" : "contained"}
            onPress={handleGoToCompareScreen}
            color={theme.colors.onBackground}
          >
            {"Compare" + (selected.length > 0 ? ` (${selected.length})` : "")}
          </Button>
        ) : (
          <Button
            mode="text"
            color={theme.colors.onBackground}
            onPress={() => setSelectMode(true)}
            disabled={images.length < 2}
          >
            Compare Images
          </Button>
        )}
        {selectMode ? (
          <Button
            color={theme.colors.onBackground}
            onPress={handleCancelSelectMode}
          >
            Cancel
          </Button>
        ) : (
          <IconButton
            color={theme.colors.onSurface}
            icon="camera"
            onPress={() => setDialog("selectImage")}
          />
        )}
      </Appbar>

      {dialog === "selectImage" && (
        <Portal>
          <Dialog visible={true} onDismiss={() => setDialog(undefined)}>
            <View
              style={{
                flexDirection: "row",
                paddingBottom: 15
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 25,
                  paddingTop: 20
                }}
              >
                <IconButton
                  icon="image"
                  size={50}
                  color={theme.colors.onSurface}
                  onPress={() => handleGetImage("album")}
                />
                <Caption style={{ textAlign: "center" }}>
                  Choose an existing image
                </Caption>
              </View>
              <View
                style={{
                  borderRightWidth: 1,
                  borderColor: theme.colors.disabled,
                  marginTop: 30
                }}
              />
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 25,
                  paddingTop: 20
                }}
              >
                <IconButton
                  icon="camera"
                  size={50}
                  color={theme.colors.onSurface}
                  name="camera"
                  onPress={() => handleGetImage("camera")}
                />
                <Caption style={{ textAlign: "center" }}>
                  Take a new photo with the Camera
                </Caption>
              </View>
            </View>
            <Dialog.Actions>
              <Button onPress={() => setDialog(undefined)}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}

      {dialog === "name" && (
        <Portal>
          <Dialog visible={true} onDismiss={() => setDialog(undefined)}>
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
              <Button onPress={() => setDialog(undefined)}>Cancel</Button>
              <Button mode="contained" onPress={handleEditProjectName}>
                Update
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}

      {dialog === "delete" && (
        <Portal>
          <Dialog
            visible={true}
            onDismiss={() => setDialog(undefined)}
            dismissable={!loading}
          >
            <Dialog.Title>Delete Project?</Dialog.Title>
            <Dialog.Content>
              <Text>
                Are you sure you want to delete this project? This cannot be
                undone.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10
                }}
              >
                <Checkbox
                  status={deleteLocalImages ? "checked" : "unchecked"}
                  onPress={() =>
                    setDeleteLocalImages((prevState) => !prevState)
                  }
                  disabled={loading}
                />
                <Text>Delete images from device?</Text>
              </View>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-between" }}>
              <Button onPress={() => setDialog(undefined)} disabled={loading}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleDeleteProject}
                color={Colors.red800}
                loading={loading}
                disabled={loading}
              >
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
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
    justifyContent: "space-between"
  },
  button: {
    backgroundColor: "black"
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    height: 100
  },
  cannotSelect: {
    borderWidth: 0,
    opacity: 0.5
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
