import React from "react";
import { useState } from "react";
import "./MovieRec.css";
import ReactPlayer from "react-player";
import backgroundImage from "../assets/back.png";

type Movie = {
  title: string;
  year: number;
  genre: string;
  summary: string;
  poster?: string;
  trailer?: string;
};

type Props = {
  movie: Movie;
  onSkip: () => void;
  onSave: () => void;
};

const TMDB_API_KEY = "310876c027113d376303d32372360b53";

async function fetchPosterandID(title: string) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        title
      )}`
    );
    const data = await res.json();
    const result = data.results[0];
    if (result && result.poster_path && result.id) {
      return {
        poster: `https://image.tmdb.org/t/p/w500/${result.poster_path}`,
        tmdbId: result.id,
      };
    }
  } catch (error) {
    console.error("Error fetching poster and ID", error);
  }
  return { poster: null, tmdbId: null };
}

async function fetchTrailer(tmdbId: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
    );
    const data = await res.json();
    const trailer = data.results?.find(
      (v: any) =>
        v.type === "Trailer" &&
        v.site === "YouTube" &&
        v.official === true &&
        v.key
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  } catch {
    console.error("Error fetching trailer", Error);
    return null;
  }
}

export default function MovieRec() {
  const [prompts, setPrompts] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchLater, setWatchLater] = useState<Movie[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!prompts.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);
    setCurrentIndex(0);
    setWatchLater([]);
    setSubmitted(true);

    try {
      const res = await fetch("http://localhost:5001/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompts }),
      });
      const data = await res.json();
      try {
        const raw = data.reply.trim();
        const match = raw.match(/\[\s*{[\s\S]*}\s*\]/)?.[0];
        if (!match) {
          throw new Error("Invalid response format");
        }

        const parsed = JSON.parse(data.reply);

        const moviesWithExtras = await Promise.all(
          parsed.map(async (movie: any) => {
            const { poster, tmdbId } = await fetchPosterandID(movie.title);
            const trailer = tmdbId ? await fetchTrailer(tmdbId) : null;
            return { ...movie, poster, trailer };
          })
        );
        setMovies(moviesWithExtras);
      } catch (error) {
        setError("Could not understand the response from AI.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };
  const handleSave = () => {
    setWatchLater((prevWatchLater) => [
      ...prevWatchLater,
      movies[currentIndex],
    ]);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="Home">
      <div className={`PromptContainer ${submitted ? "submitted" : ""}`}>
        <h2 className="PromptHeading">
          SIMPLY TYPE WHAT KIND OF MOVIES DO FEEL LIKE WATCHING AND LET US
          HANDLE THE OTHER PART!
        </h2>
        <input
          type="text"
          className="PromptInput"
          value={prompts}
          placeholder="Enter your prompt"
          onChange={(e) => setPrompts(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button className="SubmitButton" onClick={handleSubmit}>
          {loading ? "Loading..." : "SUBMIT"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {movies[currentIndex] && submitted && !loading && (
        <section className="MovieSection">
          <div className="MovieCard">
            <div className="MovieCardLeft">
              <h2>
                {movies[currentIndex].title} ({movies[currentIndex].year})
              </h2>
              <p>
                <strong>Genre:</strong> {movies[currentIndex].genre}
              </p>
              {movies[currentIndex].poster && (
                <img
                  src={movies[currentIndex].poster}
                  alt={movies[currentIndex].title}
                  className="MoviePoster"
                />
              )}
              <p>{movies[currentIndex].summary}</p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {movies[currentIndex].trailer && (
              <div className="MovieCardTrailer">
                <ReactPlayer
                  url={movies[currentIndex].trailer}
                  playing={true}
                  controls={true}
                  loop={true}
                  width="100%"
                  height="100%"
                />
              </div>
            )}

            <div className="MovieCardButtons">
              <button onClick={handleSkip} type="button" className="SkipButton">
                Skip
              </button>
              <button onClick={handleSave} className="SaveButton">
                Save to Watch Later
              </button>
            </div>
          </div>
        </section>
      )}
    </div> // ✅ FINAL closing div
  );
}
