import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hold from 'App/Models/Hold'
import HoldUpdateValidator from 'App/Validators/HoldUpdateValidator'
import HoldValidator from 'App/Validators/HoldValidator'

export default class HoldsController {
  public index() {
    return Hold.all()
  }

  public show({ params }: HttpContextContract) {
    return Hold.find(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.validate(HoldValidator)
    return Hold.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const data = await request.validate(HoldUpdateValidator)
    return Hold.updateOrCreate({ id: params.id, ...data }, data)
  }
}
