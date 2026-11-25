import type { ComponentProps } from 'react'
import { StyleSheet, View, type ColorValue } from 'react-native'
import { SymbolView } from 'expo-symbols'
import type { Tabs } from 'expo-router'
import { colors } from '@/utils/colors'

type IconName = ComponentProps<typeof SymbolView>['name']
// @react-navigation/bottom-tabs no es dependencia directa, así que el tipo sale de Tabs
type TabsScreenOptions = ComponentProps<typeof Tabs>['screenOptions']

// helper para no repetir SymbolView en cada tab; Tabs le pasa color y focused según la tab esté activa o no
export const tabIcon = (name: IconName) =>
  function TabBarIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return (
      <View style={[styles.icon, focused && styles.iconFocused]}>
        <SymbolView name={name} tintColor={color} size={22} />
      </View>
    )
  }

// estilo compartido de la barra de tabs de los paneles de USER y ARTIST
export const tabsScreenOptions: TabsScreenOptions = {
  headerShown: false, // sin header en cada pantalla, porque el header es el tabBar
  tabBarActiveTintColor: colors.black,
  tabBarInactiveTintColor: '#000000B3', // 70% negro: con 50% el label de 10px no llegaba al contraste 4.5:1
  tabBarActiveBackgroundColor: colors.green, // tab activa resaltada, como el ítem activo del SideNav
  tabBarLabelStyle: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },
  tabBarItemStyle: {
    // línea negra entre tabs para que cada una se lea como un bloque aparte
    borderRightWidth: 2,
    borderRightColor: colors.black,
    paddingTop: 6,
  },
  tabBarStyle: {
    backgroundColor: colors.button,
    borderTopWidth: 3, // mismo borde grueso que el header de la web
    borderTopColor: colors.black,
    height: 'auto', // deja que la altura salga del contenido + safe area, para que entre la pastilla del ícono
  },
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent', // mismo tamaño activa o no, así el ícono no salta al cambiar de tab
  },
  iconFocused: {
    backgroundColor: colors.button,
    borderColor: colors.black,
    boxShadow: '2px 2px 0 0 #000',
  },
})
