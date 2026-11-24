import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from 'expo-image'
import { Link, router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInLeft, useReducedMotion } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { loginSchema, type LoginInput } from 'shared/schemas/auth.schema'
import { useLogin } from '@/hooks/auth/useLogin'
import { colors } from '@/utils/colors'

const Login = () => {
  const { width } = useWindowDimensions()
  const reduceMotion = useReducedMotion()
  const [focused, setFocused] = useState<keyof LoginInput | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit, setFocus, formState: { errors }, reset } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const { mutate: login, isPending, isError, error } = useLogin()

  const formSubmit = handleSubmit((data) => login(data, { onSuccess: () => reset() }))

  // mismo vinilo medio afuera que la bienvenida, pero girando como un disco puesto
  const vinylSize = width * 0.9

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back' }} tintColor={colors.black} size={22} />
            </Pressable>
            <View style={styles.header}>
              <View style={styles.logoCell}>
                <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" accessibilityLabel="Logo de Garsonic" />
              </View>
              <Text style={styles.wordmark}>Garsonic</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <Animated.View
              entering={FadeIn.duration(700)}
              pointerEvents="none"
              style={[
                styles.vinyl,
                { width: vinylSize, height: vinylSize, right: -vinylSize * 0.45, marginTop: -vinylSize / 2 },
                !reduceMotion && styles.spinning,
              ]}
            >
              <Image source={require('@/assets/images/logo.png')} style={styles.fill} contentFit="contain" />
            </Animated.View>

            <Animated.Text entering={FadeInLeft.springify().delay(100)} style={[styles.word, styles.wordBlack]}>Hola</Animated.Text>
            <Animated.Text entering={FadeInLeft.springify().delay(230)} style={[styles.word, styles.wordWhite]}>de nuevo</Animated.Text>
          </View>

          <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Ingresá a tu cuenta</Text>
              <Text style={styles.cardSubtitle}>Seguí escuchando donde lo dejaste</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputRow, focused === 'email' && styles.inputRowFocused, errors.email && styles.inputRowError]}>
                  <View style={[styles.iconCell, focused === 'email' && styles.iconCellFocused]}>
                    <SymbolView name={{ ios: 'envelope.fill', android: 'mail' }} tintColor={colors.black} size={18} />
                  </View>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { ref, value, onChange, onBlur } }) => (
                      <TextInput
                        ref={ref}
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => { onBlur(); setFocused(null) }}
                        accessibilityLabel="Email"
                        placeholder="vos@ejemplo.com"
                        placeholderTextColor="#00000066"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => setFocus('password')}
                        style={styles.input}
                      />
                    )}
                  />
                </View>
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={[styles.inputRow, focused === 'password' && styles.inputRowFocused, errors.password && styles.inputRowError]}>
                  <View style={[styles.iconCell, focused === 'password' && styles.iconCellFocused]}>
                    <SymbolView name={{ ios: 'lock.fill', android: 'lock' }} tintColor={colors.black} size={18} />
                  </View>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { ref, value, onChange, onBlur } }) => (
                      <TextInput
                        ref={ref}
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setFocused('password')}
                        onBlur={() => { onBlur(); setFocused(null) }}
                        accessibilityLabel="Contraseña"
                        placeholder="Tu contraseña"
                        placeholderTextColor="#00000066"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete="current-password"
                        returnKeyType="done"
                        onSubmitEditing={() => formSubmit()}
                        style={styles.input}
                      />
                    )}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={8}
                    style={styles.eyeButton}
                  >
                    <SymbolView
                      name={showPassword ? { ios: 'eye.slash.fill', android: 'visibility_off' } : { ios: 'eye.fill', android: 'visibility' }}
                      tintColor={colors.black}
                      size={20}
                    />
                  </Pressable>
                </View>
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
              </View>

              {isError && (
                <View style={styles.serverError}>
                  <SymbolView name={{ ios: 'exclamationmark.triangle.fill', android: 'warning' }} tintColor={colors.black} size={18} />
                  <Text style={styles.serverErrorText}>{error.message}</Text>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                disabled={isPending}
                onPress={() => formSubmit()}
                style={({ pressed }) => [styles.button, pressed && styles.pressed, pressed && styles.buttonPressed, isPending && styles.disabled]}
              >
                <SymbolView name={{ ios: 'play.fill', android: 'play_arrow' }} tintColor={colors.black} size={18} />
                <Text style={styles.buttonText}>{isPending ? 'Ingresando...' : 'Ingresar'}</Text>
              </Pressable>
            </View>
          </Animated.View>

          <Text style={styles.footer}>
            ¿No tenés cuenta?{' '}
            <Link href="/register" replace style={styles.link}>Creá una</Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 24,
  },
  topBar: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.black,
    backgroundColor: colors.button,
    boxShadow: '4px 4px 0 0 #000',
  },
  // mismo header que la bienvenida
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
  hero: {
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  vinyl: {
    position: 'absolute',
    top: '50%',
  },
  // reanimated 4 acepta animaciones CSS; si el sistema pide menos movimiento, el disco queda quieto
  spinning: {
    animationName: { from: { transform: [{ rotate: '0deg' }] }, to: { transform: [{ rotate: '360deg' }] } },
    animationDuration: '8s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  word: {
    borderWidth: 3,
    borderColor: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontFamily: 'KronaOne_400Regular',
    fontSize: 30,
    textTransform: 'uppercase',
    boxShadow: '6px 6px 0 0 #000',
  },
  wordBlack: {
    backgroundColor: colors.black,
    color: colors.green,
    transform: [{ rotate: '-3deg' }],
  },
  wordWhite: {
    backgroundColor: colors.button,
    color: colors.black,
  },
  card: {
    borderWidth: 3,
    borderColor: colors.black,
    backgroundColor: colors.button,
    boxShadow: '8px 8px 0 0 #000',
  },
  // franja verde arriba, separada por borde como las celdas del header
  cardHeader: {
    gap: 4,
    padding: 16,
    backgroundColor: colors.green,
    borderBottomWidth: 3,
    borderColor: colors.black,
  },
  cardTitle: {
    fontFamily: 'KronaOne_400Regular',
    fontSize: 16,
    textTransform: 'uppercase',
    color: colors.black,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.black,
  },
  cardBody: {
    gap: 18,
    padding: 20,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
  },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.button,
    boxShadow: '3px 3px 0 0 #000',
  },
  // al enfocar, el campo "se levanta": más sombra y se corre al revés que el botón hundido
  inputRowFocused: {
    transform: [{ translateX: -2 }, { translateY: -2 }],
    boxShadow: '5px 5px 0 0 #000',
  },
  inputRowError: {
    backgroundColor: '#FFE3DC',
  },
  iconCell: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRightWidth: 2,
    borderColor: colors.black,
  },
  iconCellFocused: {
    backgroundColor: colors.green,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.black,
  },
  eyeButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  error: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.coral,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    color: colors.black,
  },
  serverError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.coral,
    padding: 10,
  },
  serverErrorText: {
    flex: 1,
    fontSize: 13,
    color: colors.black,
  },
  button: {
    minHeight: 56,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.black,
    backgroundColor: colors.green,
    boxShadow: '4px 4px 0 0 #000',
  },
  // mismo "hundido" que los botones de la bienvenida
  pressed: {
    transform: [{ translateX: 4 }, { translateY: 4 }],
    boxShadow: 'none',
  },
  buttonPressed: {
    backgroundColor: colors.coral,
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
  footer: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.black,
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
})
