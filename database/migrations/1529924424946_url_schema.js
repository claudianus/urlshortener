'use strict'

const Schema = use('Schema')

class UrlSchema extends Schema {
  up () {
    this.create('urls', (table) => {
      table.increments()
      table.string('url', 2000).notNullable()
      table.integer('hit').notNullable().unsigned().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('urls')
  }
}

module.exports = UrlSchema
