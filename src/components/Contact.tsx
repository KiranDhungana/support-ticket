
const Contact = () => {
  return (
     <div className="bg-[#1E4E7D] text-[#E8C28F] py-12 px-8 flex justify-center">
      {/* inner group: now centered as a block */}
      <div className="flex items-center">
      {/* Left block */}
      <div className="font-serif">
        <h1 className="text-5xl font-semibold">West Carroll</h1>
        <p className="text-2xl mt-1">Parish School Board</p>
      </div>
      
      {/* Divider */}
      <div className="h-24 w-px bg-current mx-8" />

      {/* Right block */}
      <div className="text-right space-y-1">
        <p className="text-lg">314 E. Main St, Oak Grove, LA</p>
        <p className="text-lg">71263</p>
        <p className="text-lg">
          Phone: 318-428-2378 <span className="mx-2">|</span> Fax: 318-428-3775
        </p>
      </div>
      </div>
    </div>
  )
}

export default Contact