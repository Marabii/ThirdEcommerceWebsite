import React from 'react'
import Header from '../../components/Header'
import Section1 from './sections/section2'
import TopSection from '../../components/TopSection'

const topSectionData = {
  title: 'About Us',
  description:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita adipisci voluptatum reprehenderit. Quibusdam cumque ipsa iure distinctio nemo explicabo libero?'
}

const About = () => {
  return (
    <>
      <Header />
      <TopSection data={topSectionData} />
      <Section1 />
    </>
  )
}

export default About
