import { StyleSheet, Text, View } from 'react-native'
import { colors } from '@/utils/colors'

const Register = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Crear cuenta</Text>
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontFamily: 'KronaOne_400Regular',
    fontSize: 24,
    textTransform: 'uppercase',
    color: colors.black,
  },
})
