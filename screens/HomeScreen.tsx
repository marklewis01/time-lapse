import React from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";

type Props = {
  navigation: any; // TODO: find correct type which extends DrawerActions
};

// Comps
import { ProjectCard } from "../components/Project";

export default function HomeScreen({ navigation }: Props) {
  const handleCamera = () => console.log("new pic time");

  return (
    <View>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        {/* <Appbar.BackAction onPress={goBack} /> */}
        <Appbar.Content title="" subtitle="" />
        <Appbar.Action icon="plus" onPress={handleCamera} />
      </Appbar.Header>
      <ProjectCard />
    </View>
  );
}

// NavigationScreenProps
