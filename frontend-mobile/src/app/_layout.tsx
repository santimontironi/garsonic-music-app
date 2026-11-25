import { KronaOne_400Regular, useFonts } from '@expo-google-fonts/krona-one';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { colors } from '@/utils/colors';
import queryClient from '@/queryClient';
import { useMe } from '@/hooks/auth/useMe';
import Loader from '@/components/ui/Loader';

// separado de RootLayout porque useMe tiene que estar dentro del QueryClientProvider
const RootNavigator = () => {
  const { data: user, isPending } = useMe()

  // sin esto se vería la bienvenida un instante antes de saber si hay sesión
  if (isPending) return <Loader />

  return ( //si no hay usuario logueado, se muestran las pantallas de login, register y index, si hay usuario logueado, se muestran las pantallas protegidas
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>

      {/* cuando el usuario que se loguea o esta logueado gracias al token, es redirigido al panel de USER */}
      <Stack.Protected guard={user?.role === 'USER'}>
        <Stack.Screen name="user" />
      </Stack.Protected>

      {/* cuando el usuario que se loguea o esta logueado gracias al token, es redirigido al panel de ARTIST */}
      <Stack.Protected guard={user?.role === 'ARTIST'}>
        <Stack.Screen name="artist" />
      </Stack.Protected>
    </Stack>
  )
}

const RootLayout = () => {

  const [loaded] = useFonts({ KronaOne_400Regular })

  if (!loaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {/* sin SafeAreaView acá: cada pantalla maneja su safe area para que el fondo llegue hasta los bordes con su propio color */}
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <StatusBar style="dark" />

          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}

export default RootLayout
