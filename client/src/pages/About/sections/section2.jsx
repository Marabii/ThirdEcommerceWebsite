import React from 'react'

const data = [
  { number: '20k+', name: 'Properties' },
  { number: '12k+', name: 'Customers' },
  { number: '62+', name: 'Agents' },
  { number: '160+', name: 'Awards' }
]

const Section1 = () => {
  return (
    <div className="my-10 bg-white">
      <div className="flex flex-col items-center justify-center space-x-0 px-5 md:flex-row md:space-x-20">
        <img
          src="/section2_about.png"
          alt="chair img"
          className="w-full max-w-[500px] md:w-1/2"
        />
        <div className="h-full w-full  md:w-1/2">
          <h2 className="my-10 font-playfair text-6xl font-bold">
            Welcome to Farnic
          </h2>
          <p className="mb-5 max-w-[50ch] font-bold text-[#223e3f]">
            Provide best quality of Furniture and we always focus on quality,
            technology and try to make our customer happy
          </p>
          <p className="text-[#696969]">
            Furniture best dolor sit amet, consectetur adipiscing elit. Duis
            lectus mauris, ullamcorper mauris amet, erat amet. Ornare vitae
            cursus phar purus. Ut enim sed id consectetur velit ullamcorper a.
            Tellus, tempus erdiet dui amet bibendum amet, vestibulum. Sed morbi
            viverra sit tempor tristique sit. Donec vitae lacu
          </p>
          <p className="mt-5 text-[#696969]">
            Furniture best dolor sit amet, consectetur adipiscing elit. Duis
            lectus mauris, ullamcorper mauris amet, erat amet. Ornare vitae
            cursus phar purus. Ut enim sed id consectetur velit ullamcorper
          </p>
        </div>
      </div>
      <div className="flex-warp mt-20 flex w-full justify-around space-x-5">
        {data.map((element) => {
          return (
            <div
              key={element.name}
              className="text-center font-playfair text-[#223e3f]"
            >
              <h3 className=" text-4xl font-extrabold">{element.number}</h3>
              <p className="text-semibold">{element.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Section1
