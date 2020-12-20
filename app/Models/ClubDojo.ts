import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ClubDojoTimetable from './ClubDojoTimetable'
import Club from './Club'

export default class ClubDojo extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public phoneNumber?: string

  @column()
  public address: string

  @column()
  public clubId: number

  @belongsTo(() => Club)
  public club: BelongsTo<typeof Club>

  @hasMany(() => ClubDojoTimetable)
  public timetables: HasMany<typeof ClubDojoTimetable>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
