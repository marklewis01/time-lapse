import * as React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Appbar, Button, ProgressBar } from "react-native-paper";
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
  const [project, setProject] = React.useState<IProject>();
  const [images, setImages] = React.useState<IImage[]>([]);

  const handleGetProject = async () => {
    // get from project table
    const project = await getOneProject(route.params.id);
    setProject(project);

    // get associated images
    const images = await getProjectImages(route.params.id, "ASC");
    setImages(images);
  };

  const handleDeleteProject = async () => {
    deleteProject(route.params.id);
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

  console.log({ images });

  return project ? (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title={project.name} subtitle="" />
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
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 5,
          borderColor: "red"
        }}
      >
        {images.map((image) => (
          <Image
            key={image.id}
            style={styles.image}
            source={{ uri: image.uri }}
            resizeMode="cover"
          />
        ))}
      </View>
    </SafeAreaView>
  ) : (
    <React.Fragment>
      <ProgressBar indeterminate />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>loading project...</Text>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: 100,
    height: 100
  }
});
