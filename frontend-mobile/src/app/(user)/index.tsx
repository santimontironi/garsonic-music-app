import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/utils/colors'

const HomeUser = () => (
  <SafeAreaView edges={['top']} style={styles.screen}> {/* edges top es para que el contenido tenga padding en la parte superior, ya que en la parte inferior estan los tabs */}
    <Text style={styles.title}>Inicio</Text>
  </SafeAreaView>
)

export default HomeUser

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontFamily: 'KronaOne_400Regular',
    fontSize: 24,
    textTransform: 'uppercase',
    color: colors.black,
  },
})
