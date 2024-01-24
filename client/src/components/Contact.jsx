// Contact.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";

const Contact = ({ listing, onCloseContact }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await axios.get(`/api/user/${listing.userRef}`);
        setLandlord(response.data);
      } catch (error) {
        console.error("Error fetching landlord:", error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2 mt-5">
          <p className="flex gap-5">
            <span>
              Contact <span className="font-semibold">{landlord.username}</span>{" "}
              for{" "}
              <span className="font-semibold">
                {listing.name.toLowerCase()}
              </span>
            </span>
            <button className="close-button" onClick={onCloseContact}>
              <span className="bg-red-500 rounded-xl px-3 py-2">&times;</span>
            </button>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onCloseContact: PropTypes.func.isRequired,
};

export default Contact;
