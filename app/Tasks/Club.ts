import { BaseTask } from 'adonis5-scheduler/build'
import Club from 'App/Models/Club'
import got from 'got'
import { JSDOM } from 'jsdom'

interface Timetable {
  day: string
  from: string
  to: string
  description: string
}

interface Dojo {
  id: number
  name: string
  address: string
  phoneNumber?: string
  timetables?: Array<Timetable>
}

interface ClubData {
  id: number
  logo: string
  link: string
  name: string
  dojos: Dojo[]
  website?: string
  phoneNumbers?: string[]
  email: string
  description?: string
}

const INFORMATIONS_KEYS = {
  'E-Mail :': 'email',
  'Téléphone :': 'phoneNumber',
  'Portable :': 'phoneNumber',
  'Site internet :': 'website',
} as const

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\s/g, '')
}

export default class ClubTask extends BaseTask {
  public static get schedule() {
    return '0 0 0 */1 * *'
  }
  public static get useLock() {
    return false
  }

  public async handle() {
    await this.registerClubs(0) // all clubs
    console.log('Finished the indexing of')
  }

  private async fetchPage(url: string): Promise<Document> {
    const { body } = await got.get(url)
    return new JSDOM(body).window.document
  }

  private async registerClubs(page = 1): Promise<void> {
    const document = await this.fetchPage(
      `https://www.ffjudo.com/lesclubs/liste/${page}?discipline=0`
    )
    const clubs = document.querySelectorAll<HTMLLinkElement>('#lst_dojos a')
    const duplicates = new Set<number>()
    for (let i = 0; i < clubs.length; i++) {
      const item = clubs[i]
      const data = await this.getClub({
        link: item.href,
        name: item.getElementsByClassName('s_nom_club')[0].textContent!,
      })
      if (!data || duplicates.has(data.id)) continue
      duplicates.add(data.id)
      const { dojos: dojosData, ...clubData } = data
      const club = await Club.updateOrCreate(clubData, clubData)
      dojosData.forEach(async ({ timetables, ...dojoData }) => {
        const dojo = await club.related('dojos').updateOrCreate(dojoData, dojoData)
        if (timetables) {
          dojo.related('timetables').updateOrCreateMany(timetables)
        }
      })
    }
  }

  private async getClub(data: Pick<ClubData, 'name' | 'link'>): Promise<ClubData | void> {
    const document = await this.fetchPage(data.link)
    const [, id, discipline] = document
      .getElementsByTagName('h2')[0]
      .textContent!.match(/Code : (\d+) \/ Discipline : (.+)/i)!
    if (discipline.trim() !== 'JUDO JUJITSU') return
    const informations = Array.from(
      document.querySelectorAll<HTMLLIElement>('#infos-club li')
    ).reduce((acc, element) => {
      const key: typeof INFORMATIONS_KEYS[keyof typeof INFORMATIONS_KEYS] =
        INFORMATIONS_KEYS[element.getElementsByTagName('span')[0].textContent!]
      const value = element.getElementsByTagName('strong')[0].textContent!
      if (key === 'phoneNumber') {
        ;(acc.phoneNumbers ? acc.phoneNumbers : (acc.phoneNumbers = [])).push(
          normalizePhoneNumber(value)
        )
      } else if (key !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as Pick<ClubData, 'phoneNumbers' | 'email' | 'website'>)
    const dojos = Array.from(document.querySelectorAll<HTMLLIElement>('#dojos li')).map(
      (element) => {
        const [, name, address] = element
          .getElementsByTagName('strong')[0]
          .textContent!.match(/Dojo \((\w+)\)\s*(.+)/i)!
        const data = {
          id: parseInt(element.id, 10),
          name,
          address,
        } as Dojo
        const phoneNumber = element.getElementsByTagName('p')[1]?.textContent
        if (phoneNumber) data.phoneNumber = normalizePhoneNumber(phoneNumber).substring(10)
        const timetable = element.getElementsByTagName('tr')
        if (timetable.length > 0) {
          data.timetables = Array.from(timetable).map(({ children }) => {
            const fields = Array.from(children) as HTMLTableDataCellElement[]
            return {
              day: fields[0].textContent,
              from: fields[1].textContent,
              to: fields[2].textContent,
              description: fields[3].textContent,
            } as Timetable
          })
        }
        return data
      }
    )
    const club: ClubData = {
      ...data,
      ...informations,
      id: parseInt(id, 10),
      logo: document.querySelector<HTMLImageElement>('#zone-photo img')!.src,
      dojos,
    }
    const description = document.querySelector<HTMLParagraphElement>('#desc-club > p')?.textContent
    if (description) club.description = description
    return club
  }
}
