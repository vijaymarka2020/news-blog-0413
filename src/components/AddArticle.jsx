import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { db, auth } from "./../firebaseConfig";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

export default function AddArticle() {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    url: "",
    description: "",
    image: "",
    category: "",
    newstype: "",
    gallery: ["", "", ""], // Initialize gallery array with empty strings
    createdAt: Timestamp.now().toDate(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleGalleryChange = (e, index) => {
    const updatedGallery = [...formData.gallery]; // Create a copy of the gallery array
    updatedGallery[index] = e.target.value; // Update the value at the specified index
    setFormData({ ...formData, gallery: updatedGallery }); // Update the state with the new gallery array
  };

  const handlePublish = () => {
    if (!formData.name || !formData.description) {
      alert("Please fill all the required fields");
      return;
    }

    const articleRef = collection(db, "Articles");
    addDoc(articleRef, {
      name: formData.name,
      description: formData.description,
      source: formData.source,
      image: formData.image,
      url: formData.url,
      createdBy: user.displayName,
      userId: user.uid,
      category: formData.category,
      gallery: formData.gallery,
      createdAt: Timestamp.now().toDate(),
      likes: [],
      comments: [],
    })
      .then(() => {
        toast("Article added successfully", { type: "success" });
        setFormData({
          name: "",
          source: "",
          image: "",
          url: "",
          description: "",
          category: "",
        });
      })
      .catch((err) => {
        toast("Error adding article", { type: "error" });
      });
  };

  const renderNewsTypeForm = () => {
    switch (formData.newstype) {
      case "news":
        return (
          <>
            {/* News specific fields */}
            {/* Category */}
            <label htmlFor="">Category</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={(e) => handleChange(e)}
            >
              <option value="">Select category</option>
              <option value="movies">movies</option>
              <option value="image">image</option>
              <option value="national">national</option>
              <option value="international">international</option>
              <option value="sports">sports</option>
              <option value="state">state</option>
            </select>

            <label htmlFor="">Source</label>
            <input
              type="text"
              name="source"
              className="form-control"
              value={formData.source}
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="">Url</label>
            <input
              type="text"
              name="url"
              className="form-control"
              value={formData.url}
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="">Image Url</label>
            <input
              type="text"
              name="image"
              className="form-control"
              value={formData.image}
              onChange={(e) => handleChange(e)}
            />
          </>
        );
      case "image":
        return (
          <>
            {/* Image specific fields */}
            <label htmlFor="">Gallery</label>
            {formData.gallery.map((url, index) => (
              <input
                key={index}
                type="text"
                name="gallery"
                className="form-control"
                value={url}
                onChange={(e) => handleGalleryChange(e, index)}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border p-3 mt-3 mb-5 bg-light">
      {!user ? (
        <>
          <h2>
            <Link to="/signin">Login to create article</Link>
          </h2>
          Don't have an account? <Link to="/register">Signup</Link>
        </>
      ) : (
        <>
          <h2>Create article</h2>
          <>
            {/* News type */}
            <label htmlFor="">News Type</label>
            <select
              name="newstype"
              className="form-control"
              value={formData.newstype}
              onChange={(e) => handleChange(e)}
            >
              <option value="">Select News Type</option>
              <option value="news">News</option>
              <option value="image">Image</option>
            </select>
          </>
          <div className="form-group">
            <label htmlFor="">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={(e) => handleChange(e)}
            />
          </div>

          {/* Description */}
          <label htmlFor="">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={(e) => handleChange(e)}
          />

          {/* Render category-specific form */}
          {renderNewsTypeForm()}

          <button
            className="form-control btn-primary mt-2"
            onClick={handlePublish}
          >
            Publish
          </button>
        </>
      )}
    </div>
  );
}
