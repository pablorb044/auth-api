function Card({ children }) {
  return (
    <section
      className="
        rounded-2xl
        border border-white/10
        bg-[#120829]/70
        p-8
        shadow-[0_0_40px_rgba(139,92,246,0.08)]
        backdrop-blur-xl
      "
    >
      {children}
    </section>
  )
}

export default Card