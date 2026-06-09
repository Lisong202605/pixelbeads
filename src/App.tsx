import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Editor } from './pages/Editor';
import { Calculator } from './pages/Calculator';
import { Guide } from './pages/Guide';
import { FAQ } from './pages/FAQ';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Gallery } from './pages/Gallery';
import { Templates } from './pages/Templates';
import { Contact } from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#1a1a1a]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-to-pattern" element={<Home />} />
            <Route path="/ai-generator" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/patterns" element={<Gallery />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
