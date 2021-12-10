import inProgress from '@/assets/icons/in-progress.svg'
import readyToSend from '@/assets/icons/ready-to-send.svg'
import sent from '@/assets/icons/sent.svg'
import processingByIJ from '@/assets/icons/processing.svg'
import waitingForResults from '@/assets/icons/waiting.svg'
import resultsAvailable from '@/assets/icons/results-available.svg'
import { identity } from '@/util/func-util.js'
// import { faCheck, faHandPaper, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export const AgGridLocaleText = {
  of: 'de',
  contains: 'Contient',
  equals: '=',
  notEqual: '<>',
  lessThan: '<',
  greaterThan: '>',
  lessThanOrEqual: '<=',
  greaterThanOrEqual: '>=',
  inRange: 'entre',
  notContains: 'Ne contient pas',
  startsWith: 'Commence par',
  endsWith: 'Finit par',
  AND: 'Et',
  OR: 'Ou',
  noRowsToShow: 'Liste vide',
}

export const AFFAIRE_STATES_IN_PROGRESS = 'inProgress'
export const AFFAIRE_STATES_READY_TO_SEND = 'readyToSend'
export const AFFAIRE_STATES_SENT = 'sent'
export const AFFAIRE_STATES_PROCESSING_BY_IJ = 'processingByIJ'
export const AFFAIRE_STATES_WAITING_FOR_RESULTS = 'waitingForResults'
export const AFFAIRE_STATES_RESULTS_AVAILABLE = 'resultsAvailable'

export const AFFAIRES_STATES_LABELS = {
  [AFFAIRE_STATES_IN_PROGRESS]: 'En saisie',
  [AFFAIRE_STATES_READY_TO_SEND]: 'À envoyer',
  [AFFAIRE_STATES_SENT]: 'Envoyée',
  [AFFAIRE_STATES_PROCESSING_BY_IJ]: 'En cours',
  [AFFAIRE_STATES_WAITING_FOR_RESULTS]: 'En attente de résultats',
  [AFFAIRE_STATES_RESULTS_AVAILABLE]: 'Résultats disponibles',
}

export const AFFAIRE_GPS_FROM_API = 'gpsFromApi'
export const AFFAIRE_GPS_MANUAL = 'gpsManual'
export const AFFAIRE_GPS_MISSING = 'gpsMissing'

export const AFFAIRES_GPS_LABELS = {
  [AFFAIRE_GPS_FROM_API]: 'Saisie automatique',
  [AFFAIRE_GPS_MANUAL]: 'Saisie manuelle',
  [AFFAIRE_GPS_MISSING]: 'Données manquantes',
}

export const icons = {
  [AFFAIRE_STATES_IN_PROGRESS]: {
    label: AFFAIRES_STATES_LABELS[AFFAIRE_STATES_IN_PROGRESS],
    icon: inProgress,
  },
  [AFFAIRE_STATES_READY_TO_SEND]: {
    label: AFFAIRES_STATES_LABELS[AFFAIRE_STATES_READY_TO_SEND],
    icon: readyToSend,
  },
  [AFFAIRE_STATES_SENT]: {
    label: AFFAIRES_STATES_LABELS[AFFAIRE_STATES_SENT],
    icon: sent,
  },
  [AFFAIRE_STATES_PROCESSING_BY_IJ]: {
    label: AFFAIRES_STATES_LABELS[AFFAIRE_STATES_PROCESSING_BY_IJ],
    icon: processingByIJ,
  },
  [AFFAIRE_STATES_WAITING_FOR_RESULTS]: {
    label: AFFAIRES_STATES_LABELS[AFFAIRE_STATES_WAITING_FOR_RESULTS],
    icon: waitingForResults,
  },
  [AFFAIRE_STATES_RESULTS_AVAILABLE]: {
    label: AFFAIRES_STATES_LABELS[AFFAIRE_STATES_RESULTS_AVAILABLE],
    icon: resultsAvailable,
  },
  [AFFAIRE_GPS_FROM_API]: {
    label: AFFAIRES_GPS_LABELS[AFFAIRE_GPS_FROM_API],
    // icon: faCheck.icon[4],
    fill: 'green',
  },
  [AFFAIRE_GPS_MANUAL]: {
    label: AFFAIRES_GPS_LABELS[AFFAIRE_GPS_MANUAL],
    // icon: faHandPaper.icon[4],
    fill: 'orange',
  },
  [AFFAIRE_GPS_MISSING]: {
    label: AFFAIRES_GPS_LABELS[AFFAIRE_GPS_MISSING],
    // icon: faExclamationTriangle.icon[4],
    fill: 'red',
  },
}

export const statusRenderer = ({ value }) => {
  const statusValue = value || AFFAIRE_STATES_IN_PROGRESS
  return `<span class="psij-affaire-status-icon">${icons[statusValue].icon}</span><span class="psij-affaire-status-label">${icons[statusValue].label}</span>`
}

export const infractionRenderer = ({ value }) => {
  return value === 'with-breaking'
    ? 'VPE'
    : value === 'without-breaking'
      ? 'VPE (tentative)'
      : ''
}

export const gpsRenderer = ({ value }) => {
  const gpsValue = value || AFFAIRE_GPS_MISSING
  return `<span class="psij-affaire-gps-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="1em"><path d="${icons[gpsValue].icon}" fill="${icons[gpsValue].fill}"/></svg><span class="psij-affaire-gps-label">${icons[gpsValue].label}</span></span>`
}

export const transformToCaseInfo = (currentCase, dict) => dict.map(caseInfo =>
  caseInfo.map(
    ([key, title, fn, classname = '']) => (
      [
        title,
        (fn || identity)(currentCase[key]),
        classname,
      ]
    ),
  ),
)

export const filterElementFromConditionalArray = (el, conditional) => conditional.forEach(cond => el.includes(cond))

export const cadreJuridique = (value) => value === 'flagrant-delit' ? 'Flagrant délit' : 'Enquête préliminaire'

export const traductionInfraction = (value) => value === 'with-breaking' ? 'Vol par effraction' : 'Tentative de vol par effraction'

export const residenceSecondaire = (value) => value === true ? 'Oui' : 'Non'

export const formatTextIjNotCome = (value) => value === false ? 'Oui' : value === true ? 'Non' : ''

export const hasNoPhoneNumber = (value) => value === true ? 'La victime n\'a pas de numéro de téléphone' : null
export const hasPhoneNumber = (value) => !!value === true ? value : null

export const hasNoPhoneRequerantNumber = (value) => value === true ? 'Le requerant n\'a pas de numéro de téléphone' : null

export const formatLatitude = (value) => parseFloat(value).toFixed(6)
export const formatLongitude = (value) => parseFloat(value).toFixed(6)

export const selectionsDictionary = {
  'arrachage-canon': 'Arrachage canon',
  pesee: 'Pesée',
  'bris-de-vitre': 'Bris de vitre',
  'cle-boite-lettres': 'Clef laissée dans la boîte aux lettres',
  'usage-de-fausses-cles': 'Usage de fausses clefs',
  percage: 'Perçage',
  enfoncement: 'Enfoncement',
  'sans-effraction': 'Sans effraction (ouvrant laissé ouvert)',
  decoupe: 'Découpe',
  escalade: 'Escalade',
  autre: 'Autre',
}

export const getOperationalModeSelections = selections => selections
  ? Array.from(selections).map(selection => selectionsDictionary[selection]).join(', ')
  : ''

export const maritalStatusDictionary = {
  spouse: 'Époux·se',
  divorced: 'Divorcé·e',
  widowed: 'Veuf·ve',
}

export const getMaritalStatus = maritalStatus => maritalStatusDictionary[maritalStatus] ? maritalStatusDictionary[maritalStatus] : null

export const locationTypeDictionary = {
  appartement: 'Appartement',
  house: 'Maison / Villa',
  shop: 'Commerce',
  company: 'Entreprise',
  school: 'Ecole',
  public: 'Etablissement public',
  otherType: 'Autre',
  codeVPE: 'VPE code 30',
  otherTypeDetails: '',
  codeVPEDetails: '',
  codeVPENumber: '',
}

export const getLocationType = locationType => locationTypeDictionary[locationType]

export const damageDictionary = {
  jewellery: 'Bijoux',
  cash: 'Numéraire',
  mobile: 'Téléphone',
  computing: 'Matériel informatique',
  hifi: 'TV hifi',
  gun: 'Armes',
  clothes: 'Vêtements',
  car: 'Véhicule',
  other: 'Autre',
}

export const getDamagesSelection = selectDamage => selectDamage
  ? Array.from(selectDamage).map(selectDamage => damageDictionary[selectDamage]).join(', ')
  : ''

export const defaultsToNull = x => x || null

export const defaultsToUndefined = x => x || undefined

export const formatDate = (value) => value?.split('-')?.reverse()?.join('/')

export const samplesMetadata = {
  papillary: 'Traces papillaires relevées',
  bio: 'Prélèvements biologiques',
  objects: 'Objets prélevés',
  regulars: 'Relevés de familiers',
  photos: 'Clichés photographiques',
}

const dateMetaData = [
  ['beginDate', 'Date de début des faits', formatDate],
  ['beginTime', 'Heure de début des faits'],
  ['endDate', 'Date de fin des faits', formatDate],
  ['endTime', 'Heure de fin des faits'],
  ['reportBeginDate', 'Date de début d\'intervention', formatDate],
  ['reportBeginTime', 'Heure de début d\'intervention'],
  ['reportEndDate', 'Date de fin d\'intervention', formatDate],
  ['reportEndTime', 'Heure de fin d\'intervention'],
]

export const infoCaseDictionaryBase = [
  [
    ['interventionBegin', 'Début d\'intervention'],
    ['owner', 'Rédacteur de l\'affaire'],
    ['users', 'intervenants'],
    ['service', 'Service saisi'],
  ],
  [
    ['frame', 'Cadre Juridique', cadreJuridique],
  ],
  [
    ['companyName', 'Raison Sociale'],
    ['requerantTitle', 'Civilité du requérant'],
    ['requerantLastname', 'Nom du requérant'],
    ['requerantMaritalStatus', 'Etat Civil du requérant', getMaritalStatus],
    ['requerantOtherLastname', 'Nom d\'usage'],
    ['requerantFirstname', 'Prénom du requérant'],
    ['requerantDOB', 'Date de naissance du requérant', formatDate],
    ['requerantPOB', 'Lieu de naissance du requérant'],
    ['requerantNoPhoneNumber', 'Numero de téléphone', hasNoPhoneRequerantNumber],
    ['requerantPhone', 'Numéro de téléphone'],
    ['requerantAddress', 'Adresse du requérant'],
    ['requerantLinkToVictim', 'Lien avec la victime'],
  ],
  [
    ['victimTitle', 'Civilité de la victime'],
    ['victimLastname', 'Nom de la victime'],
    ['maritalStatus', 'Etat Civil de la victime', getMaritalStatus],
    ['victimOtherLastname', 'Nom d\'usage'],
    ['victimFirstname', 'Prénom de la victime'],
    ['victimDOB', 'Date de naissance', formatDate],
    ['victimPOB', 'Lieu de naissance'],
    ['noPhoneNumber', 'Numéro de téléphone', hasNoPhoneNumber],
    ['phone', 'Numéro de téléphone', hasPhoneNumber],
    ['other', 'Autres précisions'],
    ['otherAddress', 'Autre adresse'],
    ['victimEmail', 'Adresse courriel de la victime'],
    ['secondaryResidence', 'résidence secondaire', residenceSecondaire],
  ],
  [
    ['address', 'Adresse des faits'],
    ['zipCode', 'Code postal'],
    ['city', 'Ville'],
    ['latitude', 'Latitude', formatLatitude],
    ['longitude', 'Longitude', formatLongitude],
    ['interphone', 'Interphone'],
    ['digicode', 'Digicode'],
    ['etage', 'Etage'],
  ],
  [
    ['breaking', 'Infraction', traductionInfraction],
    ['beginDate', 'Date de début', formatDate],
    ['beginTime', 'Heure'],
    ['endDate', 'Date de fin', formatDate],
    ['endTime', 'Heure'],
  ],
  [
    ['locationType', 'Nature du lieu', getLocationType],
    ['otherTypeDetails', 'Autres type de lieu', defaultsToNull],
    ['codeVPENumber', 'Nombre de code VPE', defaultsToNull],
    ['codeVPEDetails', 'Lieu relevant du VPE code 30', defaultsToNull],
    ['selections', 'Mode(s) opératoire(s)', getOperationalModeSelections],
    ['otherModeInput', 'Autres mode opératoire', defaultsToNull],
  ],
  [
    ['observation', 'Observations', defaultsToUndefined],
    ['damageTypes', 'Prejudices', getDamagesSelection],
    ['stolenMoney', 'Numéraire(Montant)'],
    ['otherDamage', 'Autres Préjudices'],
  ],
  [
    ['interventionEnd', 'Fin d\'intervention'],
    ['fullProcedureNumber', 'Numéro de procédure'],
  ],
  [
    ['intervenantsIJ', 'Intervenants de l\'Identité Judiciaire'],
  ],
  [
    ['IDC', 'Numéro IDC'],
    ['ij', 'Numéro IJ'],
  ],
  [
    ['ijNotCome', 'Déplacement de l\'identité Judiciaire', formatTextIjNotCome],
    ['reasonIjNotCome', 'Motifs', defaultsToNull],
  ],
]

export const infoCaseDictionary = [
  ...infoCaseDictionaryBase,
  Object.entries(samplesMetadata),
]

export const syncInfoCaseDictionary = infoCaseDictionary
  .flat()
  .concat([
    ...dateMetaData,
    ['countryCode', 'Code pays - Téléphone'],
  ])
  .reduce((acc, [id, label, transform]) => ({
    ...acc,
    [id]: { label, fn: transform || identity },
  })
  , {})
