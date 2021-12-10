import {
  cadreJuridique,
  formatDate,
  icons,
  infractionRenderer,
  locationTypeDictionary,
  getLocationType,
  selectionsDictionary,
  getOperationalModeSelections,
  statusRenderer,
  transformToCaseInfo,
  traductionInfraction,
  syncInfoCaseDictionary,
  AFFAIRES_STATES_LABELS,
  AFFAIRE_STATES_IN_PROGRESS,
  AFFAIRE_STATES_SENT,
} from './cases-utils'

describe('cases-utils', () => {
  it('getLocationType', async () => {
    // Given
    const input = 'house'
    const expected = locationTypeDictionary[input]

    // When
    const result = await getLocationType(input)

    // Then
    expect(result).toBe(expected)
  })

  it('getOperationalModeSelections', async () => {
    // Given
    const mode = 'Pesée'
    const expected = selectionsDictionary[mode]
    // When

    const result = await getOperationalModeSelections[mode]

    // Then
    expect(result).toBe(expected)
  })

  it('transformToCaseInfo', async () => {
    // Given
    const caseInfo = { lastname: 'Bond' }
    const dict = [
      [
        ['lastname', "Nom d'usage"],
      ],
    ]

    const expected = [
      [
        ["Nom d'usage", 'Bond', ''],
      ],
    ]

    // When
    const result = await transformToCaseInfo(caseInfo, dict)

    // Then
    expect(result).toStrictEqual(expected)
  })

  it('transformToCaseInfo', async () => {
    // Given
    const caseInfo = { lastname: 'Bond' }
    const dict = [
      [
        ['lastname', "Nom d'usage", str => str.toUpperCase()],
      ],
    ]

    const expected = [
      [
        ["Nom d'usage", 'BOND', ''],
      ],
    ]

    // When
    const result = await transformToCaseInfo(caseInfo, dict)

    // Then
    expect(result).toStrictEqual(expected)
  })

  it('transformToCaseInfo', async () => {
    // Given
    const caseInfo = { lastname: 'Bond' }
    const dict = [
      [
        ['lastname', "Nom d'usage", str => str.toUpperCase(), 'text-center'],
      ],
    ]

    const expected = [
      [
        ["Nom d'usage", 'BOND', 'text-center'],
      ],
    ]

    // When
    const result = await transformToCaseInfo(caseInfo, dict)

    // Then
    expect(result).toStrictEqual(expected)
  })

  it('Should return "Flagrant délit"', () => {
    const phrase = cadreJuridique('flagrant-delit')
    expect(phrase).toBe('Flagrant délit')
  })

  it('Should return "Enquête préliminaire"', () => {
    const phrase = cadreJuridique('whatever')
    expect(phrase).toBe('Enquête préliminaire')
  })

  it('Should return "Vol par effraction"', () => {
    const phrase = traductionInfraction('with-breaking')
    expect(phrase).toBe('Vol par effraction')
  })

  it('Should return "Tentative de vol par effraction"', () => {
    const phrase = traductionInfraction('whatever')
    expect(phrase).toBe('Tentative de vol par effraction')
  })

  it('Should return "Pesée, Découpe"', () => {
    const phrase = getOperationalModeSelections(['pesee', 'decoupe'])
    expect(phrase).toBe('Pesée, Découpe')
  })

  it('Should return empty string ""', () => {
    const phrase = getOperationalModeSelections()
    expect(phrase).toBe('')
  })

  it('Should return empty string ""', () => {
    const phrase = getOperationalModeSelections([])
    expect(phrase).toBe('')
  })

  it('Should return short french formatted date', () => {
    const phrase = formatDate('2020-01-01')
    expect(phrase).toContain('01/01/2020')
  })

  it('Should return "VPE"', () => {
    const phrase = infractionRenderer({ value: 'with-breaking' })
    expect(phrase).toContain('VPE')
  })

  it('Should return "VPE (tentative)"', () => {
    const phrase = infractionRenderer({ value: 'without-breaking' })
    expect(phrase).toContain('VPE (tentative)')
  })

  it('Should return nothing', () => {
    const phrase = infractionRenderer({ value: null })
    expect(phrase).toContain('')
  })

  it('Should return "in progress" icon and label as default', () => {
    const statusValue = undefined
    const phrase = statusRenderer({ value: statusValue })
    expect(phrase).toContain(icons[AFFAIRE_STATES_IN_PROGRESS].icon)
    expect(phrase).toContain(icons[AFFAIRE_STATES_IN_PROGRESS].label)
    expect(phrase).toContain(AFFAIRES_STATES_LABELS[AFFAIRE_STATES_IN_PROGRESS])
  })

  it('Should return "in progress" icon and label', () => {
    const statusValue = AFFAIRE_STATES_IN_PROGRESS
    const phrase = statusRenderer({ value: statusValue })
    expect(phrase).toContain(icons[statusValue].icon)
    expect(phrase).toContain(icons[statusValue].label)
    expect(phrase).toContain(AFFAIRES_STATES_LABELS[AFFAIRE_STATES_IN_PROGRESS])
  })

  it('Should return "sent" icon and label', () => {
    const statusValue = AFFAIRE_STATES_SENT
    const phrase = statusRenderer({ value: statusValue })
    expect(phrase).toContain(icons[statusValue].icon)
    expect(phrase).toContain(icons[statusValue].label)
    expect(phrase).toContain(AFFAIRES_STATES_LABELS[AFFAIRE_STATES_SENT])
  })

  it('Check syncInfoCaseDictionary', () => {
    const expectedKeys = [
      'beginDate',
      'beginTime',
      'endDate',
      'endTime',
      'fullProcedureNumber',
      'reportBeginDate',
      'reportBeginTime',
      'reportEndDate',
      'reportEndTime',
    ]

    const result = syncInfoCaseDictionary

    for (const key of expectedKeys) {
      expect(key in result).toBe(true)
    }
  })
})
