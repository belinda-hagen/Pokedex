import React, { useState, useEffect } from 'react';
import { getPokemon, getMegaForms, getMegaEvolutionData, getMegaDisplayName } from './api/pokeapi';
import './components/PokeDex.css';
import './components/Footer.css';
import './components/MusicPlayer.css';
import PokeLoader from './components/PokeLoader.jsx';
import Footer from './components/Footer.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';

function App() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [allPokemons, setAllPokemons] = useState([]);
  const [allLoading, setAllLoading] = useState(true);
  const [allError, setAllError] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 60; 
  const [splashLoader, setSplashLoader] = useState(true);
  const [isMainCardHovered, setIsMainCardHovered] = useState(false);
  
  // Mega Evolution states
  const [megaForms, setMegaForms] = useState([]);
  const [megaData, setMegaData] = useState({});
  const [selectedForm, setSelectedForm] = useState('base'); // 'base' or mega form name
  const [loadingMega, setLoadingMega] = useState(false);

  // Fetch mega evolution data when a pokemon is selected
  useEffect(() => {
    if (!pokemon) {
      setMegaForms([]);
      setMegaData({});
      setSelectedForm('base');
      return;
    }
    
    const forms = getMegaForms(pokemon.name);
    if (!forms) {
      setMegaForms([]);
      setMegaData({});
      setSelectedForm('base');
      return;
    }
    
    setMegaForms(forms);
    setSelectedForm('base');
    
    // Fetch all mega form data
    const fetchMegaData = async () => {
      setLoadingMega(true);
      const dataMap = {};
      for (const formName of forms) {
        const data = await getMegaEvolutionData(formName);
        if (data) {
          dataMap[formName] = data;
        }
      }
      setMegaData(dataMap);
      setLoadingMega(false);
    };
    
    fetchMegaData();
  }, [pokemon]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashLoader(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchAll() {
      setAllLoading(true);
      setAllError("");
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
        if (!res.ok) throw new Error('Failed to load Pokémon list');
        const data = await res.json();
        setAllPokemons(data.results);
      } catch (err) {
        setAllError(err.message);
      } finally {
        setAllLoading(false);
      }
    }
    fetchAll();
  }, []);

  const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };

  const handleInput = (e) => {
    setSearch(e.target.value);
    if (error) setError(""); 
  };

  const handleSearch = async () => {
    const query = search.trim().toLowerCase();
    if (!query) return;
    setLoading(true);
    setError("");
    setPokemon(null);
    try {
      const data = await getPokemon(query);
      console.log('Fetched pokemon:', data); 
      setPokemon(data);
      setSearch(""); 
    } catch (err) {
      console.error('Search error:', err); 
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) return;
    if (allLoading || allPokemons.length === 0) return;
    const match = allPokemons.find(p => p.name === query);
    if (!match) return;
    if (pokemon && pokemon.name === match.name) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPokemon(query);
        if (cancelled) return;
        setPokemon(data);
        setSearch("");
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [search, allPokemons, allLoading, pokemon]);

  const handleCardClick = () => setShowInfo(true);
  const handleCloseInfo = () => {
    setShowInfo(false);
    setPokemon(null); 
    setError(""); 
  };

  const handleBackToList = () => {
    setPokemon(null);
    setShowInfo(false);
    setError(""); 
  };

  if (splashLoader) {
    return <PokeLoader />;
  }

  if (allLoading) {
    return <PokeLoader />;
  }

  return (
    <>
      <div className="pokedex-container">
        <div className="pokedex">
        <div className="pokedex-black-line"></div>
          <div className="three-dots-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <img src="/img/pokemon-logo-new.png" alt="Pokedex Logo" className="pokedex-logo" />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a Pokémon..."
            value={search}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <div className="pokemon-grid">
        {loading && <div>Loading...</div>}
        {error && (search || pokemon) && <div style={{ color: 'red' }}>{error}</div>}
        {/* Show all pokemons if no search and no single pokemon selected */}
        {!search && !pokemon && (() => {
          const filteredPokemons = allPokemons.filter(poke => !poke.name.toLowerCase().includes('mega'));
          return (
          <>
            {allError && <div style={{ color: 'red' }}>{allError}</div>}
            {filteredPokemons.length > 0 && filteredPokemons.slice(page * perPage, (page + 1) * perPage).map((poke) => (
              <PokemonCardSummary key={poke.name} name={poke.name} url={poke.url} onClick={async () => {
                setLoading(true);
                setError("");
                try {
                  const data = await getPokemon(poke.name);
                  setPokemon(data);
                  setShowInfo(true); 
                } catch (err) {
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              }} />
            ))}
            {/* Enhanced Pagination controls */}
            {filteredPokemons.length > 0 && (() => {
              const totalPages = Math.max(1, Math.ceil(filteredPokemons.length / perPage));
              if (page < 0) setPage(0);
              if (page > totalPages - 1) setPage(totalPages - 1);
              return (
                <div className="pagination-container">
                  <div className="pagination">
                    <button 
                      onClick={() => setPage(0)} 
                      disabled={page === 0} 
                      aria-label="First page"
                      className="pagination-btn"
                    >
                      First
                    </button>
                    <button 
                      onClick={() => setPage(p => Math.max(0, p - 1))} 
                      disabled={page === 0}
                      className="pagination-btn"
                    >
                      Prev
                    </button>
                    <span className="pagination-info">
                      Page {page + 1} of {totalPages}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={page + 1}
                      onChange={e => {
                        let val = Number(e.target.value);
                        if (isNaN(val)) return;
                        val = Math.max(1, Math.min(totalPages, val));
                        setPage(val - 1);
                      }}
                      className="pagination-input"
                      aria-label="Jump to page"
                      title="Jump to page"
                    />
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                      disabled={page >= totalPages - 1}
                      className="pagination-btn"
                    >
                      Next 
                    </button>
                    <button 
                      onClick={() => setPage(totalPages - 1)} 
                      disabled={page >= totalPages - 1} 
                      aria-label="Last page"
                      className="pagination-btn"
                    >
                      Last 
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        );})()}
        {/* Always show single searched or selected pokemon if set */}
        {pokemon && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={handleBackToList}
              className="back-button"
            >
              ← Back to List
            </button>
            <div 
              className="pokemon-card" 
              onClick={handleCardClick} 
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setIsMainCardHovered(true)}
              onMouseLeave={() => setIsMainCardHovered(false)}
            >
              <img
                src={
                  isMainCardHovered 
                    ? pokemon.sprites?.other?.home?.front_shiny || pokemon.sprites?.other?.['official-artwork']?.front_shiny || pokemon.sprites?.front_shiny || pokemon.sprites?.other?.home?.front_default || pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default
                    : pokemon.sprites?.other?.home?.front_default || pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default
                }
                alt={`${pokemon.name}${isMainCardHovered ? ' (shiny)' : ''}`}
                style={{ 
                  width: '96px', 
                  height: '96px',
                  transition: 'transform 0.3s ease, filter 0.3s ease',
                  transform: isMainCardHovered ? 'scale(1.05)' : 'scale(1)',
                  filter: isMainCardHovered ? 'brightness(1.1) contrast(1.1)' : 'none'
                }}
              />
              <h2 style={{ textTransform: 'capitalize' }}>{pokemon.name}</h2>
              <p>
                ID: {pokemon.id}
                {isMainCardHovered && <span style={{ color: '#ffd700', marginLeft: '8px', fontSize: '0.9em' }}>✨ Shiny</span>}
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {pokemon.types.map(t => (
                  <span
                    key={t.type.name}
                    style={{
                      backgroundColor: typeColors[t.type.name] || '#ccc',
                      color: '#fff',
                      borderRadius: '8px',
                      padding: '2px 10px',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      fontSize: '0.95em',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
                    }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal popup for detailed info */}
      {showInfo && pokemon && (() => {
        // Determine which pokemon data to display (base or mega form)
        const displayPokemon = selectedForm === 'base' ? pokemon : (megaData[selectedForm] || pokemon);
        const primaryType = displayPokemon.types[0]?.type?.name;
        const typeColor = typeColors[primaryType] || '#be1c1c';
        const pct = (n) => `${Math.min(100, Math.round((n / 200) * 100))}%`;
        const hasMegaEvolutions = megaForms.length > 0;
        
        return (
          <div className="modal-overlay" onClick={handleCloseInfo}>
            <div
              className={`modal-card enhanced ${selectedForm !== 'base' ? 'mega-active' : ''}`}
              style={{ border: `4px solid ${typeColor}`, '--type-color': typeColor }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-controls">
                <button onClick={handleBackToList} className="back-button" style={{ marginRight: 'auto' }}>
                  ← Back to List
                </button>
                <button onClick={handleCloseInfo} className="modal-close" aria-label="Close">×</button>
              </div>

              <div className="modal-header">
                <div className={`modal-hero ${selectedForm !== 'base' ? 'mega-hero' : ''}`}>
                  <img
                    src={displayPokemon.sprites?.other?.home?.front_default || displayPokemon.sprites?.other?.['official-artwork']?.front_default || displayPokemon.sprites?.front_default}
                    alt={displayPokemon.name}
                    className={`modal-sprite ${selectedForm !== 'base' ? 'mega-sprite' : ''}`}
                  />
                </div>
                <h2 className="modal-title">
                  {selectedForm === 'base' ? pokemon.name : displayPokemon.name.replace('-', ' ').replace('mega', 'Mega')}
                  {selectedForm !== 'base' && <span className="mega-badge">MEGA</span>}
                </h2>
                <p className="modal-subtitle">No. {pokemon.id}</p>
                <div className="type-chips">
                  {displayPokemon.types.map((t) => (
                    <span
                      key={t.type.name}
                      className="type-chip"
                      style={{ backgroundColor: typeColors[t.type.name] || '#ccc' }}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mega Evolution Form Selector */}
              {hasMegaEvolutions && (
                <section className="section mega-section">
                  <h3 className="section-title mega-title">
                    <span className="mega-icon">💎</span> Mega Evolution
                  </h3>
                  <div className="mega-form-selector">
                    <button 
                      className={`mega-form-btn ${selectedForm === 'base' ? 'active' : ''}`}
                      onClick={() => setSelectedForm('base')}
                    >
                      Base Form
                    </button>
                    {megaForms.map(formName => (
                      <button
                        key={formName}
                        className={`mega-form-btn mega ${selectedForm === formName ? 'active' : ''}`}
                        onClick={() => setSelectedForm(formName)}
                        disabled={!megaData[formName] && loadingMega}
                      >
                        {loadingMega && !megaData[formName] ? '...' : getMegaDisplayName(formName)}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <div className="info-grid">
                <div className="info-item"><span>Height</span><strong>{(displayPokemon.height / 10).toFixed(1)} m</strong></div>
                <div className="info-item"><span>Weight</span><strong>{(displayPokemon.weight / 10).toFixed(1)} kg</strong></div>
                {typeof displayPokemon.base_experience === 'number' && (
                  <div className="info-item"><span>Base XP</span><strong>{displayPokemon.base_experience}</strong></div>
                )}
              </div>

              <section className="section">
                <h3 className="section-title">Abilities</h3>
                <div className="ability-badges">
                  {displayPokemon.abilities && displayPokemon.abilities.map((a) => (
                    <span
                      key={a.ability.name}
                      className={"ability-badge" + (a.is_hidden ? " hidden" : "")}
                      title={a.is_hidden ? 'Hidden ability' : 'Ability'}
                    >
                      {a.ability.name}
                    </span>
                  ))}
                </div>
              </section>

              <section className="section">
                <h3 className="section-title">Stats</h3>
                <ul className="stat-list">
                  {displayPokemon.stats && displayPokemon.stats.map((s) => (
                    <li key={s.stat.name} className="stat-row">
                      <span className="stat-label">{s.stat.name.replace('-', ' ')}</span>
                      <div className="stat-bar">
                        <div className="stat-bar-inner" style={{ '--target': pct(s.base_stat) }} />
                      </div>
                      <span className="stat-value">{s.base_stat}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        );
      })()}
      <MusicPlayer />
      <Footer />
    </>
  );
}


// Summary card for all pokemons 
function PokemonCardSummary({ name, url, onClick }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const id = url.split('/').filter(Boolean).pop();
  
  // Normal sprites
  const sprite3D = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
  const officialArt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const staticUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  
  // Shiny sprites
  const shinySprite3D = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${id}.png`;
  const shinyOfficialArt = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
  const shinyStaticUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
  
  const currentSprite = isHovered ? shinySprite3D : sprite3D;
  const currentOfficialArt = isHovered ? shinyOfficialArt : officialArt;
  const currentStaticUrl = isHovered ? shinyStaticUrl : staticUrl;
  
  return (
    <div 
      className="pokemon-card" 
      onClick={onClick} 
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={currentSprite}
        alt={`${name}${isHovered ? ' (shiny)' : ''}`} 
        style={{ 
          width: '96px', 
          height: '96px',
          transition: 'transform 0.3s ease, filter 0.3s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'none'
        }}
        onError={(e) => {
          if (e.target.src.includes('home')) {
            e.target.src = currentOfficialArt;
          } else if (e.target.src.includes('official-artwork')) {
            e.target.src = currentStaticUrl;
          }
        }}
      />
      <h2 style={{ textTransform: 'capitalize' }}>{name}</h2>
      <p style={{ color: '#888', fontWeight: 500 }}>
        ID: {id}
        {isHovered && <span style={{ color: '#ffd700', marginLeft: '8px', fontSize: '0.9em' }}>✨ Shiny</span>}
      </p>
    </div>
  );
}

export default App;
