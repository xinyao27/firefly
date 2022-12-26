import type { Preset } from 'unocss'
import { browserslistToTargets, transformStyleAttribute } from 'lightningcss'
import browserslist from 'browserslist'

export default function autoprefixerPreset(targets: string[] = [
  '>= 0.25%',
  'last 2 versions',
  'not dead',
  'not ie <= 11',
  'Android >= 4.0',
  'iOS >= 8',
]): Preset {
  return {
    name: 'unocss-preset-autoprefixer',
    postprocess: (util) => {
      const entries = util.entries

      const filteredUno = entries.filter(item => !item[0].startsWith('--un'))
      const transformed = filteredUno.reduce<[string, string | number][]>((acc, cur) => {
        const { code } = transformStyleAttribute({
          code: Buffer.from(cur.join(':')),
          targets: browserslistToTargets(browserslist(targets)),
        })
        const item = code.toString().split(';').map(i => i.split(':').map(j => j.replace(/\s/g, ''))) as [string, string | number][]
        return acc.concat(item)
      }, [])

      util.entries = [
        ...entries.filter(item => item[0].startsWith('--un')),
        ...transformed,
      ]
    },
  }
}
