import React from "react"

const SubmitButton = ({ children, onClick, disabled }) => [
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-32 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg transition-colors duration-150 ${
      disabled ? "bg-gray-300" : "hover:bg-blue-600"
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>,
]

export default SubmitButton
