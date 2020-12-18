import { BaseTask } from 'adonis5-scheduler/build'

export default class Club extends BaseTask {
  public static get schedule() {
    return '0 0 0 */1 * *'
  }
  public static get useLock() {
    return true
  }

  public async handle() {
    // TODO: index all clubs
  }
}
