# Time-Lapse

### Just a neat and resolved app to explore Expo and the React Native APIs with.

### [Expo Project Link](https://expo.io/@marklewis01/time-lapse)

## App overview video

<a href="http://www.youtube.com/watch?v=egwMR__ZgnE" target="_blank">
  <img src="https://marklewis01.github.io/timelapse/youtube-thumb.png" alt="A quick video overview" height="400">
</a>

## Tech Summary

- React Native
- Expo (summary of APIs used):
  - Camera
  - Constants
  - FileSystem
  - Haptics
  - ImagePicker
  - MediaLibrary
  - ScreenOrientation
  - Sensors
  - SQLite
- TypeScript
- React Native Paper

## Features

- Create multiple projects
- Overlay existing images when using camera - helps match existing photo characteristics
- Click and compare images
- Clean and simple UI
- Saves/stores images to local media library rather then filesystem, making it more intuitive for user
- Local SQLite instance to save projects and asset details
- Dark mode
- Right-to-Left support

## Screenshots

|                            Create multiple projects                            |                          Select existing or use camera                          |                             Select images to compare                             |
| :----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
| <img src="https://marklewis01.github.io/timelapse/timelapse-interface-1.png"/> | <img src="https://marklewis01.github.io/timelapse/timelapse-interface-2.png" /> | <img src="https://marklewis01.github.io/timelapse/timelapse-interface-3.png"  /> |
|                             Easy comparison slider                             |                                    Dark mode                                    |                              Right-to-Left support                               |
|  <img src="https://marklewis01.github.io/timelapse/timelapse-compare.png" />   |   <img src="https://marklewis01.github.io/timelapse/timelapse-darkmode.png"/>   |     <img src="https://marklewis01.github.io/timelapse/timelapse-rtl.png" />      |

## Final Thoughts

The app could seem trivial in nature, however the purpose was to get acquainted with React Native and the Expo framework - the purpose of the app was secondary.

Saying the above, possible further development could be through allowing users to 'share' comparison images, or even generate timelapse videos through stitching multiple images. I did investigate stitching together videos using a React-Native FFMpeg library, however this would require ejecting from Expo, as such, it wasn't an ideal step in the project. I would consider building a server-side service which would perform the video rendering component, however again, for now that is not in the intended project scope.
