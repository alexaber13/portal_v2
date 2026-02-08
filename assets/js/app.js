// Глобальные переменные
let currentLanguage = 'ru';
let translations = {};
let scheduleData = {};
let teachersData = [];
let daysMap = {};
let currentWeek = 'odd';
let currentDayIndex = 0;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
    // Загрузка данных
    await loadLanguage(currentLanguage);
    await loadScheduleData();
    await loadTeachersData();
    await loadDaysMap();
    
    // Инициализация интерфейса
    updateUI();
    setupEventListeners();
    displaySchedule();
    updateDateTime();
});

// Загрузка языкового файла
async function loadLanguage(lang) {
    try {
        const response = await fetch(`assets/lang/${lang === 'ru' ? 'russian' : 'english'}_lang.json`);
        translations = await response.json();
        currentLanguage = lang;
    } catch (error) {
        console.error('Ошибка загрузки языкового файла:', error);
    }
}

// Загрузка данных расписания
async function loadScheduleData() {
    try {
        const response = await fetch('schedule-md25.json');
        scheduleData = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
    }
}

// Загрузка данных преподавателей
async function loadTeachersData() {
    try {
        const response = await fetch('teachers.json');
        teachersData = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки преподавателей:', error);
    }
}

// Загрузка карты дней
async function loadDaysMap() {
    try {
        const response = await fetch('daysMap.json');
        daysMap = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки daysMap:', error);
    }
}

// Обновление интерфейса
function updateUI() {
    if (!translations.header) return;
    
    // Обновление заголовка страницы
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = translations.header.title;
    
    // Обновление заголовка
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) headerTitle.textContent = translations.header.title;
    
    // Обновление группы
    const groupName = document.getElementById('group-name');
    if (groupName) {
        const groupLabel = translations.header.groupLabel || 'Группа:';
        const groupDefault = translations.header.groupDefault || '-';
        const groupValue = scheduleData.schedule?.groupName || groupDefault;
        groupName.textContent = `${groupLabel} ${groupValue}`;
    }
    
    // Обновление навигации
    const navSchedule = document.getElementById('nav-schedule');
    if (navSchedule) navSchedule.textContent = translations.nav.schedule;
    
    const navGrades = document.getElementById('nav-grades');
    if (navGrades) navGrades.textContent = translations.nav.grades;
    
    const navTeachers = document.getElementById('nav-teachers');
    if (navTeachers) navTeachers.textContent = translations.nav.teachers;
    
    // Обновление недель
    if (translations.schedule) {
        const oddWeekBtn = document.getElementById('odd-week-btn');
        if (oddWeekBtn) oddWeekBtn.textContent = translations.schedule.weekOdd;
        
        const evenWeekBtn = document.getElementById('even-week-btn');
        if (evenWeekBtn) evenWeekBtn.textContent = translations.schedule.weekEven;
        
        const pairsLabel = document.getElementById('pairs-label');
        if (pairsLabel) pairsLabel.textContent = translations.schedule.pairsCount;
    }
    
    // Обновление заголовков разделов
    const gradesTitle = document.getElementById('grades-title');
    if (gradesTitle && translations.grades) gradesTitle.textContent = translations.grades.title;
    
    const teachersTitle = document.getElementById('teachers-title');
    if (teachersTitle && translations.teachers) teachersTitle.textContent = translations.teachers.title;
    
    // Обновление кнопок семестров
    const semester1Btn = document.getElementById('semester-1-btn');
    if (semester1Btn && translations.grades) semester1Btn.textContent = translations.grades.semester1;
    
    const semester2Btn = document.getElementById('semester-2-btn');
    if (semester2Btn && translations.grades) semester2Btn.textContent = translations.grades.semester2;
    
    // Обновление футера
    if (translations.footer) {
        const footerCopyright = document.getElementById('footer-copyright');
        if (footerCopyright) footerCopyright.innerHTML = translations.footer.copyright;
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Навигация
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });
    
    // Переключатель недель
    const oddWeekBtn = document.getElementById('odd-week-btn');
    if (oddWeekBtn) oddWeekBtn.addEventListener('click', () => switchWeek('odd'));
    
    const evenWeekBtn = document.getElementById('even-week-btn');
    if (evenWeekBtn) evenWeekBtn.addEventListener('click', () => switchWeek('even'));
    
    // Навигация по дням
    const prevDayBtn = document.getElementById('prev-day');
    if (prevDayBtn) prevDayBtn.addEventListener('click', () => changeDay(-1));
    
    const nextDayBtn = document.getElementById('next-day');
    if (nextDayBtn) nextDayBtn.addEventListener('click', () => changeDay(1));
}

// Обработка навигации
function handleNavigation(event) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const section = event.target.getAttribute('data-section');
    
    // Скрыть все разделы
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('grades-section').style.display = 'none';
    document.getElementById('teachers-section').style.display = 'none';
    
    // Показать соответствующий раздел
    if (section === 'schedule') {
        document.getElementById('schedule-section').style.display = 'block';
        displaySchedule();
    } else if (section === 'grades') {
        document.getElementById('grades-section').style.display = 'block';
        displayGrades();
    } else if (section === 'teachers') {
        document.getElementById('teachers-section').style.display = 'block';
        displayTeachers();
    }
}

// Переключение недели
function switchWeek(week) {
    currentWeek = week;
    const oddWeekBtn = document.getElementById('odd-week-btn');
    const evenWeekBtn = document.getElementById('even-week-btn');
    if (oddWeekBtn) oddWeekBtn.classList.toggle('active', week === 'odd');
    if (evenWeekBtn) evenWeekBtn.classList.toggle('active', week === 'even');
    displaySchedule();
}

// Изменение дня
function changeDay(direction) {
    currentDayIndex = (currentDayIndex + direction + 7) % 7;
    displaySchedule();
}

// Отображение расписания
function displaySchedule() {
    if (!scheduleData.schedule || !scheduleData.schedule.days) return;
    
    const dayNames = Object.keys(daysMap);
    if (dayNames.length === 0) return;
    
    const currentDayKey = dayNames[currentDayIndex];
    const dayData = scheduleData.schedule.days[currentDayKey];
    
    // Обновить название дня
    const dayNameElement = document.getElementById('current-day-name');
    if (dayNameElement) {
        const translatedDayName = translations.schedule?.days?.[currentDayKey] || daysMap[currentDayKey] || currentDayKey;
        dayNameElement.textContent = translatedDayName;
    }
    
    // Обновить контейнер занятий
    const container = document.getElementById('lessons-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (!dayData || !dayData.pairs) {
        const pairCountElement = document.getElementById('pair-count');
        if (pairCountElement) pairCountElement.textContent = '0';
        return;
    }
    
    const pairs = dayData.pairs;
    const pairCountElement = document.getElementById('pair-count');
    if (pairCountElement) pairCountElement.textContent = pairs.length;
    
    pairs.forEach(pair => {
        const lessonDiv = document.createElement('div');
        lessonDiv.className = 'lesson-card';
        lessonDiv.innerHTML = `
            <div class="lesson-time">${pair.time}</div>
            <div class="lesson-subject">${pair.subject}</div>
            <div class="lesson-teacher">${pair.teacher}</div>
            <div class="lesson-room">${pair.room || ''}</div>
        `;
        container.appendChild(lessonDiv);
    });
}

// Отображение оценок
function displayGrades() {
    const container = document.getElementById('grades-container');
    if (!container) return;
    const title = translations.grades?.title || 'Оценки';
    container.innerHTML = '<p>Раздел оценок в разработке</p>';
}

// Отображение преподавателей
function displayTeachers() {
    const container = document.getElementById('teachers-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (teachersData.length === 0) {
        container.innerHTML = '<p>Нет данных о преподавателях</p>';
        return;
    }
    
    teachersData.forEach(teacher => {
        const teacherDiv = document.createElement('div');
        teacherDiv.className = 'teacher-card';
        teacherDiv.innerHTML = `
            <h3>${teacher.name}</h3>
            <p>${teacher.subject || ''}</p>
            <p>${teacher.contact || ''}</p>
        `;
        container.appendChild(teacherDiv);
    });
}

// Обновление даты и времени
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US');
    const timeStr = now.toLocaleTimeString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US');
    
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = `${dateStr} ${timeStr}`;
    }
    
    const updateTimeElement = document.getElementById('update-time');
    if (updateTimeElement) {
        updateTimeElement.textContent = timeStr;
    }
    
    setTimeout(updateDateTime, 1000);
}
