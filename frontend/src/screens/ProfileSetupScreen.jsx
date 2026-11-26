import { useEffect, useState } from 'react';
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
import { AVATAR_PICKER_OPTIONS, avatarFromAsset } from '../lib/avatar';
import { authApi } from '../lib/backend';
import { styles } from './ProfileSetupScreen.styles';

const GENRES = ['Pop', 'Hip-Hop', 'Lo-fi', 'Bollywood', 'Rock', 'Classical', 'Electronic', 'Indie'];

// initial = values to start with (after sign up, or when editing the profile).
// editing = true changes the texts to "Edit profile / Save changes / Cancel".
// checkUsername(text) returns an error text, or '' when the username follows the rules.
// onContinue(data) is async and gives back an error text from the backend ('' = saved).
export default function ProfileSetupScreen({
  onContinue,
  onSkip,
  initial = {},
  editing = false,
  checkUsername,
}) {
  const [name, setName] = useState(initial.name || '');
  const [username, setUsername] = useState(initial.username || '');
  const [genres, setGenres] = useState(initial.genres || []);
  const [avatar, setAvatar] = useState(initial.avatar || ''); // picture the user chose
  const [taken, setTaken] = useState(''); // "already taken" answer from the backend
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const rulesProblem = checkUsername && username.trim() !== '' ? checkUsername(username) : '';

  // ask the backend if the username is free (0.4 seconds after the user stops typing)
  useEffect(() => {
    setTaken('');
    const u = username.trim();
    if (!u || rulesProblem) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      authApi
        .usernameAvailable(u)
        .then((r) => {
          if (!cancelled && !r.available) setTaken(r.reason || 'That username is already taken');
        })
        .catch(() => {});
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username, rulesProblem]);

  const usernameProblem = rulesProblem || taken;
  const usernameMissing = checkUsername && username.trim() === '';
  const canContinue = name.trim().length > 0 && !usernameMissing && usernameProblem === '';

  const toggleGenre = (genre) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // open the phone gallery, let the user crop a square picture
  const pickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync(AVATAR_PICKER_OPTIONS);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(avatarFromAsset(result.assets[0]));
      }
    } catch (e) {
      Alert.alert('Could not open your photos', 'Please try again.');
    }
  };

  const handleContinue = async () => {
    if (!canContinue || saving) return;
    setSaving(true);
    setSaveError('');
    const err = await onContinue({ name: name.trim(), username: username.trim(), genres, avatar });
    setSaving(false);
    if (err) setSaveError(err);
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
              <Text style={styles.skipText}>{editing ? 'Cancel' : 'Skip'}</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>{editing ? 'Edit profile' : 'Set up your profile'}</Text>
          <Text style={styles.caption}>
            {editing
              ? 'Change your photo, name or favorite genres.'
              : 'Tell us a bit about you so we can personalize your music.'}
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
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          {usernameProblem !== '' && <Text style={styles.error}>{usernameProblem}</Text>}
          {saveError !== '' && <Text style={styles.error}>{saveError}</Text>}

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
            style={[styles.button, (!canContinue || saving) && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {saving ? 'Saving...' : editing ? 'Save changes' : 'Continue'}
            </Text>
          </Pressable>

          <Pressable onPress={onSkip} style={styles.skipLink}>
            <Text style={styles.skipLinkText}>{editing ? 'Cancel' : 'Skip for now'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
