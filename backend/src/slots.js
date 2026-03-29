/**
 * Build bookable slot starts (Date) for a calendar day from ranges and step minutes.
 */
export function slotsForDay(dayConfig, dayDate, slotStepMinutes) {
  if (!dayConfig?.enabled || !dayConfig.ranges?.length) return []

  const y = dayDate.getFullYear()
  const mo = dayDate.getMonth()
  const d = dayDate.getDate()
  const out = []

  for (const range of dayConfig.ranges) {
    const startM = parseHm(range.start)
    const endM = parseHm(range.end)
    if (startM >= endM) continue
    for (let t = startM; t + slotStepMinutes <= endM; t += slotStepMinutes) {
      const hh = Math.floor(t / 60)
      const mm = t % 60
      out.push(new Date(y, mo, d, hh, mm, 0, 0))
    }
  }
  return out.sort((a, b) => a.getTime() - b.getTime())
}

function parseHm(s) {
  const [h, m] = String(s).split(':').map((x) => parseInt(x, 10))
  if (Number.isNaN(h) || Number.isNaN(m)) return 0
  return h * 60 + m
}

export function formatSlotLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd
}
