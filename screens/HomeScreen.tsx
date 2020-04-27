import React from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";

import CameraScreen from "./CameraScreen";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

type Props = {
  navigation: any; // TODO: find correct type which extends DrawerActions
};

// Comps
import { ProjectCard } from "../components/Project";
import { ScrollView, FlatList } from "react-native-gesture-handler";

export default function HomeScreen({ navigation }: Props) {
  const handleCamera = () => {
    console.log("new pic time");
    navigation.navigate("Camera");
  };

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

// NavigationScreenProps

const Home = ({ navigation }: any) => (
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
      data={[1, 2, 3, 4]}
      renderItem={({ item, index }) => <ProjectCard />}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
);
