import Topbar from './Topbar'
import Navbar1 from './Navbar1'
import Slider from './Slider'
import Widgets from './Widgets'
import QuoteSection from './QuoteSection'
import Contact from './Contact'
// import Slider from './Slider'
const Landing = () => {
  return (
    <>
    <Topbar/>
    {/* <Slider/> */}
    <Navbar1/>
    <Slider/>
    <Widgets/>
    <QuoteSection/>
    <Contact/>
    </>
  )
}

export default Landing