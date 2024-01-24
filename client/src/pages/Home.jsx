import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Ribbon.css";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const backgroundImageUrl =
    "https://www.bproperty.com/blog/wp-content/uploads/2021/04/house-1867187_1920.jpg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offerRes = await fetch("/api/listing/get?offer=true&limit=4");
        const offerData = await offerRes.json();
        setOfferListings(offerData);

        const rentRes = await fetch("/api/listing/get?type=rent&limit=4");
        const rentData = await rentRes.json();
        setRentListings(rentData);

        const saleRes = await fetch("/api/listing/get?type=sale&limit=4");
        const saleData = await saleRes.json();
        setSaleListings(saleData);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch listings.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* top section */}
      <div
        className="flex flex-col gap-6 pt-[5rem]  px-10"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          background: "cover",
          backgroundAttachment: "fixed",
          backgroundRepeat: "repeat",
        }}
      >
        <h1
          className="text-slate-800 font-bold text-3xl lg:text-6xl"
          style={{ fontFamily: "Permanent Marker" }}
          data-aos="fade-down"
        >
          Explore, Dream, Discover
          <br />
          <span className="text-2xl">Your Perfect Home Awaits</span>
        </h1>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-600 font-extrabold hover:underline"
          data-aos="fade-down"
        >
          Find Your Perfect place here
        </Link>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-10 px-20 pt-[15rem]  bg-transparent"
          style={{
            fontFamily: "Permanent Marker",
          }}
        >
          <div
            className="flex flex-col p-20 md:p-10 bg-slate-200"
            data-aos="fade-up"
          >
            <div className="flex justify-center text-[50px]">
              {offerListings.length}
            </div>
            <div className="flex justify-center">Offers Available</div>
          </div>
          <div
            className="flex flex-col p-20 md:p-10 bg-slate-200 relative"
            data-aos="fade-up"
          >
            <div className="flex justify-center text-[50px]">
              {rentListings.length}
            </div>
            <div className="flex justify-center">Properties Available</div>
            <div className="ribbon ribbon-top-left">
              <span>Rent</span>
            </div>
          </div>
          <div
            className="flex flex-col p-20 md:p-10 bg-slate-200 relative"
            data-aos="fade-up"
          >
            <div className="flex justify-center text-[50px]">
              {saleListings.length}
            </div>
            <div className="flex justify-center">Properties Available</div>
            <div className="ribbon ribbon-top-left">
              <span>Sale</span>
            </div>
          </div>
        </div>
      </div>
      {/* below section */}
      <div
        className="bg-slate-200 p-3 text-sm"
      >
        <div
          className="max-w-5xl  mx-auto flex flex-col gap-10 pt-5 pb-20"
          data-aos="fade-up"
        >
          {offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3 text-black bg-gray-300 p-5">
                <h2 className="text-2xl font-semibold ">Recent offers</h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?offer=true"}
                >
                  Show more offers
                </Link>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                data-aos="fade-right"
              >
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3  p-5 bg-gray-300 " data-aos="fade-up">
                <h2 className="text-2xl font-semibold text-black ">
                  Recent places for rent
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=rent"}
                >
                  Show more places for rent
                </Link>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                data-aos="fade-right"
              >
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3 bg-gray-300 p-5" data-aos="fade-up">
                <h2 className="text-2xl font-semibold text-black">
                  Recent places for sale
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=sale"}
                >
                  Show more places for sale
                </Link>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                data-aos="fade-right"
              >
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {(!offerListings || offerListings.length === 0) &&
            (!rentListings || rentListings.length === 0) &&
            (!saleListings || saleListings.length === 0) && (
              <div>No listings available at the moment.</div>
            )}
        </div>
      </div>
    </div>
  );
}
