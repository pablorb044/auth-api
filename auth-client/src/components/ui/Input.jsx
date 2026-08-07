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
    />
  )
}

export default Input