import * as MediaLibrary from "expo-media-library";

import { LOCAL_MEDIA_ALBUM_NAME } from "../constants";

/**
 * Save image to MediaLibrary Album
 * @param uri
 */
export const saveImageToAlbum = async (uri: string) => {
  // first save to device media library (temporary)
  const photo = await MediaLibrary.createAssetAsync(uri);

  // create album and MOVE asset to album
  const i = await MediaLibrary.createAlbumAsync(
    LOCAL_MEDIA_ALBUM_NAME,
    photo,
    false
  );

  // get new details of moved asset
  const { assets } = await MediaLibrary.getAssetsAsync({
    first: 1,
    album: i.id,
    sortBy: ["creationTime"]
  });

  return assets;
};
