function AuthLayout({ children }) {
  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#080316]
        px-4
        py-8
        text-white
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-violet-600/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-32
          h-96
          w-96
          rounded-full
          bg-blue-600/10
          blur-3xl
        "
      />

      <div className="relative z-10 w-full">
        {children}
      </div>
    </main>
  )
}

export default AuthLayout