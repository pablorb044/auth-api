function Input({
  type,
  placeholder,
  value,
  onChange,
  autoComplete
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="
        w-full
        rounded-xl
        border border-white/10
        bg-[#120829]/70
        px-4 py-3
        text-white
        outline-none
        placeholder:text-white/40
        transition-all duration-200
        hover:border-white/20
        focus:border-violet-500/50
        focus:ring-2
        focus:ring-violet-500/20
        [&:-webkit-autofill]:bg-[#120829]
        [&:-webkit-autofill]:text-white
        [&:-webkit-autofill]:shadow-[0_0_0_1000px_#120829_inset]
        [&:-webkit-autofill]:[-webkit-text-fill-color:white]
      "
    />
  )
}

export default Input
