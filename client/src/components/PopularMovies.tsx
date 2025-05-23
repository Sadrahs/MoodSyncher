import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import "./PopularMovies.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieModel from "./MovieModel"; // Adjust path if needed

const TMDB_API_KEY = "310876c027113d376303d32372360b53";

type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string;
  summary: string;
  poster_path?: string;
  trailer?: string;
};

export default function PopularMovies() {
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setTopMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch now playing movies", error);
      }
    };

    fetchTopMovies();
  }, []);

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    const videoRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`
    );
    const videoData = await videoRes.json();
    const trailer = videoData.results.find(
      (vid: any) => vid.type === "Trailer"
    );
    if (trailer) {
      setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
    } else {
      setTrailerUrl("");
    }
    setShowModal(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true, // ✅ show arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <>
      <h2 className="popular-movies-title">Now Playing in Theatres</h2>

      <Slider className="Slider" {...settings}>
        {topMovies.map((movie) => (
          <div
            key={movie.id}
            className="featured-movie"
            onClick={() => handleMovieClick(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </Slider>

      {showModal && selectedMovie && (
        <MovieModel
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          movieId={selectedMovie.id}
        />
      )}
    </>
  );
}
