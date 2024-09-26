import React from 'react'

const TopSection = (props) => {
  const { data } = props

  return (
    <div className="relative mt-20 flex flex-col items-center justify-center space-x-0 px-5 py-20 sm:px-10 md:flex-row md:space-x-10 lg:px-20 ">
      <div className="absolute -top-[200px] bottom-0 left-0 -z-10 max-h-[1000px] w-full bg-[#eff1f5]"></div>
      <div className="flex w-fit flex-col items-start font-playfair md:w-1/3">
        <h1 className="relative -top-14 w-full whitespace-nowrap text-center text-4xl font-bold sm:w-auto sm:text-6xl">
          {data.title}
        </h1>
        <p className="max-w-[40ch] leading-9">{data.description}</p>
      </div>
      <img
        className="h-auto w-full max-w-[800px] sm:w-2/3"
        src={`${data.image ? data.image : '/sofa.png'}`}
        alt="sofa-img"
      />
    </div>
  )
}

export default TopSection
