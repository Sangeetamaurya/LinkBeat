import { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NowPlayingScreen from './src/screens/NowPlayingScreen';
import { PlayerProvider } from './src/context/PlayerContext';
import { useRecentSearches } from './src/hooks/useRecentSearches';
import { styles } from './App.styles';

export default function App() {
  const [screen, setScreen] = useState('onboarding'); // 'onboarding' | 'setup' | 'main'
  const [tab, setTab] = useState('home'); // 'home' | 'search' | 'library' | 'profile'
  const [searchSeed, setSearchSeed] = useState(null); // a genre sent from Home to Search
  const [showPlayer, setShowPlayer] = useState(false);
  const [user, setUser] = useState(null); // null means default (skipped) home
  const searches = useRecentSearches();

  const goMain = (newUser) => {
    setUser(newUser);
    setTab('home');
    setScreen('main');
  };

  // phone back button closes the Now Playing screen first
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showPlayer) {
        setShowPlayer(false);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [showPlayer]);

  const changeTab = (key) => {
    if (key === 'home' || key === 'search' || key === 'library' || key === 'profile') setTab(key);
  };

  // log out: back to the first screen
  const logout = () => {
    setShowPlayer(false);
    setUser(null);
    setTab('home');
    setScreen('onboarding');
  };

  // "See All" on a Home genre row opens Search with that genre
  const openGenre = (label) => {
    searches.add(label);
    setSearchSeed({ label, id: Date.now() });
    setTab('search');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <PlayerProvider>
        {screen === 'onboarding' && (
          <OnboardingScreen
            onGetStarted={() => setScreen('setup')}
            onSkip={() => goMain(null)}
          />
        )}

        {screen === 'setup' && (
          <ProfileSetupScreen onContinue={(newUser) => goMain(newUser)} onSkip={() => goMain(null)} />
        )}

        {screen === 'main' && (
          <View style={styles.fill}>
            <View style={[styles.fill, (tab !== 'home' || showPlayer) && styles.hidden]}>
              <HomeScreen
                user={user}
                recentSearches={searches.recent}
                onSetupProfile={() => setScreen('setup')}
                onOpenPlayer={() => setShowPlayer(true)}
                onOpenGenre={openGenre}
                onTabChange={changeTab}
              />
            </View>

            <View style={[styles.fill, (tab !== 'search' || showPlayer) && styles.hidden]}>
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

            <View style={[styles.fill, (tab !== 'library' || showPlayer) && styles.hidden]}>
              <LibraryScreen
                active={tab === 'library' && !showPlayer}
                onOpenPlayer={() => setShowPlayer(true)}
                onTabChange={changeTab}
              />
            </View>

            <View style={[styles.fill, (tab !== 'profile' || showPlayer) && styles.hidden]}>
              <ProfileScreen
                user={user}
                onEditProfile={() => setScreen('setup')}
                onChangeAvatar={(uri) => setUser((old) => (old ? { ...old, avatar: uri } : old))}
                onLogout={logout}
                onOpenPlayer={() => setShowPlayer(true)}
                onTabChange={changeTab}
              />
            </View>

            {showPlayer && <NowPlayingScreen onBack={() => setShowPlayer(false)} />}
          </View>
        )}
      </PlayerProvider>
    </SafeAreaProvider>
  );
}
