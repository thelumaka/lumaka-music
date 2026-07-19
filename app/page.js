'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import '@fontsource/jost';

const BASE_URL = 'https://pub-f635042d84104c89b8ed1dd8253ad874.r2.dev/';

const ACCENT = '#71BCFF';
const BG = '#272D37';

const categories = ['all', 'atmosphere', 'energy', 'drama'];

const allTags = [
  'synthetic',
  'organic',
  'chiptune',
  'playful',
  'tense',
  'melancholic',
  'mysterious',
  'warm',
  'determined',
  'eerie',
  'grand',
];

const tracksData = [
  {
    id: 1,
    title: 'Towerful',
    file: 'towerful',
    category: 'drama',
    tags: ['warm', 'organic'],
    full: '#',
  },
  {
    id: 2,
    title: 'Liquor Suite',
    file: 'liquor_suite',
    category: 'atmosphere',
    tags: ['melancholic', 'organic'],
    full: '#',
  },
  {
    id: 3,
    title: 'Supernova Waltz',
    file: 'supernowa_waltz',
    category: 'drama',
    tags: ['grand', 'synthetic'],
    full: '#',
  },
  {
    id: 4,
    title: 'Long Way Up',
    file: 'long_way_up',
    category: 'energy',
    tags: ['determined', 'synthetic'],
    full: '#',
  },
  {
    id: 5,
    title: 'Below Zero',
    file: 'below_zero',
    category: 'atmosphere',
    tags: ['melancholic', 'chiptune'],
    full: '#',
  },
  {
    id: 6,
    title: 'Clock Game',
    file: 'clock_game',
    category: 'energy',
    tags: ['tense', 'chiptune'],
    full: '#',
  },
  {
    id: 7,
    title: 'Make Haste',
    file: 'make_haste',
    category: 'energy',
    tags: ['playful', 'chiptune'],
    full: '#',
  },
  {
    id: 8,
    title: 'Dusk',
    file: 'dusk',
    category: 'atmosphere',
    tags: ['warm', 'synthetic'],
    full: '#',
  },
  {
    id: 9,
    title: 'Noon',
    file: 'noon',
    category: 'energy',
    tags: ['playful', 'synthetic'],
    full: '#',
  },
  {
    id: 10,
    title: 'Afternoon',
    file: 'afternoon',
    category: 'energy',
    tags: ['playful', 'synthetic'],
    full: '#',
  },
  {
    id: 11,
    title: 'Dawn',
    file: 'dawn',
    category: 'atmosphere',
    tags: ['warm', 'synthetic'],
    full: '#',
  },
  {
    id: 12,
    title: 'Ups and Downs',
    file: 'ups_and_downs',
    category: 'energy',
    tags: ['playful', 'chiptune'],
    full: '#',
  },
  {
    id: 13,
    title: 'Bare Walls',
    file: 'bare_walls',
    category: 'atmosphere',
    tags: ['mysterious', 'synthetic'],
    full: '#',
  },
  {
    id: 14,
    title: 'Breeze',
    file: 'breeze',
    category: 'atmosphere',
    tags: ['warm', 'organic'],
    full: '#',
  },
  {
    id: 15,
    title: 'Pastel Pink And Orange',
    file: 'pastel_pink_and_orange',
    category: 'atmosphere',
    tags: ['warm', 'organic'],
    full: '#',
  },
  {
    id: 16,
    title: 'And Then Everything Stopped',
    file: 'and_then_everything_stopped',
    category: 'drama',
    tags: ['mysterious', 'synthetic'],
    full: '#',
  },
  {
    id: 17,
    title: 'Empty Streets',
    file: 'empty_streets',
    category: 'atmosphere',
    tags: ['eerie', 'melancholic', 'synthetic'],
    full: '#',
  },
  {
    id: 18,
    title: 'Cemetery',
    file: 'cemetery',
    category: 'atmosphere',
    tags: ['eerie', 'synthetic'],
    full: '#',
  },
  {
    id: 19,
    title: 'Stained Ivory',
    file: 'stained_ivory',
    category: 'atmosphere',
    tags: ['eerie', 'synthetic'],
    full: '#',
  },
  {
    id: 20,
    title: 'Chapel',
    file: 'chapel',
    category: 'atmosphere',
    tags: ['eerie', 'synthetic'],
    full: '#',
  },
  {
    id: 21,
    title: 'Pillow',
    file: 'pillow',
    category: 'atmosphere',
    tags: ['eerie', 'melancholic', 'synthetic'],
    full: '#',
  },
  {
    id: 22,
    title: 'Wanderlust',
    file: 'wanderlust',
    category: 'drama',
    tags: ['melancholic', 'organic'],
    full: '#',
  },
  {
    id: 23,
    title: 'Intensive Chill',
    file: 'intensive_chill',
    category: 'energy',
    tags: ['playful', 'synthetic'],
    full: '#',
  },
  {
    id: 24,
    title: 'Chiaroscuro',
    file: 'chiaroscuro',
    category: 'atmosphere',
    tags: ['eerie', 'organic'],
    full: '#',
  },
  {
    id: 25,
    title: 'Antarktis-hendelsen',
    file: 'antarktis-hendelsen',
    category: 'drama',
    tags: ['tense', 'mysterious', 'synthetic'],
    full: '#',
  },
  {
    id: 26,
    title: 'Soda Blanket',
    file: 'soda_blanket',
    category: 'drama',
    tags: ['determined', 'synthetic'],
    full: '#',
  },
  {
    id: 27,
    title: 'Mörkheimr',
    file: 'morkheimr',
    category: 'atmosphere',
    tags: ['melancholic', 'mysterious', 'organic'],
    full: '#',
  },
  {
    id: 28,
    title: 'Weightless',
    file: 'weightless',
    category: 'atmosphere',
    tags: ['melancholic', 'synthetic'],
    full: '#',
  },
  {
    id: 29,
    title: 'From the Archives of Soulcatchers',
    file: 'from_the_archives_of_soulcatchers',
    category: 'drama',
    tags: ['grand', 'organic'],
    full: '#',
  },
  {
    id: 30,
    title: 'To the Stars',
    file: 'to_the_stars',
    category: 'drama',
    tags: ['determined', 'chiptune'],
    full: '#',
  },
  {
    id: 31,
    title: '一',
    file: '一',
    category: 'energy',
    tags: ['determined', 'chiptune'],
    full: '#',
  },
].sort((a, b) => b.id - a.id);

export default function MusicSite() {
  const handleTap = track => {
    if (!isTouch) return;

    const a = audioRef.current;

    if (!a) return;

    if (currentId === track.id) {
      if (!a.paused) {
        a.pause();
      } else {
        a.play();
      }
    } else {
      playPreview(track);
    }

    setHoveredId(track.id);
  };
  const audioRef = useRef(null);
  const hoverTimeout = useRef(null);
  const progressInterval = useRef(null);
  const fadeRef = useRef(null);

  const tagsContainerRef = useRef(null);
  const tagRefs = useRef({});

  const [progress, setProgress] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTags, setActiveTags] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const [volume, setVolume] = useState(0.22);

  const [showAllTags, setShowAllTags] = useState(false);
  const [collapsedTags, setCollapsedTags] = useState([]);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const media = window.matchMedia('(hover: none)');
    setIsTouch(media.matches);
  }, []);

  const visibleTags = allTags
    .map(tag => ({ tag, count: getTagCount(tag) }))
    .filter(({ count }) => count > 0);

  useLayoutEffect(() => {
    const calculateVisibleTags = () => {
      if (!tagsContainerRef.current) return;

      const rows = [];

      visibleTags.forEach(({ tag }) => {
        const el = tagRefs.current[tag];
        if (!el) return;

        const top = el.offsetTop;

        if (!rows.includes(top)) {
          rows.push(top);
        }
      });

      if (rows.length <= 2) {
        setNeedsCollapse(false);
        setCollapsedTags(visibleTags);
        return;
      }

      setNeedsCollapse(true);

      const secondRowTop = rows[1];

      const fitting = [];

      visibleTags.forEach(item => {
        const el = tagRefs.current[item.tag];
        if (!el) return;

        if (el.offsetTop <= secondRowTop) {
          fitting.push(item);
        }
      });

      fitting.pop();

      setCollapsedTags(fitting);
    };

    setTimeout(calculateVisibleTags, 0);

    window.addEventListener('resize', calculateVisibleTags);

    return () => {
      window.removeEventListener('resize', calculateVisibleTags);
    };
  }, [activeCategory, activeTags]);

  const toggleTag = tag => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAllTags = () => setActiveTags([]);

  const filteredTracks = tracksData.filter(track => {
    const categoryMatch =
      activeCategory === 'all' || track.category === activeCategory;

    const tagMatch =
      activeTags.length === 0 ||
      activeTags.every(tag => track.tags.includes(tag));

    return categoryMatch && tagMatch;
  });

  function getTagCount(tag) {
    return tracksData.filter(track => {
      const categoryMatch =
        activeCategory === 'all' || track.category === activeCategory;

      if (!categoryMatch) return false;
      if (!track.tags.includes(tag)) return false;

      const otherActiveTags = activeTags.filter(t => t !== tag);

      const otherTagsMatch =
        otherActiveTags.length === 0 ||
        otherActiveTags.every(t => track.tags.includes(t));

      return otherTagsMatch;
    }).length;
  }

  const buildPreview = file => `${BASE_URL}${file}_clip.mp3`;

  const clearFade = () => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const fadeTo = (target, cb) => {
    clearFade();

    let vol = audioRef.current.volume;

    fadeRef.current = setInterval(() => {
      const diff = target - vol;

      vol += diff * 0.06;

      if (Math.abs(diff) < 0.01) {
        vol = target;
        clearFade();

        if (cb) cb();
      }

      audioRef.current.volume = vol;
    }, 20);
  };

  const startProgress = id => {
    clearInterval(progressInterval.current);

    progressInterval.current = setInterval(() => {
      const a = audioRef.current;

      if (!a.duration) return;

      const p = a.currentTime / a.duration;

      setProgress({ [id]: p });

      if (p >= 0.98) {
        fadeTo(0, () => {
          a.currentTime = 0;
          fadeTo(volume);
        });
      }
    }, 50);
  };

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

  const handleEnter = track => {
    if (isTouch) return;

    setHoveredId(track.id);

    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => playPreview(track), 350);
  };

  const handleLeave = () => {
    if (isTouch) return;

    setHoveredId(null);

    clearTimeout(hoverTimeout.current);

    stopPreview();
  };

  const shownTags = needsCollapse && !showAllTags ? collapsedTags : visibleTags;

  return (
    <div
      className='min-h-screen text-white font-[default]'
      style={{ background: BG }}
    >
      {/* HEADER */}
      <div className='px-4 md:px-32 pt-6 md:pt-32'>
        <div className='mb-8 md:mb-10 relative flex items-end justify-between min-h-[300px] md:min-h-[180px]'>
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

          <div style={{ maxWidth: '900px', zIndex: 2 }}>
            <div
              className='text-3xl md:text-5xl font-light tracking-wide'
              style={{ letterSpacing: '0.08em' }}
            >
              lumaka's music stash
            </div>

            <div
              className='mt-3 text-sm md:text-base font-light tracking-wide'
              style={{ opacity: 0.5 }}
            >
              I write atmospheric stuff. Available for commissions and
              collaborations.
            </div>
          </div>

          <img
            src={`${BASE_URL}header_visual.png`}
            alt=''
            className='hidden md:block'
            style={{
              position: 'absolute',
              right: '-2%',
              bottom: '-10%',
              width: '420px',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* CONTROLS */}
      <div
        className='sticky top-0 z-50'
        style={{
          background: 'rgba(39,45,55,0.92)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className='px-4 md:px-32 pt-3 pb-4'>
          {/* tabs */}
          <div className='flex mb-3 border-b' style={{ borderColor: ACCENT }}>
            {categories.map(cat => {
              const active = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className='text-sm'
                  style={{
                    background: active ? ACCENT : 'transparent',
                    color: active ? 'black' : 'white',
                    padding: '7px 14px',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* hidden measure layer */}
          <div
            ref={tagsContainerRef}
            className='absolute opacity-0 pointer-events-none flex gap-1.5 flex-wrap w-[calc(100%-2rem)] md:w-[calc(100%-16rem)]'
          >
            {visibleTags.map(({ tag, count }) => (
              <div
                key={tag}
                ref={el => (tagRefs.current[tag] = el)}
                style={{
                  padding: '5px 8px',
                  border: '1px solid white',
                  fontSize: '12px',
                }}
              >
                {tag} ({count})
              </div>
            ))}
          </div>

          {/* actual tags */}
          <div className='flex gap-1.5 flex-wrap items-center'>
            {shownTags.map(({ tag, count }) => {
              const active = activeTags.includes(tag);

              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className='text-xs border transition font-light tracking-wide flex items-center gap-1'
                  style={{
                    background: active ? ACCENT : 'transparent',
                    color: active ? 'black' : 'white',
                    borderColor: active ? ACCENT : 'white',
                    cursor: 'pointer',
                    padding: '5px 8px',
                  }}
                >
                  {tag}

                  <span
                    style={{
                      fontSize: '0.7rem',
                      opacity: active ? 0.7 : 0.5,
                    }}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}

            {needsCollapse && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className='text-xs'
                style={{
                  color: ACCENT,
                  padding: '5px 4px',
                  flexShrink: 0,
                }}
              >
                {showAllTags ? 'less' : 'show all'}
              </button>
            )}

            {activeTags.length > 0 && (
              <button
                onClick={clearAllTags}
                className='text-xs border'
                style={{
                  color: ACCENT,
                  borderColor: ACCENT,
                  padding: '5px 8px',
                }}
              >
                clear
              </button>
            )}
          </div>

          {/* RPG DIALOGUE VOLUME BOX */}
          {!isTouch && (
            <div
              className='mt-6'
              style={{
                border: `1px solid ${ACCENT}`,
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
                  borderRight: `1px solid ${ACCENT}`,
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
                {/* TEXT */}
                <div
                  style={{
                    fontSize: '1.15rem',
                    lineHeight: 1.35,
                    letterSpacing: '0.03em',
                    paddingRight: '12px',
                  }}
                >
                  Wait! Set the volume first. Playback starts on hover, genius.
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
                    {/* LINE */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'rgba(255,255,255,0.25)',
                      }}
                    />

                    {/* RANGE */}
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

      {/* TRACKS */}
      <div className='px-4 md:px-32 pt-5 pb-24'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {filteredTracks.map(track => {
            const fill = (progress[track.id] || 0) * 100;
            const isLoading = loadingId === track.id;

            const isHovered =
              hoveredId === track.id || (isTouch && currentId === track.id);

            return (
              <div
                key={track.id}
                onMouseEnter={() => handleEnter(track)}
                onMouseLeave={handleLeave}
                onClick={() => handleTap(track)}
                className='relative overflow-hidden cursor-pointer'
                style={{
                  border: `1px solid ${isHovered ? ACCENT : 'white'}`,
                  minHeight: '104px',
                }}
              >
                {/* progress */}
                <div
                  className='absolute top-0 left-0 h-full pointer-events-none'
                  style={{
                    width: `${fill}%`,
                    background: ACCENT,
                    opacity: 0.12,
                  }}
                />

                {/* full track */}
                <a
                  href={track.full}
                  target='_blank'
                  rel='noopener noreferrer'
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
                    transform: isHovered ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
                    letterSpacing: '0.14em',
                    fontSize: '0.68rem',
                    zIndex: 3,
                  }}
                >
                  FULL TRACK
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
                        letterSpacing: '0.02em',
                        color: isHovered ? ACCENT : 'white',
                      }}
                    >
                      {track.title}
                    </div>

                    <div
                      className='flex gap-x-3 gap-y-2 mt-2 flex-wrap'
                      style={{ lineHeight: '1' }}
                    >
                      {track.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className='text-xs leading-none'
                          style={{
                            color: isHovered ? ACCENT : 'white',
                            opacity: isHovered ? 0.8 : 0.5,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          className='mt-24 pt-6 border-t text-sm flex flex-col md:flex-row justify-between gap-4'
          style={{
            borderColor: 'white',
            opacity: 0.7,
          }}
        >
          <div>thelumaka@gmail.com</div>

          <div>© {new Date().getFullYear()} Lumaka</div>

          <div className='flex gap-6'>
            <a
              href='https://www.youtube.com/@the.lumaka'
              className='hover:underline'
            >
              YouTube
            </a>

            <a href='https://lumaka.bandcamp.com/' className='hover:underline'>
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

      <audio ref={audioRef} preload='auto' />
    </div>
  );
}
