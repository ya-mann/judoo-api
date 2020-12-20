import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clubs extends BaseSchema {
  public async up() {
    this.schema.createTable('clubs', (table) => {
      table.integer('id').primary()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.specificType('phone_numbers', 'varchar(14)[]').nullable()
      table.string('website').nullable()
      table.string('email').notNullable()
      table.string('logo').notNullable()
      table.string('link').notNullable()
      table.timestamps()
    })
    this.schema.createTable('club_dojos', (table) => {
      table.integer('id').primary()
      table.integer('club_id').notNullable().unsigned().references('id').inTable('clubs')
      table.string('name').notNullable()
      table.string('phone_number', 14).nullable()
      table.string('address').notNullable()
      table.timestamps()
    })
    this.schema.createTable('club_dojo_timetables', (table) => {
      table.increments('id').notNullable()
      table.integer('club_dojo_id').notNullable().unsigned().references('id').inTable('club_dojos')
      table.string('day', 8).notNullable()
      table.string('from', 5).notNullable()
      table.string('to', 5).notNullable()
      table.string('description').notNullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.raw('DROP TABLE clubs CASCADE')
    this.schema.raw('DROP TABLE club_dojos CASCADE')
    this.schema.raw('DROP TABLE club_dojo_timetables CASCADE')
  }
}
