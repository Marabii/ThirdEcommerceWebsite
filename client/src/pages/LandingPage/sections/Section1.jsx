import React, { useEffect, useState } from 'react'
import data from './data_for_section1'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const Section1 = () => {
  const [currSlide, setCurrSlide] = useState(0)
  const sliderImgs = [
    'sofa1.png',
    'sofa2.png',
    'sofa3.png'
  ]
  const [autoPlay, setAutoPlay] = useState(true)
  const navigate = useNavigate()
  const serverURL = import.meta.env.VITE_REACT_APP_SERVER

  const nextSlide = () => {
    setCurrSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1))
  }

  const getTranslation = () => {
    return `${-100 * currSlide}%`
  }

  useEffect(() => {
    let interval = null
    if (autoPlay) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [autoPlay, currSlide])

  return (
    <>
      <section className="relative mt-24 flex h-full w-full overflow-hidden">
        <div className="absolute -top-[200px] bottom-0 left-0 right-1/4 bg-slate-200"></div>
        {data.map((slide, index) => (
          <div
            key={index}
            style={{ transform: `translateX(${getTranslation()})` }}
            className={`mt-5 flex w-full shrink-0 grow-0 items-center justify-between font-playfair transition-all duration-2000 ease-in-out lg:mt-40 ${currSlide === index ? 'opacity-100' : 'opacity-0'} flex-col lg:flex-row`}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <div className="order-2 w-full p-10 lg:order-1 lg:w-1/2">
              <h3
                className={`content mb-3 font-[jost] text-xl font-normal text-[#494949]`}
              >
                {slide.text1}
              </h3>
              <h2
                className={`mb-8 max-w-[15ch] text-5xl font-extrabold leading-normal transition-all duration-2000 ease-in-out ${currSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              >
                {slide.text2}
              </h2>
              <p className={`mb-5 max-w-[50ch] font-[jost]`}>{slide.text3}</p>
              <button
                className="border border-black bg-[#1e1c1c] px-6 py-4 font-[jost] text-white duration-300 ease-in-out hover:bg-white hover:text-[#1e1c1c]"
                onClick={() => navigate('/shop')}
              >
                SHOP NOW
              </button>
            </div>
            <img
              className="relative order-1 aspect-auto lg:order-2 lg:w-[500px] lg:pr-5 xl:-top-10 xl:w-[700px]"
              src={`${serverURL}/sliderImages/${sliderImgs[index]}`}
              alt="slider-image"
            />
          </div>
        ))}
        <div className="absolute -bottom-0 right-10 z-10 space-x-4">
          {data.map((_, index) => (
            <button
              className={`aspect-square w-5 rounded-full bg-slate-300 ${index === currSlide && 'bg-slate-700'}`}
              key={index}
              onClick={() => setCurrSlide(index)}
            ></button>
          ))}
        </div>
      </section>
      <section className="relative -left-0.5 my-14 aspect-[1093/375] h-fit w-full bg-[url('/chair.jpg')] bg-cover bg-center">
        <div className="static left-[40%] top-1/2 translate-y-0 text-center text-white md:absolute md:-translate-y-1/2">
          <h3 className="clamp-font-size-med">NEW COLLECTIONS</h3>
          <h2 className="clamp-font-size-big my-5 font-playfair font-bold">
            Leisure Chair Set
          </h2>
          <p className="clamp-font-size-small mb-10 w-full md:max-w-[50ch]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat
            repudiandae sunt exercitationem sit distinctio eum
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="mb-2 bg-white px-6 py-4 text-slate-600 transition-all duration-300 hover:bg-green-200"
          >
            SHOP NOW
          </button>
        </div>
      </section>
    </>
  )
}

export default Section1
