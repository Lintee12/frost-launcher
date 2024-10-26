import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface PortalProps {
  children: ReactNode
}

const Portal = ({ children }: PortalProps) => {
  const portalRoot = document.getElementById('root')

  if (!portalRoot) {
    throw new Error('Portal root not found')
  }

  return ReactDOM.createPortal(children, portalRoot)
}

export default Portal
