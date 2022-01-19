import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Photo from './Photo';

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_K}`;;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');

  const fetchImages = async () => {
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();

      if (query && page === 1) {
        setPhotos(data.results);
      } else {
        query ? setPhotos(photos.concat(data.results)) :
          setPhotos((oldPhotos) => { return [...oldPhotos, ...data] });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  }
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line 
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => oldPage + 2);
        console.log(1);
      }
    });
    return () => window.removeEventListener('scroll', event);
    // eslint-disable-next-line 
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  }

  return <main>
    <section className="search">
      <form className="search-form">
        <input type="text" placeholder='search for whatever image u want' className='form-input' value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="submit submit-btn" onClick={handleSubmit}>
          <FaSearch />
        </button>
      </form>
    </section>
    <section className="photos">
      <div className="photos-center">
        {photos.map((image, index) => {
          return (
            <Photo key={image.id} {...image} />
          );
        })}
        {loading && <h2 className='lading'>loading...</h2>}
      </div>
    </section>
  </main>
}

export default App
