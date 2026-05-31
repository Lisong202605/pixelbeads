import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { ImageToPattern } from './pages/ImageToPattern';
import { Gallery } from './pages/Gallery';
import { PatternDetail } from './pages/PatternDetail';
import { Editor } from './pages/Editor';
import { Calculator } from './pages/Calculator';
import { Guide } from './pages/Guide';
import { Templates } from './pages/Templates';
import { FAQ } from './pages/FAQ';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-to-pattern" element={<ImageToPattern />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/pattern/:id" element={<PatternDetail />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
