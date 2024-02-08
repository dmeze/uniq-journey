import type { FC, ReactNode } from 'react'

interface WidgetsContainerProps {
  children: ReactNode
  title: string
}

const WidgetContainer: FC<WidgetsContainerProps> = ({ children, title }) => {
  return (
    <div className="m-3 flex w-full flex-col rounded-sm bg-white-yellow">
      <p className="mr-auto text-dark-green">{title}</p>
      <div className="mx-auto">{children}</div>
    </div>
  )
}

export default WidgetContainer
