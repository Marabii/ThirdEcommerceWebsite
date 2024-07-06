import Header from '../../components/Header'
import TopSection from '../../components/TopSection'
import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom'

const topSectionData = {
  title: 'Contact Us',
  description:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita adipisci voluptatum reprehenderit. Quibusdam cumque ipsa iure distinctio nemo explicabo libero?',
  image: '/chair4.jpg'
}

const Contact = () => {
  const handleSubmit = () => {
    console.log('submitted')
  }

  const navigate = useNavigate()

  return (
    <div>
      <Header />
      <TopSection data={topSectionData} />
      <div className="my-20">
        <div className="mb-20 flex flex-col items-center space-y-10">
          <h2 className="font-playfair text-5xl font-bold">Connect with us</h2>
          <p className="max-w-[50ch] text-balance text-center text-gray-600">
            Let’s talk about this website or project. Send us a message and we
            will be in touch within one work day
          </p>
          <div className="flex flex-wrap items-start justify-evenly gap-10">
            <div className="flex w-56 flex-col items-center space-y-4 text-center">
              <h4 className="w-fit font-playfair text-2xl font-semibold">
                Address
              </h4>
              <p className="w-fit max-w-[40ch] text-balance">
                256, Central City, Borlex House Main town, New York, USA
              </p>
            </div>
            <div className="flex w-56 flex-col items-center space-y-4 text-center">
              <h4 className="w-fit font-playfair text-2xl font-semibold">
                Phone
              </h4>
              <p className="w-fit max-w-[40ch] text-balance">
                880(12) 1254 2584
              </p>
            </div>
            <div className="flex w-56 flex-col items-center space-y-4 text-center">
              <h4 className="w-fit font-playfair text-2xl font-semibold">
                Email
              </h4>
              <p className="w-fit max-w-[40ch] text-balance">
                YpS1H@example.com
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-screen flex-col xl:flex-row 2xl:items-center">
          <div className="mb-10 h-fit px-10 xl:mx-auto">
            <h2 className="text-balance font-playfair text-5xl font-bold leading-relaxed xl:text-nowrap">
              Contact Us Through Email
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="my-5 grid grid-cols-2 grid-rows-2 gap-2">
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  id="email"
                  className="w-full border border-black p-3 font-jost"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject"
                  name="subject"
                  id="subject"
                  className="w-full border border-black p-3 font-jost"
                  required
                />
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  id="name"
                  className="w-full border border-black p-3 font-jost"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  id="phone"
                  className="w-full border border-black p-3 font-jost"
                  required
                />
              </div>
              <textarea
                placeholder="Message"
                name="message"
                id="message"
                className="h-80 w-full resize-none border border-black p-3 font-jost"
              />
              <button className="mt-10 rounded-md border-2 border-black bg-black px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black">
                SUBMIT
              </button>
            </form>
          </div>
          <div className="relative grid w-full items-center">
            <img
              className="-z-10 col-start-1 col-end-2 row-start-1 row-end-2 h-auto w-full object-cover"
              src="/chair3.jpg"
              alt="chair"
            />
            <div className="col-start-1 col-end-2 row-start-1 row-end-2 space-y-5 px-16 text-white">
              <p className="font-jost text-lg opacity-80">
                MEGA SALE <span className="font-semibold">UPTO 75%</span>
              </p>
              <h2 className="font-playfair text-4xl font-bold">
                Fancy Sofa Set
              </h2>
              <p className="max-w-[40ch]">
                Lorem ipsum dolor sit amet, consectetur scelerisque a tincidunt
                urna quam
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-white px-4 py-3 font-jost uppercase text-black shadow-md transition-colors duration-300 hover:bg-green-200"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact
