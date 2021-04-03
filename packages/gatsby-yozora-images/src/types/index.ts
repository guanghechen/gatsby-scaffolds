import './gatsby-yozora-images'

/**
 * Options for this plugin.
 */
export interface GatsbyYozoraImagesOptions {
  /**
   * Set the browser's native lazy loading attribute.
   * @default 'lazy'
   */
  loading?: 'lazy' | 'eager' | 'auto'
}

/**
 * Result of generateImagesAndUpdateNode
 */
export interface ResolvedImageData {
  alt: string
  title: string
  src: string
  srcset: string
  sizes: string
  loading: 'lazy' | 'eager' | 'auto'
}
