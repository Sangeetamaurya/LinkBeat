import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './TabBar.styles';

const tabs = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'search', label: 'Search', icon: 'search' },
  { key: 'library', label: 'Library', icon: 'layers' },
  { key: 'profile', label: 'Profile', icon: 'user' },
];

export default function TabBar({ active, onChange }) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const color = isActive ? colors.textPrimary : colors.textSecondary;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange && onChange(tab.key)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Feather name={tab.icon} size={20} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
