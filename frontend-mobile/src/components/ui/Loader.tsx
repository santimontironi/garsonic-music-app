import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from '@/utils/colors'

export default function RippleWaveLoader() {
  return (
    <View style={styles.container}>
      {[...Array(7)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              animationName: {
                '0%': { transform: [{ translateY: 0 }, { scaleX: 1 }, { scaleY: 0.5 }] },
                '50%': { transform: [{ translateY: -5 }, { scaleX: 0.8 }, { scaleY: 1.5 }] },
                '100%': { transform: [{ translateY: 0 }, { scaleX: 1 }, { scaleY: 0.5 }] },
              },
              animationDuration: '1s',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
              animationDelay: index * 100,
            },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bar: {
    height: 32,
    width: 8,
    backgroundColor: colors.black,
  },
})
