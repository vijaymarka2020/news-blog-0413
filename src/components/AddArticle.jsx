import React, { useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "./../firebaseConfig";
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
    createdAt: Timestamp.now().toDate(),
  });

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
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
      url: formData.url,
      image: formData.image,
      createdBy: user.displayName,
      userId: user.uid,
      category: formData.category,
      createdAt: Timestamp.now().toDate(),
      likes: [],
      comments: [],
    })
      .then(() => {
        toast("Article added successfully", { type: "success" });
        setFormData({
          name: "",
          source: "",
          url: "",
          description: "",
          category: "",
          image: ""
        });
      })
      .catch((err) => {
        toast("Error adding article", { type: "error" });
      });
  };


  return (
    <div
      className="border p-3 mt-3 mb-5 bg-light"
      // style={{ position: "fixed" }}
    >
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

          {/* description */}
          <label htmlFor="">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="">category</label>
          <textarea
            name="category"
            className="form-control"
            value={formData.category}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="">Source</label>
          <textarea
            name="source"
            className="form-control"
            value={formData.source}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="">Image</label>
          <textarea
            name="image"
            className="form-control"
            value={formData.image}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="">Url</label>
          <textarea
            name="url"
            className="form-control"
            value={formData.url}
            onChange={(e) => handleChange(e)}
          />

        
          {progress === 0 ? null : (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped mt-2"
                style={{ width: `${progress}%` }}
              >
                {`uploading image ${progress}%`}
              </div>
            </div>
          )}
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
