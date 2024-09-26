import React from 'react'
import Header from '../../components/Header'
import Section1 from './sections/section2'
import TopSection from '../../components/TopSection'
import WeAreTheBest from '../LandingPage/sections/WeAreTheBest'
import Footer from '../../components/Footer'

const topSectionData = {
  title: 'About Us',
  description:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita adipisci voluptatum reprehenderit. Quibusdam cumque ipsa iure distinctio nemo explicabo libero?'
}

const About = () => {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <TopSection data={topSectionData} />
      <Section1 />
      <WeAreTheBest />
      <Footer />
    </div>
  )
}

export default About
