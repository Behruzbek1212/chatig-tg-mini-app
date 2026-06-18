import { defineComponent, h } from 'vue'

const svgAttrs = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function makeIcon(paths) {
  return defineComponent({
    name: 'Icon',
    props: { size: { type: [Number, String], default: 24 }, class: { type: String, default: '' } },
    setup(props) {
      return () =>
        h(
          'svg',
          { viewBox: '0 0 24 24', width: props.size, height: props.size, class: props.class, ...svgAttrs },
          paths.map((p) => h(p.tag || 'path', p)),
        )
    },
  })
}

export const Icon = {
  Cart: makeIcon([
    { tag: 'circle', cx: 9, cy: 20, r: 1.4 },
    { tag: 'circle', cx: 18, cy: 20, r: 1.4 },
    { d: 'M2 3h3l2.5 13h11l2-9H6' },
  ]),
  Search: makeIcon([{ tag: 'circle', cx: 11, cy: 11, r: 7 }, { d: 'M21 21l-4-4' }]),
  Plus: makeIcon([{ d: 'M12 5v14M5 12h14' }]),
  Minus: makeIcon([{ d: 'M5 12h14' }]),
  Trash: makeIcon([{ d: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6' }]),
  Check: makeIcon([{ d: 'M20 6L9 17l-5-5' }]),
  Box: makeIcon([
    { d: 'M21 8l-9-5-9 5 9 5 9-5z' },
    { d: 'M3 8v8l9 5 9-5V8' },
    { d: 'M12 13v8' },
  ]),
  Back: makeIcon([{ d: 'M15 18l-6-6 6-6' }]),
}
