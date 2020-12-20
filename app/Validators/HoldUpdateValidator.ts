import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HoldValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [
      rules.unique({ table: 'holds', column: 'name' }),
      rules.requiredIfNotExistsAll(['description', 'image']),
    ]),
    description: schema.string.optional({}, [rules.requiredIfNotExistsAll(['name', 'image'])]),
    image: schema.string.optional({}, [rules.requiredIfNotExistsAll(['name', 'image'])]),
  })

  public messages = {}
}
