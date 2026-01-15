import React from 'react'

function Authlayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141720] px-4">
        {children}
    </div>
  )
}

export default Authlayout
