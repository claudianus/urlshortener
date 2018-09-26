const { hooks } = require('@adonisjs/ignitor')
const base62 = require('base62/lib/ascii')

hooks.after.providersBooted(() => {
  const View = use('View')
  const Env = use('Env')
  View.global('base62', (number) => base62.encode(number))
  View.global('getEnv', (envkey) => Env.get(envkey))
})