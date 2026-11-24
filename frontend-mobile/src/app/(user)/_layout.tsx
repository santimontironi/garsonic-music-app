import { Tabs } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import type { ComponentProps } from 'react'
import type { ColorValue } from 'react-native'
import { colors } from '@/utils/colors'

type IconName = ComponentProps<typeof SymbolView>['name']

// helper para no repetir SymbolView en cada tab
const icon = (name: IconName) =>
  function TabBarIcon({ color }: { color: ColorValue }) {
    return <SymbolView name={name} tintColor={color} size={24} />
  }

const UserLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // sin header en cada pantalla, porque el header es el tabBar
        tabBarActiveTintColor: colors.black, // ítem activo en negro, como el ítem activo del SideNav
        tabBarInactiveTintColor: '#00000080', // ítem inactivo con transparencia
        tabBarActiveBackgroundColor: colors.green, // tab activa resaltada, como el ítem activo del SideNav
        tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
        tabBarStyle: { // estilo del tabBar
          backgroundColor: colors.button,
          borderTopWidth: 3, // mismo borde grueso que el header de la web
          borderTopColor: colors.black,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: icon({ ios: 'house.fill', android: 'home' }) }} />
      <Tabs.Screen name="search" options={{ title: 'Buscar', tabBarIcon: icon({ ios: 'magnifyingglass', android: 'search' }) }} />
      <Tabs.Screen name="playlists" options={{ title: 'Playlists', tabBarIcon: icon({ ios: 'music.note.list', android: 'queue_music' }) }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favoritos', tabBarIcon: icon({ ios: 'heart.fill', android: 'favorite' }) }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: icon({ ios: 'person.fill', android: 'person' }) }} />
    </Tabs>
  )
}

export default UserLayout
