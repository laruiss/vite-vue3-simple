import {
  prepareAffaireForLocalForage,
  prepareAffaireForPersistance,
} from './affaire-util'
import { AFFAIRE_STATES_READY_TO_SEND, AFFAIRE_STATES_SENT } from '@/views/utils/cases-utils'

describe('prepareAffaireForLocalForage', () => {
  it('Should clean up beginDateTime, endDateTime and victimDOB, and add otherAddressCheck', () => {
    const affaire = {
      endDateTime: new Date('2020-01-02'),
      beginDateTime: new Date('2020-01-01'),
      victimDOB: '1984-02-02',
    }
    const preparedAffaire = prepareAffaireForLocalForage(affaire)

    expect(preparedAffaire).not.toHaveProperty('beginDateTime')
    expect(preparedAffaire).toHaveProperty('beginDate')
    expect(preparedAffaire).toHaveProperty('beginTime')
    expect(preparedAffaire).not.toHaveProperty('endDateTime')
    expect(preparedAffaire).toHaveProperty('endDate')
    expect(preparedAffaire).toHaveProperty('endTime')
    expect(preparedAffaire.victimDOB).toBe('1984-02-02')
    expect(preparedAffaire.otherAddressCheck).toBe(false)
  })

  it('Should add otherAddressCheck and set it to true', () => {
    const affaire = {
      otherAddress: '3 rue Pasteur',
    }
    const preparedAffaire = prepareAffaireForLocalForage(affaire)

    expect(preparedAffaire.otherAddressCheck).toBe(true)
  })

  it('Should replace', () => {
    const affaire = {
      endDate: '2020-01-02',
      endTime: '00:00:00',
      beginDate: '2020-01-01',
      beginTime: '00:00:00',
      victimDOB: '1984-02-03 0:21:21',
      otherAddress: '',
      status: AFFAIRE_STATES_READY_TO_SEND,
    }

    const preparedAffaire = prepareAffaireForPersistance(affaire)

    expect(preparedAffaire).toHaveProperty('beginDateTime')
    expect(preparedAffaire).not.toHaveProperty('beginDate')
    expect(preparedAffaire).not.toHaveProperty('beginTime')
    expect(preparedAffaire).toHaveProperty('endDateTime')
    expect(preparedAffaire).not.toHaveProperty('endDate')
    expect(preparedAffaire).not.toHaveProperty('endTime')
    expect(preparedAffaire).not.toHaveProperty('otherAddressCheck')
    expect(preparedAffaire).not.toHaveProperty('otherAddress')
  })

  it('Should replace', () => {
    const affaire = {
      otherAddressCheck: true,
      otherAddress: '12 rue Pasteur, Paris 15',
      status: AFFAIRE_STATES_SENT,
    }

    const preparedAffaire = prepareAffaireForPersistance(affaire)

    expect(preparedAffaire).not.toHaveProperty('beginDateTime')
    expect(preparedAffaire).not.toHaveProperty('beginDate')
    expect(preparedAffaire).not.toHaveProperty('beginTime')
    expect(preparedAffaire).not.toHaveProperty('endDateTime')
    expect(preparedAffaire).not.toHaveProperty('endDate')
    expect(preparedAffaire).not.toHaveProperty('endTime')
    expect(preparedAffaire).not.toHaveProperty('otherAddressCheck')
    expect(preparedAffaire).toHaveProperty('otherAddress')
  })
})
