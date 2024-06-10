import type { FC, ReactNode } from 'react'

interface WidgetsContainerProps {
  children: ReactNode
  title: string
}

const WidgetContainer: FC<WidgetsContainerProps> = ({ children, title }) => {
  return (
    <div className="flex w-full flex-col rounded-sm p-0 sm:p-10">
      <p className="mx-auto my-10 text-2xl font-black text-dark-green">
        {title}
      </p>
      <div className="w-full">{children}</div>
    </div>
  )
}

export default WidgetContainer
