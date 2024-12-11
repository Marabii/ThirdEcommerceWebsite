import React from 'react'
import Header from '../../components/Header'
import Section1 from './sections/Section1'
import Section2 from './sections/Section2'
import WeAreTheBest from './sections/WeAreTheBest'
import BestSellers from './sections/BestSellers'
import Footer from '../../components/Footer'

const LandingPage = () => {
  return (
    <>
      <main className="overflow-x-hidden">
        <Header />
        <Section1 />
        <Section2 />
        <WeAreTheBest />
        <BestSellers />
      </main>
      <Footer />
    </>
  )
}

export default LandingPage
