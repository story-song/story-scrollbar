export function mustNumArg (fn) {
  return function (...args) {
    const t = args.map(arg => {
      typeof arg !== 'number' && (arg = Number(arg))
      if (isNaN(arg)) {
        arg = 0
      }
      return arg
    })
    return fn.apply(this, t)
  }
}

export const transformToPercent = mustNumArg((a, b, n = 2) => {
  return ((a / b) * 100).toFixed(n) + '%'
})

export const transformToMorePx = mustNumArg((val, px = 15) => {
  return (val + px) + 'px'
})
