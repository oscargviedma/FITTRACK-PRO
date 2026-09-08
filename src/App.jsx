import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';
import { 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  History as HistoryIcon, 
  RotateCcw, 
  Layers, 
  Search, 
  Flame, 
  Sparkles,
  ArrowRight,
  CalendarCheck,
  CalendarDays
} from 'lucide-react';

const STANDARD_ROUTINES = [
  {
    id: 'std-push',
    name: 'Push (Hypertrophy Focus)',
    desc: 'Chest, Shoulders & Triceps. Compound emphasis.',
    exercises: [
      { name: 'Barbell Bench Press', muscle: 'chest', equipment: 'barbell', targetSets: 4, image: 'Barbell_Bench_Press/0.jpg' },
      { name: 'Incline Dumbbell Press', muscle: 'chest', equipment: 'dumbbell', targetSets: 3, image: 'Incline_Dumbbell_Press/0.jpg' },
      { name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell', targetSets: 3, image: 'Overhead_Press/0.jpg' },
      { name: 'Dumbbell Lateral Raise', muscle: 'shoulders', equipment: 'dumbbell', targetSets: 4, image: 'Dumbbell_Lateral_Raise/0.jpg' },
      { name: 'Triceps Pushdown', muscle: 'triceps', equipment: 'cable', targetSets: 3, image: 'Triceps_Pushdown/0.jpg' },
      { name: 'Triceps Overhead Extension', muscle: 'triceps', equipment: 'cable', targetSets: 3, image: 'Triceps_Overhead_Extension/0.jpg' }
    ]
  },
  {
    id: 'std-pull',
    name: 'Pull (Width & Thickness)',
    desc: 'Lats, Upper Back, Rear Delts & Biceps.',
    exercises: [
      { name: 'Pull-up', muscle: 'back', equipment: 'bodyweight', targetSets: 4, image: 'Pull-up/0.jpg' },
      { name: 'Barbell Bent Over Row', muscle: 'back', equipment: 'barbell', targetSets: 3, image: 'Barbell_Bent_Over_Row/0.jpg' },
      { name: 'Lat Pulldown', muscle: 'back', equipment: 'cable', targetSets: 3, image: 'Lat_Pulldown/0.jpg' },
      { name: 'Face Pull', muscle: 'shoulders', equipment: 'cable', targetSets: 3, image: 'Face_Pull/0.jpg' },
      { name: 'Incline Dumbbell Curl', muscle: 'biceps', equipment: 'dumbbell', targetSets: 3, image: 'Incline_Dumbbell_Curl/0.jpg' },
      { name: 'Hammer Curls', muscle: 'biceps', equipment: 'dumbbell', targetSets: 3, image: 'Hammer_Curls/0.jpg' }
    ]
  },
  {
    id: 'std-legs',
    name: 'Legs (Quad & Ham Balance)',
    desc: 'Complete lower body mechanical tension.',
    exercises: [
      { name: 'Barbell Squat', muscle: 'legs', equipment: 'barbell', targetSets: 4, image: 'Barbell_Squat/0.jpg' },
      { name: 'Romanian Deadlift', muscle: 'legs', equipment: 'barbell', targetSets: 4, image: 'Romanian_Deadlift/0.jpg' },
      { name: 'Leg Press', muscle: 'legs', equipment: 'machine', targetSets: 3, image: 'Leg_Press/0.jpg' },
      { name: 'Seated Leg Curl', muscle: 'legs', equipment: 'machine', targetSets: 3, image: 'Seated_Leg_Curl/0.jpg' },
      { name: 'Standing Calf Raises', muscle: 'legs', equipment: 'machine', targetSets: 4, image: 'Standing_Calf_Raises/0.jpg' }
    ]
  },
  {
    id: 'std-upper',
    name: 'Upper Body (Systemic)',
    desc: 'Agonist/Antagonist pairing for max efficiency.',
    exercises: [
      { name: 'Barbell Bench Press', muscle: 'chest', equipment: 'barbell', targetSets: 3, image: 'Barbell_Bench_Press/0.jpg' },
      { name: 'Barbell Bent Over Row', muscle: 'back', equipment: 'barbell', targetSets: 3, image: 'Barbell_Bent_Over_Row/0.jpg' },
      { name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell', targetSets: 3, image: 'Overhead_Press/0.jpg' },
      { name: 'Lat Pulldown', muscle: 'back', equipment: 'cable', targetSets: 3, image: 'Lat_Pulldown/0.jpg' },
      { name: 'Dumbbell Bicep Curl', muscle: 'biceps', equipment: 'dumbbell', targetSets: 3, image: 'Dumbbell_Bicep_Curl/0.jpg' },
      { name: 'Triceps Pushdown', muscle: 'triceps', equipment: 'cable', targetSets: 3, image: 'Triceps_Pushdown/0.jpg' }
    ]
  },
  {
    id: 'std-lower',
    name: 'Lower Body & Core',
    desc: 'Strength and structural integrity focus.',
    exercises: [
      { name: 'Front Barbell Squat', muscle: 'legs', equipment: 'barbell', targetSets: 3, image: 'Front_Barbell_Squat/0.jpg' },
      { name: 'Romanian Deadlift', muscle: 'legs', equipment: 'barbell', targetSets: 3, image: 'Romanian_Deadlift/0.jpg' },
      { name: 'Bulgarian Split Squat', muscle: 'legs', equipment: 'dumbbell', targetSets: 3, image: 'Bulgarian_Split_Squat/0.jpg' },
      { name: 'Lying Leg Curl', muscle: 'legs', equipment: 'machine', targetSets: 3, image: 'Lying_Leg_Curl/0.jpg' },
      { name: 'Seated Calf Raise', muscle: 'legs', equipment: 'machine', targetSets: 4, image: 'Seated_Calf_Raise/0.jpg' },
      { name: 'Hanging Leg Raise', muscle: 'core', equipment: 'bodyweight', targetSets: 3, image: 'Hanging_Leg_Raise/0.jpg' }
    ]
  }
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MUSCLE_GROUPS = [
  'All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Other'
];

const FALLBACK_DB = [
  { id: 'fb1', name: 'Barbell Bench Press', muscle: 'chest', equipment: 'barbell', image: 'Barbell_Bench_Press/0.jpg' },
  { id: 'fb2', name: 'Pull-up', muscle: 'back', equipment: 'bodyweight', image: 'Pull-up/0.jpg' },
  { id: 'fb3', name: 'Barbell Squat', muscle: 'legs', equipment: 'barbell', image: 'Barbell_Squat/0.jpg' },
  { id: 'fb4', name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell', image: 'Overhead_Press/0.jpg' },
  { id: 'fb5', name: 'Dumbbell Bicep Curl', muscle: 'biceps', equipment: 'dumbbell', image: 'Dumbbell_Bicep_Curl/0.jpg' },
  { id: 'fb6', name: 'Triceps Pushdown', muscle: 'triceps', equipment: 'cable', image: 'Triceps_Pushdown/0.jpg' }
];

let app, auth, db, appId;
if (typeof __firebase_config !== 'undefined') {
  try {
    const firebaseConfig = JSON.parse(__firebase_config);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  } catch (e) { console.error("Firebase init error:", e); }
}

const formatSeconds = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const normalizeMuscle = (muscleStr) => {
  if (!muscleStr) return 'other';
  const m = muscleStr.toLowerCase();
  if (m.includes('chest') || m.includes('pectoral')) return 'chest';
  if (m.includes('back') || m.includes('lat') || m.includes('trap')) return 'back';
  if (m.includes('shoulder') || m.includes('delt')) return 'shoulders';
  if (m.includes('bicep')) return 'biceps';
  if (m.includes('tricep')) return 'triceps';
  if (m.includes('leg') || m.includes('quad') || m.includes('hamstring') || m.includes('glute') || m.includes('calf')) return 'legs';
  if (m.includes('ab') || m.includes('core') || m.includes('waist')) return 'core';
  return m;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${imagePath}`;
};

// --- NEW TUTORIAL COMPONENT ---
const TutorialOverlay = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  
  if (!isOpen) return null;

  const slides = [
    {
      icon: <Sparkles size={48} className="text-blue-400" />,
      title: "Welcome to FitTrack Pro",
      desc: "Your smart, cloud-synced workout companion. Let's take a quick tour to see how it helps you build muscle."
    },
    {
      icon: <CalendarDays size={48} className="text-emerald-400" />,
      title: "The Weekly Tracker",
      desc: "Located on the Home screen. Days light up green when you train. Tap any day to instantly view your logged sessions."
    },
    {
      icon: <Play size={48} className="text-indigo-400 fill-indigo-400" />,
      title: "Start & Log Sessions",
      desc: "Tap the big blue Start button to begin. As you work out, log your weight and reps. The smart Rest Timer will automatically trigger to optimize your recovery."
    },
    {
      icon: <Flame size={48} className="text-amber-400" />,
      title: "Progressive Overload",
      desc: "This is the magic feature. Whenever you repeat a workout, your exact stats from the previous session will appear above your inputs so you know exactly what to beat."
    },
    {
      icon: <Layers size={48} className="text-purple-400" />,
      title: "Library & Programs",
      desc: "Explore science-based templates or build your own custom routines. Tap the calendar icon on any routine to schedule it to a specific day."
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between">
      <div className="flex justify-end p-5">
        <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 bg-slate-900 rounded-full transition-colors">Skip Tutorial</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-28 h-28 rounded-[2rem] bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/20">
          {slides[step].icon}
        </div>
        <h2 className="text-2xl font-black text-white mb-4 tracking-tight">{slides[step].title}</h2>
        <p className="text-sm text-slate-400 max-w-[280px] leading-relaxed">{slides[step].desc}</p>
      </div>
      
      <div className="p-8 pb-12 flex flex-col items-center space-y-8">
        <div className="flex space-x-2.5">
          {slides.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800'}`} />
          ))}
        </div>
        <button onClick={handleNext} className="w-full max-w-[280px] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/30 transition-all active:scale-95">
          {step === slides.length - 1 ? "Let's Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
};
// -----------------------------

const WeeklyTracker = ({ history, onSelectDay }) => {
  const weekDays = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const diffToMonday = (dayOfWeek + 6) % 7; 
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    return DAYS_OF_WEEK.map((dayName, index) => {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + index);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      const loggedWorkouts = history.filter(h => {
        const itemDate = new Date(h.date).toISOString().split('T')[0];
        return itemDate === dateStr;
      });

      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      return {
        name: dayName,
        date: targetDate,
        dateStr,
        dayNum: targetDate.getDate(),
        workouts: loggedWorkouts,
        hasWorkout: loggedWorkouts.length > 0,
        isToday
      };
    });
  }, [history]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center space-x-2">
          <CalendarDays size={16} className="text-blue-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Weekly Tracker</span>
        </div>
        <span className="text-xs text-slate-400">
          {weekDays.filter(d => d.hasWorkout).length} / 7 Days Active
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => (
          <button
            key={day.name}
            onClick={() => onSelectDay(day)}
            className={`flex flex-col items-center py-2.5 px-1 rounded-2xl transition-all ${
              day.hasWorkout
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-950'
                : day.isToday
                ? 'bg-blue-900/20 border border-blue-500/40 text-blue-300'
                : 'bg-slate-950/60 border border-slate-800/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-[10px] font-semibold text-slate-400 uppercase">{day.name}</span>
            <div className="my-1.5 relative flex items-center justify-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  day.hasWorkout 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
                    : day.isToday 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {day.dayNum}
              </div>
            </div>
            <div className="h-1.5">
              {day.hasWorkout && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const DayDetailsModal = ({ dayData, onClose, onOpenWorkout }) => {
  if (!dayData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {dayData.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {dayData.workouts.length} session{dayData.workouts.length === 1 ? '' : 's'} logged
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {dayData.workouts.length === 0 ? (
          <div className="py-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/60">
            <p className="text-slate-400 text-sm font-medium">No sessions logged for this date.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {dayData.workouts.map((w, idx) => (
              <div 
                key={w.id || idx}
                onClick={() => { onOpenWorkout(w); onClose(); }}
                className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl cursor-pointer hover:border-blue-500/50 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{w.routineName || 'Custom Workout'}</h4>
                  <div className="flex items-center space-x-3 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center"><Clock size={11} className="mr-1 text-blue-400" />{formatSeconds(w.duration)}</span>
                    <span className="flex items-center"><Dumbbell size={11} className="mr-1 text-emerald-400" />{w.exercises?.length || 0} exercises</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleModal = ({ isOpen, onClose, routine, scheduledRoutines, onUpdateSchedule }) => {
  if (!isOpen || !routine) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Program Workout</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{routine.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Select the days of the week you want to perform this routine. It will appear on your dashboard automatically.
        </p>

        <div className="space-y-2 mb-5">
          {DAYS_OF_WEEK.map((day, idx) => {
            const isAssigned = scheduledRoutines[idx]?.id === routine.id;
            const isAssignedOther = scheduledRoutines[idx] && !isAssigned;
            return (
              <button
                key={idx}
                onClick={() => {
                  const updated = { ...scheduledRoutines };
                  if (isAssigned) {
                    delete updated[idx];
                  } else {
                    updated[idx] = { id: routine.id, name: routine.name, isCustom: !routine.id.startsWith('std-') };
                  }
                  onUpdateSchedule(updated);
                }}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition-colors ${
                  isAssigned ? 'bg-blue-600 border border-blue-500 shadow-lg shadow-blue-900/30' : 
                  'bg-slate-950 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-bold ${isAssigned ? 'text-white' : 'text-slate-300'}`}>
                    {day}
                  </span>
                  {isAssignedOther && (
                    <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                      (Currently: {scheduledRoutines[idx].name})
                    </span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  isAssigned ? 'bg-white border-white text-blue-600' : 'border-slate-700 bg-slate-900 text-transparent'
                }`}>
                  <Check size={12} strokeWidth={4} />
                </div>
              </button>
            )
          })}
        </div>
        
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-800 text-white text-sm font-bold">
          Done
        </button>
      </div>
    </div>
  );
};

const StartWorkoutModal = ({ isOpen, onClose, onStartEmpty, onOpenLibrarySelection }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Play size={16} className="fill-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Start a Session</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { onClose(); onStartEmpty(); }}
            className="w-full bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl text-left transition-all group flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-blue-300">New Empty Workout</div>
              <p className="text-xs text-slate-400 mt-0.5">Start blank and log exercises on the fly</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
              <Plus size={16} />
            </div>
          </button>

          <button
            onClick={() => { onClose(); onOpenLibrarySelection(); }}
            className="w-full bg-blue-600 hover:bg-blue-500 border border-blue-500/50 p-4 rounded-2xl text-left transition-all group flex items-center justify-between shadow-lg shadow-blue-900/30"
          >
            <div>
              <div className="text-sm font-bold text-white">Choose from Library</div>
              <p className="text-xs text-blue-200 mt-0.5">Pre-existing templates or your routines</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ArrowRight size={16} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const LibraryWorkoutPickerModal = ({ isOpen, onClose, customRoutines, onSelectRoutine }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Workout Library</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a template to begin</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {customRoutines.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">My Routines</span>
              <div className="space-y-2 mt-2">
                {customRoutines.map(routine => (
                  <button key={routine.id} onClick={() => { onSelectRoutine(routine); onClose(); }} className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-2xl text-left flex items-center justify-between transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-white">{routine.name}</h4>
                      <p className="text-xs text-slate-400">{routine.exercises.length} exercises</p>
                    </div>
                    <Play size={14} className="text-blue-400 fill-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Standard Templates</span>
            <div className="space-y-2 mt-2">
              {STANDARD_ROUTINES.map(routine => (
                <button key={routine.id} onClick={() => { onSelectRoutine(routine); onClose(); }} className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-2xl text-left flex items-center justify-between transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-white">{routine.name}</h4>
                    <p className="text-xs text-slate-400">{routine.desc}</p>
                  </div>
                  <Play size={14} className="text-emerald-400 fill-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SaveRoutinePromptModal = ({ isOpen, onSave, onSkip }) => {
  const [name, setName] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-1">Save to Library?</h3>
        <p className="text-xs text-slate-400 mb-4">Would you like to save this completed session as a routine in your library for future workouts?</p>
        <div className="mb-5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Routine Name</label>
          <input type="text" placeholder="e.g., Heavy Push Day" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"/>
        </div>
        <div className="flex space-x-2">
          <button onClick={onSkip} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors">No, Just Finish</button>
          <button onClick={() => onSave(name.trim() || 'Custom Routine')} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-lg shadow-blue-900/30">Save & Finish</button>
        </div>
      </div>
    </div>
  );
};

const ExerciseSelectorModal = ({ isOpen, onClose, exerciseDB, onSelectExercise }) => {
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = useMemo(() => {
    let list = exerciseDB;
    if (selectedMuscle !== 'All') {
      const normSelected = selectedMuscle.toLowerCase();
      list = list.filter(item => {
        const itemMuscle = normalizeMuscle(item.muscle || (item.primaryMuscles && item.primaryMuscles[0]));
        return itemMuscle === normSelected;
      });
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(item => item.name.toLowerCase().includes(term));
    }
    return list;
  }, [exerciseDB, selectedMuscle, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[75] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full h-[85vh] shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-white">Select Exercise</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="relative mb-3 flex-shrink-0">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input 
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex space-x-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none flex-shrink-0">
          {MUSCLE_GROUPS.map((mg) => (
            <button
              key={mg}
              onClick={() => setSelectedMuscle(mg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedMuscle === mg ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {mg}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No exercises match your criteria.</div>
          ) : (
            filteredExercises.map((exercise) => {
              const imgUrl = getImageUrl(exercise.image || (exercise.images && exercise.images[0]));
              return (
                <div key={exercise.id || exercise.name} onClick={() => { onSelectExercise(exercise); onClose(); }} className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 p-2.5 rounded-2xl flex items-center space-x-3 cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex-shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
                    {imgUrl ? <img src={imgUrl} alt={exercise.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }}/> : <Dumbbell size={18} className="text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{exercise.name}</h4>
                    <p className="text-xs text-slate-400 capitalize">{exercise.muscle || (exercise.primaryMuscles && exercise.primaryMuscles[0]) || 'General'} • {exercise.equipment || 'Any'}</p>
                  </div>
                  <Plus size={16} className="text-blue-400 flex-shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const RoutineEditor = ({ routine, onSave, onCancel, exerciseDB }) => {
  const [name, setName] = useState(routine?.name || '');
  const [exercises, setExercises] = useState(routine?.exercises || []);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleAddExercise = (exercise) => {
    const newEx = {
      name: exercise.name,
      muscle: exercise.muscle || (exercise.primaryMuscles && exercise.primaryMuscles[0]) || 'general',
      equipment: exercise.equipment || 'standard',
      targetSets: 3,
      image: exercise.image || (exercise.images && exercise.images[0]) || null
    };
    setExercises([...exercises, newEx]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onCancel} className="flex items-center text-xs font-bold text-slate-400 hover:text-white">
          <ChevronLeft size={16} className="mr-1" /> Back
        </button>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{routine ? 'Edit Routine' : 'New Routine'}</h3>
        <button onClick={() => { if (name.trim()) onSave({ id: routine?.id || `r_${Date.now()}`, name: name.trim(), exercises }); }} disabled={!name.trim() || exercises.length === 0} className="bg-blue-600 disabled:opacity-40 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
          Save
        </button>
      </div>

      <div className="mb-4">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Routine Title</label>
        <input type="text" placeholder="e.g., Heavy Leg Day" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"/>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exercises ({exercises.length})</span>
        <button onClick={() => setIsSelectorOpen(true)} className="text-xs font-bold text-blue-400 flex items-center hover:text-blue-300">
          <Plus size={14} className="mr-1" /> Add Exercise
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {exercises.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">No exercises added yet.</p>
            <button onClick={() => setIsSelectorOpen(true)} className="mt-3 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl text-xs font-bold">Choose from Database</button>
          </div>
        ) : (
          exercises.map((ex, idx) => {
            const imgUrl = getImageUrl(ex.image);
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex-shrink-0 flex items-center justify-center">
                    {imgUrl ? <img src={imgUrl} alt={ex.name} className="w-full h-full object-cover" /> : <Dumbbell size={16} className="text-slate-400" />}
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate">{ex.name}</h4>
                    <p className="text-[11px] text-slate-400 capitalize">{ex.muscle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                    <button onClick={() => setExercises(exercises.map((e, i) => i === idx ? { ...e, targetSets: Math.max(1, (e.targetSets || 3) - 1) } : e))} className="text-slate-400 hover:text-white px-1 font-bold text-xs">-</button>
                    <span className="text-xs font-mono font-bold text-blue-400 px-1">{ex.targetSets || 3} sets</span>
                    <button onClick={() => setExercises(exercises.map((e, i) => i === idx ? { ...e, targetSets: (e.targetSets || 3) + 1 } : e))} className="text-slate-400 hover:text-white px-1 font-bold text-xs">+</button>
                  </div>
                  <button onClick={() => setExercises(exercises.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-400 p-1"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <ExerciseSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} exerciseDB={exerciseDB} onSelectExercise={handleAddExercise}/>
    </div>
  );
};

const LibraryTab = ({ customRoutines, onSaveRoutine, onDeleteRoutine, onStartRoutine, exerciseDB, scheduledRoutines, onUpdateSchedule }) => {
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showStandard, setShowStandard] = useState(true);
  const [scheduleModalRoutine, setScheduleModalRoutine] = useState(null);

  if (editingRoutine || isCreatingNew) {
    return (
      <RoutineEditor
        routine={editingRoutine} exerciseDB={exerciseDB}
        onCancel={() => { setEditingRoutine(null); setIsCreatingNew(false); }}
        onSave={async (savedRoutine) => {
          await onSaveRoutine(savedRoutine);
          setEditingRoutine(null); setIsCreatingNew(false);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Workout Library</h2>
          <p className="text-xs text-slate-400">Routines & evidence-based splits</p>
        </div>
        <button onClick={() => setIsCreatingNew(true)} className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-blue-900/30 transition-colors">
          <Plus size={15} /><span>New Routine</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-20">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">My Routines ({customRoutines.length})</span>
          <div className="space-y-2.5 mt-2">
            {customRoutines.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-400 text-sm">No custom routines yet.</p>
              </div>
            ) : (
              customRoutines.map(routine => (
                <div key={routine.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0 pr-3">
                      <h3 className="text-base font-bold text-white truncate">{routine.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{routine.exercises.length} exercises</p>
                    </div>
                    <button onClick={() => onStartRoutine(routine)} className="w-10 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-500 flex items-center justify-center shadow-md shadow-blue-900/40" title="Start">
                      <Play size={16} className="fill-white translate-x-0.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80">
                    <button onClick={() => setScheduleModalRoutine(routine)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center"><Calendar size={13} className="mr-1.5"/> Program</button>
                    <button onClick={() => setEditingRoutine(routine)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center"><Edit2 size={13} className="mr-1.5"/> Edit</button>
                    <button onClick={() => onDeleteRoutine(routine.id)} className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-bold"><Trash2 size={13}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Standard Templates (Science-Based)</span>
            <button onClick={() => setShowStandard(!showStandard)} className="text-xs font-bold text-blue-400 hover:text-blue-300">{showStandard ? 'Hide' : 'Show'}</button>
          </div>
          {showStandard && (
            <div className="space-y-2.5">
              {STANDARD_ROUTINES.map(routine => (
                <div key={routine.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white truncate">{routine.name}</h3>
                        <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md hidden sm:inline-block">Template</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{routine.desc}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{routine.exercises.length} exercises</p>
                    </div>
                    <button onClick={() => onStartRoutine(routine)} className="w-10 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-900/40 flex-shrink-0" title="Start Workout">
                      <Play size={16} className="fill-white translate-x-0.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80">
                    <button onClick={() => setScheduleModalRoutine(routine)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center"><Calendar size={13} className="mr-1.5"/> Program</button>
                    <button onClick={() => setEditingRoutine({ id: `copy_${Date.now()}`, name: `${routine.name.split(' (')[0]} (Copy)`, exercises: [...routine.exercises] })} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center"><Edit2 size={13} className="mr-1.5"/> Clone</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ScheduleModal 
        isOpen={!!scheduleModalRoutine} 
        onClose={() => setScheduleModalRoutine(null)} 
        routine={scheduleModalRoutine}
        scheduledRoutines={scheduledRoutines}
        onUpdateSchedule={onUpdateSchedule}
      />
    </div>
  );
};

const HistoryModal = ({ isOpen, onClose, history, onDeleteSession }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full h-[85vh] shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <HistoryIcon size={18} className="text-blue-400" />
            <h3 className="text-lg font-bold text-white">Workout History</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"><X size={16} /></button>
        </div>

        {selectedWorkout ? (
          <div className="flex flex-col h-full">
            <button onClick={() => setSelectedWorkout(null)} className="flex items-center text-xs font-bold text-blue-400 mb-3"><ChevronLeft size={16} className="mr-1" /> Back to List</button>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-3">
              <h4 className="text-base font-bold text-white">{selectedWorkout.routineName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{new Date(selectedWorkout.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
                <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span><span className="text-xs font-mono font-bold text-blue-400">{formatSeconds(selectedWorkout.duration)}</span></div>
                <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Rest Time</span><span className="text-xs font-mono font-bold text-amber-400">{formatSeconds(selectedWorkout.totalRestDuration || 0)}</span></div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Volume</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{selectedWorkout.exercises.reduce((total, ex) => total + (ex.sets?.reduce((sTot, s) => sTot + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0) || 0), 0)} kg</span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedWorkout.exercises.map((ex, idx) => {
                const imgUrl = getImageUrl(ex.image);
                return (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-3">
                     <div className="w-10 h-10 rounded-xl bg-slate-900 flex-shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
                        {imgUrl ? <img src={imgUrl} alt={ex.name} className="w-full h-full object-cover"/> : <Dumbbell size={16} className="text-slate-400"/>}
                     </div>
                     <div>
                        <h5 className="text-sm font-bold text-white">{ex.name}</h5>
                        <span className="text-[11px] text-slate-400">{ex.sets?.length || 0} sets</span>
                     </div>
                  </div>
                  <div className="space-y-1">
                    {ex.sets?.map((s, sIdx) => (
                      <div key={sIdx} className="flex justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/60 font-mono">
                        <span className="text-slate-400">Set {sIdx + 1}</span>
                        <span className="text-white font-bold">{s.weight} kg × {s.reps} reps</span>
                        <span className="text-slate-400">Diff: {s.difficulty}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              )})}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {history.length === 0 ? <div className="text-center py-16 text-slate-400 text-sm">No past workouts found yet.</div> : (
              history.map(item => (
                <div key={item.id} onClick={() => setSelectedWorkout(item)} className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.routineName || 'Completed Session'}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {formatSeconds(item.duration)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); onDeleteSession(item.id); }} className="w-8 h-8 rounded-xl bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 flex items-center justify-center"><Trash2 size={14} /></button>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ActiveWorkout = ({ session, history, onFinishWorkout, onCancelWorkout, exerciseDB }) => {
  const [exercises, setExercises] = useState(session.exercises || []);
  const [currentExIndex, setCurrentExIndex] = useState(0);

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exerciseSeconds, setExerciseSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [totalRestDuration, setTotalRestDuration] = useState(0);

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [difficulty, setDifficulty] = useState('8');
  const [isAddExModalOpen, setIsAddExModalOpen] = useState(false);

  // Advanced Progressive Overload Finder
  const previousSession = useMemo(() => {
    if (!session.routineName || session.routineName === 'Empty Workout') return null;
    return history.find(h => h.routineName === session.routineName);
  }, [session.routineName, history]);

  const currentExercise = exercises[currentExIndex];
  
  const prevExerciseData = useMemo(() => {
    if (!previousSession || !currentExercise) return null;
    return previousSession.exercises?.find(e => e.name === currentExercise.name);
  }, [previousSession, currentExercise]);

  const currentSetNum = (currentExercise?.sets?.length || 0) + 1;
  const prevSetData = prevExerciseData?.sets?.[currentSetNum - 1];

  useEffect(() => {
    if (!currentExercise) return;
    if (currentExercise.sets && currentExercise.sets.length > 0) {
      const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
      setWeight(lastSet.weight.toString());
      setReps(lastSet.reps.toString());
      setDifficulty(lastSet.difficulty.toString());
    } else if (prevSetData) {
      setWeight(prevSetData.weight.toString());
      setReps(prevSetData.reps.toString());
      setDifficulty(prevSetData.difficulty.toString());
    } else {
      setWeight('');
      setReps('');
      setDifficulty('8');
    }
    setExerciseSeconds(0);
  }, [currentExIndex, exercises.length]);

  useEffect(() => {
    let interval = null;
    if (!isPaused) {
      interval = setInterval(() => {
        setTotalSeconds(s => s + 1);
        if (!isResting) setExerciseSeconds(es => es + 1);
        else { setRestSeconds(rs => rs + 1); setTotalRestDuration(tr => tr + 1); }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isResting]);

  const handleLogSetAndRest = () => {
    if (!weight || !reps || !currentExercise) return;
    const newSet = { weight: parseFloat(weight), reps: parseInt(reps, 10), difficulty: parseInt(difficulty, 10), timestamp: Date.now() };
    const updatedExercises = exercises.map((ex, idx) => idx === currentExIndex ? { ...ex, sets: [...(ex.sets || []), newSet] } : ex);
    setExercises(updatedExercises);
    setIsResting(true);
    setRestSeconds(0);
  };

  const handleAddExerciseFromModal = (ex) => {
    const newEx = { name: ex.name, muscle: ex.muscle || (ex.primaryMuscles && ex.primaryMuscles[0]) || 'general', equipment: ex.equipment || 'standard', targetSets: 3, image: ex.image || (ex.images && ex.images[0]) || null, sets: [] };
    const nextList = [...exercises, newEx];
    setExercises(nextList);
    setCurrentExIndex(nextList.length - 1);
  };

  const imgUrl = getImageUrl(currentExercise?.image);

  return (
    <div className="flex flex-col h-full bg-slate-950 max-w-md mx-auto relative px-4 py-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-900">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-mono font-bold text-white tracking-tight">{formatSeconds(totalSeconds)}</span>
            <button onClick={() => setIsPaused(!isPaused)} className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center space-x-1 ${isPaused ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300 hover:text-white'}`}>
              {isPaused ? <Play size={10} className="fill-amber-300" /> : <Pause size={10} />}<span>{isPaused ? 'Paused' : 'Pause'}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onCancelWorkout} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold">Cancel</button>
          <button onClick={() => onFinishWorkout({ routineName: session.routineName, exercises, duration: totalSeconds, totalRestDuration, isCustomTemplate: session.isCustomTemplate })} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30">Finish</button>
        </div>
      </div>

      {exercises.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4"><Dumbbell size={28} /></div>
          <h3 className="text-lg font-bold text-white mb-1">No Exercises In Session</h3>
          <p className="text-xs text-slate-400 max-w-xs mb-5">Add your first exercise to begin logging weight, reps, and sets.</p>
          <button onClick={() => setIsAddExModalOpen(true)} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/30 flex items-center space-x-2"><Plus size={16} /><span>Add Exercise</span></button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between overflow-y-auto py-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Exercise {currentExIndex + 1} of {exercises.length}</span>
              <span className="text-xs font-mono text-slate-400">Timer: {formatSeconds(exerciseSeconds)}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg">
              <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden mb-2.5 flex items-center justify-center">
                {imgUrl ? <img src={imgUrl} alt={currentExercise.name} className="w-full h-full object-cover" /> : <Dumbbell size={32} className="text-slate-400" />}
              </div>
              <div className="flex items-center justify-between w-full px-2">
                <button disabled={currentExIndex === 0} onClick={() => setCurrentExIndex(i => i - 1)} className="w-8 h-8 rounded-full bg-slate-800 disabled:opacity-30 text-slate-300 flex items-center justify-center"><ChevronLeft size={16} /></button>
                <div className="flex-1 px-2">
                  <h3 className="text-base font-bold text-white truncate">{currentExercise.name}</h3>
                  <p className="text-xs text-slate-400 capitalize">{currentExercise.muscle} • Target: {currentExercise.targetSets || 3} sets</p>
                </div>
                <button disabled={currentExIndex === exercises.length - 1} onClick={() => setCurrentExIndex(i => i + 1)} className="w-8 h-8 rounded-full bg-slate-800 disabled:opacity-30 text-slate-300 flex items-center justify-center"><ChevronRight size={16} /></button>
              </div>

              {prevExerciseData && prevExerciseData.sets?.length > 0 && (
                <div className="mt-3 bg-blue-950/40 border border-blue-500/30 rounded-xl px-3 py-2 text-left w-full shadow-inner">
                  <div className="flex items-center space-x-2 text-[11px] text-blue-300 font-bold mb-1.5 pb-1.5 border-b border-blue-500/20">
                    <Sparkles size={13} className="text-blue-400 flex-shrink-0" />
                    <span>Last Session Performance:</span>
                  </div>
                  <div className="space-y-1">
                    {prevExerciseData.sets.map((s, idx) => (
                      <div key={idx} className="text-[10.5px] text-blue-200/80 font-mono flex justify-between">
                        <span>Set {idx + 1}:</span>
                        <span>{s.weight} kg × {s.reps} reps (Diff: {s.difficulty})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {currentExercise.sets && currentExercise.sets.length > 0 && (
              <div className="space-y-1.5">
                <div className="grid grid-cols-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                  <span>Set</span><span className="text-center">Weight</span><span className="text-center">Reps</span><span className="text-right">Difficulty</span>
                </div>
                {currentExercise.sets.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-4 items-center bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-2 text-xs font-mono">
                    <span className="font-bold text-slate-400">#{idx + 1}</span><span className="text-center font-bold text-white">{s.weight} kg</span><span className="text-center font-bold text-white">{s.reps}</span><span className="text-right text-slate-400">{s.difficulty}/10</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl mb-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">Log Set #{currentSetNum}</div>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 text-center">Weight (kg)</label>
                  <input type="number" step="0.5" placeholder="0" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-center text-lg font-mono font-bold text-white focus:outline-none focus:border-blue-500"/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 text-center">Reps</label>
                  <input type="number" placeholder="0" value={reps} onChange={(e) => setReps(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-center text-lg font-mono font-bold text-white focus:outline-none focus:border-blue-500"/>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1 text-center">Diff (1-10)</label>
                  <input type="number" min="1" max="10" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-center text-lg font-mono font-bold text-white focus:outline-none focus:border-blue-500"/>
                </div>
              </div>
            </div>

            {isResting ? (
              <div className="bg-blue-950/40 border border-blue-500/40 rounded-3xl p-4 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Resting</span>
                  <div className="text-2xl font-mono font-bold text-white flex items-center space-x-2"><Clock size={18} className="text-blue-400 animate-pulse" /><span>{formatSeconds(restSeconds)}</span></div>
                </div>
                <button onClick={() => setIsResting(false)} className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 flex items-center space-x-1.5"><Play size={14} className="fill-white" /><span>Resume</span></button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button onClick={handleLogSetAndRest} disabled={!weight || !reps} className="col-span-2 py-3.5 bg-blue-600 disabled:opacity-40 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center justify-center space-x-2 transition-all">
                  <Check size={16} /><span>Log Set & Rest</span>
                </button>
                {currentExIndex < exercises.length - 1 ? (
                  <button onClick={() => setCurrentExIndex(i => i + 1)} className="py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1">
                    <span>Next Ex.</span><ChevronRight size={15} />
                  </button>
                ) : (
                  <button onClick={() => setIsAddExModalOpen(true)} className="py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-400 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1">
                    <Plus size={15} /><span>Add Ex.</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <ExerciseSelectorModal isOpen={isAddExModalOpen} onClose={() => setIsAddExModalOpen(false)} exerciseDB={exerciseDB} onSelectExercise={handleAddExerciseFromModal}/>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSession, setActiveSession] = useState(null);
  const [exerciseDB, setExerciseDB] = useState(FALLBACK_DB);
  
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isLibraryPickerOpen, setIsLibraryPickerOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [saveRoutinePrompt, setSaveRoutinePrompt] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const [user, setUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(true);

  const [customRoutines, setCustomRoutines] = useState([]);
  const [history, setHistory] = useState([]);
  const [scheduledRoutines, setScheduledRoutines] = useState({});

  useEffect(() => {
    // Check if tutorial has been seen
    const hasSeenTutorial = localStorage.getItem('fittrack_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }

    if (!auth) {
      setIsSyncing(false);
      return;
    }
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error("Auth init error:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setIsSyncing(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCloseTutorial = () => {
    localStorage.setItem('fittrack_tutorial_seen', 'true');
    setShowTutorial(false);
  };

  useEffect(() => {
    if (!user || !db) return;
    
    setIsSyncing(true);
    const userId = user.uid;

    const routinesRef = collection(db, 'artifacts', appId, 'users', userId, 'routines');
    const unsubRoutines = onSnapshot(routinesRef, (snap) => {
      const r = [];
      snap.forEach(doc => r.push({ id: doc.id, ...doc.data() }));
      setCustomRoutines(r);
    }, (err) => console.error(err));

    const historyRef = collection(db, 'artifacts', appId, 'users', userId, 'history');
    const unsubHistory = onSnapshot(historyRef, (snap) => {
      const h = [];
      snap.forEach(doc => h.push({ id: doc.id, ...doc.data() }));
      h.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(h);
    }, (err) => console.error(err));

    const scheduleRef = collection(db, 'artifacts', appId, 'users', userId, 'settings');
    const unsubSchedule = onSnapshot(scheduleRef, (snap) => {
      let sched = {};
      snap.forEach(doc => {
        if (doc.id === 'schedule') sched = doc.data();
      });
      setScheduledRoutines(sched);
      setIsSyncing(false);
    }, (err) => console.error(err));

    return () => { unsubRoutines(); unsubHistory(); unsubSchedule(); };
  }, [user]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setExerciseDB(data); })
      .catch(() => {});
  }, []);

  const saveRoutineDB = async (routine) => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'routines', routine.id);
    await setDoc(docRef, routine);
  };

  const deleteRoutineDB = async (id) => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'routines', id);
    await deleteDoc(docRef);
  };

  const saveHistoryDB = async (session) => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'history', session.id);
    await setDoc(docRef, session);
  };

  const deleteHistoryDB = async (id) => {
    if (!user || !db) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'history', id);
    await deleteDoc(docRef);
  };

  const updateScheduleDB = async (sched) => {
    if (!user || !db) return;
    // Optimistic UI update
    setScheduledRoutines(sched);
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'schedule');
    await setDoc(docRef, sched);
  };

  const handleStartEmpty = () => setActiveSession({ routineName: 'Empty Workout', isCustomTemplate: false, exercises: [] });
  const handleStartRoutine = (routine) => setActiveSession({ routineName: routine.name, isCustomTemplate: !routine.id.startsWith('std-'), exercises: routine.exercises.map(e => ({ ...e, sets: [] })) });

  const handleFinishWorkout = (finishedData) => {
    const isNewUntracked = finishedData.routineName === 'Empty Workout' || !finishedData.isCustomTemplate;
    if (isNewUntracked && finishedData.exercises.length > 0) setSaveRoutinePrompt(finishedData);
    else finalizeSaveWorkout(finishedData);
  };

  const finalizeSaveWorkout = async (finishedData) => {
    const newHistoryItem = { id: `h_${Date.now()}`, routineName: finishedData.routineName, date: new Date().toISOString(), duration: finishedData.duration, totalRestDuration: finishedData.totalRestDuration, exercises: finishedData.exercises };
    await saveHistoryDB(newHistoryItem);
    setActiveSession(null);
    setSaveRoutinePrompt(null);
  };

  const handleSaveRoutineAndFinish = async (routineName) => {
    if (saveRoutinePrompt) {
      const newRoutine = { id: `r_${Date.now()}`, name: routineName, exercises: saveRoutinePrompt.exercises.map(e => ({ name: e.name, muscle: e.muscle, equipment: e.equipment, targetSets: e.sets?.length || 3, image: e.image })) };
      await saveRoutineDB(newRoutine);
      await finalizeSaveWorkout({ ...saveRoutinePrompt, routineName });
    }
  };

  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const todayProgram = scheduledRoutines[currentDayIndex];

  return (
    <div className="flex justify-center w-full h-[100dvh] bg-slate-950 font-sans text-slate-100 select-none overflow-hidden relative">
      <TutorialOverlay isOpen={showTutorial} onClose={handleCloseTutorial} />
      
      <div className="w-full max-w-md h-full flex flex-col bg-slate-950 border-x border-slate-900 shadow-2xl relative">
        {activeSession ? (
          <ActiveWorkout session={activeSession} history={history} exerciseDB={exerciseDB} onCancelWorkout={() => setActiveSession(null)} onFinishWorkout={handleFinishWorkout} />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden pb-16">
            {activeTab === 'home' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-6">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2"><span>FitTrack</span><span className="text-blue-500">Pro</span></h1>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <p className="text-xs text-slate-400">Track overload & rest efficiently</p>
                      {user && (
                        <span className="flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                          <Check size={9} className="mr-0.5" /> Synced
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setIsHistoryModalOpen(true)} className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-md shadow-black/40"><HistoryIcon size={18} /></button>
                </div>

                <WeeklyTracker history={history} onSelectDay={(day) => setSelectedDayData(day)} />

                {todayProgram && (
                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-3xl p-4 flex items-center justify-between shadow-lg">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-1 text-blue-400">
                        <CalendarCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Today's Program</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{todayProgram.name}</h3>
                    </div>
                    <button 
                      onClick={() => {
                        const routineToStart = customRoutines.find(r => r.id === todayProgram.id) || STANDARD_ROUTINES.find(r => r.id === todayProgram.id);
                        if (routineToStart) handleStartRoutine(routineToStart);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/40"
                    >
                      Start
                    </button>
                  </div>
                )}

                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <button onClick={() => setIsStartModalOpen(true)} className="w-48 h-48 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 shadow-2xl shadow-blue-600/40 flex flex-col items-center justify-center text-white border-4 border-blue-400/20 active:scale-95 transition-all group">
                    <Play size={44} className="fill-white translate-x-1 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-base font-black tracking-wider uppercase">Start Workout</span>
                    <span className="text-[11px] text-blue-200 mt-0.5">New or from Library</span>
                  </button>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 grid grid-cols-2 gap-3 text-center">
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                    <span className="text-lg font-black text-white">{history.length} Sessions</span>
                  </div>
                  <div className="p-2 border-l border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Routines</span>
                    <span className="text-lg font-black text-white">{customRoutines.length + STANDARD_ROUTINES.length} Total</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'library' && <LibraryTab customRoutines={customRoutines} onSaveRoutine={saveRoutineDB} onDeleteRoutine={deleteRoutineDB} onStartRoutine={handleStartRoutine} exerciseDB={exerciseDB} scheduledRoutines={scheduledRoutines} onUpdateSchedule={updateScheduleDB} />}
          </div>
        )}

        {!activeSession && (
          <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-6 z-40">
            <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center space-y-1 ${activeTab === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}><Flame size={20} /><span className="text-[11px]">Home</span></button>
            <button onClick={() => setActiveTab('library')} className={`flex flex-col items-center space-y-1 ${activeTab === 'library' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}><Layers size={20} /><span className="text-[11px]">Library</span></button>
          </div>
        )}

        <StartWorkoutModal isOpen={isStartModalOpen} onClose={() => setIsStartModalOpen(false)} onStartEmpty={handleStartEmpty} onOpenLibrarySelection={() => setIsLibraryPickerOpen(true)} />
        <LibraryWorkoutPickerModal isOpen={isLibraryPickerOpen} onClose={() => setIsLibraryPickerOpen(false)} customRoutines={customRoutines} onSelectRoutine={handleStartRoutine} />
        <HistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} history={history} onDeleteSession={deleteHistoryDB} />
        <DayDetailsModal dayData={selectedDayData} onClose={() => setSelectedDayData(null)} onOpenWorkout={() => setIsHistoryModalOpen(true)} />
        <SaveRoutinePromptModal isOpen={!!saveRoutinePrompt} onSave={handleSaveRoutineAndFinish} onSkip={() => finalizeSaveWorkout(saveRoutinePrompt)} />
      </div>
    </div>
  );
}