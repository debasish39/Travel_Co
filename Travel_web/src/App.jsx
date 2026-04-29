import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

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

          {/* 🔒 Protected Routes */}
          <Route
            path="/booking"
            element={
              <>
                <SignedIn>
                  <Booking />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/payment"
            element={
              <>
                <SignedIn>
                  <Payment />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/success/:bookingId"
            element={
              <>
                <SignedIn>
                  <Success />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/track-booking"
            element={
              <>
                <SignedIn>
                  <TrackBooking />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;