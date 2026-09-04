import { memo, useEffect, useId, useRef } from 'react'
import './DotField.css'

const TWO_PI = Math.PI * 2

const DotField = memo(({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = 'rgba(168, 85, 247, 0.35)',
  gradientTo = 'rgba(180, 151, 207, 0.25)',
  glowColor = '#120F17',
  ...rest
}) => {
  const canvasRef = useRef(null)
  const glowRef = useRef(null)
  const dotsRef = useRef([])
  const frameRef = useRef(0)
  const propsRef = useRef({})
  const glowId = `dot-field-${useId().replaceAll(':', '')}`

  propsRef.current = {
    dotRadius, dotSpacing, cursorRadius, bulgeStrength,
    sparkle, waveAmplitude, gradientFrom, gradientTo,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const glow = glowRef.current
    const container = canvas?.parentElement
    if (!canvas || !container) return undefined

    const context = canvas.getContext('2d', { alpha: true })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 }
    const size = { width: 0, height: 0 }
    let active = false
    let resizeFrame = 0
    let glowOpacity = 0
    let engagement = 0
    let tickCount = 0

    const buildDots = () => {
      const { dotRadius: radius, dotSpacing: spacing } = propsRef.current
      const step = radius + spacing
      const columns = Math.floor(size.width / step)
      const rows = Math.floor(size.height / step)
      const offsetX = (size.width % step) / 2
      const offsetY = (size.height % step) / 2
      dotsRef.current = Array.from({ length: rows * columns }, (_, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const x = offsetX + column * step + step / 2
        const y = offsetY + row * step + step / 2
        return { x, y, currentX: x, currentY: y }
      })
    }

    const draw = (frame = 0) => {
      const props = propsRef.current
      const dots = dotsRef.current
      const radius = props.dotRadius / 2
      const cursorRadiusSquared = props.cursorRadius * props.cursorRadius
      const time = frame * .02

      const deltaX = mouse.prevX - mouse.x
      const deltaY = mouse.prevY - mouse.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      mouse.speed += (distance - mouse.speed) * .35
      mouse.prevX = mouse.x
      mouse.prevY = mouse.y
      engagement += (Math.min(mouse.speed / 5, 1) - engagement) * .06
      if (engagement < .001) engagement = 0
      glowOpacity += (engagement - glowOpacity) * .08

      if (glow) {
        glow.setAttribute('cx', mouse.x)
        glow.setAttribute('cy', mouse.y)
        glow.style.opacity = glowOpacity
      }

      context.clearRect(0, 0, size.width, size.height)
      const gradient = context.createLinearGradient(0, 0, size.width, size.height)
      gradient.addColorStop(0, props.gradientFrom)
      gradient.addColorStop(1, props.gradientTo)
      context.fillStyle = gradient
      context.beginPath()

      dots.forEach((dot, index) => {
        const dx = mouse.x - dot.x
        const dy = mouse.y - dot.y
        const distanceSquared = dx * dx + dy * dy
        if (!reducedMotion && distanceSquared < cursorRadiusSquared && engagement > .01) {
          const cursorDistance = Math.sqrt(distanceSquared)
          const force = (1 - cursorDistance / props.cursorRadius) ** 2 * props.bulgeStrength * engagement
          const angle = Math.atan2(dy, dx)
          dot.currentX += (dot.x - Math.cos(angle) * force - dot.currentX) * .15
          dot.currentY += (dot.y - Math.sin(angle) * force - dot.currentY) * .15
        } else {
          dot.currentX += (dot.x - dot.currentX) * .1
          dot.currentY += (dot.y - dot.currentY) * .1
        }

        let drawX = dot.currentX
        let drawY = dot.currentY
        if (!reducedMotion && props.waveAmplitude > 0) {
          drawY += Math.sin(dot.x * .03 + time) * props.waveAmplitude
          drawX += Math.cos(dot.y * .03 + time * .7) * props.waveAmplitude * .5
        }
        const sparkleScale = props.sparkle && ((index * 2654435761) ^ (frame >> 3)) % 100 < 3 ? 1.8 : 1
        const drawRadius = radius * sparkleScale
        context.moveTo(drawX + drawRadius, drawY)
        context.arc(drawX, drawY, drawRadius, 0, TWO_PI)
      })
      context.fill()
    }

    const tick = () => {
      tickCount += 1
      draw(tickCount)
      if (active && !document.hidden && !reducedMotion) {
        frameRef.current = window.requestAnimationFrame(tick)
      }
    }

    const resize = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        size.width = rect.width
        size.height = rect.height
        canvas.width = Math.round(rect.width * dpr)
        canvas.height = Math.round(rect.height * dpr)
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        buildDots()
        draw(tickCount)
      })
    }

    const onPointerMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }
    const onVisibilityChange = () => {
      if (!document.hidden && active && !reducedMotion) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = window.requestAnimationFrame(tick)
      }
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      const nextActive = entry.isIntersecting
      if (nextActive === active) return
      active = nextActive
      window.cancelAnimationFrame(frameRef.current)
      if (active && !document.hidden && !reducedMotion) frameRef.current = window.requestAnimationFrame(tick)
    }, { rootMargin: '100px 0px' })
    const resizeObserver = new ResizeObserver(resize)

    resize()
    visibilityObserver.observe(container)
    resizeObserver.observe(container)
    if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      active = false
      window.cancelAnimationFrame(frameRef.current)
      window.cancelAnimationFrame(resizeFrame)
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <div className="dot-field-container" {...rest}>
      <canvas ref={canvasRef} />
      <svg aria-hidden="true">
        <defs>
          <radialGradient id={glowId}>
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle ref={glowRef} cx="-9999" cy="-9999" r={glowRadius} fill={`url(#${glowId})`} />
      </svg>
    </div>
  )
})

DotField.displayName = 'DotField'

export default DotField
