import { KronaOne_400Regular, useFonts } from '@expo-google-fonts/krona-one';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/utils/colors';

const RootLayout = () => {

  const [loaded] = useFonts({ KronaOne_400Regular })

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="dark" />

        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>

  )
}

export default RootLayout