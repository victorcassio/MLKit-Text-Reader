import React, { useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera-text-recognition';

function App() {
  const [data, setData] = useState(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  console.log(data);

  if (!hasPermission) {
    return <Text>Solicitando permissão de câmera...</Text>;
  }

  return (
    <>
      {!!device && hasPermission && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          options={{
            language: 'pt',
          }}
          mode={'recognize'}
          callback={d => setData(d)}
        />
      )}
    </>
  );
}

export default App;
