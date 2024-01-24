import React from "react";

const OfficeLocation = () => {
  return (
    <div className="office-location-container">
      <p>
        123 Main Street,
        <br />
        Cityville, State 12345,
        <br />
        Country
      </p>
      <div className="location-info mt-4">
        <iframe
          title="Office Location"
          width="100%"
          height="400"
          style={{ border: 0 }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d439774.79929769295!2d76.28308442444323!3d30.556631578844147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fefa816374259%3A0x9fc88728e241a34!2s24%2F7%20Real%20Estate%20Advisor%20(%20Plots%2C%20Flats%2C%20House%2CVillas%20and%20Investment)!5e0!3m2!1sen!2sin!4v1705226092983!5m2!1sen!2sin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default OfficeLocation;
