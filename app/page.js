'use client';

import { useState, useRef, useEffect } from 'react';
import '@fontsource/jost';

const BASE_URL =
  'https://pub-f635042d84104c89b8ed1dd8253ad874.r2.dev/';

const ACCENT = '#71BCFF';
const BG = '#272D37';

import {
  categories,
  tracksData,
} from './tracks';

export default function MusicSite() {
  const audioRef = useRef(null);
  const hoverTimeout = useRef(null);
  const progressInterval = useRef(null);
  const fadeRef = useRef(null);

  const controlsRef = useRef(null);
  const pageTopRef = useRef(null);

  const collectionRefs = useRef({});
  const collectionButtonRefs = useRef({});

  const [progress, setProgress] = useState({});
  const [activeCollection, setActiveCollection] = useState(
    categories[1] || null
  );
  const [currentId, setCurrentId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const [volume, setVolume] = useState(0.22);
  const [loadingId, setLoadingId] = useState(null);

  /*
   * Collections from Google Sheets.
   * "all" is not an actual collection.
   */
  const collectionNames = categories.filter(
    category => category !== 'all'
  );

  /*
   * Detect touch devices.
   */
  useEffect(() => {
    const media = window.matchMedia('(hover: none)');
    setIsTouch(media.matches);
  }, []);

  /*
   * Pause audio when the page is hidden / left.
   */
  useEffect(() => {
    const pauseAudio = () => {
      const a = audioRef.current;

      if (!a) return;

      a.pause();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAudio();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    window.addEventListener('pagehide', pauseAudio);

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      window.removeEventListener('pagehide', pauseAudio);
    };
  }, []);

  /*
   * Detect which collection is currently being viewed.
   */
  useEffect(() => {
    const handleScroll = () => {
      const controls = controlsRef.current;

      if (!controls) return;

      const controlHeight =
        controls.getBoundingClientRect().height;

      let closestSection = null;
      let closestDistance = Infinity;

      /*
       * Regular collections.
       */
      collectionNames.forEach(name => {
        const section = collectionRefs.current[name];

        if (!section) return;

        const rect = section.getBoundingClientRect();

        const distance = Math.abs(
          rect.top - controlHeight - 20
        );

        if (
          rect.top <= controlHeight + 180 &&
          distance < closestDistance
        ) {
          closestDistance = distance;
          closestSection = name;
        }
      });

      /*
       * All tracks section.
       */
      const allTracksSection =
        collectionRefs.current['All tracks'];

      if (allTracksSection) {
        const rect =
          allTracksSection.getBoundingClientRect();

        const distance = Math.abs(
          rect.top - controlHeight - 20
        );

        if (
          rect.top <= controlHeight + 180 &&
          distance < closestDistance
        ) {
          closestDistance = distance;
          closestSection = 'All tracks';
        }
      }

      if (closestSection) {
        setActiveCollection(closestSection);
      }
    };

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [collectionNames]);

  /*
   * Keep the active selector item visible horizontally.
   * Particularly useful on mobile.
   */
  useEffect(() => {
    if (!activeCollection) return;

    const button =
      collectionButtonRefs.current[activeCollection];

    if (!button) return;

    button.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeCollection]);

  /*
   * Scroll to a collection.
   */
  const scrollToCollection = collection => {
    const section =
      collectionRefs.current[collection];

    if (!section) return;

    const controls = controlsRef.current;

    const controlHeight = controls
      ? controls.getBoundingClientRect().height
      : 0;

    const y =
      window.scrollY +
      section.getBoundingClientRect().top -
      controlHeight -
      16;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: 'smooth',
    });

    setActiveCollection(collection);
  };

  /*
   * AUDIO
   */

  const clearFade = () => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const fadeTo = (target, cb) => {
    clearFade();

    const a = audioRef.current;

    if (!a) return;

    let vol = a.volume;

    fadeRef.current = setInterval(() => {
      const diff = target - vol;

      vol += diff * 0.06;

      if (Math.abs(diff) < 0.01) {
        vol = target;
        clearFade();

        if (cb) cb();
      }

      a.volume = vol;
    }, 20);
  };

  const startProgress = id => {
    clearInterval(progressInterval.current);

    progressInterval.current = setInterval(() => {
      const a = audioRef.current;

      if (!a || !a.duration) return;

      const p = a.currentTime / a.duration;

      setProgress({
        [id]: p,
      });

      if (p >= 0.98) {
        fadeTo(0, () => {
          a.currentTime = 0;
          fadeTo(volume);
        });
      }
    }, 50);
  };

  const buildPreview = file =>
    `${BASE_URL}${file}_clip.mp3`;

  const playPreview = async track => {
    const a = audioRef.current;

    if (!a) return;

    if (isTouch) {
      setLoadingId(track.id);
    }

    clearFade();

    const newSrc = buildPreview(track.file);

    if (a.src !== newSrc) {
      a.src = newSrc;
      a.currentTime = 0;
    }

    a.volume = 0;

    try {
      await a.play();

      setCurrentId(track.id);

      fadeTo(volume);

      startProgress(track.id);
    } catch (error) {
      console.error('Audio playback failed:', error);
    } finally {
      if (isTouch) {
        setLoadingId(null);
      }
    }
  };

  const stopPreview = () => {
    const a = audioRef.current;

    if (!a) return;

    fadeTo(0, () => {
      a.pause();
      a.currentTime = 0;
    });

    clearInterval(progressInterval.current);

    setProgress({});
    setCurrentId(null);
  };

  const handleTap = track => {
    if (!isTouch) return;

    const a = audioRef.current;

    if (!a) return;

    if (currentId === track.id) {
      if (!a.paused) {
        a.pause();
      } else {
        a.play().catch(error => {
          console.error('Audio playback failed:', error);
        });
      }
    } else {
      playPreview(track);
    }

    setHoveredId(track.id);
  };

  const handleEnter = track => {
    if (isTouch) return;

    setHoveredId(track.id);

    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      playPreview(track);
    }, 350);
  };

  const handleLeave = () => {
    if (isTouch) return;

    setHoveredId(null);

    clearTimeout(hoverTimeout.current);

    stopPreview();
  };

  /*
   * TRACK CARD
   */
  const renderTrack = track => {
    const fill = (progress[track.id] || 0) * 100;
    const isLoading = loadingId === track.id;

    const isHovered =
      hoveredId === track.id ||
      (isTouch && currentId === track.id);

    return (
      <div
        key={track.id}
        onMouseEnter={() => handleEnter(track)}
        onMouseLeave={handleLeave}
        onClick={() => handleTap(track)}
        className='relative overflow-hidden cursor-pointer'
        style={{
          border: `1px solid ${
            isHovered ? ACCENT : 'white'
          }`,
          minHeight: '104px',
        }}
      >
        {/* PROGRESS */}
        <div
          className='absolute top-0 left-0 h-full pointer-events-none'
          style={{
            width: `${fill}%`,
            background: ACCENT,
            opacity: 0.12,
          }}
        />

        {/* FULL TRACK / DEMO */}
        <a
          href={track.full || '#'}
          target='_blank'
          rel='noopener noreferrer'
          onClick={e => {
            if (!track.full) {
              e.preventDefault();
            }
          }}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '34px',
            background: ACCENT,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            writingMode: 'vertical-rl',
            transform: isHovered
              ? 'translateX(0)'
              : 'translateX(100%)',
            transition:
              'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
            letterSpacing: '0.14em',
            fontSize: '0.68rem',
            zIndex: 3,
            pointerEvents: track.full ? 'auto' : 'none',
            opacity: track.full ? 1 : 0.6,
          }}
        >
          {track.full ? 'FULL TRACK' : 'DEMO'}
        </a>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            paddingRight: '56px',
            minHeight: '104px',
          }}
        >
          {/* LOADING */}
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(39,45,55,0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  opacity: 0.8,
                }}
              >
                LOADING...
              </div>
            </div>
          )}

          {/* IMAGE */}
          <img
            src={`${BASE_URL}${track.file}.png`}
            alt=''
            style={{
              width: '72px',
              height: '72px',
              minWidth: '72px',
              background: '#000',
              position: 'relative',
              zIndex: 1,
            }}
          />

          {/* TEXT */}
          <div
            className='flex-1 min-w-0'
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              className='font-bold leading-tight'
              style={{
                fontSize: '1.1rem',
                letterSpacing: '0.08em',
                color: isHovered ? ACCENT : 'white',
              }}
            >
              {track.title}
            </div>

            <div
              className='mt-2 text-sm font-light'
              style={{
                color: isHovered ? ACCENT : 'white',
                opacity: isHovered ? 0.8 : 0.5,
                lineHeight: 1.3,
                fontStyle: 'italic',
              }}
            >
              {track.line}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={pageTopRef}
      className='min-h-screen text-white font-[default]'
      style={{
        background: BG,
      }}
    >
      {/* HEADER */}
      <div className='px-4 md:px-32 pt-6 md:pt-32 overflow-visible'>
        <div className='mb-8 md:mb-10 relative flex items-end justify-between min-h-[300px] md:min-h-[120px] overflow-visible'>
          <img
            src={`${BASE_URL}header_visual.png`}
            alt=''
            className='md:hidden'
            style={{
              position: 'absolute',
              left: '50%',
              top: '42%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '500px',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '900px',
              zIndex: 2,
            }}
          >
            <div
              className='text-3xl md:text-5xl font-light tracking-wide'
              style={{
                letterSpacing: '0.08em',
              }}
            >
              lumaka's music stash
            </div>

            <div
              className='mt-3 text-sm md:text-base font-light tracking-wide'
              style={{
                opacity: 0.5,
              }}
            >
              I write atmospheric stuff. Available for commissions and
              collaborations.
            </div>
          </div>
        </div>
      </div>

      {/* COLLECTION NAVIGATION */}
      <div
        ref={controlsRef}
        className='sticky top-0 z-50'
        style={{
          background: 'rgba(39,45,55,0.92)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className='px-4 md:px-32 pt-3 pb-4'>
          {/* COLLECTION SELECTOR */}
          <div
            className='flex gap-1.5 overflow-x-auto flex-nowrap border-b'
            style={{
              borderColor: ACCENT,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {collectionNames.map(collection => {
              const active =
                activeCollection === collection;

              return (
                <button
                  key={collection}
                  ref={el => {
                    collectionButtonRefs.current[collection] =
                      el;
                  }}
                  onClick={() =>
                    scrollToCollection(collection)
                  }
                  className='text-sm flex-shrink-0 whitespace-nowrap'
                  style={{
                    background: active
                      ? ACCENT
                      : 'transparent',
                    color: active ? 'black' : 'white',
                    padding: '7px 14px',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                  }}
                >
                  {collection}
                </button>
              );
            })}

            {/* ALL TRACKS */}
            <button
              ref={el => {
                collectionButtonRefs.current['All tracks'] = el;
              }}
              onClick={() =>
                scrollToCollection('All tracks')
              }
              className='text-sm flex-shrink-0 whitespace-nowrap'
              style={{
                background:
                  activeCollection === 'All tracks'
                    ? ACCENT
                    : 'transparent',
                color:
                  activeCollection === 'All tracks'
                    ? 'black'
                    : 'white',
                padding: '7px 14px',
                marginBottom: '-1px',
                cursor: 'pointer',
              }}
            >
              All tracks
            </button>
          </div>

          {/* RPG DIALOGUE VOLUME BOX */}
          {!isTouch && (
            <div
              className='mt-6'
              style={{
                border: '1px solid white',
                display: 'flex',
                minHeight: '132px',
                overflow: 'hidden',
              }}
            >
              {/* PORTRAIT */}
              <div
                style={{
                  width: '132px',
                  minWidth: '132px',
                  borderRight: '1px solid white',
                  background: '#000',
                }}
              >
                <img
                  src={`${BASE_URL}lumaka_vibing.gif`}
                  alt=''
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* CONTENT */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px 20px 16px 20px',
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: '1.15rem',
                    lineHeight: 1.35,
                    letterSpacing: '0.03em',
                    paddingRight: '12px',
                  }}
                >
                  Wait! Set the volume first. Playback starts on hover!
                </div>

                {/* SLIDER */}
                <div style={{ marginTop: '18px' }}>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      opacity: 0.45,
                      letterSpacing: '0.16em',
                      marginBottom: '10px',
                    }}
                  >
                    VOLUME
                  </div>

                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '1px',
                        background:
                          'rgba(255,255,255,0.25)',
                      }}
                    />

                    <input
                      type='range'
                      min='0'
                      max='1'
                      step='0.01'
                      value={volume}
                      onChange={e => {
                        const v = Number(e.target.value);

                        setVolume(v);

                        if (audioRef.current) {
                          audioRef.current.volume = v;
                        }
                      }}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        accentColor: ACCENT,
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COLLECTIONS */}
      <div className='px-4 md:px-32 pt-8 pb-24'>
        {collectionNames.map(collection => {
          const collectionTracks = tracksData.filter(
            track =>
              track.collections?.includes(collection)
          );

          if (collectionTracks.length === 0) {
            return null;
          }

          return (
            <section
              key={collection}
              ref={el => {
                collectionRefs.current[collection] = el;
              }}
              style={{
                scrollMarginTop: '160px',
                marginBottom: '64px',
              }}
            >
              {/* COLLECTION TITLE */}
              <h2
                className='text-2xl md:text-3xl font-light mb-4'
                style={{
                  letterSpacing: '0.05em',
                }}
              >
                {collection}
              </h2>

              {/* TRACKS */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {collectionTracks.map(renderTrack)}
              </div>
            </section>
          );
        })}

        {/* ALL TRACKS */}
        <section
          ref={el => {
            collectionRefs.current['All tracks'] = el;
          }}
          style={{
            scrollMarginTop: '160px',
            marginBottom: '64px',
          }}
        >
          <h2
            className='text-2xl md:text-3xl font-light mb-4'
            style={{
              letterSpacing: '0.05em',
            }}
          >
            All tracks
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {tracksData.map(renderTrack)}
          </div>
        </section>

        {/* FOOTER */}
        <div
          className='mt-24 pt-6 border-t text-sm flex flex-col md:flex-row justify-between gap-4'
          style={{
            borderColor: 'white',
            opacity: 0.7,
          }}
        >
          <div>thelumaka@gmail.com</div>

          <div>
            © {new Date().getFullYear()} Lumaka
          </div>

          <div className='flex gap-6'>
            <a
              href='https://www.youtube.com/@the.lumaka'
              className='hover:underline'
            >
              YouTube
            </a>

            <a
              href='https://lumaka.bandcamp.com/'
              className='hover:underline'
            >
              Bandcamp
            </a>

            <a
              href='https://mastodon.gamedev.place/home'
              className='hover:underline'
            >
              Mastodon
            </a>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload='auto'
      />
    </div>
  );
}
