import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { coverFallbacks } from '../lib/cover';

// Shows cover art. While it loads (or if every size fails) a gradient + music icon is shown.
// The box is measured first and the picture is drawn at that exact pixel size: Android draws
// "fill the parent" images wrongly (only a thin band shows), exact sizes are reliable.
export default function CoverImage({
  uri,
  style,
  iconSize = 22,
  tint = ['#34343A', '#17171A'],
}) {
  const urls = useMemo(() => coverFallbacks(uri), [uri]);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState(null); // { w, h } of this box

  useEffect(() => {
    setAttempt(0);
    setLoaded(false);
  }, [uri]);

  const flat = StyleSheet.flatten(style) || {};
  const radius = flat.borderRadius || 0;
  const failed = attempt >= urls.length;

  const onLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (!fixed && width > 0 && height > 0) {
      setSize((old) => (old && old.w === width && old.h === height ? old : { w: width, h: height }));
    }
  };

  // if the style already gives a number width and height, use them straight away (no waiting);
  // otherwise use the measured size
  const fixed = typeof flat.width === 'number' && typeof flat.height === 'number';
  const exact = fixed
    ? { width: flat.width, height: flat.height }
    : size
      ? { width: size.w, height: size.h }
      : null;

  return (
    <View style={[styles.box, style]} onLayout={onLayout}>
      {exact && (
        <>
          <LinearGradient colors={tint} style={[styles.layer, exact]} />
          {!loaded && (
            <View style={[styles.layer, styles.center, exact]}>
              <Ionicons name="musical-notes" size={iconSize} color="rgba(255,255,255,0.35)" />
            </View>
          )}
          {!failed && (
            <Image
              key={urls[attempt]}
              source={{ uri: urls[attempt] }}
              style={[styles.layer, exact, { borderRadius: radius }]}
              resizeMode="cover"
              fadeDuration={0}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                console.warn('Cover failed:', urls[attempt], e && e.nativeEvent && e.nativeEvent.error);
                setAttempt((a) => a + 1);
              }}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', backgroundColor: '#1A1A1A' },
  layer: { position: 'absolute', top: 0, left: 0 },
  center: { alignItems: 'center', justifyContent: 'center' },
});
