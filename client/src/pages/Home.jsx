import React from 'react'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Testimonial from '../components/home/Testimonial'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div>
      <Banner />
      <Hero />
      <Features />
      <Testimonial />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Home


// Imports UI sections of the Home page
// Each file = one section of the page
// Renders components top to bottom
// Each component outputs JSX
// Together they form the full Home page
// This file is a page-level component
// It does NOT contain logic, only composition
// so we have made multiple resuable react components which we combine using this single
// file and and display it 
