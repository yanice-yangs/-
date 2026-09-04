import { useCallback, useRef } from 'react'
import './BorderGlow.css'

const positions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const colorMap = [0, 1, 2, 0, 1, 2, 1]

function buildGradientVars(colors) {
  return positions.reduce((vars, position, index) => {
    vars[`--gradient-${index + 1}`] = `radial-gradient(at ${position}, ${colors[colorMap[index]]} 0, transparent 50%)`
    return vars
  }, {})
}

function buildGlowVars(glowColor, intensity) {
  const match = glowColor.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  const [h, s, l] = match ? match.slice(1).map(Number) : [320, 100, 52]
  const levels = [100, 60, 45, 30, 18, 10]
  return levels.reduce((vars, opacity, index) => {
    vars[`--glow-${index}`] = `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * intensity, 100)}%)`
    return vars
  }, {})
}

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '320 100 52',
  backgroundColor = '#eee9f3',
  borderRadius = 0,
  glowRadius = 32,
  glowIntensity = 0.8,
  coneSpread = 25,
  colors = ['#ec009b', '#ff62c5', '#8e26e3'],
  fillOpacity = 0.2,
}) {
  const cardRef = useRef(null)

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = x - cx
    const dy = y - cy
    const kx = dx === 0 ? Infinity : cx / Math.abs(dx)
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy)
    const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360
    card.style.setProperty('--edge-proximity', (proximity * 100).toFixed(3))
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
  }, [])

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  )
}
