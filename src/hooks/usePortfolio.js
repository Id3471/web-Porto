import { useContext } from 'react'
import { PortfolioContext } from '../data/PortfolioContextValue'

export function usePortfolio() {
  return useContext(PortfolioContext)
}
