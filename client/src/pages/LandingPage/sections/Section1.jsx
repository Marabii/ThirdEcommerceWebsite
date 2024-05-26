import React, { useEffect, useState } from "react";
import data from "./data_for_section1";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Section1 = () => {
    const [currSlide, setCurrSlide] = useState(0);
    const [sliderImgs, setSliderImgs] = useState(['sofa1.png', 'sofa2.png', 'sofa3.png']);
    const [autoPlay, setAutoPlay] = useState(true);
    const serverURL = import.meta.env.VITE_REACT_APP_SERVER;

    const nextSlide = () => {
        setCurrSlide(prev => (prev === data.length - 1 ? 0 : prev + 1));
    };

    const getTranslation = () => {
        return `${-100 * currSlide}%`;
    };

    useEffect(() => {
        let interval = null;
        if (autoPlay) {
            interval = setInterval(() => {
                nextSlide();
            }, 5000);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [autoPlay, currSlide]);

    // useEffect(() => {
    //     const getImgs = async () => {
    //         try {
    //             const response = await axios.get(`${serverURL}/api/getLandingPageSlider`);
    //             const data = response.data;
    //             setSliderImgs(data)
    //         } catch(e) {
    //             toast.error('Unable To Get Slider Images')
    //             console.error(e)
    //         }
    //     }
    //     getImgs()
    // }, [])

    return (
        <>
            <div className="h-screen w-1/2 bg-slate-200 absolute top-0 left-0 -z-10"></div>
            <section className="flex w-full h-full overflow-hidden relative">
                {data.map((slide, index) => (
                    <div key={index} style={{ transform: `translateX(${getTranslation()})` }} className={`flex justify-between items-center mt-5 lg:mt-40 font-playfair shrink-0 grow-0 w-full transition-all duration-2000 ease-in-out ${currSlide === index ? 'opacity-100' : 'opacity-0'} flex-col lg:flex-row`}  
                        onMouseEnter={() => setAutoPlay(false)} 
                        onMouseLeave={() => setAutoPlay(true)}
                    >  
                        <div className="w-full lg:w-1/2 lg:order-1 p-10 order-2">
                            <h3 className={`text-xl content text-[#494949] font-normal font-[jost] mb-3`}>{slide.text1}</h3>
                            <h2 className={`text-5xl max-w-[15ch] font-extrabold leading-normal mb-8 transition-all duration-2000 ease-in-out ${currSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>{slide.text2}</h2>
                            <p className={`max-w-[50ch] font-[jost] mb-5`}>{slide.text3}</p>
                            <button className="bg-[#1e1c1c] duration-300 ease-in-out text-white px-6 py-4 font-[jost] border border-black hover:bg-white hover:text-[#1e1c1c]">SHOP NOW</button>
                        </div>
                        <img className="aspect-auto lg:w-[500px] xl:w-[700px] lg:order-2 order-1 lg:pr-5 relative xl:-top-10" src={`${serverURL}/products/${sliderImgs[index]}`} alt="slider-image" />
                    </div>
                ))}
                <div className="absolute right-10 -bottom-0 space-x-4 z-10">
                    {data.map((_, index) => <button className={`bg-slate-300 rounded-full aspect-square w-5 ${index === currSlide && 'bg-slate-700'}`} key = {index} onClick={() => setCurrSlide(index)}></button>)}
                </div>
            </section>
            <section className="w-full bg-[url('/chair.jpg')] aspect-[1093/375] bg-cover bg-center relative my-14 h-fit">
                <div className="static md:absolute left-[40%] text-white top-1/2 text-center translate-y-0 md:-translate-y-1/2">
                    <h3 className="clamp-font-size-med">NEW COLLECTIONS</h3>
                    <h2 className="clamp-font-size-big font-bold font-playfair my-5">Leisure Chair Set</h2>
                    <p className="w-full md:max-w-[50ch] mb-10 clamp-font-size-small">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat repudiandae sunt exercitationem sit distinctio eum</p>
                    <button className="bg-white text-slate-600 px-6 py-4 transition-all duration-300 hover:bg-green-200 mb-2">SHOP NOW</button>
                </div>
            </section>
            <ToastContainer />
        </>
    );
};

export default Section1;
