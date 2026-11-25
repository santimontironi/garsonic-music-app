import { Pressable, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLogout } from '@/hooks/auth/useLogout'
import { colors } from '@/utils/colors'

const Profile = () => {
  const { mutate: logout, isPending } = useLogout()

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <Text style={styles.title}>Perfil</Text>

      <Pressable
        accessibilityRole="button"
        disabled={isPending}
        onPress={() => logout()}
        style={({ pressed }) => [styles.button, pressed && styles.pressed, isPending && styles.disabled]}
      >
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 20,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontFamily: 'KronaOne_400Regular',
    fontSize: 24,
    textTransform: 'uppercase',
    color: colors.black,
  },
  button: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.black,
    backgroundColor: colors.coral,
    boxShadow: '4px 4px 0 0 #000',
  },
  // mismo "hundido" que los botones de la bienvenida y el login
  pressed: {
    transform: [{ translateX: 4 }, { translateY: 4 }],
    boxShadow: 'none',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'KronaOne_400Regular',
    fontSize: 14,
    textTransform: 'uppercase',
    color: colors.black,
  },
})
