import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { DeviceMotion } from "expo-sensors";

// Comps
import { BottomToolbar, TopToolbar } from "./Toolbar";
import { Overlay } from "./Overlay";

// styles
import { styles } from "./styles";

// Types
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { orientation } from "../../types";

/*
 * ============================
 *  Exported Camera Component
 * ============================
 */
export default () => {
  const camera = React.createRef<Camera | null>();

  const [cameraPermission, setCameraPermission] = React.useState<boolean>();
  const [cameraType, setCameraType] = React.useState<
    typeof Camera.Constants.Type
  >(Camera.Constants.Type.back);
  const [capturing, setCapturing] = React.useState(false);
  const [flashMode, setFlashMode] = React.useState<
    typeof Camera.Constants.FlashMode
  >(Camera.Constants.FlashMode.auto);
  const [orientation, setOrientation] = React.useState<orientation>(
    "portrait-up"
  );
  const [overlay, setOverlay] = React.useState<ImageInfo | null>(null);

  const handleCameraType = () => {
    setCameraType((prevState: typeof Camera.Constants.Type) =>
      prevState === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleClearOverlay = () => setOverlay(null);

  const handleFlashMode = () => {
    // cycles through flash modes: auto > flash > none
    setFlashMode((prevState: typeof Camera.Constants.FlashMode) =>
      prevState === Camera.Constants.FlashMode.auto
        ? Camera.Constants.FlashMode.on
        : prevState === Camera.Constants.FlashMode.on
        ? Camera.Constants.FlashMode.off
        : Camera.Constants.FlashMode.auto
    );
  };

  const handleSelectOverlay = async () => {
    // pause camera
    camera.current?.pausePreview();

    // display media library
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // on click, if selected, set state
    const result = await ImagePicker.launchImageLibraryAsync();

    console.log({ result });
    if (!result.cancelled) {
      // get size of overlay image, update camera aspect if required

      setOverlay(result);
    }

    // resume camera
    camera.current?.resumePreview();
  };

  const handleTakePhoto = async () => {
    if (camera.current instanceof Camera) {
      try {
        setCapturing(true);
        const { uri } = await camera.current.takePictureAsync();
        setCapturing(false);

        // // save to filesystem
        // await FileSystem.copyAsync({
        //   from: image.uri,
        //   to: projectDirectory! + "first_project/test.jpg"
        // });

        // save to device media library
        const asset = await MediaLibrary.createAssetAsync(uri);

        await MediaLibrary.createAlbumAsync("aa_TimeShift", asset, false);
      } catch (error) {
        console.log("err", error);
      }
    }
  };

  const hasDeviceMotion = async () => DeviceMotion.isAvailableAsync();

  React.useEffect(() => {
    // Check / Obtain permissions on mount
    (async () => {
      console.log("mounting");

      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      // const {
      //   status: mediaStatus
      // } = await MediaLibrary.requestPermissionsAsync();

      setCameraPermission(cameraStatus === "granted");
    })();
  }, []);

  React.useEffect(() => {
    // subscribe to device motion - used to rotate icons

    if (hasDeviceMotion()) {
      DeviceMotion.addListener(({ rotation }) => {
        setOrientation(
          rotation.beta > 0.75
            ? "portrait-up"
            : rotation.beta < -0.75
            ? "portrait-down"
            : rotation.gamma > 0
            ? "landscape-right"
            : "landscape-left"
        );
      });

      DeviceMotion.setUpdateInterval(1000);
    }

    return () => DeviceMotion.removeAllListeners();
  }, []);

  if (cameraPermission === undefined) {
    return <View />;
  } else if (cameraPermission === false) {
    return <Text>Access to camera has been denied.</Text>;
  }

  return (
    <React.Fragment>
      <Camera
        type={cameraType}
        flashMode={flashMode}
        style={styles.preview}
        ref={(ref) => (camera.current = ref)}
        ratio={"16:9"}
      ></Camera>
      {overlay && <Overlay overlay={overlay} />}
      <TopToolbar
        flashMode={flashMode}
        setFlashMode={handleFlashMode}
        cameraType={cameraType}
        setCameraType={handleCameraType}
        orientation={orientation}
      />

      <BottomToolbar
        capturing={capturing}
        handleOverlay={handleSelectOverlay}
        handleClearOverlay={handleClearOverlay}
        onShortCapture={handleTakePhoto}
        overlay={overlay}
        orientation={orientation}
      />
    </React.Fragment>
  );
};
