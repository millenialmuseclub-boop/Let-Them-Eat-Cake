/**
 * ISO 3166-1 numeric codes for Atlas countries, matched against the `id` field on
 * each feature in world-atlas/countries-110m.json (via topojson-client) so the map's
 * country shapes -- not just the small pin markers -- can be tapped to select a country.
 * Small island nations and the 110m map's single "United Kingdom" landmass (which
 * England/Scotland/Wales all share) simply won't resolve to a shape and keep working
 * through their existing pin only -- no regression, just no shape tap for those few.
 */
export const ATLAS_COUNTRY_ISO_NUMERIC: Record<string, string> = {
  Argentina: '32',
  Armenia: '51',
  Australia: '36',
  Austria: '40',
  Barbados: '52',
  Belgium: '56',
  Brazil: '76',
  Bulgaria: '100',
  Canada: '124',
  Chile: '152',
  China: '156',
  Colombia: '170',
  Croatia: '191',
  Cuba: '192',
  'Czech Republic': '203',
  Denmark: '208',
  'Dominican Republic': '214',
  Egypt: '818',
  England: '826',
  Finland: '246',
  France: '250',
  Georgia: '268',
  Germany: '276',
  Greece: '300',
  Hungary: '348',
  Iceland: '352',
  India: '356',
  Indonesia: '360',
  Iran: '364',
  Ireland: '372',
  Italy: '380',
  Jamaica: '388',
  Japan: '392',
  Lebanon: '422',
  Lithuania: '440',
  Malaysia: '458',
  Mauritius: '480',
  Mexico: '484',
  Morocco: '504',
  Netherlands: '528',
  'New Zealand': '554',
  Nigeria: '566',
  Norway: '578',
  Peru: '604',
  Philippines: '608',
  Poland: '616',
  Portugal: '620',
  'Puerto Rico': '630',
  Romania: '642',
  Russia: '643',
  Scotland: '826',
  Singapore: '702',
  'South Africa': '710',
  'South Korea': '410',
  Spain: '724',
  Sweden: '752',
  Switzerland: '756',
  Thailand: '764',
  'Trinidad and Tobago': '780',
  Turkey: '792',
  Ukraine: '804',
  'United Kingdom': '826',
  'United States': '840',
  Uruguay: '858',
  Vietnam: '704',
  Wales: '826',
}

/** Reverse lookup built once: topojson feature id -> our country name(s). Multiple countries can share an id (e.g. UK). */
export function getCountriesForIsoNumeric(id: string): string[] {
  const normalized = String(Number(id))
  return Object.entries(ATLAS_COUNTRY_ISO_NUMERIC)
    .filter(([, code]) => code === normalized)
    .map(([country]) => country)
}
