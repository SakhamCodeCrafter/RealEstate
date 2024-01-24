import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [textareaValue, setTextareaValue] = useState("");
  const userEmail = useSelector((state) => state.user.currentUser.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/user/submitForm", {
        problemDescription: textareaValue, 
        email: userEmail, 
      });

      if (response.status === 200) {
        console.log("Form submitted successfully!");
        toast.success("Form submitted successfully!");
      } else {
        console.error("Error submitting form:", response.data.message);
        toast.error(`Error submitting form: ${response.data.message}`);
      }
    } catch (error) {
      console.log("Network error:", error.message);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="contact-us-container">
      <div className="form-container mt-4">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group flex flex-col gap-5">
            <label htmlFor="textarea" className="text-lg font-bold">
              How Can We Help You?
            </label>
            <textarea
              required="true"
              cols={30}
              rows={10}
              id="textarea"
              name="textarea"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              className="w-full border p-2 mt-2 text-white font-sans bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="form-submit-btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
