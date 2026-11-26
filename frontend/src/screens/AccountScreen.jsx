import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import InputField from '../components/InputField';
import { passwordError } from '../lib/auth';
import { styles } from './AccountScreen.styles';

// Account details, change password, log out and delete account.
// onChangePassword(old, new) returns an error text, or '' when it worked.
export default function AccountScreen({ user, onBack, onChangePassword, onLogout, onDelete }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState({ text: '', ok: false });

  const save = () => {
    if (oldPass === '' || newPass === '') {
      return setMessage({ text: 'Fill in all the password boxes', ok: false });
    }
    const pErr = passwordError(newPass);
    if (pErr) return setMessage({ text: pErr, ok: false });
    if (newPass !== confirm) return setMessage({ text: 'New passwords do not match', ok: false });
    const err = onChangePassword(oldPass, newPass);
    if (err) return setMessage({ text: err, ok: false });
    setOldPass('');
    setNewPass('');
    setConfirm('');
    setMessage({ text: 'Password updated', ok: true });
  };

  const confirmDelete = () => {
    Alert.alert('Delete account?', 'Your account is removed. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title="Account" onBack={onBack} />

          <View style={styles.card}>
            <Text style={styles.label}>NAME</Text>
            <Text style={styles.value}>{user.name}</Text>
            <View style={styles.line} />
            <Text style={styles.label}>USERNAME</Text>
            <Text style={styles.value}>@{user.username}</Text>
          </View>

          <Text style={styles.section}>Change password</Text>
          <InputField icon="lock" placeholder="Current password" value={oldPass} onChangeText={setOldPass} secureTextEntry />
          <InputField icon="lock" placeholder="New password" value={newPass} onChangeText={setNewPass} secureTextEntry />
          <InputField icon="lock" placeholder="Confirm new password" value={confirm} onChangeText={setConfirm} secureTextEntry />
          {message.text !== '' && (
            <Text style={[styles.message, message.ok && styles.messageOk]}>{message.text}</Text>
          )}
          <Pressable onPress={save} style={styles.button}>
            <Text style={styles.buttonText}>Update password</Text>
          </Pressable>

          <Pressable onPress={onLogout} style={[styles.row, styles.rowTop]}>
            <Feather name="log-out" size={18} color="#FF5A5F" />
            <Text style={styles.rowText}>Log out</Text>
          </Pressable>
          <Pressable onPress={confirmDelete} style={styles.row}>
            <Feather name="trash-2" size={18} color="#FF5A5F" />
            <Text style={styles.rowText}>Delete account</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
