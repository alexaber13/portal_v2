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
    
    // Обновление заголовка
    document.querySelector('h1').textContent = translations.header.title;
    
    // Обновление навигации
    document.querySelectorAll('.nav-button').forEach((btn, index) => {
        const keys = ['schedule', 'grades', 'teachers'];
        if (translations.nav && translations.nav[keys[index]]) {
            btn.textContent = translations.nav[keys[index]];
        }
    });
    
    // Обновление недель
    if (translations.schedule) {
        document.getElementById('odd-week-btn').textContent = translations.schedule.weekOdd;
        document.getElementById('even-week-btn').textContent = translations.schedule.weekEven;
    }
    
    // Обновление футера
    if (translations.footer) {
        document.querySelector('footer p').innerHTML = translations.footer.copyright;
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });
    
    // Переключатель недель
    document.getElementById('odd-week-btn').addEventListener('click', () => switchWeek('odd'));
    document.getElementById('even-week-btn').addEventListener('click', () => switchWeek('even'));
    
    // Навигация по дням
    document.getElementById('prev-day').addEventListener('click', () => changeDay(-1));
    document.getElementById('next-day').addEventListener('click', () => changeDay(1));
}

// Обработка навигации
function handleNavigation(event) {
    const section = event.target.textContent;
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Показать соответствующий раздел
    document.getElementById('schedule-section').style.display = 'none';
    document.getElementById('grades-section').style.display = 'none';
    document.getElementById('teachers-section').style.display = 'none';
    
    if (event.target.textContent.includes('📅') || event.target.textContent.toLowerCase().includes('schedule')) {
        document.getElementById('schedule-section').style.display = 'block';
        displaySchedule();
    } else if (event.target.textContent.includes('📊') || event.target.textContent.toLowerCase().includes('grades')) {
        document.getElementById('grades-section').style.display = 'block';
        displayGrades();
    } else if (event.target.textContent.includes('👨‍🏫') || event.target.textContent.toLowerCase().includes('teachers')) {
        document.getElementById('teachers-section').style.display = 'block';
        displayTeachers();
    }
}

// Переключение недели
function switchWeek(week) {
    currentWeek = week;
    document.getElementById('odd-week-btn').classList.toggle('active', week === 'odd');
    document.getElementById('even-week-btn').classList.toggle('active', week === 'even');
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
    const currentDayKey = dayNames[currentDayIndex];
    const dayData = scheduleData.schedule.days[currentDayKey];
    
    // Обновить название дня
    document.getElementById('current-day-name').textContent = daysMap[currentDayKey] || currentDayKey;
    
    // Обновить контейнер занятий
    const container = document.getElementById('lessons-container');
    container.innerHTML = '';
    
    if (!dayData || !dayData.pairs) {
        document.getElementById('pair-count').textContent = '0';
        return;
    }
    
    const pairs = dayData.pairs;
    document.getElementById('pair-count').textContent = pairs.length;
    
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
    container.innerHTML = '<h2>' + (translations.grades?.title || 'Оценки') + '</h2>';
    container.innerHTML += '<p>Раздел оценок в разработке</p>';
}

// Отображение преподавателей
function displayTeachers() {
    const container = document.getElementById('teachers-container');
    container.innerHTML = '<h2>' + (translations.teachers?.title || 'Преподаватели') + '</h2>';
    
    if (teachersData.length === 0) {
        container.innerHTML += '<p>Нет данных о преподавателях</p>';
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
