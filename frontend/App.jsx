import { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
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
import { styles } from './App.styles';

export default function App() {
  // 'onboarding' | 'auth' (log in / sign up) | 'setup' (after sign up) | 'main'
  const [screen, setScreen] = useState('onboarding');
  const [tab, setTab] = useState('home'); // 'home' | 'search' | 'library' | 'profile'
  const [sub, setSub] = useState(null); // screen opened from Profile: 'edit' | 'account' | 'settings' | 'history' | 'help'
  const [searchSeed, setSearchSeed] = useState(null); // a genre or artist sent to Search
  const [showPlayer, setShowPlayer] = useState(false);
  const searches = useRecentSearches();

  // Accounts live in memory (frontend only): they are gone when the app is closed.
  const [accounts, setAccounts] = useState([]); // { name, username, password, genres, avatar }
  const [currentUsername, setCurrentUsername] = useState(null); // null means guest

  const account = accounts.find((a) => a.username === currentUsername) || null;
  const user = account
    ? { name: account.name, username: account.username, genres: account.genres, avatar: account.avatar }
    : null; // null means default (guest) home

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

  // ---- accounts ----
  const signup = ({ name, username, password }) => {
    const key = username.toLowerCase();
    if (accounts.some((a) => a.username === key)) return 'That username is already taken';
    setAccounts((list) => [...list, { name, username: key, password, genres: [], avatar: '' }]);
    setCurrentUsername(key);
    setScreen('setup'); // next: pick genres and a photo
    return '';
  };

  const login = (username, password) => {
    const found = accounts.find((a) => a.username === username.toLowerCase());
    if (!found || found.password !== password) return 'Wrong username or password';
    setCurrentUsername(found.username);
    goMain();
    return '';
  };

  const logout = () => {
    setShowPlayer(false);
    setSub(null);
    setCurrentUsername(null);
    setTab('home');
    setScreen('onboarding');
  };

  const deleteAccount = () => {
    setAccounts((list) => list.filter((a) => a.username !== currentUsername));
    logout();
  };

  const changePassword = (oldPassword, newPassword) => {
    if (!account || account.password !== oldPassword) return 'Current password is wrong';
    setAccounts((list) =>
      list.map((a) => (a.username === currentUsername ? { ...a, password: newPassword } : a))
    );
    return '';
  };

  // save name / username / genres / photo of the logged in user
  const updateProfile = (data) => {
    const newKey = (data.username || currentUsername).trim().toLowerCase();
    setAccounts((list) =>
      list.map((a) =>
        a.username === currentUsername
          ? { ...a, name: data.name, username: newKey, genres: data.genres, avatar: data.avatar }
          : a
      )
    );
    setCurrentUsername(newKey);
  };

  const changeAvatar = (uri) => {
    setAccounts((list) =>
      list.map((a) => (a.username === currentUsername ? { ...a, avatar: uri } : a))
    );
  };

  // username rules + nobody else uses it
  const checkUsername = (text) => {
    const problem = usernameError(text);
    if (problem) return problem;
    const key = text.trim().toLowerCase();
    return accounts.some((a) => a.username === key && a.username !== currentUsername)
      ? 'That username is already taken'
      : '';
  };

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
      <PlayerProvider>
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
            onContinue={(data) => {
              updateProfile(data);
              goMain();
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
                    onContinue={(data) => {
                      updateProfile(data);
                      setSub(null);
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
