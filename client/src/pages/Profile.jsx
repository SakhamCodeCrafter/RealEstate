import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateListing from "./CreateListing";

const images = [
  "https://images.unsplash.com/photo-1565402170291-8491f14678db?q=80&w=2917&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(0);
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = "info") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleFileUpload = useCallback(
    (file) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        () => {
          setFileUploadError(true);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({ ...formData, avatar: downloadURL });
        }
      );
    },
    [setFilePerc, setFileUploadError, formData]
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("Are you sure you want to update account?");
    if (confirm) {
      try {
        dispatch(updateUserStart());
        const response = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          showToast(data.message, "error");
          return;
        }

        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        showToast("User is updated successfully!", "success");
      } catch (error) {
        dispatch(updateUserFailure(error.message));
        showToast(error.message, "error");
      }
    } else {
      return;
    }
  };

  const handleDeleteUser = async () => {
    const confirm = window.confirm("Are you sure you want to delete account?");
    if (confirm) {
      try {
        dispatch(deleteUserStart());
        const response = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          showToast(data.message, "error");
          return;
        }
        showToast("User deleted successfully!", "success");
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        showToast(error.message, "error");
        dispatch(deleteUserFailure(error.message));
      }
    } else {
      return;
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const response = await fetch("/api/auth/signout");
      const data = await response.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        showToast(data.message, "error");
        return;
      }
      showToast("Signed out successfully!", "success");
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      showToast(error.message, "error");
      dispatch(deleteUserFailure(error.message));
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const response = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await response.json();

      if (data.success === false) {
        setShowListingsError(true);
        showToast("Error showing listings", "error");
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
      showToast("Error showing listings", "error");
    }
  };

  const handleListingDelete = async (listingId) => {
    const confirm = window.confirm("Are you sure you want to delete account?");
    if (confirm) {
      try {
        const response = await fetch(`/api/listing/delete/${listingId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success === false) {
          console.log(data.message);
          showToast(data.message, "error");
          return;
        }

        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      } catch (error) {
        console.log(error.message);
        showToast(error.message, "error");
      }
    } else {
      return;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`w-full md:w-1/5 bg-gray-800 p-4 h-[40vh] md:h-[95vh] text-white ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="mb-7">
          <button
            onClick={() => setActiveSection("profile")}
            className={`w-full p-2 rounded ${
              activeSection === "profile"
                ? "bg-green-700"
                : "hover:bg-green-600"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection("updateProfile")}
            className={`w-full p-2 rounded ${
              activeSection === "updateProfile"
                ? "bg-blue-700"
                : "hover:bg-blue-400"
            }`}
          >
            Update Profile
          </button>
          <button
            onClick={() => setActiveSection("createListing")}
            className={`w-full p-2 rounded ${
              activeSection === "createListing"
                ? "bg-green-600"
                : "hover:bg-green-500"
            }`}
          >
            Create Listing
          </button>
          <button
            onClick={() => {
              setActiveSection("listings");
              handleShowListings();
            }}
            className={`w-full p-2 rounded ${
              activeSection === "listings"
                ? "bg-yellow-700"
                : "hover:bg-yellow-600"
            }`}
          >
            Show Listings
          </button>
        </div>
        <div>
          <button
            onClick={handleDeleteUser}
            className="w-full p-2 bg-red-500 rounded hover:bg-red-400"
          >
            Delete Account
          </button>
          <button
            onClick={handleSignOut}
            className="w-full p-2 bg-red-500 rounded mt-2 hover:bg-red-400"
          >
            Sign Out
          </button>
        </div>
      </div>
      <button
        className="md:hidden absolute top-15 left-4 z-10 p-2 bg-gray-800 text-white"
        onClick={handleToggleSidebar}
      >
        ☰
      </button>

      {/* Main Content */}
      <div
        className="flex-1 px-4 mx-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${images[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s  ease-in",
          position: "relative",
        }}
      >
        <div className="p-9 max-w-6xl pt-5">
          {activeSection === "profile" && (
            <div className="p-9 max-w-xl mx-auto pt-20">
              <div className="flex flex-col gap-4">
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt="profile"
                  className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                <p className="text-sm self-center">
                  {fileUploadError ? (
                    <span className="text-red-700">
                      Error Image upload (image must be less than 2 mb)
                    </span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className="text-green-700">
                      Image successfully uploaded!
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p className="border p-3 rounded-lg text-white text-center">
                  {currentUser.username}
                </p>
                <p className="border p-3 rounded-lg text-white text-center">
                  {currentUser.email}
                </p>
              </div>
            </div>
          )}

          {activeSection === "updateProfile" && (
            <div className="p-9 max-w-xl  mx-auto pt-20">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                />
                <img
                  onClick={() => fileRef.current.click()}
                  src={formData.avatar || currentUser.avatar}
                  alt="profile"
                  className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                />
                <p className="text-sm self-center">
                  {fileUploadError ? (
                    <span className="text-red-700">
                      Error Image upload (image must be less than 2 mb)
                    </span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className="text-green-700">
                      Image successfully uploaded!
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <input
                  type="text"
                  placeholder="username"
                  defaultValue={currentUser.username}
                  id="username"
                  className="border p-3 rounded-lg"
                  onChange={handleChange}
                />
                <input
                  type="email"
                  placeholder="email"
                  id="email"
                  defaultValue={currentUser.email}
                  className="border p-3 rounded-lg"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  placeholder="password"
                  onChange={handleChange}
                  id="password"
                  className="border p-3 rounded-lg"
                />
                <button
                  disabled={loading}
                  className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
                >
                  {loading ? "Loading..." : "Update"}
                </button>
              </form>
            </div>
          )}

          {activeSection === "createListing" && <CreateListing />}

          {activeSection === "listings" && (
            <div style={{ maxHeight: "87vh", overflowY: "auto" }}>
              {userListings && userListings.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h1
                    className="text-yellow-200 p-5 text-center mt-7 text-3xl font-semibold"
                    style={{ fontFamily: "Permanent Marker" }}
                  >
                    Your Listings
                  </h1>

                  {userListings.map((listing) => (
                    <div
                      key={listing._id}
                      className="border rounded-lg p-3 flex justify-between items-center gap-5 "
                      style={{
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Link to={`/listing/${listing._id}`}>
                        <img
                          src={listing.imageUrls[0]}
                          alt="listing cover"
                          className="h-16 w-16 object-contain"
                        />
                      </Link>
                      <Link
                        className="text-slate-200 font-semibold  hover:underline truncate flex-1"
                        to={`/listing/${listing._id}`}
                      >
                        <p>{listing.name}</p>
                      </Link>

                      <div className="flex item-center gap-2">
                        <button
                          onClick={() => handleListingDelete(listing._id)}
                          class="inline-flex items-center w-full px-5 py-3 mb-3 mr-1 text-base font-semibold text-white no-underline align-middle bg-red-700 border border-transparent border-solid rounded-md cursor-pointer select-none sm:mb-0 sm:w-auto hover:bg-red-600 hover:border-red-600 hover:text-white focus-within:bg-red-600 focus-within:border-red-600"
                        >
                          Delete
                        </button>
                        <Link to={`/update-listing/${listing._id}`}>
                          <button class="inline-flex items-center w-full px-5 py-3 mb-3 mr-1 text-base font-semibold text-white no-underline align-middle bg-blue-600 border border-transparent border-solid rounded-md cursor-pointer select-none sm:mb-0 sm:w-auto hover:bg-blue-700 hover:border-blue-700 hover:text-white focus-within:bg-blue-700 focus-within:border-blue-700">
                            Edit
                            <svg
                              class="w-4 h-4 ml-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              ></path>
                            </svg>
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
