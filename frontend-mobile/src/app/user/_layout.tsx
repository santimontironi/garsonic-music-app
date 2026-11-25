import { Tabs } from 'expo-router'
import { tabIcon, tabsScreenOptions } from '@/components/ui/tabs'

const UserLayout = () => {
  return (
    <Tabs screenOptions={tabsScreenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: tabIcon({ ios: 'house.fill', android: 'home' }) }} />
      <Tabs.Screen name="search" options={{ title: 'Buscar', tabBarIcon: tabIcon({ ios: 'magnifyingglass', android: 'search' }) }} />
      <Tabs.Screen name="playlists" options={{ title: 'Playlists', tabBarIcon: tabIcon({ ios: 'music.note.list', android: 'queue_music' }) }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favoritos', tabBarIcon: tabIcon({ ios: 'heart.fill', android: 'favorite' }) }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: tabIcon({ ios: 'person.fill', android: 'person' }) }} />
    </Tabs>
  )
}

export default UserLayout
