import React, { useEffect, useState } from "react";
import "./MovieModel.css";
import ReactPlayer from "react-player";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  movieId: number;
};

const TMDB_API_KEY = "310876c027113d376303d32372360b53";

export default function MovieModal({ isOpen, onClose, movieId }: Props) {
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  
  useEffect(() => {
    if (!isOpen) return;

    const fetchDetails = async () => {
      try {
        const detailsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
        );
        const detailsData = await detailsRes.json();
        const videoData = await videoRes.json();

        const trailer = videoData.results?.find(
          (v: any) =>
            v.type === "Trailer" &&
            v.site === "YouTube" &&
            v.official === true &&
            v.key
        );

        setDetails(detailsData);
        setTrailerUrl(
          trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
        );
      } catch (error) {
        console.error("Error fetching modal data", error);
      }
    };

    fetchDetails();
  }, [movieId, isOpen]);

  if (!isOpen || !details) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {trailerUrl && (
          <div className="trailer-container">
            <ReactPlayer url={trailerUrl} controls width="100%" height="100%" />
          </div>
        )}

        <div className="modal-content">
          <h2>
            {details.title} ({details.release_date?.slice(0, 4)})
          </h2>
          <p>
            <strong>Genres:</strong>{" "}
            {details.genres?.map((g: any) => g.name).join(", ")}
          </p>
          <p>
            <strong>Runtime:</strong> {details.runtime} minutes
          </p>
          <p>{details.overview}</p>
        </div>
      </div>
    </div>
  );
}
