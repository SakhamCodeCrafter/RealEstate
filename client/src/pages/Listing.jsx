import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaShare,
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import Contact from "../components/Contact";
import ShareButtons from "./ShareComp";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        if (!params.listingId) {
          setError(true);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const closeContact = () => {
    setContact(false);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className="bg-blue-100 ">
          <div className="grid grid-cols-1 md:grid-cols-2 p-5 md:max-w-8xl pt-[3rem] pb-[3rem] gap-10">
            <div>
              <Swiper navigation={true} modules={[Navigation]}>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className="h-[200px] md:h-[550px]"
                      style={{
                        background: `url(${url}) center no-repeat`,
                        backgroundSize: "cover",
                        borderRadius: "5%",
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="grid grid-cols-1 pt-5 gap-2">
              <p className="text-xl md:text-2xl font-extrabold underline">
                {listing.name}
              </p>
              <p className="flex items-center gap-2 text-slate-600 text-sm">
                <FaMapMarkerAlt className="text-green-700" />
                {listing.address}
              </p>
              <p className="text-xl font-bold">
                {"\u20B9"}
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-IN")
                  : listing.regularPrice.toLocaleString("en-IN")}
                {listing.type === "rent" && " / month"}
              </p>
              <p
                className={`text-sm md:text-base text-slate-800 flex flex-wrap flex-col ${
                  showFullDescription ? "" : "line-clamp-6"
                }`}
              >
                <span className="font-bold text-black">
                  Description - <br />
                </span>
                {listing.description}
              </p>
              <ul className="text-green-900 font-semibold text-xs md:text-md flex flex-wrap items-center gap-[0.7rem] md:gap-10">
                <li className="flex items-center gap-1">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds `
                    : `${listing.bedrooms} bed `}
                </li>
                <li className="flex items-center gap-1">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths `
                    : `${listing.bathrooms} bath `}
                </li>
                <li className="flex items-center gap-1">
                  <FaParking className="text-lg" />
                  {listing.parking ? "Parking spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-1">
                  <FaChair className="text-lg" />
                  {listing.furnished ? "Furnished" : "Unfurnished"}
                </li>
              </ul>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 h-5 justify-center">
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
                {listing.offer && (
                  <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    {"\u20B9"}
                    {+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>
              <ShareButtons />
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="mt-5 bg-slate-700 text-white h-10 rounded-lg uppercase hover:opacity-95"
                  >
                    Contact landlord
                  </button>
                )}
              {contact && (
                <Contact listing={listing} onCloseContact={closeContact} />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
