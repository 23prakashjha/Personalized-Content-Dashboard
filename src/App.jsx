import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownUp,
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  ExternalLink,
  Feather,
  Flame,
  Headphones,
  Heart,
  LayoutGrid,
  ListFilter,
  Menu,
  Moon,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";
import {
  mockStories,
  stories,
  socialPosts,
  topics as allTopics,
} from "./content.js";
import {
  toggleDarkMode,
  toggleFavorite,
  toggleTopic,
} from "./store.js";

const navigation = [
  { id: "feed", label: "Your feed", icon: LayoutGrid },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "saved", label: "Saved for later", icon: Bookmark },
];

const sourceColors = {
  Read: "sage",
  Listen: "lilac",
  Watch: "peach",
  Community: "blue",
};

function formatDate() {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function App() {
  const dispatch = useDispatch();
  const { favorites, topics: selectedTopics, darkMode } = useSelector(
    (state) => state.preferences,
  );
  const [activeView, setActiveView] = useState("feed");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [orderedIds, setOrderedIds] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const searchInput = useRef(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setQuery(searchText.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    function handleSearchShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    }

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const allContent = useMemo(
    () => [...stories, ...mockStories, ...socialPosts],
    [],
  );

  const displayedContent = useMemo(() => {
    let items = [...allContent];
    if (activeView === "saved") {
      items = items.filter((item) => favorites.includes(item.id));
    } else if (activeView === "trending") {
      items = items.filter(
        (item) =>
          item.trending ||
          ["quiet-internet", "materials-future", "attention-economy", "post-jules"].includes(item.id),
      );
    } else if (selectedTopics.length && !query) {
      items = items.filter((item) => selectedTopics.includes(item.category));
    }

    if (selectedTopic !== "All") {
      items = items.filter((item) => item.category === selectedTopic);
    }

    if (query) {
      const normalizedQuery = query.toLowerCase();
      items = items.filter((item) =>
        [
          item.title,
          item.description,
          item.category,
          item.source,
          item.author,
          item.kind,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }

    if (orderedIds.length && activeView === "feed" && !query) {
      const positions = new Map(orderedIds.map((id, index) => [id, index]));
      items.sort(
        (first, second) =>
          (positions.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
          (positions.get(second.id) ?? Number.MAX_SAFE_INTEGER),
      );
    }

    return items;
  }, [
    activeView,
    allContent,
    favorites,
    orderedIds,
    query,
    selectedTopic,
    selectedTopics,
  ]);

  const visibleContent = displayedContent.slice(0, visibleCount);

  function moveCard(targetId) {
    if (!draggedId || draggedId === targetId) return;
    const current = [...displayedContent];
    const fromIndex = current.findIndex((item) => item.id === draggedId);
    const toIndex = current.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);
    setOrderedIds(current.map((item) => item.id));
    setDraggedId(null);
  }

  function refreshFeed() {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 650);
  }

  function changeView(view) {
    setActiveView(view);
    setSelectedTopic("All");
    setVisibleCount(5);
    setShowMobileNav(false);
  }

  const currentLabel =
    navigation.find((item) => item.id === activeView)?.label ?? "Your feed";
  const activeStory = stories[0];

  return (
    <div className={`app-shell min-h-screen ${darkMode ? "theme-dark" : ""}`}>
      <aside className={`sidebar ${showMobileNav ? "sidebar-open" : ""}`}>
        <a className="brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark">
            <Feather size={19} strokeWidth={1.8} />
          </span>
          <span className="brand-name">good things<span>.</span></span>
        </a>

        <div className="sidebar-profile">
          <div className="avatar avatar-you">J</div>
          <div className="profile-copy">
            <strong>Jamie Parker</strong>
            <span>Your personal space</span>
          </div>
          <button
            className="icon-button profile-more"
            aria-label="Open profile settings"
            onClick={() => setShowSettings(true)}
          >
            <MoreHorizontal size={19} />
          </button>
        </div>

        <div className="sidebar-group">
          <p className="sidebar-label">YOUR SPACE</p>
          <nav aria-label="Main navigation">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                className={`nav-link ${activeView === id ? "active" : ""}`}
                key={id}
                onClick={() => changeView(id)}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {id === "saved" && favorites.length > 0 && (
                  <span className="nav-count">{favorites.length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-group topics-nav">
          <div className="sidebar-label-row">
            <p className="sidebar-label">YOUR INTERESTS</p>
            <button
              className="tiny-icon-button"
              aria-label="Edit interests"
              onClick={() => setShowSettings(true)}
            >
              <Plus size={15} />
            </button>
          </div>
          <div className="interest-list">
            {selectedTopics.map((topic) => (
              <button
                className={`interest-link ${selectedTopic === topic ? "interest-active" : ""}`}
                key={topic}
                onClick={() => {
                  setSelectedTopic(selectedTopic === topic ? "All" : topic);
                  setActiveView("feed");
                  setVisibleCount(5);
                  setShowMobileNav(false);
                }}
              >
                <span className={`topic-dot dot-${topic.toLowerCase()}`} />
                {topic}
              </button>
            ))}
            {!selectedTopics.length && (
              <button className="add-interest" onClick={() => setShowSettings(true)}>
                <Plus size={14} /> Add your first interest
              </button>
            )}
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="note-icon"><Sparkles size={16} /></div>
            <p>A calmer corner<br />of the internet.</p>
            <span>Made for what moves you.</span>
          </div>
          <button className="nav-link sidebar-settings" onClick={() => setShowSettings(true)}>
            <Settings2 size={18} strokeWidth={1.8} />
            <span>Preferences</span>
          </button>
          <div className="sidebar-footer">
            <span>© 2026 Good Things</span>
            <button aria-label="Help and feedback"><CircleHelp size={17} /></button>
          </div>
        </div>
      </aside>

      {showMobileNav && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setShowMobileNav(false)}
        />
      )}

      <main className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            aria-label="Open navigation"
            onClick={() => setShowMobileNav(true)}
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            <span>My space</span><span className="breadcrumb-slash">/</span>
            <strong>{currentLabel}</strong>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                ref={searchInput}
                type="search"
                placeholder="Search anything..."
                aria-label="Search your feed"
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setVisibleCount(5);
                }}
              />
              {searchText && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => setSearchText("")}
                >
                  <X size={14} />
                </button>
              )}
              {!searchText && <kbd>⌘ K</kbd>}
            </label>
            <button
              className="icon-button theme-toggle"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => dispatch(toggleDarkMode())}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="top-avatar avatar avatar-you" onClick={() => setShowSettings(true)} aria-label="Open account settings">J</button>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="live-dot" /> YOUR DAILY EDITION</div>
              <h1>{activeView === "feed" ? <>A little good <em>for you.</em></> : currentLabel}</h1>
              <p className="page-subtitle">
                {activeView === "feed"
                  ? "A thoughtful mix of things worth your time."
                  : activeView === "trending"
                    ? "The stories making their way around today."
                    : "The good stuff you wanted to come back to."}
              </p>
            </div>
            <div className="heading-right">
              <span className="date-label">{formatDate()}</span>
              <button className={`refresh-button ${refreshing ? "is-refreshing" : ""}`} onClick={refreshFeed}>
                <ArrowDownUp size={14} />
                {refreshing ? "Refreshing" : "Refresh"}
              </button>
            </div>
          </div>

          {activeView === "feed" && !query && selectedTopic === "All" && (
            <section className="feature-panel" aria-label="Featured story">
              <div className="feature-copy">
                <div className="feature-meta">
                  <span className="editor-pick"><Sparkles size={12} /> TODAY'S EDITOR PICK</span>
                  <span className="feature-dot">·</span>
                  <span>{activeStory.category}</span>
                </div>
                <h2>{activeStory.title}</h2>
                <p>{activeStory.description}</p>
                <div className="feature-byline">
                  <span className="source-monogram">N</span>
                  <span><strong>{activeStory.source}</strong><small>{activeStory.time} <span>·</span> {activeStory.published}</small></span>
                </div>
                <button className="feature-cta" onClick={() => setSelectedStory(activeStory)}>
                  Settle in and read <ArrowRight size={16} />
                </button>
              </div>
              <div className="feature-image-wrap">
                <img src={activeStory.image} alt="A quiet independent bookshop" className="feature-image" />
                <div className="image-caption"><span>01 / 03</span><span>THE SLOW WEB</span></div>
              </div>
              <div className="feature-orbit orbit-one" />
              <div className="feature-orbit orbit-two" />
            </section>
          )}

          {activeView === "feed" && (
            <section className="topic-strip" aria-label="Filter by topic">
              <div className="topic-strip-label"><ListFilter size={15} /><span>EXPLORE BY</span></div>
              <div className="topic-pills">
                {["All", ...allTopics].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setVisibleCount(5);
                    }}
                    className={`topic-pill ${selectedTopic === topic ? "selected" : ""}`}
                  >
                    {topic === "All" && <Compass size={13} />}
                    {topic}
                  </button>
                ))}
              </div>
              <span className="drag-hint"><ArrowDownUp size={13} /> Drag to make it yours</span>
            </section>
          )}

          <div className="feed-layout">
            <section className="feed-column">
              <div className="section-heading">
                <div>
                  <h2>{query ? "Search results" : activeView === "saved" ? "Your saved collection" : activeView === "trending" ? "On everyone's mind" : "Picked for your day"}</h2>
                  <p>
                    {query
                      ? `Showing matches for “${query}”`
                      : `${displayedContent.length} lovely things, picked around your interests`}
                  </p>
                </div>
                <button className="filter-control" onClick={() => setShowSettings(true)}>
                  <Settings2 size={15} /> <span>Personalize</span>
                </button>
              </div>

              {visibleContent.length > 0 ? (
                <motion.div layout className="story-grid">
                  <AnimatePresence initial={false}>
                    {visibleContent.map((item, index) => (
                      <StoryCard
                        key={item.id}
                        item={item}
                        index={index}
                        saved={favorites.includes(item.id)}
                        onSave={() => dispatch(toggleFavorite(item.id))}
                        onOpen={() => setSelectedStory(item)}
                        onDragStart={() => setDraggedId(item.id)}
                        onDragEnd={() => setDraggedId(null)}
                        dragging={draggedId === item.id}
                        onDrop={() => moveCard(item.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">{activeView === "saved" ? <Bookmark size={22} /> : <Search size={22} />}</span>
                  <h3>{activeView === "saved" && !query ? "Nothing tucked away yet" : "Nothing found just yet"}</h3>
                  <p>{activeView === "saved" && !query ? "Save a story when something catches your eye. It'll be right here when you're ready." : "Try another search or choose a different topic to keep exploring."}</p>
                  {activeView === "saved" && !query && (
                    <button className="text-action" onClick={() => changeView("feed")}>Find something good <ArrowRight size={15} /></button>
                  )}
                </div>
              )}

              {visibleContent.length > 0 && visibleContent.length < displayedContent.length && (
                <button className="load-more" onClick={() => setVisibleCount((count) => count + 12)}>
                  Show me a little more <ChevronDown size={16} />
                </button>
              )}
              {activeView === "feed" && !query && visibleContent.length === displayedContent.length && displayedContent.length > 0 && (
                <div className="end-note"><span /> That's your daily dose. Go make something. <span /></div>
              )}
            </section>

            <aside className="right-rail">
              <div className="rail-card pulse-card">
                <div className="rail-card-heading">
                  <div><span className="rail-kicker">THE DAILY PULSE</span><h3>What's moving</h3></div>
                  <span className="pulse-live"><i /> LIVE</span>
                </div>
                <button className="pulse-item" onClick={() => changeView("trending")}>
                  <span className="pulse-rank">01</span>
                  <span className="pulse-copy"><strong>The softer side of tech</strong><small>Technology <span>·</span> 2.4k reading</small></span>
                  <span className="pulse-trend"><TrendingUp size={14} /></span>
                </button>
                <button className="pulse-item" onClick={() => changeView("trending")}>
                  <span className="pulse-rank">02</span>
                  <span className="pulse-copy"><strong>Making room for slow</strong><small>Culture <span>·</span> 1.8k reading</small></span>
                  <span className="pulse-trend"><TrendingUp size={14} /></span>
                </button>
                <button className="pulse-item" onClick={() => changeView("trending")}>
                  <span className="pulse-rank">03</span>
                  <span className="pulse-copy"><strong>Objects with a second life</strong><small>Design <span>·</span> 960 reading</small></span>
                  <span className="pulse-trend"><TrendingUp size={14} /></span>
                </button>
                <button className="rail-link" onClick={() => changeView("trending")}>See what's trending <ArrowRight size={14} /></button>
              </div>

              <div className="rail-card listening-card">
                <div className="listening-art">
                  <img src={stories[1].image} alt="" />
                  <span className="listening-badge"><Headphones size={14} /> A MOMENT FOR YOU</span>
                  <button className="play-button" aria-label="Play featured podcast" onClick={() => setSelectedStory(stories[1])}>
                    <Play size={17} fill="currentColor" />
                  </button>
                </div>
                <div className="listening-copy">
                  <span className="rail-kicker">YOUR NEXT LISTEN</span>
                  <h3>Let your mind wander a little.</h3>
                  <p>On noticing the world around us.</p>
                  <div className="listen-footer"><span>99% Invisible</span><span><Clock3 size={12} /> 32 min</span></div>
                </div>
              </div>

              <div className="rail-note">
                <div className="rail-note-icon"><Heart size={15} /></div>
                <p>Good things find their way to you when you make room for them.</p>
                <span>— a little reminder from us</span>
              </div>

              <button className="interest-edit" onClick={() => setShowSettings(true)}>
                <span><span className="interest-edit-icon"><Plus size={15} /></span> Make this space yours</span>
                <ArrowRight size={15} />
              </button>
            </aside>
          </div>
          <footer className="page-footer"><span>Made with a little more intention.</span><span>About <i>·</i> Privacy <i>·</i> Your data is yours</span></footer>
        </div>
      </main>

      <AnimatePresence>
        {showSettings && (
          <SettingsDialog
            selectedTopics={selectedTopics}
            onToggleTopic={(topic) => dispatch(toggleTopic(topic))}
            darkMode={darkMode}
            onToggleDarkMode={() => dispatch(toggleDarkMode())}
            onClose={() => setShowSettings(false)}
          />
        )}
        {selectedStory && (
          <StoryDialog
            item={selectedStory}
            saved={favorites.includes(selectedStory.id)}
            onSave={() => dispatch(toggleFavorite(selectedStory.id))}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryCard({ item, index, saved, onSave, onOpen, onDragStart, onDragEnd, onDrop, dragging }) {
  const tint = sourceColors[item.kind] ?? "sage";
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.15) }}
      className={`story-card ${dragging ? "card-dragging" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
    >
      <button className="story-image-button" onClick={onOpen} aria-label={`Open ${item.title}`}>
        <img src={item.image} alt="" className="story-image" loading="lazy" />
        <span className={`content-type type-${tint}`}>
          {item.kind === "Listen" ? <Headphones size={12} /> : item.kind === "Watch" ? <Play size={11} fill="currentColor" /> : item.kind === "Community" ? <Sparkles size={11} /> : <Feather size={11} />}
          {item.kind}
        </span>
        <span className="card-image-count">{String(index + 1).padStart(2, "0")}</span>
      </button>
      <div className="story-card-body">
        <div className="story-category-row">
          <span className="story-category">{item.category}</span><span className="category-separator">·</span><span>{item.published}</span>
        </div>
        <button className="story-title-button" onClick={onOpen}><h3>{item.title}</h3></button>
        <p className="story-description">{item.description}</p>
        <div className="story-card-footer">
          <div className="story-source">
            {item.avatar ? <img className="source-avatar" src={item.image} alt="" /> : <span className={`source-icon source-${tint}`}>{item.source.charAt(0)}</span>}
            <span><strong>{item.source}</strong><small>{item.time}</small></span>
          </div>
          <button
            className={`save-button ${saved ? "is-saved" : ""}`}
            onClick={onSave}
            aria-label={saved ? "Remove from saved stories" : "Save for later"}
            title={saved ? "Saved" : "Save for later"}
          >
            {saved ? <Bookmark size={16} fill="currentColor" /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function SettingsDialog({ selectedTopics, onToggleTopic, darkMode, onToggleDarkMode, onClose }) {
  return (
    <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.section className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title" initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}>
        <div className="dialog-header">
          <div><span className="dialog-kicker">A SPACE OF YOUR OWN</span><h2 id="settings-title">Make it feel like you.</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close preferences"><X size={19} /></button>
        </div>
        <p className="dialog-description">Choose the things you're curious about. We'll make sure there's always something good to find.</p>
        <div className="settings-topics-label"><span>YOUR INTERESTS</span><span>{selectedTopics.length} selected</span></div>
        <div className="settings-topic-grid">
          {allTopics.map((topic) => {
            const selected = selectedTopics.includes(topic);
            return (
              <button key={topic} className={`settings-topic ${selected ? "topic-is-selected" : ""}`} onClick={() => onToggleTopic(topic)}>
                <span className={`topic-dot dot-${topic.toLowerCase()}`} />{topic}
                {selected && <Check size={14} />}
              </button>
            );
          })}
        </div>
        <div className="settings-theme">
          <div className="settings-theme-icon">{darkMode ? <Moon size={17} /> : <Sun size={17} />}</div>
          <span><strong>Evening reading</strong><small>A softer look, for later in the day.</small></span>
          <button className={`switch ${darkMode ? "switch-on" : ""}`} role="switch" aria-checked={darkMode} aria-label="Toggle dark mode" onClick={onToggleDarkMode}><span /></button>
        </div>
        <div className="dialog-footer">
          <span>Your choices stay on this device.</span>
          <button className="dialog-done" onClick={onClose}>That's me <ArrowRight size={15} /></button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function StoryDialog({ item, saved, onSave, onClose }) {
  const tint = sourceColors[item.kind] ?? "sage";
  const sourceSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${item.title} ${item.source}`)}`;
  return (
    <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.article className="story-dialog" role="dialog" aria-modal="true" aria-labelledby="story-dialog-title" initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}>
        <div className="story-dialog-image"><img src={item.image} alt="" /><button className="dialog-image-close" onClick={onClose} aria-label="Close story"><X size={19} /></button></div>
        <div className="story-dialog-content">
          <div className="story-category-row"><span className={`content-type type-${tint}`}>{item.kind}</span><span>{item.category}</span><span>·</span><span>{item.published}</span></div>
          <h2 id="story-dialog-title">{item.title}</h2>
          <p className="dialog-story-description">{item.description}</p>
          <div className="dialog-story-byline"><span className={`source-icon source-${tint}`}>{item.source.charAt(0)}</span><span><strong>{item.source}</strong><small>By {item.author} <i>·</i> {item.time}</small></span></div>
          <div className="dialog-story-actions">
            <a className="feature-cta" href={sourceSearchUrl} target="_blank" rel="noreferrer">{item.kind === "Listen" || item.kind === "Watch" ? <>Find this episode <ExternalLink size={13} /></> : <>Find the full story <ArrowRight size={15} /> </>}</a>
            <button className={`dialog-save ${saved ? "dialog-save-active" : ""}`} onClick={onSave}>{saved ? <Bookmark size={15} fill="currentColor" /> : <Bookmark size={15} />}{saved ? "Saved for later" : "Save for later"}</button>
          </div>
          <div className="dialog-preview-note"><span><Sparkles size={13} /> A little preview</span><p>Thoughtfully chosen for you. Open the original from <strong>{item.source}</strong> to discover the full story.</p><a href={sourceSearchUrl} target="_blank" rel="noreferrer">Find the original <ExternalLink size={12} /></a></div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default App;
