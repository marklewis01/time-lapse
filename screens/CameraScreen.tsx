import React from "react";
import { Text, View } from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { DeviceMotion } from "expo-sensors";

// Comps
// import { Overlay } from "../components/Camera/Overlay";
import {
  ActionsToolbar,
  FlashAnimation,
  OptionsToolbar,
  Overlay
} from "../components/Camera";

// styles
import { styles } from "../components/Camera/styles";

// Types
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { orientation } from "../types";

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
  const [opacity, setOpacity] = React.useState(0.4);

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

  const handleOverlayOpacity = (value: number) => setOpacity(value / 100);

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
        setTimeout(() => {
          setCapturing(false);
        }, 200);
        const { uri } = await camera.current.takePictureAsync();

        // save to device media library
        const asset = await MediaLibrary.createAssetAsync(uri);

        await MediaLibrary.createAlbumAsync("aa_TimeShift", asset, false);
      } catch (error) {
        console.log("err", error);
      }
    }
  };

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
    (async () => {
      if (await await DeviceMotion.isAvailableAsync()) {
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

        return () => DeviceMotion.removeAllListeners();
      } else {
        // no device motion. Do nothing.
        console.log("no dm");
      }
    })();
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
      {overlay && <Overlay overlay={overlay} opacity={opacity} />}
      <OptionsToolbar
        flashMode={flashMode}
        setFlashMode={handleFlashMode}
        cameraType={cameraType}
        setCameraType={handleCameraType}
        orientation={orientation}
      />
      <ActionsToolbar
        capturing={capturing}
        handleOverlay={handleSelectOverlay}
        handleOverlayOpacity={handleOverlayOpacity}
        handleClearOverlay={handleClearOverlay}
        onShortCapture={handleTakePhoto}
        opacity={opacity}
        overlay={overlay}
        orientation={orientation}
      />
      {capturing && <FlashAnimation />}
    </React.Fragment>
  );
};
