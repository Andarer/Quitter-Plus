import React, { useState } from 'react';
import { 
  BookOpen, 
  Waves, 
  HelpCircle, 
  PhoneCall, 
  ShieldCheck, 
  User, 
  ChevronDown, 
  ChevronUp,
  Heart,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('urge_surfing');

  const toggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? '' : id));
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 border border-teal-500/20 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          Научная база и экстренная поддержка
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Справка & Руководство по освобождению
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Проверенные когнитивно-поведенческие методики, протоколы преодоления тяги, план предотвращения срывов и контакты поддержки.
        </p>
      </div>

      {/* Accordion Guide Sections */}
      <div className="space-y-3">
        
        {/* Section 1: Urge Surfing */}
        <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden transition">
          <button
            onClick={() => toggle('urge_surfing')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Методология Urge Surfing (Серфинг влечения)
                </h3>
                <p className="text-xs text-slate-400">
                  Почему борьба с тягой проигрывает наблюдению за ней
                </p>
              </div>
            </div>
            {openSection === 'urge_surfing' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'urge_surfing' && (
            <div className="p-4 sm:p-5 pt-0 border-t border-white/5 text-xs text-slate-300 leading-relaxed space-y-3">
              <p>
                Техника <strong>Urge Surfing</strong> разработана доктором клинической психологии Аланом Марлаттом (Alan Marlatt, Вашингтонский университет). Она базируется на понимании нейробиологии зависимостей.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                <h4 className="font-bold text-teal-300">Анатомия волны тяги:</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>Волна зарождается:</strong> появляется триггер (стресс, запах, привычное место, скука).</li>
                  <li><strong>Пик (гребень волны):</strong> через 3–7 минут интенсивность достигает максимума. В этот момент кажется, что вы «взорветесь» без привычного действия.</li>
                  <li><strong>Спад:</strong> через 10–15 минут уровень нейромедиаторов естественным образом стабилизируется, и тяга угасает.</li>
                </ul>
              </div>
              <p>
                Если вы пытаетесь <em>силой воли подавить</em> мысли, возникает психологический феномен «белого медведя» (иронический процесс контроля): чем больше вы запрещаете себе думать о привычке, тем ярче мозг её визуализирует.
              </p>
              <p>
                <strong>Как скользить по волне:</strong> Займите позицию беспристрастного исследователя. Где в теле вы чувствуете тягу? (Ком в горле? Напряжение в груди? Сухость во рту?). Не осуждайте себя. Дышите глубоко по схеме 4-4-4, активируя блуждающий нерв (n. vagus), который замедляет пульс и выключает симпатическую реакцию «бей или беги».
              </p>
            </div>
          )}
        </div>

        {/* Section 2: HALT Technique */}
        <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden transition">
          <button
            onClick={() => toggle('halt')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Правило H.A.L.T.: распознавание скрытых триггеров
                </h3>
                <p className="text-xs text-slate-400">
                  Четыре состояния, в которых воля наиболее уязвима
                </p>
              </div>
            </div>
            {openSection === 'halt' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'halt' && (
            <div className="p-4 sm:p-5 pt-0 border-t border-white/5 text-xs text-slate-300 leading-relaxed space-y-3">
              <p>
                Акроним <strong>H.A.L.T.</strong> — золотой стандарт наркологии и программ реабилитации. Перед тем как сдаться импульсу, задайте себе вопрос:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="font-bold text-amber-400">H — Hungry (Голоден)</span>
                  <p className="mt-1 text-slate-400">
                    Падение глюкозы в крови отключает префронтальную кору, отвечающую за самоконтроль. Решение: здоровый плотный перекус.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="font-bold text-amber-400">A — Angry (Зоnetwork / Разгневан)</span>
                  <p className="mt-1 text-slate-400">
                    Адреналин и кортизол требуют быстрой разрядки. Мозг пытается получить знакомый дешевый дофамин. Решение: физическая активность.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="font-bold text-amber-400">L — Lonely (Одинок)</span>
                  <p className="mt-1 text-slate-400">
                    Изоляция порождает тоску. Решение: напишите близкому человеку, выйдите в парк или обратитесь в группу поддержки.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="font-bold text-amber-400">T — Tired (Утомлен)</span>
                  <p className="mt-1 text-slate-400">
                    Недостаток сна лишает нейромедиаторных резервов. Решение: короткий сон 20 минут или полноценный ранний отбой.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Relapse Prevention Plan */}
        <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden transition">
          <button
            onClick={() => toggle('relapse_plan')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Личный протокол предотвращения срыва
                </h3>
                <p className="text-xs text-slate-400">
                  Пошаговый алгоритм действий в критический момент
                </p>
              </div>
            </div>
            {openSection === 'relapse_plan' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'relapse_plan' && (
            <div className="p-4 sm:p-5 pt-0 border-t border-white/5 text-xs text-slate-300 leading-relaxed space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Правило 15 минут:</strong> Скажите себе: «Я не запрещаю себе навсегда, но прямо сейчас подожду ровно 15 минут». Включите таймер SOS. В 90% случаев тяга уйдет.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Смена локации:</strong> Немедленно покиньте место, где возник импульс (выйдите из комнаты, встаньте из-за стола, выйдите на свежий воздух).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Термический шок (нырятельный рефлекс):</strong> Умойте лицо ледяной водой. Это мгновенно снижает частоту сердечных сокращений на 15–20% и успокаивает миндалевидное тело.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Что делать, если срыв произошел?</strong> Зафиксируйте сброс честно. Срыв — это не обнуление вашей личности, а единичный инцидент на пути к зрелости. Ваш предыдущий опыт трезвости никуда не исчез.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Hotlines & Crisis Contacts */}
        <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden transition">
          <button
            onClick={() => toggle('hotlines')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Экстренные телефоны помощи и кризисные линии
                </h3>
                <p className="text-xs text-slate-400">
                  Анонимная и бесплатная профессиональная помощь
                </p>
              </div>
            </div>
            {openSection === 'hotlines' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'hotlines' && (
            <div className="p-4 sm:p-5 pt-0 border-t border-white/5 text-xs text-slate-300 leading-relaxed space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="font-bold text-white">Единый телефон доверия (РФ)</div>
                  <div className="font-mono text-emerald-400 text-sm mt-0.5 font-bold">8 (800) 200-01-22</div>
                  <div className="text-[10px] text-slate-400">Круглосуточно, бесплатно, анонимно</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="font-bold text-white">Горячая линия помощи по отказу от курения</div>
                  <div className="font-mono text-emerald-400 text-sm mt-0.5 font-bold">8 (800) 200-0-200</div>
                  <div className="text-[10px] text-slate-400">Минздрав РФ (звонок бесплатный)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="font-bold text-white">Неотложная психологическая помощь</div>
                  <div className="font-mono text-cyan-400 text-sm mt-0.5 font-bold">051 (с городского) / +7 (495) 051</div>
                  <div className="text-[10px] text-slate-400">Квалифицированные психологи</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="font-bold text-white">Международная кризисная линия (SAMHSA)</div>
                  <div className="font-mono text-cyan-400 text-sm mt-0.5 font-bold">1-800-662-4357</div>
                  <div className="text-[10px] text-slate-400">Substance Abuse & Mental Health Services</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: About Author Andárer */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 overflow-hidden transition">
          <button
            onClick={() => toggle('author')}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Об авторе проекта: Andárer
                </h3>
                <p className="text-xs text-emerald-400/90 font-medium">
                  Философия суверенности, дисциплины и ясного разума
                </p>
              </div>
            </div>
            {openSection === 'author' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'author' && (
            <div className="p-4 sm:p-5 pt-0 border-t border-white/5 text-xs text-slate-300 leading-relaxed space-y-3">
              <p>
                <strong>Quitter Plus</strong> создан автором <strong>Andárer</strong> как манифест возвращения личной свободы и суверенитета внимания. В мире, перенасыщенном дешевым дофамином, химическими стимуляторами и алгоритмическими ловушками, способность сказать осознанное «нет» разрушительным паттернам становится высшей формой бунта и самообладания.
              </p>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 italic text-slate-300">
                «Мы не можем изменить прошлое, но в каждый настоящий момент мы вольны выбирать свои реакции. Трезвость — это не аскеза и не лишение, а возвращение полноты восприятия мира без посредников».
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                Quitter Plus распространяется открыто. Приложение разработано по принципу «local-first» с заботой о приватности: ваши мысли, срывы и успехи принадлежат только вам.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
