import { useEffect, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AccountScreen from './src/screens/AccountScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HelpScreen from './src/screens/HelpScreen';
import NowPlayingScreen from './src/screens/NowPlayingScreen';
import { PlayerProvider } from './src/context/PlayerContext';
import { useRecentSearches } from './src/hooks/useRecentSearches';
import { usernameError } from './src/lib/auth';
import { authApi, meApi, profileApi } from './src/lib/backend';
import { setToken, setUnauthorizedHandler } from './src/lib/client';
import { idle, setSyncEnabled } from './src/lib/sync';
import { flushListening } from './src/lib/listenBuffer';
import { styles } from './App.styles';

export default function App() {
  // 'onboarding' | 'auth' (log in / sign up) | 'setup' (after sign up) | 'main'
  const [screen, setScreen] = useState('onboarding');
  const [tab, setTab] = useState('home'); // 'home' | 'search' | 'library' | 'profile'
  const [sub, setSub] = useState(null); // screen opened from Profile: 'edit' | 'account' | 'settings' | 'history' | 'help'
  const [searchSeed, setSearchSeed] = useState(null); // a genre or artist sent to Search
  const [showPlayer, setShowPlayer] = useState(false);
  const searches = useRecentSearches();

  // The account lives on the backend. The app keeps the logged in user (null means guest)
  // and what the backend saved for that user (hydration), which the player takes over.
  const [user, setUser] = useState(null); // { id, name, username, genres, avatar }
  const [hydration, setHydration] = useState(null);

  const goMain = () => {
    setTab('home');
    setSub(null);
    setScreen('main');
  };

  // phone back button: Now Playing first, then a screen opened from Profile
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showPlayer) {
        setShowPlayer(false);
        return true;
      }
      if (sub) {
        setSub(null);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [showPlayer, sub]);

  const changeTab = (key) => {
    if (key === 'home' || key === 'search' || key === 'library' || key === 'profile') setTab(key);
  };

  // ---- accounts (all of this talks to the backend) ----
  const EMPTY_STATE = { liked: [], history: [], playCounts: {}, listenByDay: [0, 0, 0, 0, 0, 0, 0], recents: [], queue: null };

  // token received: remember it, then load everything saved for this user
  const startSession = async (data) => {
    setToken(data.token);
    setSyncEnabled(true);
    let state = EMPTY_STATE;
    try {
      state = await meApi.state();
    } catch (e) {
      // the data can be loaded later; the account itself works
    }
    searches.reset(state.recents);
    setUser(state.user || data.user);
    setHydration(state);
  };

  // forget the login on this phone (after the last changes were sent)
  const endSession = async ({ callServer }) => {
    await flushListening();
    await idle();
    if (callServer) await authApi.logout().catch(() => {});
    setSyncEnabled(false);
    setToken(null);
  };

  const resetLocal = () => {
    setShowPlayer(false);
    setSub(null);
    setUser(null);
    setHydration(null);
    searches.reset([]);
    setTab('home');
    setScreen('onboarding');
  };

  // each of these returns an error text ('' means it worked)
  const signup = async ({ name, username, password }) => {
    try {
      await startSession(await authApi.signup(name, username, password));
      setScreen('setup'); // next: pick genres and a photo
      return '';
    } catch (e) {
      return e.message;
    }
  };

  const login = async (username, password) => {
    try {
      await startSession(await authApi.login(username, password));
      goMain();
      return '';
    } catch (e) {
      return e.message;
    }
  };

  const logout = () => {
    resetLocal();
    endSession({ callServer: true });
  };

  // the server said our login is no longer valid
  useEffect(() => {
    setUnauthorizedHandler(() => {
      resetLocal();
      setSyncEnabled(false);
      setToken(null);
      setScreen('auth');
    });
    return () => setUnauthorizedHandler(null);
  });

  const deleteAccount = async () => {
    try {
      await authApi.deleteAccount();
    } catch (e) {
      Alert.alert('Could not delete the account', e.message);
      return;
    }
    // the account is gone, so there is nothing left to send
    setSyncEnabled(false);
    setToken(null);
    resetLocal();
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await authApi.changePassword(oldPassword, newPassword);
      return '';
    } catch (e) {
      return e.message;
    }
  };

  // save name / username / genres / photo of the logged in user. Returns an error text or ''.
  const updateProfile = async (data) => {
    try {
      const result = await profileApi.save({
        name: data.name,
        username: data.username,
        genres: data.genres,
        avatar: data.avatar,
      });
      setUser(result.user);
      return '';
    } catch (e) {
      return e.message;
    }
  };

  const changeAvatar = async (avatar) => {
    const before = user;
    setUser((u) => (u ? { ...u, avatar } : u)); // show it at once
    try {
      await profileApi.saveAvatar(avatar);
    } catch (e) {
      setUser(before);
      Alert.alert('Could not save your photo', e.message);
    }
  };

  // username rules (the backend checks if it is taken while the user types)
  const checkUsername = (text) => usernameError(text);

  // "See All" on a Home genre row (or an artist on Profile) opens Search with that text
  const openGenre = (label) => {
    searches.add(label);
    setSearchSeed({ label, id: Date.now() });
    setSub(null);
    setTab('search');
  };

  const hideTab = (key) => tab !== key || showPlayer || sub !== null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <PlayerProvider hydration={hydration}>
        {screen === 'onboarding' && (
          <OnboardingScreen onGetStarted={() => setScreen('auth')} onSkip={goMain} />
        )}

        {screen === 'auth' && (
          <AuthScreen onLogin={login} onSignup={signup} onSkip={goMain} />
        )}

        {screen === 'setup' && (
          <ProfileSetupScreen
            initial={user || {}}
            checkUsername={checkUsername}
            onContinue={async (data) => {
              const err = await updateProfile(data);
              if (!err) goMain();
              return err;
            }}
            onSkip={goMain}
          />
        )}

        {screen === 'main' && (
          <View style={styles.fill}>
            <View style={[styles.fill, hideTab('home') && styles.hidden]}>
              <HomeScreen
                user={user}
                recentSearches={searches.recent}
                onSetupProfile={() => setScreen('auth')}
                onOpenPlayer={() => setShowPlayer(true)}
                onOpenGenre={openGenre}
                onTabChange={changeTab}
              />
            </View>

            <View style={[styles.fill, hideTab('search') && styles.hidden]}>
              <SearchScreen
                recent={searches.recent}
                onAddRecent={searches.add}
                onRemoveRecent={searches.remove}
                onClearRecent={searches.clear}
                onOpenPlayer={() => setShowPlayer(true)}
                onTabChange={changeTab}
                seed={searchSeed}
              />
            </View>

            <View style={[styles.fill, hideTab('library') && styles.hidden]}>
              <LibraryScreen
                active={tab === 'library' && !showPlayer && sub === null}
                onOpenPlayer={() => setShowPlayer(true)}
                onTabChange={changeTab}
              />
            </View>

            <View style={[styles.fill, hideTab('profile') && styles.hidden]}>
              <ProfileScreen
                user={user}
                onSetupProfile={() => setScreen('auth')}
                onOpenSub={setSub}
                onOpenArtist={openGenre}
                onChangeAvatar={changeAvatar}
                onLogout={logout}
                onOpenPlayer={() => setShowPlayer(true)}
                onTabChange={changeTab}
              />
            </View>

            {/* screens opened from Profile */}
            {sub !== null && (
              <View style={[styles.fill, showPlayer && styles.hidden]}>
                {sub === 'edit' && user && (
                  <ProfileSetupScreen
                    editing
                    initial={user}
                    checkUsername={checkUsername}
                    onContinue={async (data) => {
                      const err = await updateProfile(data);
                      if (!err) setSub(null);
                      return err;
                    }}
                    onSkip={() => setSub(null)}
                  />
                )}
                {sub === 'account' && user && (
                  <AccountScreen
                    user={user}
                    onBack={() => setSub(null)}
                    onChangePassword={changePassword}
                    onLogout={logout}
                    onDelete={deleteAccount}
                  />
                )}
                {sub === 'settings' && (
                  <SettingsScreen onBack={() => setSub(null)} onClearSearches={searches.clear} />
                )}
                {sub === 'history' && (
                  <HistoryScreen onBack={() => setSub(null)} onOpenPlayer={() => setShowPlayer(true)} />
                )}
                {sub === 'help' && <HelpScreen onBack={() => setSub(null)} />}
              </View>
            )}

            {showPlayer && <NowPlayingScreen onBack={() => setShowPlayer(false)} />}
          </View>
        )}
      </PlayerProvider>
    </SafeAreaProvider>
  );
}
