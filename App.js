import React, { useState } from 'react';
import { StyleSheet } from "react-native";
import { useCameraDevice } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera-text-recognition';

function App (){
  const [data,setData] = useState(null)
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission()
  console.log(data)
  return(
    <>
      {!!device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          options={{
            language: 'pt'
          }}
          mode={'recognize'}
          callback={(d) => setData(d)}
        />
      )}
    </>
  )
}

export default App;


