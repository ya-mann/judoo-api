import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HoldValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.unique({ table: 'holds', column: 'name' })]),
    description: schema.string(),
    image: schema.string(),
  })

  public messages = {}
}
