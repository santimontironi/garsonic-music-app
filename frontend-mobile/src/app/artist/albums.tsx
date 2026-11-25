import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/utils/colors'

const MyAlbums = () => (
  <SafeAreaView edges={['top']} style={styles.screen}>
    <Text style={styles.title}>Álbumes</Text>
  </SafeAreaView>
)

export default MyAlbums

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
