import MapWithCluster from './Map';
import Header from './components/Header';
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/600.css";
import "@fontsource/quicksand/700.css";
import "./app.css"
// import Hero from './components/Hero';
function App() {

  return (
    <>
    <Header />
    {/* <Hero /> */}
    <h1 className='font-sans'>Ayla Oasis</h1>
    <MapWithCluster />
    </>
  )
}

export default App
