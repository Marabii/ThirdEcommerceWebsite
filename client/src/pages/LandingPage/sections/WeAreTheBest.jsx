import { useNavigate } from 'react-router-dom'

const WeAreTheBest = () => {
  const navigate = useNavigate()
  return (
    <div className="my-10 flex w-screen flex-col overflow-x-hidden xl:flex-row 2xl:items-center">
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
          <h2 className="font-playfair text-4xl font-bold">Fancy Sofa Set</h2>
          <p className="max-w-[40ch]">
            Lorem ipsum dolor sit amet, consectetur scelerisque a tincidunt urna
            quam
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-white px-4 py-3 font-jost uppercase text-black shadow-md transition-colors duration-300 hover:bg-green-200"
          >
            Shop Now
          </button>
        </div>
      </div>
      <div className="h-fit px-10 xl:mx-auto">
        <h2 className="mt-5 text-balance font-playfair text-5xl font-bold leading-relaxed xl:text-nowrap">
          Why Are We The Best ?
        </h2>
        <p className="my-10 max-w-[60ch] leading-loose text-gray-600">
          Features that we have which Lorem ipsum dolor sit amet, consectetur
          convallis. Arcu, egestas nec scelerisque mi. Augue proin
        </p>
        <div className="grid grid-cols-2 grid-rows-2 gap-5">
          <div className="space-y-2">
            <div className="box-content w-fit rounded-full bg-slate-100 p-1">
              <img
                className="relative -top-1"
                src="/free-shipping.svg"
                alt="free-shipping"
              />
            </div>
            <h3 className="font-playfair text-2xl font-semibold">
              Free Shipping
            </h3>
            <p className="font-jost text-gray-600">
              Buy product over $100 and get free home delivery offer
            </p>
          </div>
          <div className="space-y-2">
            <div className="box-content w-fit rounded-full bg-slate-100 p-1">
              <img className="relative -top-1" src="/return.svg" alt="return" />
            </div>
            <h3 className="font-playfair text-2xl font-semibold">
              Easy Return Policy
            </h3>
            <p className="font-jost text-gray-600">
              Provide 30 day easy Return policy for all of our customer
            </p>
          </div>
          <div className="space-y-2">
            <div className="box-content w-fit rounded-full bg-slate-100 p-1">
              <img
                className="relative -top-1"
                src="/payment.svg"
                alt="payment"
              />
            </div>
            <h3 className="font-playfair text-2xl font-semibold">
              Secure Payment
            </h3>
            <p className="font-jost text-gray-600">
              We conform you that payment system are totally secure
            </p>
          </div>
          <div className="space-y-2">
            <div className="box-content w-fit rounded-full bg-slate-100 p-1">
              <img
                className="relative -top-1"
                src="/quality.svg"
                alt="quality"
              />
            </div>
            <h3 className="font-playfair text-2xl font-semibold">
              Best Quality
            </h3>
            <p className="font-jost text-gray-600">
              We never compromise about the quality of our products
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeAreTheBest
