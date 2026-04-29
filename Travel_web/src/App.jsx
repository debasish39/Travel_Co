import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Booking from "./pages/Booking";
import Success from "./pages/Success";
import Home from "./pages/Home";
import About from "./pages/About";
import Destinations from "./pages/Destinations";
import Packages from "./pages/Packages";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import DestinationDetails from "./pages/DestinationDetails";
import TrackBooking from "./pages/TrackBooking";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />

          {/* Previously Protected Routes (now public) */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success/:bookingId" element={<Success />} />
          <Route path="/track-booking" element={<TrackBooking />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
