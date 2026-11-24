import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInLeft } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/utils/colors'

const Index = () => {
  const { width } = useWindowDimensions()
  // el PNG trae aire alrededor del disco: a 1.3x el ancho, el vinilo se ve de ~0.8x y queda medio afuera
  const vinylSize = width * 1.3

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.logoCell}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" accessibilityLabel="Logo de Garsonic" />
        </View>
        <Text style={styles.wordmark}>Garsonic</Text>
      </Animated.View>

      <View style={styles.poster}>
        {/* el disco se centra en las tres palabras, no en todo el bloque: así nunca baja hasta los botones */}
        <View style={styles.words}>
          <Animated.View
            entering={FadeIn.duration(700)}
            pointerEvents="none"
            style={[styles.vinyl, { width: vinylSize, height: vinylSize, right: -vinylSize * 0.5, marginTop: -vinylSize / 2 }]}
          >
            <Image source={require('@/assets/images/logo.png')} style={styles.fill} contentFit="contain" />
          </Animated.View>

          <Animated.Text entering={FadeInLeft.springify().delay(150)} style={[styles.word, styles.wordWhite]}>Escuchá</Animated.Text>
          <Animated.Text entering={FadeInLeft.springify().delay(280)} style={[styles.word, styles.wordCoral]}>Guardá</Animated.Text>
          <Animated.Text entering={FadeInLeft.springify().delay(410)} style={[styles.word, styles.wordBlack]}>Publicá</Animated.Text>
        </View>

        <Animated.Text entering={FadeIn.duration(500).delay(600)} style={styles.subtitle}>
          Tu música, tus playlists y, si sos artista, tus canciones. Todo en un mismo lugar.
        </Animated.Text>

        <Animated.View entering={FadeInDown.duration(500).delay(700)} style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/login')} style={({ pressed }) => [styles.button, styles.primary, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/register')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    gap: 24,
    overflow: 'hidden',
  },
  // mismo header que la web: celdas separadas por bordes, el logo en verde
  header: {
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: colors.black,
    backgroundColor: colors.button,
    boxShadow: '4px 4px 0 0 #000',
  },
  logoCell: {
    padding: 8,
    backgroundColor: colors.green,
    borderRightWidth: 3,
    borderColor: colors.black,
  },
  logo: {
    width: 32,
    height: 32,
  },
  wordmark: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    fontFamily: 'KronaOne_400Regular',
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.black,
  },
  poster: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 14,
    // corre el bloque centrado hacia arriba; compensa el marginTop de actions para que las palabras no suban
    paddingBottom: 62,
  },
  words: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    gap: 14,
  },
  vinyl: {
    position: 'absolute',
    top: '50%',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  // cada palabra es un bloque propio: el póster de la pantalla
  word: {
    borderWidth: 3,
    borderColor: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontFamily: 'KronaOne_400Regular',
    fontSize: 34,
    textTransform: 'uppercase',
    boxShadow: '6px 6px 0 0 #000',
  },
  wordWhite: {
    backgroundColor: colors.button,
    color: colors.black,
  },
  wordCoral: {
    backgroundColor: colors.coral,
    color: colors.black,
  },
  wordBlack: {
    backgroundColor: colors.black,
    color: colors.green,
  },
  subtitle: {
    maxWidth: 260,
    marginTop: 10,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.button,
    padding: 12,
    fontFamily: 'KronaOne_400Regular',
    fontSize: 12,
    lineHeight: 20,
    color: colors.black,
  },
  actions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 32,
  },
  button: {
    minHeight: 56,
    borderWidth: 3,
    borderColor: colors.black,
    backgroundColor: colors.button,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '4px 4px 0 0 #000',
  },
  primary: {
    backgroundColor: colors.green,
  },
  // se "hunde": se desplaza lo mismo que la sombra y la sombra desaparece
  pressed: {
    transform: [{ translateX: 4 }, { translateY: 4 }],
    boxShadow: 'none',
    backgroundColor: colors.coral,
  },
  buttonText: {
    fontFamily: 'KronaOne_400Regular',
    // 12px: los dos botones comparten el ancho y Krona One es muy ancha
    fontSize: 12,
    textTransform: 'uppercase',
    color: colors.black,
  },
})
