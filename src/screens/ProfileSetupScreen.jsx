import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/InputField';
import GenreChip from '../components/GenreChip';
import { colors } from '../theme/colors';
import { styles } from './ProfileSetupScreen.styles';

const GENRES = ['Pop', 'Hip-Hop', 'Lo-fi', 'Bollywood', 'Rock', 'Classical', 'Electronic', 'Indie'];

export default function ProfileSetupScreen({ onContinue, onSkip }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [genres, setGenres] = useState([]);
  const [avatar, setAvatar] = useState(''); // picture the user chose (a local file uri)

  const canContinue = name.trim().length > 0;

  const toggleGenre = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // open the phone gallery, let the user crop a square picture
  const pickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Could not open your photos', 'Please try again.');
    }
  };

  const handleContinue = () => {
    if (!canContinue) return;
    onContinue({ name: name.trim(), username: username.trim(), genres, avatar });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Pressable style={styles.skip} onPress={onSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Set up your profile</Text>
          <Text style={styles.caption}>
            Tell us a bit about you so we can personalize your music.
          </Text>

          <Pressable style={styles.avatarWrap} onPress={pickAvatar}>
            <View style={styles.avatar}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={44} color={colors.textSecondary} />
              )}
            </View>
            <View style={styles.camera}>
              <Feather name="camera" size={14} color={colors.textPrimary} />
            </View>
          </Pressable>
          <Text style={styles.avatarHint}>{avatar ? 'Tap to change photo' : 'Tap to add a photo'}</Text>

          <InputField icon="user" placeholder="Full name" value={name} onChangeText={setName} />
          <InputField
            icon="at-sign"
            placeholder="Username (optional)"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.section}>Pick your favorite genres</Text>
          <View style={styles.chips}>
            {GENRES.map((g) => (
              <GenreChip
                key={g}
                label={g}
                selected={genres.includes(g)}
                onPress={() => toggleGenre(g)}
              />
            ))}
          </View>

          <Pressable
            onPress={handleContinue}
            style={[styles.button, !canContinue && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>

          <Pressable onPress={onSkip} style={styles.skipLink}>
            <Text style={styles.skipLinkText}>Skip for now</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
