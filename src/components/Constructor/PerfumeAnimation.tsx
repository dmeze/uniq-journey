import { animated, useSpring } from '@react-spring/web'
import Wave from 'react-wavify'
import React, { useMemo } from 'react'

interface PerfumeAnimationProps {
  index: number
  total: number
  color: string
}

const PerfumeAnimation = ({ index, total, color }: PerfumeAnimationProps) => {
  const bottomPosition = useMemo(() => {
    const heightPercentage = 100 / total
    return index * heightPercentage
  }, [total, index])

  const spring = useSpring({
    from: { top: '100%' },
    to: {
      top: `${bottomPosition}%`,
    },
    config: { duration: 1000 },
  })

  return (
    <animated.div
      style={{
        ...spring,
        height: `100%`,
        position: 'absolute',
        width: '100%',
        zIndex: 10,
      }}
    >
      <Wave
        fill={color}
        paused={false}
        options={{
          height: 20 - index,
          amplitude: 10,
          speed: 0.2,
          points: 3,
        }}
        style={{
          width: '100%',
          height: '200%',
        }}
      />
    </animated.div>
  )
}

export default PerfumeAnimation
