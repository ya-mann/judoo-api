import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ClubDojo from './ClubDojo'

export default class ClubDojoTimetable extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clubDojoId: number

  @column()
  public day: string

  @column()
  public from: string

  @column()
  public to: string

  @column()
  public description: string

  @belongsTo(() => ClubDojo)
  public clubDojo: BelongsTo<typeof ClubDojo>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
