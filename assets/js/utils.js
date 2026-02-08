// Portal v2 - Utility Functions

/**
 * Date and Time utilities
 */
const DateUtils = {
    /**
     * Get current week number
     * @returns {number} Week number (1-52)
     */
    getWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.ceil(diff / oneWeek);
    },

    /**
     * Determine if current week is odd or even
     * @returns {string} 'odd' or 'even'
     */
    getWeekType() {
        const weekNum = this.getWeekNumber();
        return weekNum % 2 === 1 ? 'odd' : 'even';
    },

    /**
     * Get current day of week (0-6, where 0 is Sunday)
     * @returns {number}
     */
    getCurrentDay() {
        return new Date().getDay();
    },

    /**
     * Format date for display
     * @param {Date} date
     * @returns {string}
     */
    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('ru-RU', options);
    },

    /**
     * Format time for display
     * @param {Date} date
     * @returns {string}
     */
    formatTime(date) {
        return date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
};

/**
 * DOM manipulation utilities
 */
const DOMUtils = {
    /**
     * Create HTML element with classes and attributes
     * @param {string} tag
     * @param {Object} options
     * @returns {HTMLElement}
     */
    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        
        if (options.className) {
            element.className = options.className;
        }
        
        if (options.id) {
            element.id = options.id;
        }
        
        if (options.textContent) {
            element.textContent = options.textContent;
        }
        
        if (options.innerHTML) {
            element.innerHTML = options.innerHTML;
        }
        
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        
        return element;
    },

    /**
     * Clear all children from element
     * @param {HTMLElement} element
     */
    clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
};

/**
 * Data loading utilities
 */
const DataLoader = {
    /**
     * Load JSON data from file
     * @param {string} url
     * @returns {Promise}
     */
    async loadJSON(url) {
        try {
            const response = await fetch(`${url}?v=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
            throw error;
        }
    },

    /**
     * Load multiple JSON files
     * @param {Object} urls
     * @returns {Promise}
     */
    async loadMultipleJSON(urls) {
        const promises = Object.entries(urls).map(async ([key, url]) => {
            const data = await this.loadJSON(url);
            return [key, data];
        });
        
        const results = await Promise.all(promises);
        return Object.fromEntries(results);
    }
};

/**
 * Schedule utilities
 */
const ScheduleUtils = {
    /**
     * Get day name by index
     * @param {number} dayIndex
     * @returns {string}
     */
    getDayName(dayIndex) {
        const days = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ];
        return days[dayIndex];
    },

    /**
     * Get short day name by index
     * @param {number} dayIndex
     * @returns {string}
     */
    getShortDayName(dayIndex) {
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return days[dayIndex];
    },

    /**
     * Check if room is remote/online
     * @param {string} room
     * @returns {boolean}
     */
    isRemoteLesson(room) {
        if (!room) return false;
        const lowerRoom = room.toLowerCase();
        return lowerRoom.includes('online') || 
               lowerRoom.includes('дист') || 
               lowerRoom.includes('zoom') ||
               lowerRoom.includes('teams');
    }
};

/**
 * Local Storage utilities
 */
const StorageUtils = {
    /**
     * Save data to localStorage
     * @param {string} key
     * @param {any} value
     */
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    /**
     * Load data from localStorage
     * @param {string} key
     * @param {any} defaultValue
     * @returns {any}
     */
    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};
