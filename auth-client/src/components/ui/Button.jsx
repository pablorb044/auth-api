function Button({
  children,
  type = 'button',
  onClick,
  disabled = false
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        rounded-xl
        bg-gradient-to-r from-violet-600 to-purple-600
        px-4 py-3
        font-medium text-white
        transition
        hover:from-violet-500 hover:to-purple-500
        disabled:cursor-not-allowed disabled:opacity-50
      "
    >
      {children}
    </button>
  )
}

export default Button