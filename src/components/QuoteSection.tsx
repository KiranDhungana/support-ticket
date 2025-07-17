
const QuoteSection = () => {
  return (
     <div
      className="relative bg-cover bg-center bg-no-repeat h-96"
      style={{ backgroundImage: "url('/Backg.png')" }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-amber-200/75 z-10"></div>

      {/* Quote container */}
      <div className="relative z-20 flex items-center justify-center h-full px-32">
        <p className="text-center font-semibold font-serif text-[#1d3c6a] text-xl md:text-2xl lg:text-3xl leading-relaxed">
          “The goal of West Carroll Parish Schools is to provide a happy, caring,
          safe, quality education which maximizes student potential and ensures
          that students of all ability levels and ethnicities are prepared to
          meet the challenges of education, vocation, and citizenship.”
        </p>
      </div>
    </div>
  )
}

export default QuoteSection