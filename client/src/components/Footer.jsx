import { Facebook, Instagram, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

const linksForCompany = [
  { name: 'Home', link: '/' },
  { name: 'About Us', link: '/about' },
  { name: 'Our Blog', link: '/blog' },
  { name: 'Contact Us', link: '/contact' },
  { name: 'Login', link: '/login' },
  { name: 'Register', link: '/register' },
  { name: 'shop', link: '/shop' }
]

const linksForInformation = [
  { name: 'Terms & Conditions', link: '/terms-and-conditions' },
  { name: 'Style Guide', link: '/style-guide' },
  { name: 'Change Log', link: '/change-log' },
  { name: 'Liscense', link: '/license' }
]

const Footer = () => {
  return (
    <footer className="flex grid-rows-2 flex-col place-items-center items-start space-y-5 bg-slate-200 px-2 py-10 font-jost md:grid md:grid-cols-2 md:justify-center xl:flex xl:flex-row xl:gap-10 xl:px-24 xl:py-32">
      <div className="space-y-5 md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 md:w-1/2">
        <img src="/farnic.png" alt="logo" />
        <p className="text-gray-600">
          Features that we have which lorem ipsum dolor sit amet, consectetur
        </p>
        <div className="flex items-center gap-1 font-playfair text-xl font-semibold">
          <p>Follow Us</p> <div className="h-[1px] w-16 bg-black"></div>
        </div>
        <div className="flex gap-2">
          <Twitter fill="#000" />
          <Facebook fill="#000" />
          <Instagram />
        </div>
      </div>
      <div className="w-fit md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2 md:w-1/2">
        <h3 className="mb-3 w-fit font-playfair text-2xl font-semibold">
          Company
        </h3>
        <ul className="w-fit">
          {linksForCompany.map((link) => {
            return (
              <Link className="block w-fit" to={link.link} key={link.name}>
                <li className="mb-2 font-jost text-gray-600 transition-all duration-300 hover:translate-x-2">
                  {link.name}
                </li>
              </Link>
            )
          })}
        </ul>
      </div>
      <div className="w-fit md:row-start-2 md:row-end-3 md:w-1/2">
        <h3 className="mb-3 font-playfair text-2xl font-semibold">
          Information
        </h3>
        <ul className="w-fit">
          {linksForInformation.map((link) => {
            return (
              <Link className="block w-fit" to={link.link} key={link.name}>
                <li className="mb-2 font-jost text-gray-600 transition-all duration-300 hover:translate-x-2">
                  {link.name}
                </li>
              </Link>
            )
          })}
        </ul>
      </div>
      <div className="md:row-start-2 md:row-end-3 md:w-1/2">
        <h3 className="mb-3 font-playfair text-2xl font-semibold">
          Contact Us
        </h3>
        <p className="mb-2 max-w-[20ch] text-balance font-jost text-gray-600">
          256, Central City, Borlex House Main town, New York, USA
        </p>
        <p className="mb-2 text-xl text-gray-800">+880(12) 125 48765</p>
        <p className="font-jost text-xl text-gray-500">
          <Link to="/">www.farnic.com</Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer
