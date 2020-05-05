import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import moment from "moment";
import { useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenStackParamList } from "../types";

// db
import { selectOneProject } from "../db";

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
  const [project, setProject] = React.useState([]);

  const handleGetProject = async () => {
    const project = await selectOneProject(route.params.id);
    setProject(project);
  };

  React.useEffect(() => {
    // lookup project details
    handleGetProject();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title={project.name} subtitle="" />
      </Appbar.Header>
      <Text>Project ID: {route.params.id}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
