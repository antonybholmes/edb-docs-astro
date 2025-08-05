import type { IClassProps } from "./class-props"

export interface ILayoutProps extends IClassProps   {
  title?: string
 
  description?: string

  tab?: string
  isIndexed?: boolean
  bg?: string
  //added?: Date
  hero?: string
  heroAlt?: string
  heroTitle?: string
}
