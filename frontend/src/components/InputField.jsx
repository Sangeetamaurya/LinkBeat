import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { styles } from './InputField.styles';

// secureTextEntry turns it into a password box with a show / hide eye.
export default function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  maxLength,
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={[styles.box, focused && styles.boxFocused]}>
      <Feather name={icon} size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={secureTextEntry && hidden}
        maxLength={maxLength}
      />
      {secureTextEntry && (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
          <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}
