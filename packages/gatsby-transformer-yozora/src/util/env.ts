/**
 * Check if under the production env.
 */
export const isEnvProduction: boolean = process.env.NODE_ENV !== 'production'

export default {
  isEnvProduction,
}
