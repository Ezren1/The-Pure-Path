// ADVANCED USER EXPERIENCE FEATURES
// Search, audio, accessibility, and premium micro-interactions

class AdvancedFeatures {
    constructor() {
        this.searchIndex = [];
        this.audioContext = null;
        this.currentAudio = null;
        this.bookmarks = JSON.parse(localStorage.getItem('quran-bookmarks') || '[]');
        this.userProgress = JSON.parse(localStorage.getItem('user-progress') || '{}');
        this.init();
    }

    init() {
        this.setupAdvancedSearch();
        this.setupAudioSystem();
        this.setupBookmarkSystem();
        this.setupProgressTracking();
        this.setupAdvancedAccessibility();
        this.setupMicroInteractions();
        this.setupSocialFeatures();
        this.setupOfflineSupport();
        this.setupAnalytics();
    }

    // ===== ADVANCED SEARCH SYSTEM =====
    setupAdvancedSearch() {
        this.createSearchInterface();
        this.buildSearchIndex();
        this.setupSearchFunctionality();
    }

    createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'advanced-search-container';
        searchContainer.innerHTML = `
            <div class="search-overlay" style="display: none;">
                <div class="search-modal">
                    <div class="search-header">
                        <input type="text" class="search-input" placeholder="Search verses, topics, or content..." autocomplete="off">
                        <button class="search-close">&times;</button>
                    </div>
                    <div class="search-filters">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="verses">Verses</button>
                        <button class="filter-btn" data-filter="topics">Topics</button>
                        <button class="filter-btn" data-filter="contradictions">Contradictions</button>
                    </div>
                    <div class="search-results"></div>
                    <div class="search-suggestions">
                        <h4>Popular Searches:</h4>
                        <div class="suggestion-tags">
                            <span class="suggestion-tag">Prayer times</span>
                            <span class="suggestion-tag">Hadith contradictions</span>
                            <span class="suggestion-tag">Qur'an sufficiency</span>
                            <span class="suggestion-tag">Prophet character</span>
                        </div>
                    </div>
                </div>
            </div>
            <button class="search-trigger" title="Search (Ctrl+K)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </button>
        `;
        
        document.body.appendChild(searchContainer);
        this.setupSearchStyles();
    }

    setupSearchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .advanced-search-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
            }
            
            .search-trigger {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary-gold), var(--secondary-gold));
                border: none;
                color: var(--rich-black);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
                transition: all 0.3s ease;
            }
            
            .search-trigger:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(212, 175, 55, 0.5);
            }
            
            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 1002;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 10vh;
            }
            
            .search-modal {
                background: linear-gradient(135deg, var(--deep-navy), var(--rich-black));
                border: 2px solid var(--primary-gold);
                border-radius: 20px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                animation: searchModalAppear 0.3s ease-out;
            }
            
            @keyframes searchModalAppear {
                from { opacity: 0; transform: translateY(-50px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            .search-header {
                display: flex;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            }
            
            .search-input {
                flex: 1;
                background: transparent;
                border: none;
                color: var(--divine-white);
                font-size: 1.2rem;
                outline: none;
                padding: 0.5rem 0;
            }
            
            .search-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            
            .search-close {
                background: none;
                border: none;
                color: var(--primary-gold);
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                margin-left: 1rem;
            }
            
            .search-filters {
                display: flex;
                gap: 1rem;
                padding: 1rem 1.5rem;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            }
            
            .filter-btn {
                background: transparent;
                border: 1px solid rgba(212, 175, 55, 0.3);
                color: var(--divine-white);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .filter-btn.active,
            .filter-btn:hover {
                background: var(--primary-gold);
                color: var(--rich-black);
            }
            
            .search-results {
                max-height: 300px;
                overflow-y: auto;
                padding: 1rem 1.5rem;
            }
            
            .search-result-item {
                padding: 1rem;
                border-radius: 10px;
                margin-bottom: 1rem;
                background: rgba(212, 175, 55, 0.1);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .search-result-item:hover {
                background: rgba(212, 175, 55, 0.2);
                transform: translateX(5px);
            }
            
            .search-result-title {
                color: var(--primary-gold);
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .search-result-content {
                color: var(--divine-white);
                opacity: 0.9;
                line-height: 1.5;
            }
            
            .search-suggestions {
                padding: 1.5rem;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
            }
            
            .search-suggestions h4 {
                color: var(--primary-gold);
                margin-bottom: 1rem;
            }
            
            .suggestion-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .suggestion-tag {
                background: rgba(212, 175, 55, 0.2);
                color: var(--divine-white);
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .suggestion-tag:hover {
                background: var(--primary-gold);
                color: var(--rich-black);
            }
        `;
        document.head.appendChild(style);
    }

    buildSearchIndex() {
        // Build comprehensive search index
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const title = section.querySelector('h2')?.textContent || '';
            const content = section.textContent || '';
            const id = section.id;
            
            this.searchIndex.push({
                id,
                title,
                content: content.toLowerCase(),
                type: this.getContentType(id),
                element: section
            });
        });

        // Add verse-specific entries
        const verses = document.querySelectorAll('[data-verse]');
        verses.forEach(verse => {
            const verseText = verse.textContent;
            const verseRef = verse.getAttribute('data-verse');
            
            this.searchIndex.push({
                id: `verse-${verseRef}`,
                title: `Qur'an ${verseRef}`,
                content: verseText.toLowerCase(),
                type: 'verse',
                element: verse
            });
        });
    }

    getContentType(sectionId) {
        const typeMap = {
            'scene1': 'sufficiency',
            'scene2': 'contradictions',
            'scene3': 'conflicts',
            'scene4': 'defense',
            'scene5': 'problematic',
            'scene6': 'prohibition',
            'scene7': 'path',
            'scene8': 'faq'
        };
        return typeMap[sectionId] || 'general';
    }

    setupSearchFunctionality() {
        const searchTrigger = document.querySelector('.search-trigger');
        const searchOverlay = document.querySelector('.search-overlay');
        const searchInput = document.querySelector('.search-input');
        const searchClose = document.querySelector('.search-close');
        const searchResults = document.querySelector('.search-results');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const suggestionTags = document.querySelectorAll('.suggestion-tag');

        // Open search
        searchTrigger.addEventListener('click', () => {
            searchOverlay.style.display = 'flex';
            setTimeout(() => searchInput.focus(), 100);
        });

        // Close search
        searchClose.addEventListener('click', () => {
            searchOverlay.style.display = 'none';
        });

        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.style.display = 'none';
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchOverlay.style.display = 'flex';
                setTimeout(() => searchInput.focus(), 100);
            }
            if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
                searchOverlay.style.display = 'none';
            }
        });

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.performSearch(searchInput.value, btn.dataset.filter);
            });
        });

        // Suggestion tags
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent;
                this.performSearch(tag.textContent);
            });
        });
    }

    performSearch(query, filter = 'all') {
        const searchResults = document.querySelector('.search-results');
        
        if (!query.trim()) {
            searchResults.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center;">Start typing to search...</p>';
            return;
        }

        const results = this.searchIndex.filter(item => {
            const matchesQuery = item.content.includes(query.toLowerCase()) || 
                                item.title.toLowerCase().includes(query.toLowerCase());
            const matchesFilter = filter === 'all' || item.type === filter;
            return matchesQuery && matchesFilter;
        });

        if (results.length === 0) {
            searchResults.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center;">No results found. Try different keywords.</p>';
            return;
        }

        searchResults.innerHTML = results.slice(0, 10).map(result => `
            <div class="search-result-item" data-target="${result.id}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-content">${this.getSearchSnippet(result.content, query)}</div>
            </div>
        `).join('');

        // Add click handlers to results
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.dataset.target;
                const targetElement = document.getElementById(targetId.replace('verse-', ''));
                if (targetElement) {
                    document.querySelector('.search-overlay').style.display = 'none';
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    this.highlightSearchResult(targetElement);
                }
            });
        });
    }

    getSearchSnippet(content, query) {
        const index = content.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return content.substring(0, 150) + '...';
        
        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + query.length + 50);
        let snippet = content.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        // Highlight the query
        const regex = new RegExp(`(${query})`, 'gi');
        snippet = snippet.replace(regex, '<mark style="background: var(--primary-gold); color: var(--rich-black);">$1</mark>');
        
        return snippet;
    }

    highlightSearchResult(element) {
        element.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.8)';
        element.style.transform = 'scale(1.02)';
        setTimeout(() => {
            element.style.boxShadow = '';
            element.style.transform = '';
        }, 2000);
    }

    // ===== AUDIO SYSTEM =====
    setupAudioSystem() {
        this.createAudioPlayer();
        this.setupAudioControls();
    }

    createAudioPlayer() {
        const audioPlayer = document.createElement('div');
        audioPlayer.className = 'audio-player-container';
        audioPlayer.innerHTML = `
            <div class="audio-player" style="display: none;">
                <div class="audio-controls">
                    <button class="audio-btn play-pause">▶️</button>
                    <div class="audio-progress">
                        <div class="audio-progress-bar"></div>
                    </div>
                    <div class="audio-time">0:00 / 0:00</div>
                    <button class="audio-btn volume">🔊</button>
                    <button class="audio-btn close-audio">✕</button>
                </div>
                <div class="audio-info">
                    <div class="audio-title">Qur'anic Recitation</div>
                    <div class="audio-verse">Loading...</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(audioPlayer);
        this.setupAudioStyles();
    }

    setupAudioStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .audio-player-container {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                z-index: 1001;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .audio-player {
                background: linear-gradient(135deg, var(--deep-navy), var(--rich-black));
                border: 2px solid var(--primary-gold);
                border-radius: 15px;
                padding: 1rem;
                backdrop-filter: blur(20px);
                animation: audioPlayerSlideUp 0.3s ease-out;
            }
            
            @keyframes audioPlayerSlideUp {
                from { opacity: 0; transform: translateY(100px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .audio-controls {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .audio-btn {
                background: none;
                border: none;
                color: var(--primary-gold);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .audio-btn:hover {
                background: rgba(212, 175, 55, 0.2);
                transform: scale(1.1);
            }
            
            .audio-progress {
                flex: 1;
                height: 4px;
                background: rgba(212, 175, 55, 0.3);
                border-radius: 2px;
                cursor: pointer;
                position: relative;
            }
            
            .audio-progress-bar {
                height: 100%;
                background: var(--primary-gold);
                border-radius: 2px;
                width: 0%;
                transition: width 0.1s ease;
            }
            
            .audio-time {
                color: var(--divine-white);
                font-size: 0.9rem;
                min-width: 80px;
                text-align: center;
            }
            
            .audio-info {
                text-align: center;
            }
            
            .audio-title {
                color: var(--primary-gold);
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .audio-verse {
                color: var(--divine-white);
                font-size: 0.9rem;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }

    setupAudioControls() {
        // Add audio triggers to verses
        document.querySelectorAll('blockquote, .verse-revelation').forEach(verse => {
            const audioIcon = document.createElement('button');
            audioIcon.className = 'verse-audio-trigger';
            audioIcon.innerHTML = '🔊';
            audioIcon.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(212, 175, 55, 0.8);
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.3s ease;
            `;
            
            verse.style.position = 'relative';
            verse.appendChild(audioIcon);
            
            audioIcon.addEventListener('click', () => {
                this.playVerseAudio(verse.textContent);
            });
        });
    }

    playVerseAudio(verseText) {
        // Simulate audio playback (in real implementation, you'd use actual audio files)
        const audioPlayer = document.querySelector('.audio-player');
        const audioVerse = document.querySelector('.audio-verse');
        
        audioPlayer.style.display = 'block';
        audioVerse.textContent = verseText.substring(0, 100) + '...';
        
        // Simulate progress
        const progressBar = document.querySelector('.audio-progress-bar');
        const timeDisplay = document.querySelector('.audio-time');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 1;
            progressBar.style.width = progress + '%';
            timeDisplay.textContent = `${Math.floor(progress/4)}:${String(Math.floor((progress%4)*15)).padStart(2, '0')} / 3:45`;
            
            if (progress >= 100) {
                clearInterval(interval);
                audioPlayer.style.display = 'none';
            }
        }, 100);
        
        // Close button
        document.querySelector('.close-audio').addEventListener('click', () => {
            clearInterval(interval);
            audioPlayer.style.display = 'none';
        });
    }

    // ===== BOOKMARK SYSTEM =====
    setupBookmarkSystem() {
        this.createBookmarkInterface();
        this.addBookmarkButtons();
        this.loadBookmarks();
    }

    createBookmarkInterface() {
        const bookmarkContainer = document.createElement('div');
        bookmarkContainer.className = 'bookmark-container';
        bookmarkContainer.innerHTML = `
            <button class="bookmark-toggle" title="View Bookmarks">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                </svg>
                <span class="bookmark-count">${this.bookmarks.length}</span>
            </button>
            <div class="bookmark-panel" style="display: none;">
                <h3>Your Bookmarks</h3>
                <div class="bookmark-list"></div>
                <button class="clear-bookmarks">Clear All</button>
            </div>
        `;
        
        document.querySelector('.advanced-search-container').appendChild(bookmarkContainer);
        this.setupBookmarkStyles();
    }

    setupBookmarkStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .bookmark-container {
                position: relative;
                margin-bottom: 1rem;
            }
            
            .bookmark-toggle {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #4a90e2, #357abd);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all 0.3s ease;
            }
            
            .bookmark-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(74, 144, 226, 0.5);
            }
            
            .bookmark-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--primary-gold);
                color: var(--rich-black);
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 0.7rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            
            .bookmark-panel {
                position: absolute;
                top: 60px;
                right: 0;
                width: 300px;
                background: linear-gradient(135deg, var(--deep-navy), var(--rich-black));
                border: 2px solid var(--primary-gold);
                border-radius: 15px;
                padding: 1rem;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .bookmark-panel h3 {
                color: var(--primary-gold);
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .bookmark-item {
                background: rgba(212, 175, 55, 0.1);
                border-radius: 8px;
                padding: 0.8rem;
                margin-bottom: 0.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .bookmark-item:hover {
                background: rgba(212, 175, 55, 0.2);
                transform: translateX(5px);
            }
            
            .bookmark-title {
                color: var(--primary-gold);
                font-weight: 600;
                font-size: 0.9rem;
                margin-bottom: 0.3rem;
            }
            
            .bookmark-content {
                color: var(--divine-white);
                font-size: 0.8rem;
                opacity: 0.8;
            }
            
            .bookmark-remove {
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                color: #ff6464;
                cursor: pointer;
                font-size: 0.8rem;
            }
            
            .clear-bookmarks {
                width: 100%;
                background: #ff6464;
                color: white;
                border: none;
                padding: 0.8rem;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 1rem;
                transition: all 0.3s ease;
            }
            
            .clear-bookmarks:hover {
                background: #ff4444;
            }
            
            .bookmark-btn {
                position: absolute;
                top: 10px;
                right: 50px;
                background: rgba(74, 144, 226, 0.8);
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                color: white;
                font-size: 0.8rem;
                transition: all 0.3s ease;
            }
            
            .bookmark-btn:hover {
                background: rgba(74, 144, 226, 1);
                transform: scale(1.1);
            }
            
            .bookmark-btn.bookmarked {
                background: var(--primary-gold);
                color: var(--rich-black);
            }
        `;
        document.head.appendChild(style);
    }

    addBookmarkButtons() {
        document.querySelectorAll('.premium-card').forEach((card, index) => {
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-btn';
            bookmarkBtn.innerHTML = '🔖';
            bookmarkBtn.dataset.cardIndex = index;
            
            card.style.position = 'relative';
            card.appendChild(bookmarkBtn);
            
            // Check if already bookmarked
            if (this.bookmarks.some(b => b.index === index)) {
                bookmarkBtn.classList.add('bookmarked');
            }
            
            bookmarkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleBookmark(card, index);
            });
        });
        
        // Setup bookmark panel functionality
        const bookmarkToggle = document.querySelector('.bookmark-toggle');
        const bookmarkPanel = document.querySelector('.bookmark-panel');
        
        bookmarkToggle.addEventListener('click', () => {
            bookmarkPanel.style.display = bookmarkPanel.style.display === 'none' ? 'block' : 'none';
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.bookmark-container')) {
                bookmarkPanel.style.display = 'none';
            }
        });
    }

    toggleBookmark(card, index) {
        const bookmarkBtn = card.querySelector('.bookmark-btn');
        const title = card.querySelector('.card-title')?.textContent || 'Untitled';
        const content = card.querySelector('.card-content')?.textContent || '';
        
        const existingIndex = this.bookmarks.findIndex(b => b.index === index);
        
        if (existingIndex > -1) {
            // Remove bookmark
            this.bookmarks.splice(existingIndex, 1);
            bookmarkBtn.classList.remove('bookmarked');
        } else {
            // Add bookmark
            this.bookmarks.push({
                index,
                title,
                content: content.substring(0, 100) + '...',
                timestamp: Date.now()
            });
            bookmarkBtn.classList.add('bookmarked');
        }
        
        this.saveBookmarks();
        this.updateBookmarkDisplay();
    }

    saveBookmarks() {
        localStorage.setItem('quran-bookmarks', JSON.stringify(this.bookmarks));
        document.querySelector('.bookmark-count').textContent = this.bookmarks.length;
    }

    loadBookmarks() {
        this.updateBookmarkDisplay();
    }

    updateBookmarkDisplay() {
        const bookmarkList = document.querySelector('.bookmark-list');
        
        if (this.bookmarks.length === 0) {
            bookmarkList.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center;">No bookmarks yet</p>';
            return;
        }
        
        bookmarkList.innerHTML = this.bookmarks.map(bookmark => `
            <div class="bookmark-item" data-index="${bookmark.index}">
                <div class="bookmark-title">${bookmark.title}</div>
                <div class="bookmark-content">${bookmark.content}</div>
                <button class="bookmark-remove" data-index="${bookmark.index}">✕</button>
            </div>
        `).join('');
        
        // Add click handlers
        bookmarkList.querySelectorAll('.bookmark-item').forEach(item => {
            item.addEventListener('click', () => {
                const cardIndex = parseInt(item.dataset.index);
                const targetCard = document.querySelectorAll('.premium-card')[cardIndex];
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth' });
                    this.highlightSearchResult(targetCard);
                    document.querySelector('.bookmark-panel').style.display = 'none';
                }
            });
        });
        
        bookmarkList.querySelectorAll('.bookmark-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.toggleBookmark(document.querySelectorAll('.premium-card')[index], index);
            });
        });
        
        // Clear all bookmarks
        document.querySelector('.clear-bookmarks').addEventListener('click', () => {
            this.bookmarks = [];
            this.saveBookmarks();
            this.updateBookmarkDisplay();
            document.querySelectorAll('.bookmark-btn').forEach(btn => {
                btn.classList.remove('bookmarked');
            });
        });
    }

    // ===== PROGRESS TRACKING =====
    setupProgressTracking() {
        this.createProgressIndicator();
        this.trackScrollProgress();
        this.trackSectionVisits();
    }

    createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="reading-progress">
                <div class="progress-bar"></div>
            </div>
            <div class="section-progress">
                <div class="progress-dots"></div>
            </div>
        `;
        
        document.body.appendChild(progressContainer);
        this.setupProgressStyles();
    }

    setupProgressStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .progress-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 999;
                pointer-events: none;
            }
            
            .reading-progress {
                height: 3px;
                background: rgba(212, 175, 55, 0.3);
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-gold), var(--secondary-gold));
                width: 0%;
                transition: width 0.1s ease;
                box-shadow: 0 0 10px var(--glow-gold);
            }
            
            .section-progress {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: auto;
            }
            
            .progress-dots {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .progress-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(212, 175, 55, 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .progress-dot.active {
                background: var(--primary-gold);
                box-shadow: 0 0 15px var(--glow-gold);
                transform: scale(1.3);
            }
            
            .progress-dot.visited {
                background: rgba(212, 175, 55, 0.7);
            }
            
            .progress-dot::after {
                content: attr(data-section);
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 0.3rem 0.6rem;
                border-radius: 4px;
                font-size: 0.8rem;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            
            .progress-dot:hover::after {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    trackScrollProgress() {
        const progressBar = document.querySelector('.progress-bar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }

    trackSectionVisits() {
        const sections = document.querySelectorAll('section[id]');
        const progressDots = document.querySelector('.progress-dots');
        
        // Create dots for each section
        sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            dot.dataset.section = section.querySelector('h2')?.textContent || `Section ${index + 1}`;
            dot.dataset.target = section.id;
            
            // Check if visited before
            if (this.userProgress[section.id]) {
                dot.classList.add('visited');
            }
            
            dot.addEventListener('click', () => {
                section.scrollIntoView({ behavior: 'smooth' });
            });
            
            progressDots.appendChild(dot);
        });
        
        // Track section visibility
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const dot = document.querySelector(`[data-target="${entry.target.id}"]`);
                if (entry.isIntersecting) {
                    // Mark as active
                    document.querySelectorAll('.progress-dot').forEach(d => d.classList.remove('active'));
                    dot.classList.add('active', 'visited');
                    
                    // Save progress
                    this.userProgress[entry.target.id] = {
                        visited: true,
                        timestamp: Date.now()
                    };
                    localStorage.setItem('user-progress', JSON.stringify(this.userProgress));
                }
            });
        }, { threshold: 0.3 });
        
        sections.forEach(section => observer.observe(section));
    }

    // ===== ADVANCED ACCESSIBILITY =====
    setupAdvancedAccessibility() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderEnhancements();
        this.setupFocusManagement();
        this.setupColorBlindnessSupport();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'h':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        document.querySelector('.hero-section').scrollIntoView({ behavior: 'smooth' });
                    }
                    break;
                case 'n':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.navigateToNextSection();
                    }
                    break;
                case 'p':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.navigateToPreviousSection();
                    }
                    break;
                case 'b':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        document.querySelector('.bookmark-toggle').click();
                    }
                    break;
            }
        });
    }

    navigateToNextSection() {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            const nextSection = sections[currentIndex + 1];
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    navigateToPreviousSection() {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            const prevSection = sections[currentIndex - 1];
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    setupScreenReaderEnhancements() {
        // Add ARIA labels and descriptions
        document.querySelectorAll('.premium-card').forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-labelledby', `card-title-${index}`);
            card.setAttribute('aria-describedby', `card-content-${index}`);
            
            const title = card.querySelector('.card-title');
            const content = card.querySelector('.card-content');
            
            if (title) {
                title.id = `card-title-${index}`;
            }
            if (content) {
                content.id = `card-content-${index}`;
            }
        });
        
        // Add live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    setupFocusManagement() {
        // Improve focus visibility
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid var(--primary-gold) !important;
                outline-offset: 2px !important;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-gold);
                color: var(--rich-black);
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
                transition: top 0.3s ease;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(style);
        
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#scene1';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupColorBlindnessSupport() {
        // Add pattern overlays for color-blind users
        const colorBlindToggle = document.createElement('button');
        colorBlindToggle.className = 'accessibility-toggle';
        colorBlindToggle.innerHTML = '🎨';
        colorBlindToggle.title = 'Toggle color-blind friendly mode';
        colorBlindToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #6c5ce7;
            border: none;
            color: white;
            cursor: pointer;
            z-index: 1001;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(colorBlindToggle);
        
        colorBlindToggle.addEventListener('click', () => {
            document.body.classList.toggle('color-blind-mode');
        });
        
        // Color-blind friendly styles
        const colorBlindStyles = document.createElement('style');
        colorBlindStyles.textContent = `
            .color-blind-mode .premium-card {
                border-style: dashed !important;
            }
            
            .color-blind-mode .scene-hadith-vs-quran .premium-card {
                border-style: dotted !important;
            }
            
            .color-blind-mode .scene-internal-conflicts .premium-card {
                border-style: double !important;
            }
            
            .color-blind-mode .card-icon::after {
                content: '●';
                position: absolute;
                top: -5px;
                right: -5px;
                color: white;
                font-size: 1.5rem;
            }
        `;
        document.head.appendChild(colorBlindStyles);
    }

    // ===== MICRO-INTERACTIONS =====
    setupMicroInteractions() {
        this.setupHoverEffects();
        this.setupClickFeedback();
        this.setupScrollEffects();
    }

    setupHoverEffects() {
        // Enhanced hover effects for all interactive elements
        document.querySelectorAll('button, a, .premium-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = element.style.transform || '';
                if (!element.style.transform.includes('scale')) {
                    element.style.transform += ' scale(1.05)';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = element.style.transform.replace(/scale\([^)]*\)/g, '');
            });
        });
    }

    setupClickFeedback() {
        // Ripple effect for clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .premium-card, .nav-link')) {
                this.createRippleEffect(e);
            }
        });
    }

    createRippleEffect(e) {
        const ripple = document.createElement('div');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Add ripple animation
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupScrollEffects() {
        // Parallax effect for background elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-background, .divine-light-rays');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ===== SOCIAL FEATURES =====
    setupSocialFeatures() {
        this.createSocialShareButtons();
        this.setupSocialProof();
    }

    createSocialShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share-container';
        shareContainer.innerHTML = `
            <button class="share-toggle" title="Share this page">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
            </button>
            <div class="share-options" style="display: none;">
                <button class="share-btn" data-platform="twitter">Twitter</button>
                <button class="share-btn" data-platform="facebook">Facebook</button>
                <button class="share-btn" data-platform="whatsapp">WhatsApp</button>
                <button class="share-btn" data-platform="copy">Copy Link</button>
            </div>
        `;
        
        document.querySelector('.advanced-search-container').appendChild(shareContainer);
        this.setupSocialStyles();
        this.setupSocialFunctionality();
    }

    setupSocialStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .social-share-container {
                position: relative;
                margin-bottom: 1rem;
            }
            
            .share-toggle {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #25d366, #128c7e);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .share-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(37, 211, 102, 0.5);
            }
            
            .share-options {
                position: absolute;
                top: 60px;
                right: 0;
                background: linear-gradient(135deg, var(--deep-navy), var(--rich-black));
                border: 2px solid var(--primary-gold);
                border-radius: 15px;
                padding: 1rem;
                min-width: 150px;
            }
            
            .share-btn {
                display: block;
                width: 100%;
                background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.3);
                color: var(--divine-white);
                padding: 0.8rem;
                margin-bottom: 0.5rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .share-btn:hover {
                background: var(--primary-gold);
                color: var(--rich-black);
            }
        `;
        document.head.appendChild(style);
    }

    setupSocialFunctionality() {
        const shareToggle = document.querySelector('.share-toggle');
        const shareOptions = document.querySelector('.share-options');
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareToggle.addEventListener('click', () => {
            shareOptions.style.display = shareOptions.style.display === 'none' ? 'block' : 'none';
        });
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                this.shareContent(platform);
                shareOptions.style.display = 'none';
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.social-share-container')) {
                shareOptions.style.display = 'none';
            }
        });
    }

    shareContent(platform) {
        const url = window.location.href;
        const title = 'The Pure Path - Quran Only Islam';
        const text = 'Discover the pure path of Islam through the Quran alone. Learn why the Quran is sufficient and how hadith contradictions lead believers astray.';
        
        switch(platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('Link copied to clipboard!');
                });
                break;
        }
    }

    setupSocialProof() {
        // Add testimonials or user feedback (simulated)
        const testimonials = [
            { name: 'Ahmad', text: 'This opened my eyes to the truth of Quran-only Islam.' },
            { name: 'Fatima', text: 'Finally, a clear explanation of why hadith are problematic.' },
            { name: 'Omar', text: 'The pure path makes so much sense. Thank you!' }
        ];
        
        // Add testimonials to footer or create a dedicated section
        // Implementation would depend on design requirements
    }

    // ===== OFFLINE SUPPORT =====
    setupOfflineSupport() {
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
        
        this.setupOfflineIndicator();
        this.cacheImportantContent();
    }

    registerServiceWorker() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    setupOfflineIndicator() {
        const offlineIndicator = document.createElement('div');
        offlineIndicator.className = 'offline-indicator';
        offlineIndicator.textContent = 'You are offline';
        offlineIndicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff6464;
            color: white;
            text-align: center;
            padding: 0.5rem;
            z-index: 10001;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(offlineIndicator);
        
        window.addEventListener('online', () => {
            offlineIndicator.style.transform = 'translateY(-100%)';
        });
        
        window.addEventListener('offline', () => {
            offlineIndicator.style.transform = 'translateY(0)';
        });
    }

    cacheImportantContent() {
        // Cache critical content for offline access
        const criticalContent = {
            verses: [],
            sections: []
        };
        
        document.querySelectorAll('blockquote').forEach(verse => {
            criticalContent.verses.push(verse.textContent);
        });
        
        document.querySelectorAll('section[id]').forEach(section => {
            criticalContent.sections.push({
                id: section.id,
                title: section.querySelector('h2')?.textContent,
                content: section.textContent.substring(0, 500)
            });
        });
        
        localStorage.setItem('cached-content', JSON.stringify(criticalContent));
    }

    // ===== ANALYTICS =====
    setupAnalytics() {
        this.trackUserInteractions();
        this.trackReadingProgress();
        this.trackSearchQueries();
    }

    trackUserInteractions() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('.premium-card, .nav-link, .flip-card')) {
                this.logEvent('interaction', {
                    type: 'click',
                    element: e.target.className,
                    timestamp: Date.now()
                });
            }
        });
    }

    trackReadingProgress() {
        // Track how much time users spend on each section
        const sectionTimes = {};
        let currentSection = null;
        let sectionStartTime = Date.now();
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (currentSection) {
                        sectionTimes[currentSection] = (sectionTimes[currentSection] || 0) + 
                                                     (Date.now() - sectionStartTime);
                    }
                    currentSection = entry.target.id;
                    sectionStartTime = Date.now();
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
        
        // Save reading times periodically
        setInterval(() => {
            localStorage.setItem('reading-times', JSON.stringify(sectionTimes));
        }, 30000);
    }

    trackSearchQueries() {
        // Track what users search for
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.length > 2) {
                    this.logEvent('search', {
                        query: e.target.value,
                        timestamp: Date.now()
                    });
                }
            });
        }
    }

    logEvent(type, data) {
        const events = JSON.parse(localStorage.getItem('user-events') || '[]');
        events.push({ type, data });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('user-events', JSON.stringify(events));
    }

    // ===== UTILITY METHODS =====
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-gold);
            color: var(--rich-black);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10002;
            animation: notificationSlide 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notificationSlide 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Add notification animation
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes notificationSlide {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize advanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedFeatures();
});

