import NavigationBar from "../components/Navbar";
import CarouselSlides from "../components/Carousels";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import '../styles/Home.css' ; 
import ProductComponents from "../components/ProductComponents";

function Home() {

    return (
        <>
            <NavigationBar/> 
            <CarouselSlides />
            <ProductComponents/>
            <div id="about-us">
                <AboutUs />
            </div>
            <div id="contact-us">
                <ContactUs/>
            </div>
            
        </>
    ) ; 

}

export default Home ; 
