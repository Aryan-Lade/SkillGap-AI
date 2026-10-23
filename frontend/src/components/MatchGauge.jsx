import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function MatchGauge({ percentage }) {
  const svgRef = useRef(null)

  const pct = Math.max(0, Math.min(100, percentage ?? 0))

  const color = pct >= 75 ? '#c6fd50' : pct >= 50 ? '#ffd15c' : '#ff7660'
  const label = pct >= 75 ? '⚡ Strong Match Fit' : pct >= 50 ? '📈 Moderate Foundation' : '🎯 Growth Opportunity'

  useEffect(() => {
    if (!svgRef.current) return

    const width = 280
    const height = 160
    const cx = width / 2
    const cy = height - 20
    const r = 120
    const strokeW = 20

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')

    const arcBg = d3.arc()
      .innerRadius(r - strokeW)
      .outerRadius(r)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)

    svg.append('path')
      .attr('d', arcBg)
      .attr('transform', `translate(${cx},${cy})`)
      .attr('fill', '#e5e5df')
      .attr('stroke', '#131311')
      .attr('stroke-width', 1.5)

    const arcFg = d3.arc()
      .innerRadius(r - strokeW)
      .outerRadius(r)
      .startAngle(-Math.PI / 2)
      .cornerRadius(strokeW / 2)

    const endAngle = -Math.PI / 2 + (Math.PI * pct) / 100

    const path = svg.append('path')
      .attr('transform', `translate(${cx},${cy})`)
      .attr('fill', color)
      .attr('stroke', '#131311')
      .attr('stroke-width', 1.5)

    path.transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attrTween('d', () => {
        const interp = d3.interpolate(-Math.PI / 2, endAngle)
        return (t) => arcFg.endAngle(interp(t))()
      })

    const ticks = [0, 25, 50, 75, 100]
    ticks.forEach((tick) => {
      const angle = -Math.PI / 2 + (Math.PI * tick) / 100
      const x = cx + (r + 12) * Math.cos(angle)
      const y = cy + (r + 12) * Math.sin(angle)
      svg.append('text')
        .attr('x', x).attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#71716b')
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .text(tick)
    })

    svg.append('text')
      .attr('x', cx).attr('y', cy - 28)
      .attr('text-anchor', 'middle')
      .attr('fill', '#131311')
      .attr('font-size', '44px')
      .attr('font-weight', '900')
      .attr('font-family', 'var(--font-display)')
      .text('0%')
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .tween('text', function () {
        const interp = d3.interpolateNumber(0, pct)
        return (t) => { d3.select(this).text(`${Math.round(interp(t))}%`) }
      })

    svg.append('text')
      .attr('x', cx).attr('y', cy - 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#71716b')
      .attr('font-size', '11px')
      .attr('font-weight', '800')
      .attr('letter-spacing', '1.5px')
      .text('MATCH SCORE')

  }, [pct, color])

  return (
    <div className="neo-card animate-fadeIn" style={{ textAlign: 'center' }}>
      <div className="section-title" style={{ justifyContent: 'center' }}>
        <span style={{ background: 'var(--accent-lime)', padding: '2px 8px', borderRadius: 6, border: 'var(--border-main)' }}>🎯</span>
        Role Readiness Score
      </div>
      <div style={{ position: 'relative', maxWidth: 280, margin: '0 auto' }}>
        <svg ref={svgRef} />
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        background: color === '#c6fd50' ? 'var(--accent-lime)' : color,
        border: 'var(--border-main)',
        borderRadius: 999,
        padding: '0.35rem 1rem',
        fontSize: '0.85rem', fontWeight: 800,
        color: '#131311',
        boxShadow: 'var(--shadow-sm)',
        marginTop: '0.5rem',
      }}>
        {label}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
        {pct >= 75
          ? "You're exceptionally well-positioned. A few specialization skills will secure your interviews."
          : pct >= 50
          ? "Solid foundation. Complete the targeted intermediate roadmap skills to stand out."
          : "Focus on the foundational skills first to build an unshakeable technical baseline."}
      </p>
    </div>
  )
}
