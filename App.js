import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor, runOnJS } from 'react-native-vision-camera';
import { scanText } from 'react-native-vision-camera-text-recognition';

export default function App() {
  const device = useCameraDevice('back');
  const [permission, setPermission] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [resultText, setResultText] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [frozenText, setFrozenText] = useState('');

  async function copyTextSafe(text) {
    try {
      const Clipboard = (await import('@react-native-clipboard/clipboard')).default;
      Clipboard.setString(text);
      console.log('Copied:', text);
    } catch (e) {
      console.warn('Clipboard not linked yet:', e?.message);
    }
  }

  useEffect(() => {
    (async () => {
      const current = await Camera.getCameraPermissionStatus();
      if (current !== 'granted') {
        const req = await Camera.requestCameraPermission();
        setPermission(req === 'granted');
        setBlocked(req === 'denied' || req === 'restricted');
      } else {
        setPermission(true);
      }
    })();
  }, []);

  const args = useMemo(() => ({ language: 'latin' }), []);
  const lastTs = useRef(0);

  const onOCR = useCallback((res) => {
    setResultText(res?.resultText ?? '');
    setBlocks(Array.isArray(res?.blocks) ? res.blocks : []);
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    try {
      const res = scanText(frame, args); // { resultText, blocks }
      const now = Date.now();
      if (res?.resultText && now - lastTs.current > 400) {
        lastTs.current = now;
        runOnJS(onOCR)(res);
      }
    } catch (e) {
      // ignore inside worklet
    }
  }, [args, onOCR]);

  const handleCapture = () => {
    setFrozenText(resultText);
    setIsActive(false);
  };

  const handleCopy = () => copyTextSafe(frozenText || resultText);

  const handleSend = async () => {
    try {
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: frozenText || resultText, blocks }),
      });
    } catch { }
  };

  if (!device) {
    return (
      <Center>
        <Text style={s.msg}>Loading camera…</Text>
      </Center>
    );
  }

  if (!permission) {
    return (
      <Center>
        <Text style={s.msg}>Grant camera permission to continue</Text>
        {blocked && (
          <TouchableOpacity style={s.btn} onPress={() => Linking.openSettings()}>
            <Text style={s.btnTxt}>Open Settings</Text>
          </TouchableOpacity>
        )}
      </Center>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        photo={false}
        video={false}
        audio={false}
      />

      <View style={s.overlay}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={s.caption} numberOfLines={4}>
            {(frozenText || resultText) || 'Point the camera at text…'}
          </Text>
          {!!blocks.length && (
            <Text style={{ color: '#bbb', fontSize: 12 }}>
              blocks: {blocks.length}
            </Text>
          )}
        </View>

        <TouchableOpacity style={s.btn} onPress={handleCapture}>
          <Text style={s.btnTxt}>Capture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, { marginLeft: 8 }]} onPress={() => copyTextSafe(frozenText || resultText)}>
          <Text style={s.btnTxt}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, { marginLeft: 8 }]} onPress={handleSend}>
          <Text style={s.btnTxt}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, { marginLeft: 8 }]} onPress={() => setIsActive(v => !v)}>
          <Text style={s.btnTxt}>{isActive ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Center = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </View>
);

const s = StyleSheet.create({
  msg: { color: '#fff', fontSize: 16, padding: 12, textAlign: 'center' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caption: { color: '#fff', flex: 1, marginRight: 10 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#1e88e5', borderRadius: 6 },
  btnTxt: { color: '#fff', fontWeight: '600' },
});
