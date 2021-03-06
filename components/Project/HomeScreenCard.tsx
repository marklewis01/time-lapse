import * as React from "react";
import { Avatar, Card, IconButton, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

// TS
import { IProject } from "../../types";

export const ProjectCard = ({ project }: { project: IProject }) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const handlePress = () =>
    navigation.navigate("ProjectScreen", { ...project });

  return (
    <Card onPress={handlePress} style={{ borderRadius: 0 }}>
      <Card.Title
        title={project.name}
        subtitle={`Updated: ${moment(project.updated_at).fromNow()}`}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="folder"
            color={theme.colors.placeholder}
          />
        )}
        right={(props) => (
          <IconButton {...props} icon="chevron-right" onPress={handlePress} />
        )}
      />
    </Card>
  );
};
