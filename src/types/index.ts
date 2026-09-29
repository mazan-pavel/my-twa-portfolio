export type ProjectCategory = 'TWA' | 'Web' | 'Backend'

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  shortDescription: string
  description: string
  stack: string[]
  githubUrl: string
  demoUrl: string
}

export interface Service {
  id: string
  title: string
  description: string
  priceFrom: number
  unit: string
}

export interface PortfolioContacts {
  /** Username бота в Telegram, напр. @pavel_m_portfolio_bot */
  telegram: string
  email: string
  github: string
}

export interface PortfolioData {
  name: string
  role: string
  bio: string
  availability: string
  stack: string[]
  contacts: PortfolioContacts
  projects: Project[]
  services: Service[]
}

export interface ContactPayload {
  type?: string
  name?: string
  contact?: string
  message?: string
  services?: string[]
  serviceIds?: string[]
  from?: {
    id?: number
    username?: string | null
    first_name?: string
  }
  createdAt?: string
}
