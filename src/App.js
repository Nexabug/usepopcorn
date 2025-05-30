
import { useEffect, useState } from "react";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  const KEY = '5e7d5405'
 


export default function App() {
  
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId , setselectedId] = useState("")
  const [watched, setWatched] = useState([]);
  
  useEffect(function () {
   const controller = new AbortController()
    async function fetchMovies() {
    try {
     const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}` , {signal: controller.signal});

    
     const data = await res.json();
     
     if(data.Response === 'False') throw new Error (' movie not found (:')
     setMovies(data.Search);
    //  console.log(data.Search)
    } catch(err){
      // console.error(err.message)
    }
       
    }
   if(!query.length){
      setMovies([])
    }
  
    fetchMovies();

    return function(){
      controller.abort();
    }
  }, [query]);

 
  return (
    <>
     <Navbar movies={movies} query={query} setQuery={setQuery}/>
     <Main movies={movies} selectedId={selectedId} setselectedId={setselectedId} setMovies={setMovies} watched={watched} setWatched={setWatched}/>
    </>
  );
}

function Navbar ({movies , query , setQuery}){
  return (<nav className="nav-bar">
 <Logo />
 <Serch query={query} setQuery={setQuery}/>
 <NoOfResult movies={movies}/>
 
 
</nav>)

}

function Logo(){
  return (
    <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
  )
}

function Serch({query, setQuery}){
  

  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  )
}

function NoOfResult({movies}){
  return(
    <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
  )
}

function Main ({movies ,setMovies,selectedId , setselectedId , setWatched , watched}) {
  
 
  return (
    <main className="main">
    <Result movies={movies} setselectedId={setselectedId} selectedId={selectedId}/>
   {selectedId ? <SelectedMovie selectedId={selectedId} setselectedId={setselectedId} setMovies={setMovies} setWatched={setWatched} watched={watched}/> : <WatchedMovie setWatched={setWatched} watched={watched} />
}
    
  </main>
  )
}

function Result ({movies , setselectedId , selectedId}){
  const [isOpen1, setIsOpen1] = useState(true);

  return(
    <div className="box">
      <OpenMovieList isOpen1={isOpen1} setIsOpen1={setIsOpen1}/>
      {isOpen1 && (
       <MovieList movies={movies} setselectedId={setselectedId} selectedId={selectedId}/>
      )}
    </div>
  )
}

function OpenMovieList ({isOpen1 , setIsOpen1}){
  

  return(
    <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
  )
}

function MovieList({movies,setselectedId ,selectedId}) {
  return (
    <ul className="list">
    
   { 
   
    movies.map((movie) =>  <MovieItems movie={movie} key={movie.imdbID} setselectedId={setselectedId} selectedId={selectedId} />)
      }
    </ul>
  );
}

function SelectedMovie({setselectedId , selectedId , setWatched , watched}){
  const [movie , SetMovie ]=useState([])
 useEffect( function(){
  async function RenderSelectedMovie (){
    const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
    const data = await res.json()
    SetMovie(data)
    // console.log(data)
    
  }
  RenderSelectedMovie()
 } , [selectedId]) 
  
 useEffect(function(){
  document.title =`Movie | ${movie.Title}`

  return function (){
    document.title = 'UsePopcorn'
  }
 } , [movie.Title])
  function handelcloseMovie(){
    setselectedId(null)

  }

  function handeladdmovie (){
   setWatched(e => [...e , movie])
   setselectedId(null)
  //  console.log(watched)
  }
   
  useEffect(function(){
    document.addEventListener('keydown' , function(e){
      if(e.code === 'Escape'){
        handelcloseMovie()
      }
      return function(){
        document.removeEventListener('keydown' , function(e){
          if(e.code === 'Escape'){
            handelcloseMovie()
          }
        } )
    }
    }
    
    )
  }, [handelcloseMovie])
  
  return (
 <> <div className="box details">
  <header>
  <button className="btn-back" onClick={handelcloseMovie}>&larr;</button>

  <img src={movie.Poster} alt={`poster of ${movie}`} /> 
  <div className="details-overview">
    <h2>{movie.Title}</h2>
    <p>{movie.Released} &bull; {movie.Runtime}</p>
    <p>{movie.Genre}</p>
    <p><span>*</span>{movie.imdbRating} IMBD Rating</p>
  </div>
  </header>

  <section>
    <button className="btn-add" onClick={handeladdmovie}> + add to the list</button>
    <p><em>{movie.Plot}</em></p>
    <p> Starring {movie.Actors}</p>
    <p> Directed by {movie.Director}</p>
  </section>
  </div></>
  )
}

function MovieItems({movie , setselectedId , selectedId}){
  const handelclickonmovie = function(){
    setselectedId(selectedId === movie.imdbID ? null : movie.imdbID)
 }
  return(
    <>
  { <li onClick={handelclickonmovie} >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>}</>
)}


function WatchedMovie ({setWatched ,watched}) {
  
  
  const [isOpen2, setIsOpen2] = useState(true);
  function handeldeletwatched (id){
    setWatched(e => e.filter(x => x.imdbID !== id))
  }

  return (
    <div className="box">
      <OpenMovieWatched isOpen2={isOpen2} setIsOpen2={setIsOpen2}/>
      {isOpen2 && (
        <>
         <Summary watched={watched}/>
         <WatchedMovieList watched={watched} handeldeletwatched={handeldeletwatched}/>

          
        </>
      )}
    </div>
  )
}

function WatchedItems({movie , handeldeletwatched}){
  return(
    <li key={movie.imdbID}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      
      <p>
        <span>⏳</span>
        <span>{parseInt(movie.Runtime)} min</span>
      </p>
      <button className="btn-delete" onClick={() =>handeldeletwatched(movie.imdbID)}> x </button>
    </div>
  </li>
  )
}

function OpenMovieWatched({isOpen2 , setIsOpen2}){
  
  return(
    <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
  )
}

function Summary({watched}){
  const avgImdbRating = Math.round(Number(average(watched.map((movie) => movie.imdbRating))));
 
  const avgRuntime = Math.round(Number(average(watched.map((movie) => parseInt(movie.Runtime)))));
  return (
    <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      
      <p>
        <span>⏳</span>
        <span>{avgRuntime} Min</span>
      </p>
    </div>
  </div>
  )
}

function WatchedMovieList ({watched , handeldeletwatched}){
  
  return(
    <ul className="list">
            {watched.map((movie) => (
              <WatchedItems movie={movie} watched={watched} handeldeletwatched={handeldeletwatched}/>
            ))}
          </ul>
  )
}