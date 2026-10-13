import { 
  Achievement, 
  ChangelogRelease, 
  Habit, 
  HealthMilestone, 
  Tracker, 
  UserPreferences, 
  WidgetSettings 
} from '../types';

export const DEFAULT_TRACKERS: Tracker[] = [
  {
    id: 'tracker_nicotine',
    name: 'Никотин и вейпинг',
    category: 'vaping',
    iconName: 'Wind',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString(), // 3 days 4h ago by default
    costPerDay: 350,
    currency: '₽',
    itemsPerDay: 20,
    itemUnitName: 'затяжек / стиков',
    timeSavedPerItemMin: 4,
    motivationQuote: 'Свободное дыхание, ясный разум и контроль над своей жизнью.',
    color: '#10b981', // emerald
    resets: [],
  },
  {
    id: 'tracker_alcohol',
    name: 'Алкоголь',
    category: 'alcohol',
    iconName: 'WineOff',
    startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    costPerDay: 500,
    currency: '₽',
    itemsPerDay: 2,
    itemUnitName: 'порций',
    timeSavedPerItemMin: 45,
    motivationQuote: 'Трезвость дарит всё то, что алкоголь лишь обещает.',
    color: '#06b6d4', // cyan
    resets: [],
  },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit_meditation',
    name: 'Утренняя медитация 10 мин',
    category: 'mind',
    icon: 'Brain',
    color: '#8b5cf6',
    targetPerWeek: 7,
    completions: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_water',
    name: 'Пить 2 литра чистой воды',
    category: 'health',
    icon: 'Droplets',
    color: '#06b6d4',
    targetPerWeek: 7,
    completions: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_walk',
    name: 'Прогулка или бег 30 мин',
    category: 'sport',
    icon: 'Activity',
    color: '#10b981',
    targetPerWeek: 5,
    completions: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_read',
    name: 'Чтение книги 15 минут',
    category: 'focus',
    icon: 'BookOpen',
    color: '#f59e0b',
    targetPerWeek: 6,
    completions: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit_sleep',
    name: 'Сон не менее 7.5 часов',
    category: 'selfcare',
    icon: 'Moon',
    color: '#ec4899',
    targetPerWeek: 7,
    completions: {},
    createdAt: new Date().toISOString(),
  },
];

export const HEALTH_MILESTONES: HealthMilestone[] = [
  {
    id: 'hm_20m',
    hours: 0.33,
    title: 'Нормализация пульса и давления',
    description: 'Через 20 минут после прекращения пульс и артериальное давление возвращаются к здоровой норме. Кровоснабжение конечностей улучшается.',
    category: 'general',
  },
  {
    id: 'hm_8h',
    hours: 8,
    title: 'Падение угарного газа и кислород',
    description: 'Уровень угарного газа в крови падает до нуля, уровень кислорода возвращается к оптимуму. Клетки мозга насыщаются энергией.',
    category: 'smoking',
  },
  {
    id: 'hm_24h',
    hours: 24,
    title: 'Очищение легких и сосудов',
    description: 'Легкие начинают активно очищаться от продуктов распада. Риск внезапного сердечного приступа начинает снижаться.',
    category: 'general',
  },
  {
    id: 'hm_48h',
    hours: 48,
    title: 'Возвращение вкуса и обоняния',
    description: 'Нервные окончания регенерируют. Еда снова приобретает насыщенный вкус, запахи окружающего мира становятся тонкими и яркими.',
    category: 'general',
  },
  {
    id: 'hm_72h',
    hours: 72,
    title: 'Пик синдрома отмены позади',
    description: 'Организм полностью освободился от химического вещества. Бронхи расслабляются, дыхание становится глубоким и легким.',
    category: 'general',
  },
  {
    id: 'hm_1w',
    hours: 168,
    title: '1 Неделя: прилив энергии',
    description: 'Нормализуется фаза глубокого сна (REM-фаза). Пропадает утренняя вялость, просыпаться становится намного легче.',
    category: 'general',
  },
  {
    id: 'hm_2w',
    hours: 336,
    title: '2 Недели: кровообращение +30%',
    description: 'Кровоток в тканях и мышечный тонус значительно улучшаются. Подниматься по лестнице и заниматься спортом становится в разы проще.',
    category: 'general',
  },
  {
    id: 'hm_1m',
    hours: 720,
    title: '1 Месяц: восстановление серого вещества',
    description: 'Дофаминовая чувствительность рецепторов головного мозга восстанавливается. Уходит фоновая тревожность и раздражительность.',
    category: 'general',
  },
  {
    id: 'hm_3m',
    hours: 2160,
    title: '3 Месяца: перестройка нейронных путей',
    description: 'Старые патологические привычки теряют силу. Объем легких увеличивается до 30%. Иммунная система работает на максимуме.',
    category: 'general',
  },
  {
    id: 'hm_6m',
    hours: 4320,
    title: '6 Месяцев: психологическая автономия',
    description: 'Стрессоустойчивость выше, чем когда-либо. Организм научился вырабатывать эндорфины естественным путем без допингов.',
    category: 'general',
  },
  {
    id: 'hm_1y',
    hours: 8760,
    title: '1 Год: Риск сердечно-сосудистых катастроф снижен вдвое',
    description: 'Один полный год свободы. Риск ишемической болезни сердца снижен на 50%. Тело переродилось, а дисциплина закалилась.',
    category: 'general',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1h',
    title: 'Первый час',
    description: 'Сделать осознанный выбор и продержаться первый час.',
    category: 'streak',
    icon: 'Sparkles',
    tier: 'bronze',
    targetValue: 1, // hours
  },
  {
    id: 'ach_24h',
    title: 'Сутки свободы',
    description: '24 часа чистой жизни без срывов.',
    category: 'streak',
    icon: 'Sun',
    tier: 'bronze',
    targetValue: 24, // hours
  },
  {
    id: 'ach_72h',
    title: 'Переломные 72 часа',
    description: 'Преодолеть самую жесткую фазу физической тяги.',
    category: 'streak',
    icon: 'Shield',
    tier: 'silver',
    targetValue: 72, // hours
  },
  {
    id: 'ach_7d',
    title: 'Первая неделя',
    description: '7 дней подряд в полном контроле над собой.',
    category: 'streak',
    icon: 'Flame',
    tier: 'silver',
    targetValue: 168, // hours
  },
  {
    id: 'ach_14d',
    title: 'Форт трезвости',
    description: '14 дней побед. Формируются новые здоровые синапсы.',
    category: 'streak',
    icon: 'Castle',
    tier: 'silver',
    targetValue: 336, // hours
  },
  {
    id: 'ach_30d',
    title: 'Клуб 30 дней',
    description: 'Целый месяц новой жизни. Вы на верном пути!',
    category: 'streak',
    icon: 'Award',
    tier: 'gold',
    targetValue: 720, // hours
  },
  {
    id: 'ach_66d',
    title: 'Перезагрузка мозга',
    description: '66 дней — научный порог укоренения новой привычки.',
    category: 'streak',
    icon: 'Zap',
    tier: 'gold',
    targetValue: 1584, // hours
  },
  {
    id: 'ach_90d',
    title: 'Сезон победы',
    description: 'Квартал без возврата к прошлому. Полная трансформация.',
    category: 'streak',
    icon: 'Trophy',
    tier: 'platinum',
    targetValue: 2160, // hours
  },
  {
    id: 'ach_365d',
    title: 'Годовой Триумф',
    description: '365 дней абсолютной свободы. Вы настоящий титан воли!',
    category: 'streak',
    icon: 'Crown',
    tier: 'diamond',
    targetValue: 8760, // hours
  },
  {
    id: 'ach_crav_1',
    title: 'Первый серфинг',
    description: 'Успешно преодолеть и зафиксировать 1 приступ тяги.',
    category: 'cravings',
    icon: 'Waves',
    tier: 'bronze',
    targetValue: 1,
  },
  {
    id: 'ach_crav_10',
    title: 'Укротитель импульсов',
    description: 'Оседлать и преодолеть 10 волн влечения.',
    category: 'cravings',
    icon: 'Anchor',
    tier: 'silver',
    targetValue: 10,
  },
  {
    id: 'ach_save_1k',
    title: 'Первая копилка',
    description: 'Сэкономить более 1 000 валюты на отказе от зависимости.',
    category: 'savings',
    icon: 'Coins',
    tier: 'bronze',
    targetValue: 1000,
  },
  {
    id: 'ach_save_10k',
    title: 'Инвестор в здоровье',
    description: 'Сберечь более 10 000 валюты на здоровое будущее.',
    category: 'savings',
    icon: 'Wallet',
    tier: 'gold',
    targetValue: 10000,
  },
  {
    id: 'ach_hab_7',
    title: 'Строитель рутины',
    description: 'Выполнить 7 позитивных привычек.',
    category: 'habits',
    icon: 'CheckCircle2',
    tier: 'bronze',
    targetValue: 7,
  },
  {
    id: 'ach_hab_30',
    title: 'Архитектор характера',
    description: 'Выполнить 30 позитивных привычек.',
    category: 'habits',
    icon: 'Compass',
    tier: 'gold',
    targetValue: 30,
  },
  {
    id: 'ach_zen_3',
    title: 'Глубокий вдох',
    description: 'Завершить 3 сеанса антикризисного дыхания SOS.',
    category: 'zen',
    icon: 'HeartHandshake',
    tier: 'silver',
    targetValue: 3,
  },
];

export const DEFAULT_WIDGETS: WidgetSettings[] = [
  { id: 'sober_clock', enabled: true, order: 1 },
  { id: 'quick_metrics', enabled: true, order: 2 },
  { id: 'urge_sos', enabled: true, order: 3 },
  { id: 'habits_daily', enabled: true, order: 4 },
  { id: 'health_next', enabled: true, order: 5 },
  { id: 'quote_daily', enabled: true, order: 6 },
  { id: 'craving_pulse', enabled: true, order: 7 },
  { id: 'heatmap_30d', enabled: true, order: 8 },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  activeTrackerId: 'tracker_nicotine',
  enableSound: true,
  dailyReminderTime: '20:00',
  widgets: DEFAULT_WIDGETS,
};

export const MOTIVATIONAL_QUOTES = [
  {
    quote: 'Тот, кто побеждает других, силен; тот, кто побеждает самого себя, могуществен.',
    author: 'Лао-цзы',
  },
  {
    quote: 'Сложности созданы не для того, чтобы сломать нас, а для того, чтобы показать, из какого теста мы сделаны.',
    author: 'Эпиктет',
  },
  {
    quote: 'Свобода — это не отсутствие обязательств, это способность выбирать то, что действительно важно.',
    author: 'Виктор Франкл',
  },
  {
    quote: 'Вы не поднимаетесь до уровня своих целей. Вы опускаетесь до уровня своих систем.',
    author: 'Джеймс Клир (Атомные привычки)',
  },
  {
    quote: 'Боль от дисциплины весит граммы, а боль от сожаления весит тонны.',
    author: 'Джим Рон',
  },
  {
    quote: 'Тяга — это всего лишь мысль и физическое ощущение. Волна всегда поднимается, достигает пика и спадает.',
    author: 'Д-р Алан Марлатт (Urge Surfing)',
  },
  {
    quote: 'Каждый раз, когда вы говорите "нет" сиюминутному импульсу, вы говорите "да" своему лучшему будущему.',
    author: 'Andárer',
  },
];

export const APP_CHANGELOG: ChangelogRelease[] = [
  {
    version: 'v1.2.0',
    date: '2026-10-13',
    title: 'Выпуск Quitter Plus: Виджеты, Облачная Синхронизация и CI/CD',
    badge: 'Latest Release',
    commits: [
      { type: 'feat', text: 'Интеграция полноценного трекинга полезных привычек с сериями дней и сеткой' },
      { type: 'feat', text: 'Модульная система дашборд-виджетов с кастомизацией и скрытием блоков' },
      { type: 'feat', text: 'Система достижений с 5 уровнями редкости (Бронза → Алмаз) и конфетти' },
      { type: 'feat', text: 'Двусторонняя облачная синхронизация между устройствами по секретному коду' },
      { type: 'feat', text: 'Поддержка 6 цветовых тем: Dark, OLED Black, Light, Emerald, Cyber, Sunset' },
      { type: 'ci', text: 'Добавлены пайплайны GitHub Actions для автоматической сборки APK и релизов' },
      { type: 'ci', text: 'Настроена автоматическая генерация Changelog на основе Conventional Commits' },
      { type: 'docs', text: 'Интерактивный раздел "Справка": серфинг тяги, метод H.A.L.T., кризисные линии' },
    ],
  },
  {
    version: 'v1.1.0',
    date: '2026-09-20',
    title: 'SOS Режим серфинга влечения & Звуковая терапия',
    commits: [
      { type: 'feat', text: 'Добавлен экстренный режим серфинга влечения (Urge Surfing) с дыхательным кругом' },
      { type: 'feat', text: 'Встроен синтезатор успокаивающих звуковых волн Web Audio (без внешних файлов)' },
      { type: 'fix', text: 'Оптимизирован таймер секунд с нулевой нагрузкой на процессор' },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026-08-01',
    title: 'Первый релиз на основе концепции Quitter от Andárer',
    commits: [
      { type: 'feat', text: 'Мультитрекер зависимостей (никотин, алкоголь, кофеин, кастомные)' },
      { type: 'feat', text: 'Калькулятор сэкономленных денег и неиспользованных единиц' },
      { type: 'feat', text: 'Научная шкала восстановления организма по часам' },
      { type: 'feat', text: 'Локальное хранилище и экспорт/импорт данных в JSON' },
    ],
  },
];
