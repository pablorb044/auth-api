function Button({ children, type = 'button', onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        w-full
        rounded-xl
        bg-gradient-to-r from-violet-600 to-purple-600
        px-4 py-3
        font-medium text-white
        shadow-[0_0_20px_rgba(139,92,246,0.18)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:from-violet-500 hover:to-purple-500
        hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      {children}
    </button>
  )
}

export default Button
