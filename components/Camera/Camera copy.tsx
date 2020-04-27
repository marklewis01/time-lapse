import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

import { Overlay } from "./Overlay";

export const CameraComponent = () => {
  const [cameraPermission, setCameraPermission] = React.useState<boolean>();
  const [cameraRollPermission, setCameraRollPermission] = React.useState<
    boolean
  >();
  const [type, setType] = React.useState(Camera.Constants.Type.back);
  const [imageSelected, setImageSelected] = React.useState<null | any>(null);

  const { height, width } = Dimensions.get("window");
  // const maskRowHeight = Math.round((AppStore.height - 300) / 20);
  // const maskColWidth = (width - 300) / 2;

  // camera ref
  const camera = React.createRef();

  const takePicture = async () => {
    if (camera.current instanceof Camera) {
      console.log("Taking photo");

      const options = {
        quality: 1,
        base64: true,
        // fixOrientation: true,
        exif: true
      };

      const { uri } = await camera.current.takePictureAsync();

      const asset = await MediaLibrary.createAssetAsync(uri);

      MediaLibrary.createAlbumAsync("aa_TimeShift", asset)
        .then(() => {
          console.log("Album created!");
        })
        .catch((error: any) => {
          console.log("err", error);
        });
    }
  };

  // Request permissions on load
  React.useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      const {
        status: mediaStatus
      } = await MediaLibrary.requestPermissionsAsync();
      // const {
      //   granted: cameraRollGranted
      // } = await MediaLibrary.getPermissionsAsync();

      // console.log({ cameraRollGranted });
      // if (!cameraRollGranted) {
      //   console.log({ status });
      // }
      setCameraPermission(cameraStatus === "granted");
      setCameraRollPermission(mediaStatus === "granted");
    })();
  }, []);

  console.log("cameraRollPermission", cameraRollPermission);
  if (cameraPermission === undefined) {
    return (
      <View>
        <Text>No Camera Permission</Text>
      </View>
    );
  }
  if (cameraRollPermission === undefined) {
    return (
      <View>
        <Text>No Camera Roll Permission</Text>
      </View>
    );
  }
  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (cameraRollPermission === false) {
    return <Text>No access to camera roll</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => (camera.current = ref)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 30
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "transparent"
            }}
            // onPress={() => this.pickImage()}
            onPress={() => console.log("select overlay")}
          >
            <Ionicons
              name="ios-photos"
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "transparent"
            }}
            onPress={() => takePicture()}
            // onPress={() => console.log("cheese!")}
          >
            <FontAwesome
              name="camera"
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
              backgroundColor: "transparent"
            }}
            // onPress={()=>this.handleCameraType()}
            onPress={() => console.log("switching to other camera")}
          >
            <MaterialCommunityIcons
              name="camera-switch"
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
        </View>

        {/* {imageSelected ? <Overlay image={imageSelected} /> : null} */}
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  cameraControls: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 30
  },
  cameraButton: {
    alignItems: "center"
  },
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  maskInner: {
    width: 300,
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1
  },
  maskFrame: {
    backgroundColor: "rgba(1,1,1,0.6)"
  },
  maskRow: {
    width: "100%"
  },
  maskCenter: { flexDirection: "row" }
});
