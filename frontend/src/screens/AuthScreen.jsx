import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../components/InputField';
import { passwordError, usernameError } from '../lib/auth';
import { styles } from './AuthScreen.styles';

// Log in / Sign up in one screen. onLogin and onSignup return an error text ('' means success).
export default function AuthScreen({ initialMode = 'signup', onLogin, onSignup, onSkip }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const submit = () => {
    if (isSignup) {
      if (name.trim() === '') return setError('Please enter your name');
      const uErr = usernameError(username);
      if (uErr) return setError(uErr);
      const pErr = passwordError(password);
      if (pErr) return setError(pErr);
      if (password !== confirm) return setError('Passwords do not match');
      setError(onSignup({ name: name.trim(), username: username.trim(), password }));
    } else {
      if (username.trim() === '' || password === '') {
        return setError('Enter your username and password');
      }
      setError(onLogin(username.trim(), password));
    }
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

          <Text style={styles.title}>{isSignup ? 'Create account' : 'Welcome back'}</Text>
          <Text style={styles.caption}>
            {isSignup
              ? 'Save your liked songs and your listening in one place.'
              : 'Log in to pick up where you left off.'}
          </Text>

          <View style={styles.toggle}>
            <Pressable
              style={[styles.toggleItem, !isSignup && styles.toggleActive]}
              onPress={() => switchMode('login')}
            >
              <Text style={[styles.toggleText, !isSignup && styles.toggleTextActive]}>Log in</Text>
            </Pressable>
            <Pressable
              style={[styles.toggleItem, isSignup && styles.toggleActive]}
              onPress={() => switchMode('signup')}
            >
              <Text style={[styles.toggleText, isSignup && styles.toggleTextActive]}>Sign up</Text>
            </Pressable>
          </View>

          {isSignup && (
            <InputField icon="user" placeholder="Full name" value={name} onChangeText={setName} />
          )}
          <InputField
            icon="at-sign"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            maxLength={30}
          />
          <InputField
            icon="lock"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {isSignup && (
            <InputField
              icon="lock"
              placeholder="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
            />
          )}

          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <Pressable onPress={submit} style={styles.button}>
            <Text style={styles.buttonText}>{isSignup ? 'Create account' : 'Log in'}</Text>
          </Pressable>

          <Pressable onPress={onSkip} style={styles.guestLink}>
            <Text style={styles.guestText}>Continue as guest</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
