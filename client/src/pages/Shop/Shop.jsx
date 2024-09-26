import Header from '../../components/Header'
import TopSection from '../../components/TopSection'
import Footer from '../../components/Footer'
import ShopSection1 from './ShopSections/ShopSection1'

const topSectionData = {
  title: 'Shop',
  description:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita adipisci voluptatum reprehenderit. Quibusdam cumque ipsa iure distinctio nemo explicabo libero?',
  image: '/chair4.jpg'
}

const Shop = () => {
  return (
    <div>
      <Header />
      <TopSection data={topSectionData} />
      <ShopSection1 />
      <Footer />
    </div>
  )
}

export default Shop
