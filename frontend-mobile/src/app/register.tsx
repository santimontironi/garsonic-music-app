import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { Link, router } from 'expo-router'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { registerSchema, type RegisterInput } from 'shared/schemas/auth.schema'
import { useRegister } from '@/hooks/auth/useRegister'
import type { PhotoFile } from '@/types/auth.types'
import { colors } from '@/utils/colors'

type TextField = Exclude<keyof RegisterInput, 'role'>

const Register = () => {
  const [focused, setFocused] = useState<TextField | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [photo, setPhoto] = useState<PhotoFile | null>(null)

  const { control, handleSubmit, formState: { errors }, reset } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', surname: '', username: '', email: '', password: '', role: 'USER', bio: '' },
  })

  const isArtist = useWatch({ control, name: 'role' }) === 'ARTIST'

  const { mutate: registerUser, isPending, isError, isSuccess, error } = useRegister()

  const formSubmit = handleSubmit((data) => registerUser({ data, photo }, { onSuccess: () => { reset(); setPhoto(null) } }))

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 })
    if (result.canceled) return
    const asset = result.assets[0]
    setPhoto({ uri: asset.uri, name: asset.fileName ?? 'photo.jpg', type: asset.mimeType ?? 'image/jpeg' })
  }

  const renderField = (name: TextField, label: string, icon: SymbolViewProps['name'], inputProps: TextInputProps = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused === name && styles.inputRowFocused, errors[name] && styles.inputRowError]}>
        <View style={[styles.iconCell, focused === name && styles.iconCellFocused]}>
          <SymbolView name={icon} tintColor={colors.black} size={18} />
        </View>
        <Controller
          control={control}
          name={name}
          render={({ field: { ref, value, onChange, onBlur } }) => (
            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChange}
              onFocus={() => setFocused(name)}
              onBlur={() => { onBlur(); setFocused(null) }}
              accessibilityLabel={label}
              placeholderTextColor="#00000066"
              style={styles.input}
              {...inputProps}
            />
          )}
        />
        {name === 'password' && (
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
        )}
      </View>
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </View>
  )

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

          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Creá tu cuenta</Text>
              <Text style={styles.cardSubtitle}>Sumate a Garsonic para escuchar y publicar música</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.field}>
                <Text style={styles.label}>Quiero ser</Text>
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { value, onChange } }) => (
                    <View style={styles.roleRow}>
                      {(['USER', 'ARTIST'] as const).map((role, i) => (
                        <Pressable
                          key={role}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: value === role }}
                          onPress={() => onChange(role)}
                          style={[styles.roleOption, i > 0 && styles.roleDivider, value === role && styles.roleSelected]}
                        >
                          <Text style={styles.roleText}>{role === 'USER' ? 'Oyente' : 'Artista'}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Foto de perfil (opcional)</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={photo ? 'Cambiar foto de perfil' : 'Elegir foto de perfil'}
                  onPress={pickPhoto}
                  style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}
                >
                  <View style={styles.photoPreview}>
                    {photo
                      ? <Image source={{ uri: photo.uri }} style={styles.fill} contentFit="cover" />
                      : <SymbolView name={{ ios: 'person.crop.circle.fill', android: 'account_circle' }} tintColor={colors.black} size={28} />}
                  </View>
                  <Text style={styles.photoText}>{photo ? 'Cambiar foto' : 'Elegir de la galería'}</Text>
                </Pressable>
              </View>

              {renderField('name', 'Nombre', { ios: 'person.fill', android: 'person' }, { autoComplete: 'given-name', placeholder: 'Tu nombre' })}
              {renderField('surname', 'Apellido', { ios: 'person.fill', android: 'person' }, { autoComplete: 'family-name', placeholder: 'Tu apellido' })}
              {renderField('username', isArtist ? 'Nombre artístico' : 'Usuario', { ios: 'at', android: 'alternate_email' }, { autoCapitalize: 'none', autoComplete: 'username', placeholder: isArtist ? 'Cómo te conocen' : 'tu_usuario' })}
              {renderField('email', 'Email', { ios: 'envelope.fill', android: 'mail' }, { keyboardType: 'email-address', autoCapitalize: 'none', autoComplete: 'email', placeholder: 'vos@ejemplo.com' })}
              {renderField('password', 'Contraseña', { ios: 'lock.fill', android: 'lock' }, { secureTextEntry: !showPassword, autoCapitalize: 'none', autoComplete: 'new-password', placeholder: 'Mínimo 6 caracteres' })}
              {renderField('bio', 'Bio (opcional)', { ios: 'text.quote', android: 'notes' }, { multiline: true, numberOfLines: 3, placeholder: 'Contá algo de vos' })}

              {isError && (
                <View style={styles.message}>
                  <SymbolView name={{ ios: 'exclamationmark.triangle.fill', android: 'warning' }} tintColor={colors.black} size={18} />
                  <Text style={styles.messageText}>{error.message}</Text>
                </View>
              )}

              {isSuccess && (
                <View style={[styles.message, styles.messageSuccess]}>
                  <SymbolView name={{ ios: 'envelope.open.fill', android: 'mark_email_read' }} tintColor={colors.black} size={18} />
                  <Text style={styles.messageText}>¡Listo! Revisá tu email para confirmar la cuenta.</Text>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                disabled={isPending}
                onPress={() => formSubmit()}
                style={({ pressed }) => [styles.button, pressed && styles.pressed, pressed && styles.buttonPressed, isPending && styles.disabled]}
              >
                <SymbolView name={{ ios: 'plus', android: 'add' }} tintColor={colors.black} size={18} />
                <Text style={styles.buttonText}>{isPending ? 'Creando...' : 'Crear cuenta'}</Text>
              </Pressable>
            </View>
          </Animated.View>

          <Text style={styles.footer}>
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" replace style={styles.link}>Ingresá</Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Register

// mismo lenguaje brutalista que login
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
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
  card: {
    borderWidth: 3,
    borderColor: colors.black,
    backgroundColor: colors.button,
    boxShadow: '8px 8px 0 0 #000',
  },
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
  roleRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.button,
    boxShadow: '3px 3px 0 0 #000',
  },
  roleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  roleDivider: {
    borderLeftWidth: 2,
    borderColor: colors.black,
  },
  roleSelected: {
    backgroundColor: colors.coral,
  },
  roleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.button,
    boxShadow: '3px 3px 0 0 #000',
  },
  photoPreview: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRightWidth: 2,
    borderColor: colors.black,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  photoText: {
    fontSize: 14,
    color: colors.black,
  },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.button,
    boxShadow: '3px 3px 0 0 #000',
  },
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
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.coral,
    padding: 10,
  },
  messageSuccess: {
    backgroundColor: colors.green,
  },
  messageText: {
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
