import React from "react";

type Props = {
  navigation: any; // TODO: find correct type which extends DrawerActions
};

// Comps
import Camera from "../components/Camera/Camera";

export default ({ navigation }: Props) => <Camera />;
