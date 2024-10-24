import React, { useState, useEffect } from "react";
import api from "../Api/Api";
import { useNavigate } from "react-router-dom";
import { Rating, Typography } from "@mui/material";
import toast from "react-hot-toast";
import Loader from "../Loader/Spinner";
// import 'flowbite/css/flowbite.css';

const Community = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [ratings, setRatings] = useState([0, 0, 0, 0, 0]); // Initialize ratings for 5 stars
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentFeedback();
  }, []);
  const [value, setValue] = React.useState(4);

  const fetchRecentFeedback = async () => {
    try {
      const recentFeedback = await api.getRecentFeedback();
      setFeedbackList(recentFeedback);
    } catch (error) {
      console.error("Error fetching recent feedback:", error);
      // Handle error appropriately
    }
  };

  const [loader, setLoader] = useState(false);
  const [v,set] = useState(false);
  const [info, setInfo] = useState({});

  useEffect(() => {
    set(false)
    setLoader(true);
    api
      .get("/all-feedback")
      .then((res) => {
        setInfo(res.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoader(false);
      });
  }, [v]);

  const handleSubmit = async (e) => {
    setLoader(true);
    const userInsession = sessionStorage.getItem("_id");
    const _id = JSON.parse(userInsession);
    e.preventDefault();
    try {
      // Create an object containing rating and feedback text
      const feedbackData = {
        rating: value,
        feedbackText: feedbackText,
        _id,
      };

      api
        .post("/feedback", { feedbackData })
        .then((res) => {
          setInfo(res.data);
          set(true)
          setLoader(false);
          toast.success("Done..👍");
          setFeedbackText("");
          // navigate('/thank-you');
        })
        .catch((err) => {
          setLoader(false);
          toast.error(err.message);
        });
    } catch (error) {
      setLoader(false);
      console.error("Error submitting feedback:", error);
      // Handle error appropriately
    }
  };

  function parseCreatedAt(createdAt) {
    // Parse the createdAt string into a Date object
    const createdAtDate = new Date(createdAt);

    // Extract day, month, and year
    const day = createdAtDate.getDate();
    const month = createdAtDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
    const year = createdAtDate.getFullYear();

    // Create an object to hold the parsed components
    const parsedData = {
      day,
      month,
      year,
    };

    return parsedData;
  }

// Function to calculate average rating
function calculateAverageRating(feedbackData) {
  if (!Array.isArray(feedbackData)) {
      console.error('Feedback data is not an array.');
      return null; // Handle the error or return a default value
  }

  // Calculate total sum of ratings
  const totalRatings = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
  
  // Calculate average rating
  const averageRating = totalRatings / feedbackData.length;

  return averageRating;
}



  return (
    <div
      //  className="bg-[#252f3d]"
      style={{ background: "rgb(12, 12, 12)" }}
    >
      {loader ? (
        <Loader message={"submitting feedback..."} />
      ) : (
        <div style={{ width: "80%", margin: "0 auto", padding: "2rem 0", fontSize: "3rem"}}>
          <h1 className=" font-bold  py-4
          // text-[#ffc144] 
          text-white
          ">
            Community Feedback
          </h1>

          <div className="w-[100%]  flex justify-between gap-[2rem]" style={{height: "auto"}}>
            <div className="w-[70%]">
              <div
                className="bg-slate-300 w-full rounded-lg  p-4 mb-6 "
              // style={{boxShadow: "10px 10px 10px 20px #87b9ffd7" }}
              >
                <h2 className="text-2xl font-bold mb-4">Rating</h2>
                <Typography component="legend" className="font-bold text-2xl">
                  Controlled
                </Typography>

                {/* Rating */}
                <Rating
                  name="simple-controlled"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
                {[5, 4, 3, 2, 1].map((starRating, index) => (
                  <div key={index} className="flex items-center mt-4 ">
                    <a
                      href="#"
                      className="text-xl font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      {starRating} star
                    </a>
                    <div className="w-2/4 h-2 mx-4 bg-gray-100 rounded bg-gradient-to-r from-violet-500 to-fuchsia-500">
                      <div
                        className="h-5 bg-yellow-300 rounded "
                        style={{
                          width: `${(ratings[starRating - 1] / 1745) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {((ratings[starRating - 1] / 1745) * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Feedback Form */}
              <div className="bg-slate-300 rounded-lg  p-2  ">
              <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="feedback"
                      className="block text-gray-700 font-semibold mb-2"
                      style={{fontSize: "1rem"}}
                    >
                      Your Feedback:
                    </label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      rows="4"
                      style={{ border: "none" }}
                      className="w-[80%] p-2 rounded-md  focus:border-none "
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="font-bold bg-gradient-to-b from-yellow-200 to-yellow-400 text-black px-4 py-2 rounded-md hover:bg-blue-600"
                    style={{fontSize: "1rem"}}
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>
            <div className="w-full h-uto">
              {/* Recent Feedback */}
              <div className="  bg-slate-300 rounded-lg  p-4 pr-8" >
                <h2 className="text-xl font-bold mb-4">Recent Feedback</h2>
                <div className="space-y-2 grid" style={{gridTemplateColumns: "auto auto", columnGap: "2rem", rowGap: "1rem"}}> 
                  {/* {info.length &&
                    info.map((feedback, index) => (
                      <div
                        key={index}
                        className="border p-4 rounded-lg border-pink-600 flex gap-4"
                      >
                        <p className="text-black font-bold">{`"${feedback.name}"`}</p>
                        <Rating
                          name="simple-controlled"
                          value={feedback.rating}
                        />
                        <p>{`${parseCreatedAt(feedback.createdAt).day}/${
                          parseCreatedAt(feedback.createdAt).month
                        }/${parseCreatedAt(feedback.createdAt).year}`}</p>

                        <p>---</p>
                        <p>{feedback.feedbackText}</p>
                      </div>
                    ))} */}


                    {info.length && 
                    info.map((feedback, index) =>(
                      <div key={index} class="flex items-start gap-2.5">
                        <img class="w-8 h-8 rounded-full" src={`https://randomuser.me/api/portraits/men/${index}.jpg`} alt="Jese image" />
                        <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                          <div class="flex items-center space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-semibold text-gray-900 dark:text-white">{`${feedback.name}`}</span>
                            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">{`${parseCreatedAt(feedback.createdAt).day}/${parseCreatedAt(feedback.createdAt).month}/${parseCreatedAt(feedback.createdAt).year}`}</span>
                          </div>
                          <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{feedback.feedbackText}</p>
                          <div className="flex justify-between">

                          <Rating name="simple-controlled" value={feedback.rating}/>
                          <img src="../../public/double-check.png" style={{width: "1rem", marginLeft: "1rem"}} alt="" />
                          </div>
                        </div>
                      </div>
                    ))}
                  

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
