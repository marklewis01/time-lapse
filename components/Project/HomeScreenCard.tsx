import * as React from "react";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />;

import { deleteProject } from "../../db";

// TS
import { IProject } from "../../types";

export const ProjectCard = ({ project }: { project: IProject }) => {
  const handleDelete = async (id: number) => {
    await deleteProject(id);
    console.log("deleted", id);
  };

  return (
    <Card>
      <Card.Title
        title={project.name}
        subtitle={`ID: ${project.id}, Created ${project.created_at}`}
        left={LeftContent}
      />
      <Card.Content>
        <Title>Card title</Title>
        <Paragraph>Card content</Paragraph>
      </Card.Content>
      <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
      <Card.Actions>
        <Button onPress={() => handleDelete(project.id)}>Delete</Button>
      </Card.Actions>
    </Card>
  );
};
