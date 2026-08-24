import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Designer from './pages/Designer';
import Gallery from './pages/Gallery';
import About from './pages/About';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <div key={location.pathname} className="flex-1 flex flex-col w-full min-h-0 animate-page-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/designer" element={<Designer />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div 
        className="min-h-[100dvh] flex flex-col font-body bg-cover bg-center bg-no-repeat bg-fixed overflow-x-hidden"
        style={{ backgroundImage: `url('/backg.png')` }}
      >
        <Header />
        <main className="flex-1 flex flex-col px-2 md:px-4 max-w-[1600px] mx-auto w-full min-h-0 pb-4">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
