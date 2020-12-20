import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import ClubDojo from './ClubDojo'

export default class Club extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description?: string

  @column()
  public logo: string

  @column()
  public link: string

  @hasMany(() => ClubDojo)
  public dojos: HasMany<typeof ClubDojo>

  @column()
  public website?: string

  @column()
  public email: string

  @column()
  public phoneNumbers?: string[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
