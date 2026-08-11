function Page({ children }) {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#080316]
        px-4
        py-8
        text-white
      "
    >
      {children}
    </main>
  )
}

export default Page