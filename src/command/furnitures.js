const { fetchMany, fetchJson } = require('../functions')
const { config } = require('../utils')

async function parse (json) {
  const all = [
    ...json.roomitemtypes.furnitype,
    ...json.wallitemtypes.furnitype,
  ]

  const map = []

  all.forEach((item) => {
    map.push(
      { revision: item.revision, name: `${item.classname.replace('*', '_')}_icon.png` },
      { revision: item.revision, name: `${item.classname.split('*')[0]}.swf` },
    )
  })

  return new Set(map)
}

async function handle () {
  const conf = await config()

  const json = await fetchJson(`https://www.habbo.${conf.domain}/gamedata/furnidata_json/0`)
  const all = await parse(json)

  await fetchMany([...all].map((item) => {
    return {
      src: `https://images.habbo.com/dcr/hof_furni/${item.revision}/${item.name}`,
      dst: (conf.revision)
        ? `resource/dcr/hof_furni/${item.revision}/${item.name}`
        : `resource/dcr/hof_furni/${item.name}`
    }
  }))
}

module.exports = handle
