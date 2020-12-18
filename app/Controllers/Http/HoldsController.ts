import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hold from 'App/Models/Hold'
import HoldValidator from 'App/Validators/HoldValidator'

export default class HoldsController {

  index() {
    return Hold.query().select('id').then(rows => rows.map(row => row.id))
  }

  show({ params }: HttpContextContract) {
    return Hold.find(params.id)
  }

  async store({ request }: HttpContextContract) {
    const data = await request.validate(HoldValidator)
    return Hold.create(data)
  }
}
