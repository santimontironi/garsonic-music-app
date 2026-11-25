import { Tabs } from 'expo-router'
import { tabIcon, tabsScreenOptions } from '@/components/ui/tabs'

// mismas secciones que el SideNavArtist de la web
const ArtistLayout = () => {
  return (
    <Tabs screenOptions={tabsScreenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: tabIcon({ ios: 'house.fill', android: 'home' }) }} />
      <Tabs.Screen name="search" options={{ title: 'Buscar', tabBarIcon: tabIcon({ ios: 'magnifyingglass', android: 'search' }) }} />
      <Tabs.Screen name="songs" options={{ title: 'Canciones', tabBarIcon: tabIcon({ ios: 'music.note', android: 'music_note' }) }} />
      <Tabs.Screen name="albums" options={{ title: 'Álbumes', tabBarIcon: tabIcon({ ios: 'square.stack.fill', android: 'album' }) }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: tabIcon({ ios: 'chart.bar.fill', android: 'bar_chart' }) }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: tabIcon({ ios: 'person.fill', android: 'person' }) }} />
    </Tabs>
  )
}

export default ArtistLayout
