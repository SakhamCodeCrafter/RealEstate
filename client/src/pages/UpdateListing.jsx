import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await axios.get(`/api/listing/get/${listingId}`);
      const data = res.data;
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

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

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!params.listingId) {
        setError("Invalid listing ID");
        showToast("Invalid listing ID", "error");
        return;
      }

      if (formData.imageUrls.length < 1) {
        setError("You must upload at least one image");
        showToast("You must upload at least one image", "error");
        return;
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        setError("Discount price must be lower than regular price");
        showToast("Discount price must be lower than regular price", "error");
        return;
      }

      setLoading(true);
      setError(false);

      const response = await axios.put(
        `/api/listing/update/${params.listingId}`,
        formData
      );
      setLoading(false);
      const data = response.data;

      if (data && data.success === false) {
        setError(data.message || "An error occurred");
        showToast(data.message || "An error occurred", "error");
      } else {
        showToast("Listing updated successfully!", "success");
        navigate(`/listing/${params.listingId}`);
      }
    } catch (error) {
      setError("An error occurred while processing your request");
      showToast("An error occurred while processing your request", "error");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex-1 px-4 mx-0"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1565402170291-8491f14678db?q=80&w=2917&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s  ease-in",
        position: "relative",
      }}
    >
      <div className="flex justify-center py-10">
        <main className=" p-7 my-auto max-w-8xl rounded-3xl">
          <h1
            className="text-3xl font-semibold text-center my-7 text-yellow-100 drop-shadow-xl"
            style={{ fontFamily: "Permanent Marker" }}
          >
            Update a Listing
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex flex-col gap-4 flex-1">
              <input
                type="text"
                placeholder="Name"
                className="border p-3 rounded-lg"
                id="name"
                maxLength="62"
                minLength="10"
                required
                onChange={handleChange}
                value={formData.name}
              />
              <textarea
                type="text"
                placeholder="Description"
                className="border p-3 rounded-lg"
                id="description"
                required
                onChange={handleChange}
                value={formData.description}
              />
              <input
                type="text"
                placeholder="Address"
                className="border p-3 rounded-lg"
                id="address"
                required
                onChange={handleChange}
                value={formData.address}
              />
              <div className="flex  gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="sale"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "sale"}
                  />
                  <span className="text-white">Sell</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="rent"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                  />
                  <span className="text-white">Rent</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span className="text-white">Parking spot</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span className="text-white">Furnished</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="offer"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.offer}
                  />
                  <span className="text-white">Offer</span>
                </div>
              </div>
              <div className="flex  flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.bedrooms}
                  />
                  <p className="text-white">Beds</p>
                </div>
                <div className="flex  items-center gap-2">
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.bathrooms}
                  />
                  <p className="text-white">Baths</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="regularPrice"
                    min="50"
                    max="10000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p className="text-white">Regular price</p>
                    {formData.type === "rent" && (
                      <span className="text-xs text-white">
                        ({"\u20B9"} / month)
                      </span>
                    )}
                  </div>
                </div>
                {formData.offer && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="discountPrice"
                      min="0"
                      max="10000000"
                      required
                      className="p-3 border border-gray-300 rounded-lg"
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                    <div className="flex flex-col items-center">
                      <p className="text-white">Discounted price</p>

                      {formData.type === "rent" && (
                        <span className="text-xs text-white">
                          ({"\u20B9"} / month)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
              <p className="font-semibold text-white">
                Images:
                <span className="font-normal text-gray-200 ml-2">
                  The first image will be the cover (max 6)
                </span>
              </p>
              <div className="flex gap-4">
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className="p-3 border border-gray-300 text-white rounded w-full"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className="p-3 text-green-400 border border-green-500 rounded uppercase hover:shadow-lg disabled:opacity-80"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
              <p className="text-red-400 text-sm">
                {imageUploadError && imageUploadError}
              </p>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex justify-between p-3 border items-center"
                  >
                    <img
                      src={url}
                      alt="listing image"
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-3 text-red-400 rounded-lg uppercase hover:opacity-75"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              <button
                disabled={loading || uploading}
                className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
              >
                {loading ? "Updating..." : "Update listing"}
              </button>
              {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
