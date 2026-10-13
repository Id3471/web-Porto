import { useEffect, useState } from 'react'
import { defaultContent, mergePortfolioContent } from './portfolioDefaults'
import { PortfolioContext } from './PortfolioContextValue'
import { portfolioApiUrl } from './portfolioApi'

export function PortfolioProvider({ children }) {
  const [content, setContent] = useState(defaultContent)

  useEffect(() => {
    const controller = new AbortController()

    fetch(portfolioApiUrl('/portfolio-content'), {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Chargement du portfolio impossible (${response.status}).`)
        return response.json()
      })
      .then(({ data }) => {
        if (data) setContent(mergePortfolioContent(data))
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Chargement du contenu dynamique impossible.', error)
      })

    return () => controller.abort()
  }, [])

  return <PortfolioContext.Provider value={content}>{children}</PortfolioContext.Provider>
}
