import React, { useState, useEffect, useContext } from "react";
import '../App.css';
import NewsItem from "./NewsItem";
import { Spinner } from "flowbite-react";
import toast from "react-hot-toast";
import api from '../Api/Api'
import { getUi } from '../Api/GetUi'
import Nav from "./Nav";
import { UiContext } from "../App";

const Home = ({ country = 'in', category = '', pagesize = 6 }) => {
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState([]);


  const { ui } = useContext(UiContext); // Destructure ui from UiContext
  useEffect(() => {
    fetchNews();
    // getUi();
  }, [country, category, pagesize, api, ui]);


  const fetchNews = () => {
    try {
      api.post('/news').then((res) => {
        setArticles(res.data.articles)
      })

    } catch (error) {

      toast.error(error.message)

    }
  }

  return (
    <>
      <Nav />
      <div style={{ backgroundColor: ui.backgroundColor, color: ui.textColor }} className="container my-3 d-flex align-items-center justify-content-center flex-column varad">
        <h1 className="text-center">Top headlines</h1>

        {loading && <Spinner />}

        <div className="row">
          {!loading &&
            articles.map((ele) => (
              <div className="col-md-4" key={ele.url}>
                <NewsItem
                  title={ele.title ? ele.title.slice(0, 50) : ""}
                  description={ele.description ? ele.description.slice(0, 90) : "description"}
                  imgUrl={ele.urlToImage}
                  newsurl={ele.url}
                  author={ele.author}
                  date={ele.publishedAt.slice(0, 10)}
                  source={ele.source.name}
                />
              </div>
            ))}
        </div>
        {/* <div className="container d-flex justify-content-between">
          <button disabled={page < 1} type="button" className="btn btn-dark" onClick={handlePreviousClick}>&larr; Previous</button>
          <button disabled={page + 1 > Math.ceil(totalResults / pagesize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>
        </div> */}
      </div>
    </>
  );
};

export default Home;
