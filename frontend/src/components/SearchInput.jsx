import { Pressable, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './SearchInput.styles';

export default function SearchInput({ value, onChangeText, onSubmit }) {
  return (
    <View style={styles.box}>
      <Feather name="search" size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        placeholder="Songs, artists, albums"
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Feather name="x" size={18} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}
