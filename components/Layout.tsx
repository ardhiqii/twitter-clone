import React from 'react'

const Layout = ({children}: {children:React.ReactNode}) => {
  return (
    <div className="max-w-2xl mx-auto border-r  border-l border-twitterBorder h-full min-h-screen">
      {children}
      </div>
  )
}

export default Layout