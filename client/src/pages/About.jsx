import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ContactUs from "../components/ContactUs";
import OfficeLocation from "../components/OfficeLocation";
import { useSelector } from "react-redux";
const images = [
  "https://mygate.com/wp-content/uploads/2023/07/110.jpg",
  "https://plus.unsplash.com/premium_photo-1661883982941-50af7720a6ff?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const About = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const currentUser = useSelector(state => state.user.currentUser);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);

  return (
    <>
      <div
        className="px-4  mx-auto "
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s  ease-in",
          position: "relative",
        }}
      >
        <div className="py-[8rem] px-10 max-w-7xl  mx-auto shadow-md backdrop-blur-xl">
          <div
            className="flex flex-col justify-center"
            style={{ fontFamily: "Permanent Marker" }}
            data-aos="zoom-in-up"
          >
            <h1 className="flex justify-center text-3xl font-bold mb-4 text-slate-200">
              <span>
                About <span className="text-red-200"> Saksham </span>
                <span className="text-red-500">Estate</span>
              </span>
            </h1>
            <div className="flex justify-center">
              <div className="circle rounded-full w-[20px] h-[20px] bg-yellow-600"></div>
              <div className="hr h-[3px] w-[400px] bg-yellow-600 mt-2"></div>
              <div className="circle rounded-full w-[20px] h-[20px] bg-yellow-600"></div>
            </div>
          </div>

          <p
            className="mb-4 text-slate-300 pt-3"
            style={{ fontFamily: "Exo 2" }}
            data-aos="zoom-in-up"
          >
            {" "}
            Saksham Estate is a leading force in real estate, committed to
            transforming property dreams into reality. We prioritize building
            lasting relationships and meeting each client's unique aspirations.
            Our experienced team specializes in creating exceptional
            experiences, connecting individuals with their perfect properties in
            sought-after neighborhoods.
          </p>
          <p className="mb-4 text-slate-300" data-aos="zoom-in-up">
            Our mission extends beyond transactions. We empower clients to
            effortlessly achieve their real estate goals. With years of industry
            expertise, our professionals offer tailored advice, personalized
            service, and a deep understanding of local market intricacies. From
            dream homes to profitable sales and ideal rentals, we guide clients
            seamlessly through their property journeys.
          </p>
          <p className="mb-4 text-slate-300" data-aos="zoom-in-up">
            At Saksham Estate, excellence is our signature. Every interaction
            aims to be transformational. Our unwavering commitment ensures
            successful deals and memorable experiences. We don't just sell
            properties; we sculpt futures. Trust us to make your property
            journey not just fruitful but also enjoyable and deeply rewarding.
          </p>
          {currentUser ? (
            <>
              <div
                className="flex flex-col justify-center pt-5"
                style={{ fontFamily: "Permanent Marker" }}
                data-aos="zoom-in-up"
              >
                <h1 className="flex justify-center text-3xl font-bold mb-4 text-slate-200">
                  <span>Contact Us</span>
                </h1>
                <div className="flex justify-center">
                  <div className="circle rounded-full w-[20px] h-[20px] bg-yellow-600"></div>
                  <div className="hr h-[3px] w-[400px] bg-yellow-600 mt-2"></div>
                  <div className="circle rounded-full w-[20px] h-[20px] bg-yellow-600"></div>
                </div>
              </div>
              <div
                className="text-center mt-10 text-white"
                style={{ fontFamily: "Permanent Marker" }}
                data-aos="zoom-in-up"
              >
                <ContactUs />
              </div>
            </>
          ) : null}
          <div
            className="flex flex-col justify-center pt-5"
            style={{ fontFamily: "Permanent Marker" }}
            data-aos="zoom-in-up"
          >
            <h1 className="flex justify-center text-3xl font-bold mt-4 text-slate-200">
              <span>Our Location</span>
            </h1>
            <div className="flex justify-center">
              <div className="circle rounded-full w-[20px] h-[20px] bg-yellow-600"></div>
              <div className="hr h-[3px] w-[400px] bg-yellow-600 mt-2"></div>
              <div className="circle rounded-full w-[20px] h-[20px] bg-yellow-600"></div>
            </div>
          </div>
          <div
            className="text-center mt-10 text-white"
            style={{ fontFamily: "Permanent Marker" }}
            data-aos="zoom-in-up"
          >
            <OfficeLocation />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
