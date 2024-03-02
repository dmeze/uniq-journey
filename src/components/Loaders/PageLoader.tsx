const PageLoader = ({ size = '50px' }) => {
  return (
    <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 bg-transparent">
      <div
        style={{ width: size, height: size }}
        className=" animate-spin rounded-full border-r-4 border-t-2 border-dark-green"
      />
    </div>
  )
}

export default PageLoader
