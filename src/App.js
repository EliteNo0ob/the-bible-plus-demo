import React, { useState, useEffect, useCallback } from 'react';
import {
  Home, BookOpen, Users, Compass, MoreHorizontal,
  Heart, MessageCircle, Share2, Bookmark, FileText,
  Lightbulb, Search, Settings, Bell, User, Plus, Tag,
  PenTool, TrendingUp, HandHelping, Globe, Sun, HelpCircle, Info, X
} from 'lucide-react'; // Import Lucide React icons

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'read', 'community', 'discover'
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [username, setUsername] = useState('Brandon');
  const [currentVerse, setCurrentVerse] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  // FIX: Initialize showNotifications to false so it doesn't open on startup
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  // isVerseActionMenuOpen is now only used internally by BiblePage,
  // but kept here for potential future global state needs if the bottom bar changes more dynamically.
  // For now, the main footer's visibility is tied directly to currentPage !== 'read'.
  const [isVerseActionMenuOpen, setIsVerseActionMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);


  // Publicly accessible image URLs for demo purposes.
  const profilePicUrl = "/images/profile-br.jpg"; // Assuming you saved it as profile-br.jpg in public/images/
  const verseBgImageUrl = "/images/verse-bg.jpg"; // Assuming you saved it as verse-bg.jpg in public/images/

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Array of Verses for "Verse of the Day"
  const versesOfTheDay = [
    {
      text: "For where two or three are gathered in my name, there am I among them.",
      reference: "Matthew 18:20 (ESV)"
    },
    {
      text: "I can do all things through Christ who strengthens me.",
      reference: "Philippians 4:13 (NKJV)"
    },
    {
      text: "The Lord is my shepherd; I shall not want.",
      reference: "Psalm 23:1 (KJV)"
    },
    {
      text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
      reference: "Matthew 6:33 (NIV)"
    },
    {
      text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16 (ESV)"
    }
  ];

  // Demo Notifications Content
  const demoNotifications = [
    { id: 1, text: "New insight available for 'Prayer & Reflection'!", time: "2m ago" },
    { id: 2, text: "Your friend John just shared a verse.", time: "1h ago" },
    { id: 3, text: "Daily devotional 'Hope in Trials' is ready.", time: "5h ago" },
    { id: 4, text: "Your saved insights list has been updated.", time: "1d ago" },
  ];

  // Effect to set a random verse on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * versesOfTheDay.length);
    setCurrentVerse(versesOfTheDay[randomIndex]);
  }, []);

  // Simulated AI responses based on keywords
  const simulatedResponses = {
    "john 3:16": {
      text: "John 3:16 is one of the most well-known verses in the Bible, summarizing the core of Christian belief regarding God's love and the path to salvation. It states: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.'\n\nThis verse emphasizes God's immense love (agape love) for all humanity, demonstrated by the ultimate sacrifice of His Son, Jesus Christ. It highlights the condition for receiving eternal life: belief (faith) in Jesus. The contrast between 'perish' and 'eternal life' underscores the profound stakes of this divine offer. The Greek word for 'world' (kosmos) signifies all of humanity, not just a select group.",
      sources: ["John 3:16 (ESV)", "NIV Study Bible Notes on John 3:16", "Strong's Concordance (G2889 - kosmos)"]
    },
    "genesis 1": {
      text: "Genesis 1 describes the creation of the heavens and the earth by God. It presents a majestic, orderly account of creation over six 'days,' culminating in the creation of humanity in God's image. Key themes include God's sovereignty, the power of His spoken word ('God said...'), the goodness of creation, and the establishment of order from chaos. It lays the theological foundation for God as Creator and humanity's unique place within His creation.",
      sources: ["Genesis 1:1-31 (NIV)", "Tremper Longman III, 'Genesis' (Baker Commentary on the Old Testament)", "John Walton, 'The Lost World of Genesis One'"]
    },
    "paul's letters": {
      text: "Paul's letters (or epistles) are a significant portion of the New Testament, offering foundational theological teaching and practical guidance for early Christian communities. Written by the Apostle Paul, they address various churches and individuals, covering doctrines such as justification by faith, the nature of the church, Christian living, and eschatology. Key letters include Romans, 1 & 2 Corinthians, Galatians, Ephesians, Philippians, and Colossians, among others.",
      sources: ["Romans (NLT)", "Gordon Fee, 'God's Empowering Presence: The Holy Spirit in the Letters of Paul'", "N.T. Wright, 'Paul and the Faithfulness of God'"]
    },
    "what is prayer": {
      text: "Prayer, in a biblical context, is communication with God. It involves speaking to God (adoration, confession, thanksgiving, supplication) and listening to Him. It's a vital aspect of a believer's relationship with God, allowing for communion, expressing dependence, and seeking divine intervention. The Bible presents various forms of prayer, from spontaneous cries to structured petitions, emphasizing sincerity and faith.",
      sources: ["Matthew 6:5-15 (Sermon on the Mount)", "Philippians 4:6-7", "Richard Foster, 'Celebration of Discipline'"]
    },
    "scripture deep dive": {
      text: "Let's dive deep into a significant passage. Consider Romans 8, often called the 'Magna Carta of Christian liberty.' It speaks profoundly about life in the Spirit, freedom from condemnation, the hope of glory, and God's unwavering love. It's a rich chapter for understanding the believer's security in Christ and the work of the Holy Spirit.",
      sources: ["Romans 8 (NIV)", "John Stott, 'The Message of Romans'", "D. Martyn Lloyd-Jones, 'Romans: An Exposition of Chapter 8'"]
    },
    "prayer & reflection": {
      text: "Prayer is a conversation with God, not a monologue. Take a moment to reflect on Psalm 46:10: 'Be still, and know that I am God.' Consider what it means to be still in His presence, to listen, and to truly 'know' Him in a deeper way today. What burdens can you release to Him? What gratitude can you express?",
      sources: ["Psalm 46:10 (KJV)", "Andrew Murray, 'With Christ in the School of Prayer'"]
    },
    "theological concepts": {
      text: "The concept of the Trinity is central to Christian theology: one God existing in three co-equal, co-eternal Persons—Father, Son (Jesus Christ), and Holy Spirit. While a mystery, it's revealed in Scripture and essential for understanding God's nature, salvation, and the Christian life. It's not three gods, but one God in three persons.",
      sources: ["Matthew 28:19", "2 Corinthians 13:14", "Wayne Grudem, 'Systematic Theology'"]
    },
    "historical context": {
      text: "Understanding the historical context of the Gospels is crucial. For example, the political and religious landscape of 1st-century Judea under Roman rule heavily influenced Jesus' ministry and the early church. The tension between Jewish religious leaders (Pharisees, Sadducees), Roman authorities, and various Jewish sects (like the Zealots) provides essential background for many biblical narratives.",
      sources: ["Josephus, 'Antiquities of the Jews'", "Craig Keener, 'The IVP Bible Background Commentary: New Testament'"]
    }
  };

  // Function to simulate AI response
  const getSimulatedAiResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    for (const key in simulatedResponses) {
      if (lowerQuery.includes(key)) {
        return simulatedResponses[key];
      }
    }
    // Default response if no keyword matches
    return {
      text: "I'm still learning and growing! For now, I can provide insights on common biblical topics like 'John 3:16', 'Genesis 1', 'Paul's letters', 'What is prayer?', or try clicking one of the 'AI Guided Journeys' cards!",
      sources: ["The Bible Plus Development Team"]
    };
  };

  // Handle question submission
  const handleSubmit = async (prefilledQuestion = '') => {
    const queryToSubmit = prefilledQuestion || question;
    if (!queryToSubmit.trim()) return;

    setIsLoading(true);
    setAiResponse(null);
    setShowDisclaimer(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate AI response
    const response = getSimulatedAiResponse(queryToSubmit);
    setAiResponse(response);
    setIsLoading(false);
    setQuestion(''); // Clear input after submission
  };

  const handleSocialAction = (action) => {
    setModalContent(`${action} feature coming soon!`);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
  };

  const handleProfileClick = () => {
    setModalContent('Profile functionality coming soon!');
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  const handleNotificationsClick = () => {
    setShowNotifications(true); // Show the notifications list
    setHasNewNotification(false); // Clear the badge when clicked
  };

  const handleMoreMenuItemClick = (item) => {
    setModalContent(`${item} feature coming soon!`);
    setShowModal(true);
    setShowMoreMenu(false); // Close the More menu
    setTimeout(() => setShowModal(false), 2000);
  };

  // Memoize the callback to prevent unnecessary re-renders of BiblePage
  const handleVerseActionMenuToggle = useCallback((isOpen) => {
    setIsVerseActionMenuOpen(isOpen);
  }, []);

  // --- BiblePage Component ---
  const BiblePage = ({ setShowModal, setModalContent }) => {
    const [selectedVerseIds, setSelectedVerseIds] = useState(new Set()); // Use a Set for multiple selections
    const [highlightedVerses, setHighlightedVerses] = useState({}); // { 'john3-16': 'bg-yellow-500', ... }
    const [showVerseActionMenu, setShowVerseActionMenu] = useState(false);

    // Effect to update showVerseActionMenu based on selection
    useEffect(() => {
      const shouldShowMenu = selectedVerseIds.size > 0;
      if (shouldShowMenu !== showVerseActionMenu) {
        setShowVerseActionMenu(shouldShowMenu);
      }
    }, [selectedVerseIds, showVerseActionMenu]); // Depend on selectedVerseIds and showVerseActionMenu

    // Effect to clear selection when the menu is hidden (e.g., by navigating away or explicitly closing)
    useEffect(() => {
      // This effect runs when showVerseActionMenu changes,
      // if it becomes false and there were selected verses, clear them.
      if (!showVerseActionMenu && selectedVerseIds.size > 0) {
        setSelectedVerseIds(new Set());
      }
    }, [showVerseActionMenu]); // Only depend on showVerseActionMenu

    const handleVerseClick = (verseId) => {
      setSelectedVerseIds(prevSelected => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(verseId)) {
          newSelected.delete(verseId); // Deselect if already selected
        } else {
          newSelected.add(verseId); // Select if not selected
        }
        return newSelected;
      });
    };

    const handleHighlight = (colorClass) => {
      if (selectedVerseIds.size > 0) {
        setHighlightedVerses(prev => {
          const newHighlighted = { ...prev };
          selectedVerseIds.forEach(id => {
            newHighlighted[id] = colorClass;
          });
          return newHighlighted;
        });
        setShowVerseActionMenu(false); // Close menu after action
      }
    };

    const handleVerseAction = (action) => {
      const verseCount = selectedVerseIds.size;
      const verseNumbers = Array.from(selectedVerseIds).map(id => id.split('-')[1]).join(', ');
      const verseText = verseCount === 1
        ? `verse ${verseNumbers}`
        : `${verseCount} selected verses (${verseNumbers})`;

      setModalContent(`${action} feature for ${verseText} coming soon!`);
      setShowModal(true);
      setShowVerseActionMenu(false); // Close menu after action
      setTimeout(() => setShowModal(false), 2000);
    };

    const handleSearchOnPage = () => {
      setModalContent('Search on this page functionality coming soon!');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    };

    const handleBookNameClick = () => {
      setModalContent('Select Book/Chapter/Verse functionality coming soon!');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    };

    const handleBibleVersionClick = () => {
      setModalContent('Select Bible Version functionality coming soon!');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    };

    // Handle Commentary Click
    const handleCommentaryClick = (verseId) => {
      setModalContent(`Commentary for John ${verseId.split('-')[1]}: This verse speaks to the profound mystery of divine love and sacrifice, offering eternal life through belief. Various interpretations emphasize God's universal love (agape) and the pivotal role of faith in salvation. (Simulated Commentary)`);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 4000); // Longer display for commentary
    };

    // Handle Original Language Insight Click
    const handleOriginalLanguageClick = (word, original, meaning) => {
      setModalContent(`Original word insight for "${word}":\n\nGreek: ${original}\nMeaning: "${meaning}"\n\n(Simulated Insight)`);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    };


    const bibleText = [
      { id: 'john3-1', text: "Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews." },
      { id: 'john3-2', text: "He came to Jesus by night and said to him, 'Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do unless God is with him.'" },
      { id: 'john3-3', text: "Jesus answered him, 'Truly, truly, I say to you, unless one is born again he cannot see the kingdom of God.'" },
      { id: 'john3-4', text: "Nicodemus said to him, 'How can a man be born when he is old? Can he enter a second time into his mother's womb and be born?'" },
      { id: 'john3-5', text: "Jesus answered, 'Truly, truly, I say to you, unless one is born of water and the Spirit, he cannot enter the kingdom of God.'" },
      { id: 'john3-6', text: "That which is born of the flesh is flesh, and that which is born of the Spirit is spirit." },
      { id: 'john3-7', text: "Do not marvel that I said to you, 'You must be born again.'" },
      { id: 'john3-8', text: "The wind blows where it wishes, and you hear its sound, but you do not know where it comes from or where it goes. So it is with everyone who is born of the Spirit.'" },
      { id: 'john3-9', text: "Nicodemus answered him, 'How can these things be?'" },
      { id: 'john3-10', text: "Jesus answered him, 'Are you the teacher of Israel and yet you do not understand these things?'" },
      { id: 'john3-11', text: "Truly, truly, I say to you, we speak of what we know, and bear witness to what we have seen, but you do not receive our testimony." },
      { id: 'john3-12', text: "If I have told you earthly things and you do not believe, how can you believe if I tell you heavenly things?" },
      { id: 'john3-13', text: "No one has ascended into heaven except he who descended from heaven, the Son of Man." },
      { id: 'john3-14', text: "And as Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up," },
      { id: 'john3-15', text: "that whoever believes in him may have eternal life." },
      { id: 'john3-16', text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life." },
      { id: 'john3-17', text: "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him." },
      { id: 'john3-18', text: "Whoever believes in him is not condemned, but whoever does not believe is condemned already, because he has not believed in the name of the only Son of God." },
      { id: 'john3-19', text: "And this is the judgment: the light has come into the world, and people loved the darkness rather than the light because their deeds were evil." },
      { id: 'john3-20', text: "For everyone who does wicked things hates the light and does not come to the light, lest his deeds should be exposed." },
      { id: 'john3-21', text: "But whoever does what is true comes to the light, so that it may be clearly seen that his deeds have been carried out in God." },
    ];

    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-800 text-gray-100 bible-page-content"> {/* Added bible-page-content class */}
        <h2 className="text-2xl font-bold text-gray-200 mb-4 text-center">John 3 (ESV)</h2>
        {bibleText.map(verse => (
          <div key={verse.id} className="relative group">
            <p
              className={`text-base leading-relaxed cursor-pointer p-2 rounded-md transition-colors
                          ${highlightedVerses[verse.id] || ''}
                          ${selectedVerseIds.has(verse.id) ? 'ring-2 ring-[#C2B027]' : 'hover:bg-gray-700'}`}
              onClick={() => handleVerseClick(verse.id)}
            >
              <span className="font-semibold text-gray-400 mr-2">{verse.id.split('-')[1]}.</span>
              {/* Original Language Insight Demo */}
              {verse.id === 'john3-16' ? (
                <>
                  For God so loved the <span className="underline cursor-pointer text-[#C2B027] hover:text-white" onClick={(e) => { e.stopPropagation(); handleOriginalLanguageClick('world', 'κόσμος (kosmos)', 'The ordered universe, humanity'); }}>world</span>, that he gave his only Son, that whoever believes in him should not perish but have eternal life.
                </>
              ) : verse.id === 'john3-3' ? (
                <>
                  Jesus answered him, 'Truly, truly, I say to you, unless one is <span className="underline cursor-pointer text-[#C2B027] hover:text-white" onClick={(e) => { e.stopPropagation(); handleOriginalLanguageClick('born again', 'ἄνωθεν (anōthen)', 'From above, or again'); }}>born again</span> he cannot see the kingdom of God.'
                </>
              ) : (
                verse.text
              )}
            </p>
            {/* Commentary Icon - Appears on hover/click */}
            <button
              onClick={(e) => { e.stopPropagation(); handleCommentaryClick(verse.id); }}
              className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full text-gray-400 hover:text-[#C2B027] hover:bg-gray-600 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="View Commentary"
            >
              <MessageCircle className="w-4 h-4" /> {/* Lucide Icon */}
            </button>
          </div>
        ))}

        {/* Bottom Bar for Bible Page - Conditional based on verse action menu */}
        {!showVerseActionMenu && (
          <div className="absolute bottom-0 left-0 right-0 bg-black text-white h-16 flex items-center justify-between px-6 shadow-lg">
            <button onClick={handleBookNameClick} className="flex items-center space-x-2 hover:text-gray-400 transition-colors">
              <span className="font-semibold text-lg">John 3</span>
            </button>
            <button onClick={handleBibleVersionClick} className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
              (ESV)
            </button>
            <button onClick={handleSearchOnPage} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <Search className="w-6 h-6 text-white" /> {/* Lucide Icon */}
            </button>
          </div>
        )}

        {/* Verse Action Menu */}
        {showVerseActionMenu && (
          <div className="absolute bottom-0 left-0 right-0 bg-black text-white h-16 flex items-center justify-around px-4 shadow-lg">
            {/* Highlight Colors */}
            {['bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'].map(color => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full ${color} border-2 border-white hover:scale-110 transition-transform`}
                onClick={() => handleHighlight(color)}
              ></button>
            ))}
            {/* Action Buttons */}
            <button onClick={() => handleVerseAction('Save')} className="flex flex-col items-center text-xs hover:text-[#C2B027] transition-colors">
              <Bookmark className="w-5 h-5" /> {/* Lucide Icon */}
              Save
            </button>
            <button onClick={() => handleVerseAction('Note')} className="flex flex-col items-center text-xs hover:text-[#C2B027] transition-colors">
              <FileText className="w-5 h-5" /> {/* Lucide Icon */}
              Note
            </button>
            <button onClick={() => handleVerseAction('Share')} className="flex flex-col items-center text-xs hover:text-[#C2B027] transition-colors">
              <Share2 className="w-5 h-5" /> {/* Lucide Icon */}
              Share
            </button>
            <button onClick={() => handleVerseAction('Ask AI')} className="flex flex-col items-center text-xs hover:text-[#C2B027] transition-colors">
              <Lightbulb className="w-5 h-5" /> {/* Lucide Icon */}
              Ask AI
            </button>
          </div>
        )}
      </div>
    );
  };

  // --- CommunityPage Component ---
  const CommunityPage = ({ setShowModal, setModalContent }) => {
    const handleCommunityAction = (action) => {
      setModalContent(`${action} functionality coming soon!`);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    };

    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-800 text-gray-100">
        <h2 className="text-2xl font-bold text-gray-200 mb-6 text-center">Community</h2>

        <section className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-600">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Community Feed (Coming Soon!)</h3>
          <p className="text-gray-400 italic mb-4">See what your friends and groups are sharing and discussing.</p>
          <button
            onClick={() => handleCommunityAction('View Feed')}
            className="w-full px-4 py-2 bg-[#C2B027] text-gray-900 rounded-full hover:bg-[#A19020] transition-colors font-medium"
          >
            View My Feed
          </button>
        </section>

        <section className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-600">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">My Study Groups</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex justify-between items-center bg-gray-600 p-3 rounded-lg">
              <span>Morning Devotion Group</span>
              <button onClick={() => handleCommunityAction('Morning Devotion Group')} className="text-[#C2B027] hover:text-white text-sm">View</button>
            </li>
            <li className="flex justify-between items-center bg-gray-600 p-3 rounded-lg">
              <span>Book of John Study</span>
              <button onClick={() => handleCommunityAction('Book of John Study')} className="text-[#C2B027] hover:text-white text-sm">View</button>
            </li>
            <li className="flex justify-between items-center bg-gray-600 p-3 rounded-lg">
              <span>Family Bible Time</span>
              <button onClick={() => handleCommunityAction('Family Bible Time')} className="text-[#C2B027] hover:text-white text-sm">View</button>
            </li>
          </ul>
          <button
            onClick={() => handleCommunityAction('Create New Group')}
            className="w-full mt-4 px-4 py-2 border border-[#C2B027] text-[#C2B027] rounded-full hover:bg-[#C2B027] hover:text-gray-900 transition-colors font-medium"
          >
            + Create New Group
          </button>
        </section>

        <section className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-600">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Prayer Requests</h3>
          <p className="text-gray-400 italic mb-4">Share your prayer needs and pray for others.</p>
          <button
            onClick={() => handleCommunityAction('Submit Prayer Request')}
            className="w-full px-4 py-2 bg-gray-600 text-gray-200 rounded-full hover:bg-gray-500 transition-colors font-medium"
          >
            Submit a Request
          </button>
        </section>
      </div>
    );
  };

  // --- DiscoverPage Component ---
  const DiscoverPage = ({ setShowModal, setModalContent }) => {
    const handleDiscoverAction = (action) => {
      setModalContent(`${action} functionality coming soon!`);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    };

    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-800 text-gray-100">
        <h2 className="text-2xl font-bold text-gray-200 mb-6 text-center">Discover</h2>

        <section className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-600">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Daily Devotionals</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex justify-between items-center bg-gray-600 p-3 rounded-lg">
              <span>Morning Refresh</span>
              <button onClick={() => handleDiscoverAction('Morning Refresh Devotional')} className="text-[#C2B027] hover:text-white text-sm">Read</button>
            </li>
            <li className="flex justify-between items-center bg-gray-600 p-3 rounded-lg">
              <span>Evening Peace</span>
              <button onClick={() => handleDiscoverAction('Evening Peace Devotional')} className="text-[#C2B027] hover:text-white text-sm">Read</button>
            </li>
          </ul>
          <button
            onClick={() => handleDiscoverAction('Browse All Devotionals')}
            className="w-full mt-4 px-4 py-2 border border-[#C2B027] text-[#C2B027] rounded-full hover:bg-[#C2B027] hover:text-gray-900 transition-colors font-medium"
          >
            Browse All
          </button>
        </section>

        <section className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-600">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Reading Plans</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex justify-between items-center bg-gray-600 p-3 rounded-lg">
              <span>Bible in a Year</span>
              <button onClick={() => handleDiscoverAction('Bible in a Year Plan')} className="text-[#C2B027] hover:text-white text-sm">Start</button>
            </li>
            <li className="flex justify-between items-center bg-gray-600 p-3 rounded-lg">
              <span>Psalms & Proverbs</span>
              <button onClick={() => handleDiscoverAction('Psalms & Proverbs Plan')} className="text-[#C2B027] hover:text-white text-sm">Start</button>
            </li>
          </ul>
          <button
            onClick={() => handleDiscoverAction('Explore All Plans')}
            className="w-full mt-4 px-4 py-2 bg-gray-600 text-gray-200 rounded-full hover:bg-gray-500 transition-colors font-medium"
          >
            Explore All
          </button>
        </section>

        <section className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-600">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Podcasts & Articles</h3>
          <p className="text-gray-400 italic mb-4">Engage with inspiring audio and written content.</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleDiscoverAction('Browse Podcasts')}
              className="px-4 py-2 bg-[#C2B027] text-gray-900 rounded-full hover:bg-[#A19020] transition-colors font-medium"
            >
              Podcasts
            </button>
            <button
              onClick={() => handleDiscoverAction('Browse Articles')}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-full hover:bg-gray-500 transition-colors font-medium"
            >
              Articles
            </button>
          </div>
        </section>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      {/* Simulated Mobile App Frame - Adjusted for a larger phone feel */}
      <div className="relative w-full max-w-lg h-[90vh] bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-inter text-gray-100 border-8 border-gray-950">
        {/* Top Navigation Menu - Now Black */}
        <nav className="bg-black text-white flex justify-around items-center h-16 shadow-lg rounded-t-2xl">
          {/* Home */}
          <button onClick={() => setCurrentPage('home')} className={`flex flex-col items-center p-2 text-xs font-medium transition-colors ${currentPage === 'home' ? 'text-[#C2B027]' : 'hover:text-gray-400'}`}>
            <Home className="w-6 h-6 mb-1" /> {/* Lucide Icon */}
            Home
          </button>
          {/* Read */}
          <button onClick={() => setCurrentPage('read')} className={`flex flex-col items-center p-2 text-xs font-medium transition-colors ${currentPage === 'read' ? 'text-[#C2B027]' : 'hover:text-gray-400'}`}>
            <BookOpen className="w-6 h-6 mb-1" /> {/* Lucide Icon */}
            Read
          </button>
          {/* Community */}
          <button onClick={() => setCurrentPage('community')} className={`flex flex-col items-center p-2 text-xs font-medium transition-colors ${currentPage === 'community' ? 'text-[#C2B027]' : 'hover:text-gray-400'}`}>
            <Users className="w-6 h-6 mb-1" /> {/* Lucide Icon */}
            Community
          </button>
          {/* Discover */}
          <button onClick={() => setCurrentPage('discover')} className={`flex flex-col items-center p-2 text-xs font-medium transition-colors ${currentPage === 'discover' ? 'text-[#C2B027]' : 'hover:text-gray-400'}`}>
            <Compass className="w-6 h-6 mb-1" /> {/* Lucide Icon */}
            Discover
          </button>
          {/* More */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className="flex flex-col items-center p-2 text-xs font-medium hover:text-gray-400 transition-colors"
          >
            <MoreHorizontal className="w-6 h-6 mb-1" /> {/* Lucide Icon */}
            More
          </button>
        </nav>

        {/* Conditional Rendering of Pages */}
        {currentPage === 'home' && (
          // Home Page Content
          <main className="flex-1 overflow-y-auto p-6 space-y-8 pb-4 bg-gray-800 home-page-content"> {/* Added home-page-content class */}
            {/* Search Bar */}
            <section className="mb-6">
              <input
                type="text"
                placeholder="Search the Bible, topics, or insights..."
                className="w-full p-3 rounded-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C2B027] focus:border-transparent text-base shadow-sm"
              />
            </section>

            {/* Greeting & Verse of the Day */}
            <section className="text-center mb-8">
              <p className="text-xl font-medium text-gray-300 mb-2">{getGreeting()}, {username}!</p>
              <h2 className="text-2xl font-bold text-gray-200 mb-4">Verse of the Day</h2>
              <div className="relative bg-gray-700 p-5 rounded-xl shadow-md border border-gray-600 overflow-hidden flex items-center justify-center"> {/* Added flex and justify-center */}
                {/* Background Image for Verse of the Day */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url('${verseBgImageUrl}')` }}
                  // Fallback for image loading errors
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if fallback also fails
                    e.target.style.backgroundImage = `url('https://placehold.co/400x200/4B5563/FFFFFF?text=Image+Load+Error')`;
                  }}
                ></div>
                {/* White Transparent Box for Text */}
                <div className="relative z-10 bg-white bg-opacity-10 p-4 rounded-lg mx-4"> {/* Changed bg-opacity-80 to bg-opacity-10 */}
                  <p className="text-lg italic text-gray-900 mb-3"> {/* Changed text color to gray-900 */}
                    "{currentVerse.text}"
                  </p>
                  <p className="text-md font-semibold text-[#C2B027]">— {currentVerse.reference}</p>
                </div>
              </div>
              {/* Like, Comment, Share Buttons */}
              <div className="flex justify-around items-center mt-4 px-4">
                <button onClick={() => handleSocialAction('Like')} className="flex items-center space-x-1 text-gray-300 hover:text-[#C2B027] transition-colors active:scale-95">
                  <Heart className="w-5 h-5" /> {/* Lucide Icon */}
                  <span className="text-sm">Like</span>
                </button>
                <button onClick={() => handleSocialAction('Comment')} className="flex items-center space-x-1 text-gray-300 hover:text-[#C2B027] transition-colors active:scale-95">
                  <MessageCircle className="w-5 h-5" /> {/* Lucide Icon */}
                  <span className="text-sm">Comment</span>
                </button>
                <button onClick={() => handleSocialAction('Share')} className="flex items-center space-x-1 text-gray-300 hover:text-[#C2B027] transition-colors active:scale-95">
                  <Share2 className="w-5 h-5" /> {/* Lucide Icon */}
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </section>

            {/* AI Guided Items */}
            <section className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-200 mb-5 text-center">AI Guided Journeys</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handleSubmit('Scripture Deep Dive')}
                  className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-600 transition-colors active:scale-95"
                >
                  <BookOpen className="w-8 h-8 text-[#C2B027] mb-2" /> {/* Lucide Icon */}
                  <p className="text-base font-medium text-gray-200">Scripture Deep Dive</p>
                </div>
                <div
                  onClick={() => handleSubmit('Prayer & Reflection')}
                  className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-600 transition-colors active:scale-95"
                >
                  <Heart className="w-8 h-8 text-[#C2B027] mb-2" /> {/* Lucide Icon */}
                  <p className="text-base font-medium text-gray-200">Prayer & Reflection</p>
                </div>
                <div
                  onClick={() => handleSubmit('Theological Concepts')}
                  className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-600 transition-colors active:scale-95"
                >
                  <Lightbulb className="w-8 h-8 text-[#C2B027] mb-2" /> {/* Lucide Icon */}
                  <p className="text-base font-medium text-gray-200">Theological Concepts</p>
                </div>
                <div
                  onClick={() => handleSubmit('Historical Context')}
                  className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-600 transition-colors active:scale-95"
                >
                  <BookOpen className="w-8 h-8 text-[#C2B027] mb-2" /> {/* Lucide Icon */}
                  <p className="text-base font-medium text-gray-200">Historical Context</p>
                </div>
                {/* New Thematic Journeys Card */}
                <div
                  onClick={() => handleMoreMenuItemClick('Thematic Journeys')}
                  className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-600 transition-colors active:scale-95"
                >
                  <Compass className="w-8 h-8 text-[#C2B027] mb-2" /> {/* Lucide Icon */}
                  <p className="text-base font-medium text-gray-200">Thematic Journeys</p>
                </div>
              </div>
            </section>

            {/* My Saved Insights Section (New Placeholder) */}
            <section className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-200 mb-5 text-center">My Saved Insights</h3>
              <div className="bg-gray-700 p-5 rounded-xl shadow-md border border-gray-600 text-center text-gray-400 italic">
                <p>Your personalized insights and notes will appear here.</p>
                <p className="text-sm mt-2">Start exploring to save your first insight!</p>
              </div>
            </section>

            {/* Original Demo Section - Ask The AI */}
            <section className="bg-gray-700 rounded-xl shadow-inner p-5 border border-gray-600">
              <h3 className="text-2xl font-semibold text-gray-200 mb-6 text-center">
                Ask The AI
              </h3>
              <div className="mb-4">
                <textarea
                  className="w-full p-3 border border-gray-500 rounded-lg focus:ring-[#C2B027] focus:border-[#C2B027] text-base resize-y min-h-[80px] shadow-sm bg-gray-800 text-gray-100"
                  placeholder="e.g., What is the meaning of John 3:16? or Tell me about Genesis 1."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => handleSubmit()} // Call with no prefilled question for direct input
                  disabled={isLoading || !question.trim()}
                  className={`px-6 py-3 text-lg font-semibold rounded-full shadow-md transition duration-300 ease-in-out transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#C2B027]
                    ${isLoading || !question.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#C2B027] text-gray-900 hover:bg-[#A19020]'}`}
                >
                  {isLoading ? 'Thinking...' : 'Get Insight'}
                </button>
              </div>

              {/* AI Response Display */}
              {isLoading && (
                <div className="text-center text-gray-200 text-lg font-medium mt-4">
                  <div className="animate-pulse">Processing your query<span className="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>
                </div>
              )}

              {aiResponse && (
                <div className="bg-gray-600 p-5 rounded-lg border border-gray-500 shadow-sm">
                  <h4 className="text-xl font-semibold text-gray-200 mb-3">AI Insight:</h4>
                  <p className="text-base text-gray-100 leading-relaxed whitespace-pre-wrap">{aiResponse.text}</p>
                  <div className="mt-5 pt-3 border-t border-gray-500">
                    <p className="text-xs font-medium text-gray-200 mb-1">Sources Cited (Simulated):</p>
                    <ul className="list-disc list-inside text-xs text-gray-300">
                      {aiResponse.sources.map((source, index) => (
                        <li key={index}>{source}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {showDisclaimer && (
                <div className="mt-6 p-3 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg text-xs text-center">
                  **Disclaimer:** This is a demo. Responses and sources are simulated to showcase the app's potential. "The Bible Plus" is currently in its strategic planning and architectural structuring phase, focused on building a truly ethical and trustworthy AI foundation.
                </div>
              )}
            </section>

            {/* Footer - Simplified for app context */}
            <footer className="text-center text-gray-400 text-xs mt-8">
              <p>&copy; {new Date().getFullYear()} The Bible Plus. Built with a vision for truth.</p>
            </footer>
          </main>
        )}

        {currentPage === 'read' && (
          <BiblePage
            setShowModal={setShowModal} // Pass modal setters to BiblePage
            setModalContent={setModalContent} // Pass modal setters to BiblePage
          />
        )}

        {currentPage === 'community' && (
          <CommunityPage
            setShowModal={setShowModal}
            setModalContent={setModalContent}
          />
        )}

        {currentPage === 'discover' && (
          <DiscoverPage
            setShowModal={setShowModal}
            setModalContent={setModalContent}
          />
        )}

        {/* Conditional Bottom Bar for the App */}
        {currentPage !== 'read' && (
          <footer className="flex items-center justify-between p-4 bg-black text-white shadow-md rounded-b-2xl h-16">
            {/* Profile Picture */}
            <button onClick={handleProfileClick} className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white overflow-hidden">
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  // Fallback for image loading errors
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if fallback also fails
                    e.target.src = '/images/profile-br.jpg'; // Fallback to local .jpg
                  }}
                />
              </div>
            </button>
            {/* AI Button (Centered and less apparent) */}
            <button className="p-2 bg-gray-700 rounded-full shadow-lg hover:bg-gray-600 transition-colors transform active:scale-95 flex-grow-0">
              <Lightbulb className="w-7 h-7" /> {/* Lucide Icon */}
            </button>
            {/* Notifications Bell with Badge */}
            <button onClick={handleNotificationsClick} className="relative text-white p-2 rounded-full hover:bg-gray-700 transition-colors flex-shrink-0">
              <Bell className="w-6 h-6" /> {/* Lucide Icon */}
              {hasNewNotification && (
                <span className="absolute top-1 right-1 block h-3 w-3 rounded-full ring-2 ring-gray-800 bg-[#C2B027]"></span>
              )}
            </button>
          </footer>
        )}


        {/* Generic Modal for "Coming Soon" messages */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg text-center border border-gray-600">
              <p className="text-xl text-gray-100 font-semibold mb-4">{modalContent}</p>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-[#C2B027] text-gray-900 rounded-full hover:bg-[#A19020] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}

        {/* More Menu Overlay */}
        {showMoreMenu && (
          <div className="absolute inset-0 flex justify-end z-40 bg-black bg-opacity-75"> {/* Overlay within app frame */}
            <div className="w-64 bg-gray-900 h-full shadow-lg p-6 flex flex-col rounded-l-2xl">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" /> {/* Lucide Icon for close */}
                </button>
              </div>

              {/* User Profile in Menu */}
              <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-700">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    // Fallback for image loading errors
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if fallback also fails
                      e.target.src = '/images/profile-br.jpg'; // Fallback to local .jpg
                    }}
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-100">{username}</p>
                </div>
              </div>

              {/* Menu Items */}
              <ul className="space-y-4 flex-1">
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Friends')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Users className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Friends</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Prayer')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Heart className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Prayer</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Your Activity')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <TrendingUp className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Your Activity</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Saved')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Bookmark className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Saved</span>
                  </button>
                </li>
                {/* New: Custom Tags */}
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Custom Tags')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Tag className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Custom Tags</span>
                  </button>
                </li>
                {/* New: Journaling */}
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Journaling')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <PenTool className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Journaling</span>
                  </button>
                </li>
                {/* New: Reading Streaks */}
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Reading Streaks')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <BookOpen className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Reading Streaks</span>
                  </button>
                </li>
                {/* New: Study Groups */}
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Study Groups')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Users className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Study Groups</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Share The Bible +')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Share2 className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Share The Bible +</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('About')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Info className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>About</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Giving')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <HandHelping className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Giving</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Language')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Globe className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Language</span>
                  </button>
                </li>
                {/* New: Display Settings */}
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Display Settings')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Sun className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Display Settings</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Settings')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <Settings className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Settings</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleMoreMenuItemClick('Help')} className="flex items-center space-x-3 text-gray-300 hover:text-[#C2B027] transition-colors text-lg w-full text-left">
                    <HelpCircle className="w-6 h-6" /> {/* Lucide Icon */}
                    <span>Help</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Notifications List Overlay */}
        {showNotifications && (
          <div className="absolute inset-0 flex justify-end z-40 bg-black bg-opacity-75">
            <div className="w-80 bg-gray-900 h-full shadow-lg p-6 flex flex-col rounded-l-2xl">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-gray-100">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" /> {/* Lucide Icon for close */}
                </button>
              </div>

              <ul className="space-y-4 flex-1 overflow-y-auto">
                {demoNotifications.length > 0 ? (
                  demoNotifications.map(notification => (
                    <li key={notification.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <p className="text-gray-200 text-sm">{notification.text}</p>
                      <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic text-center">No new notifications.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Custom CSS to hide scrollbar */}
        <style>
          {`
          /* For Webkit browsers (Chrome, Safari, Edge) */
          .home-page-content::-webkit-scrollbar,
          .bible-page-content::-webkit-scrollbar,
          .community-page-content::-webkit-scrollbar,
          .discover-page-content::-webkit-scrollbar {
              display: none;
          }

          /* For Firefox */
          .home-page-content,
          .bible-page-content,
          .community-page-content,
          .discover-page-content {
              scrollbar-width: none; /* Firefox */
          }

          .typing-dots span {
            opacity: 0;
            animation: blink 1s infinite;
          }
          .typing-dots span:nth-child(1) {
            animation-delay: 0s;
          }
          .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
          }
          .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes blink {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
          `}
        </style>
      </div>
    </div>
  );
};

export default App;
