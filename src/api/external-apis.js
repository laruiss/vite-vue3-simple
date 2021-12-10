/**
 * Objet regroupant les fonctions pour communiquer avec des API externes
 *
 * @module
 * @exports
 */
import { xhrClient } from './xhr-client.js'

/**
 * @type {string}
 */
export const apiAdresse = 'https://api-adresse.data.gouv.fr/search/'

/**
 * @typedef {ExternalApiClient}
 * @type {Object}
 *
 * @property {Object} geoloc - Objet contenant des fonctions permettant de communiquer avec des
 *                             API RESTful externes
 * @property {AddressSearchFunction} addressSearch - Fonction pour récupérér une liste d'adresse depuis `api-adresse.data.gouv.fr`
 */
export default {
  geoloc: {
    /**
     * Récupère une liste d'adresse complètes à partir d'éléments de l'adresse
     * pour une autocomplétion d'un champs adresse
     *
     * @typedef AddressSearchFunction
     *
     * @async
     * @function
     *
     * @param {string} query - Élements de l'adresse à rechercher
     * @param {number=} autocomplete - mode autocomplete (1) ou non (0) de l'API. (cf. https://geo.api.gouv.fr/adresse)
     * @param {('housenumber' | 'street' | 'locality' | 'municipality')=} type - type de résulat trouvé, 'housenumber' par défaut (cf. https://geo.api.gouv.fr/adresse)
     */
    async addressSearch (query, autocomplete, type) {
      const res = await xhrClient.get(apiAdresse, {
        params: {
          q: query,
          autocomplete,
          type,
        },
      })
      return res
    },
  },
}
