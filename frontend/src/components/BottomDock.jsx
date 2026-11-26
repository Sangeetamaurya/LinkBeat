import { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MiniPlayer from './MiniPlayer';
import TabBar from './TabBar';
import { styles } from './BottomDock.styles';

export default function BottomDock({ active, onTabChange, onOpenPlayer }) {
  const insets = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // hide the dock while the keyboard is open so it does not float above the keys
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (keyboardOpen) return null;

  return (
    <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <MiniPlayer onPress={onOpenPlayer} />
      <TabBar active={active} onChange={onTabChange} />
    </View>
  );
}
