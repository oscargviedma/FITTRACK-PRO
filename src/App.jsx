import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Play, Pause, Plus, Trash2, Edit2, Check, X, Calendar, Clock, 
  ChevronLeft, ChevronRight, Dumbbell, History as HistoryIcon, 
  Layers, Search, Flame, Sparkles, ArrowRight, CalendarCheck, 
  CalendarDays, Activity, Target, Trophy, ArrowRightLeft, TrendingUp,
  Menu, Download, Info, DatabaseZap, User, Save
} from 'lucide-react';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Bodyweight'];

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
      { name: 'Pull-up', muscle: 'back', equipment: 'bodyweight', targetSets: 4, image: 'Pull_Up/0.jpg' },
      { name: 'Barbell Bent Over Row', muscle: 'back', equipment: 'barbell', targetSets: 3, image: 'Barbell_Bent_Over_Row/0.jpg' },
      { name: 'Lat Pulldown', muscle: 'back', equipment: 'cable', targetSets: 3, image: 'Lat_Pulldown/0.jpg' },
      { name: 'Face Pull', muscle: 'shoulders', equipment: 'cable', targetSets: 3, image: 'Face_Pull/0.jpg' },
      { name: 'Incline Dumbbell Curl', muscle: 'biceps', equipment: 'dumbbell', targetSets: 3, image: 'Incline_Dumbbell_Curl/0.jpg' },
      { name: 'Hammer Curls', muscle: 'biceps', equipment: 'dumbbell', targetSets: 3, image: 'Hammer_Curl/0.jpg' }
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
    id: 'std-bodyweight',
    name: 'Bodyweight Mastery',
    desc: 'No equipment needed. Pure functional strength.',
    exercises: [
      { name: 'Pull-up', muscle: 'back', equipment: 'bodyweight', targetSets: 4, image: 'Pull_Up/0.jpg' },
      { name: 'Push-up', muscle: 'chest', equipment: 'bodyweight', targetSets: 4, image: 'Push_Up/0.jpg' },
      { name: 'Dips', muscle: 'triceps', equipment: 'bodyweight', targetSets: 3, image: 'Dips/0.jpg' },
      { name: 'Bodyweight Squat', muscle: 'legs', equipment: 'bodyweight', targetSets: 4, image: 'Bodyweight_Squat/0.jpg' },
      { name: 'Lunges', muscle: 'legs', equipment: 'bodyweight', targetSets: 3, image: 'Lunges/0.jpg' },
      { name: 'Plank', muscle: 'core', equipment: 'bodyweight', targetSets: 3, image: 'Plank/0.jpg' }
    ]
  },
  {
    id: 'std-arms',
    name: 'Arms Blast',
    desc: 'Dedicated Biceps and Triceps isolation.',
    exercises: [
      { name: 'Barbell Curl', muscle: 'biceps', equipment: 'barbell', targetSets: 4, image: 'Barbell_Curl/0.jpg' },
      { name: 'Triceps Pushdown', muscle: 'triceps', equipment: 'cable', targetSets: 4, image: 'Triceps_Pushdown/0.jpg' },
      { name: 'Hammer Curls', muscle: 'biceps', equipment: 'dumbbell', targetSets: 3, image: 'Hammer_Curl/0.jpg' },
      { name: 'Overhead Triceps Extension', muscle: 'triceps', equipment: 'dumbbell', targetSets: 3, image: 'Overhead_Triceps_Extension/0.jpg' },
      { name: 'Preacher Curl', muscle: 'biceps', equipment: 'machine', targetSets: 3, image: 'Preacher_Curl/0.jpg' }
    ]
  },
  {
    id: 'std-back',
    name: 'Back Focus',
    desc: 'Lats and Rhomboids isolation for width.',
    exercises: [
      { name: 'Deadlift', muscle: 'back', equipment: 'barbell', targetSets: 4, image: 'Deadlift/0.jpg' },
      { name: 'Pull-up', muscle: 'back', equipment: 'bodyweight', targetSets: 4, image: 'Pull_Up/0.jpg' },
      { name: 'Seated Cable Row', muscle: 'back', equipment: 'cable', targetSets: 3, image: 'Seated_Cable_Row/0.jpg' },
      { name: 'Dumbbell Row', muscle: 'back', equipment: 'dumbbell', targetSets: 3, image: 'Dumbbell_Row/0.jpg' },
      { name: 'Lat Pulldown', muscle: 'back', equipment: 'cable', targetSets: 3, image: 'Lat_Pulldown/0.jpg' }
    ]
  }
];

const FALLBACK_DB = [
  { id: 'f1', name: 'Barbell Bench Press', muscle: 'chest', equipment: 'barbell', image: 'Barbell_Bench_Press/0.jpg' },
  { id: 'f2', name: 'Incline Dumbbell Press', muscle: 'chest', equipment: 'dumbbell', image: 'Incline_Dumbbell_Press/0.jpg' },
  { id: 'f3', name: 'Cable Chest Fly', muscle: 'chest', equipment: 'cable', image: 'Cable_Chest_Fly/0.jpg' },
  { id: 'f4', name: 'Pull-up', muscle: 'back', equipment: 'bodyweight', image: 'Pull_Up/0.jpg' },
  { id: 'f5', name: 'Barbell Bent Over Row', muscle: 'back', equipment: 'barbell', image: 'Barbell_Bent_Over_Row/0.jpg' },
  { id: 'f6', name: 'Lat Pulldown', muscle: 'back', equipment: 'cable', image: 'Lat_Pulldown/0.jpg' },
  { id: 'f7', name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell', image: 'Overhead_Press/0.jpg' },
  { id: 'f8', name: 'Dumbbell Lateral Raise', muscle: 'shoulders', equipment: 'dumbbell', image: 'Dumbbell_Lateral_Raise/0.jpg' },
  { id: 'f9', name: 'Face Pull', muscle: 'shoulders', equipment: 'cable', image: 'Face_Pull/0.jpg' },
  { id: 'f10', name: 'Barbell Squat', muscle: 'legs', equipment: 'barbell', image: 'Barbell_Squat/0.jpg' },
  { id: 'f11', name: 'Romanian Deadlift', muscle: 'legs', equipment: 'barbell', image: 'Romanian_Deadlift/0.jpg' },
  { id: 'f12', name: 'Leg Press', muscle: 'legs', equipment: 'machine', image: 'Leg_Press/0.jpg' },
  { id: 'f13', name: 'Lying Leg Curl', muscle: 'legs', equipment: 'machine', image: 'Lying_Leg_Curl/0.jpg' },
  { id: 'f14', name: 'Standing Calf Raises', muscle: 'legs', equipment: 'machine', image: 'Standing_Calf_Raises/0.jpg' },
  { id: 'f15', name: 'Incline Dumbbell Curl', muscle: 'biceps', equipment: 'dumbbell', image: 'Incline_Dumbbell_Curl/0.jpg' },
  { id: 'f16', name: 'Triceps Pushdown', muscle: 'triceps', equipment: 'cable', image: 'Triceps_Pushdown/0.jpg' },
  { id: 'f17', name: 'Hanging Leg Raise', muscle: 'core', equipment: 'bodyweight', image: 'Hanging_Leg_Raise/0.jpg' },
  { id: 'f18', name: 'Plank', muscle: 'core', equipment: 'bodyweight', image: 'Plank/0.jpg' },
  { id: 'f19', name: 'Triceps Overhead Extension', muscle: 'triceps', equipment: 'cable', image: 'Triceps_Overhead_Extension/0.jpg' },
  { id: 'f20', name: 'Seated Leg Curl', muscle: 'legs', equipment: 'machine', image: 'Seated_Leg_Curl/0.jpg' },
  { id: 'f21', name: 'Seated Calf Raise', muscle: 'legs', equipment: 'machine', image: 'Seated_Calf_Raise/0.jpg' },
  { id: 'f22', name: 'Front Barbell Squat', muscle: 'legs', equipment: 'barbell', image: 'Front_Barbell_Squat/0.jpg' },
  { id: 'f23', name: 'Push-up', muscle: 'chest', equipment: 'bodyweight', image: 'Push_Up/0.jpg' }
];

const isExerciseBodyweight = (ex) => {
  if (!ex) return false;
  if (ex.equipment && ex.equipment.toLowerCase().includes('body')) return true;
  const n = ex.name.toLowerCase();
  const bwKeywords = ['pull-up', 'pull up', 'push-up', 'push up', 'drop push', 'dip', 'plank', 'chin-up', 'bodyweight', 'calf raise', 'sit-up', 'crunch', 'lunges'];
  return bwKeywords.some(kw => n.includes(kw));
};

const playRestChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch(e) {}
};

const formatSeconds = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getLocalYYYYMMDD = (dateInput) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

const getMuscleColor = (muscle) => {
  switch (muscle?.toLowerCase()) {
    case 'chest': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    case 'back': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    case 'legs': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'shoulders': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'biceps': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    case 'triceps': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    case 'core': return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20';
    default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
  }
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${imagePath}`;
};

const calculate1RM = (weight, reps) => {
  if (weight === undefined || reps === undefined || weight === 0) return 0;
  return weight * (1 + reps / 30);
};

const getSetVolume = (weight, reps, exercise, userProfile) => {
  const w = isExerciseBodyweight(exercise) ? (Number(weight) + Number(userProfile?.weight || 75)) : Number(weight);
  return w * Number(reps);
};

const getGlobalPreviousStats = (exerciseName, historyList) => {
  if (!exerciseName || !historyList) return null;
  for (const session of historyList) {
    const foundEx = session.exercises?.find(e => e.name === exerciseName);
    if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
      const workingSets = foundEx.sets.filter(s => !s.isWarmup && !s.is1RM);
      if (workingSets.length > 0) return workingSets;
      return foundEx.sets;
    }
  }
  return null;
};

const ExerciseImage = ({ srcPath, alt, className, fallbackSize = 24, muscle }) => {
  const [hasError, setHasError] = useState(false);
  const imgUrl = getImageUrl(srcPath);

  if (!imgUrl || hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#121214] border border-zinc-800`}>
        <Dumbbell size={fallbackSize} className={getMuscleColor(muscle).split(' ')[0] || 'text-zinc-600'} />
      </div>
    );
  }
  return <img src={imgUrl} alt={alt} className={className} onError={() => setHasError(true)} loading="lazy" />;
};

const TutorialOverlay = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Welcome to FitTrack.PRO", desc: "Let's take a quick 5-step tour so you can maximize your gains. (Swipe left and right anywhere to navigate tabs!)", icon: <Flame size={40} className="text-indigo-500" /> },
    { title: "The Planner & Goals", desc: "Use the Planner on the Home Screen to schedule your workout days. Set a Weekly Goal to keep yourself accountable and watch the progress bar fill up as you train.", icon: <Target size={40} className="text-emerald-500" /> },
    { title: "Smart Active Workouts", desc: "Inside a workout: Tap the 'Swap' icon if a machine is taken. Toggle '1RM' to mark your heavy records, and use the background-safe circular Rest Timer.", icon: <Activity size={40} className="text-amber-500" /> },
    { title: "Bodyweight Smarts", desc: "If you log a bodyweight exercise like Pull-ups, the app automatically factors in your body weight for total volume and accurate calorie calculations!", icon: <Dumbbell size={40} className="text-rose-500" /> },
    { title: "Progress Analytics", desc: "Your 1-Rep Max (1RM), Max Reps, and muscle workloads are automatically calculated. Check the Progress Tab to watch your trendlines grow over time!", icon: <TrendingUp size={40} className="text-sky-500" /> }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#09090b]/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-end p-4 pt-safe w-full max-w-md mx-auto relative">
        <button onClick={onClose} className="absolute right-6 top-6 px-5 py-2.5 bg-zinc-900 rounded-full text-xs font-bold text-zinc-300 uppercase tracking-wider hover:bg-zinc-800 active:scale-95 transition-all z-50">Skip</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-12 w-full max-w-sm mx-auto">
        <div className="w-24 h-24 rounded-full bg-[#121214] border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/10">
          {steps[step].icon}
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-3">{steps[step].title}</h2>
        <p className="text-sm font-medium text-zinc-400 mb-10 leading-relaxed">{steps[step].desc}</p>
        
        <div className="flex space-x-2 mb-10">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-500' : 'w-2 bg-zinc-800'}`} />
          ))}
        </div>

        <div className="flex space-x-3 w-full">
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold active:scale-95 transition-transform">Back</button>}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">Next</button>
          ) : (
            <button onClick={onClose} className="flex-[2] py-4 bg-white text-black rounded-2xl font-bold shadow-xl active:scale-95 transition-transform">Get Started</button>
          )}
        </div>
      </div>
    </div>
  );
};

const UserProfileModal = ({ isOpen, onSave }) => {
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [autoProgression, setAutoProgression] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
         <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4"><User size={32} /></div>
         <h3 className="text-xl font-bold text-white mb-2 text-center">Your Profile</h3>
         <p className="text-xs text-zinc-400 mb-6 text-center">We use this to calculate your calorie burn and track bodyweight exercises accurately.</p>
         
         <div className="space-y-4 mb-6">
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none" />
              </div>
            </div>
            <div className="pt-2">
              <label className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-white block">Auto-Progression</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">Smart progression suggestions</span>
                </div>
                <input type="checkbox" checked={autoProgression} onChange={(e) => setAutoProgression(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
              </label>
            </div>
         </div>
         
         <button onClick={() => onSave({ gender, age: Number(age), weight: Number(weight), height: Number(height), autoProgression })} className="w-full py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform">Save Profile</button>
      </div>
    </div>
  );
};

const WorkoutRecapModal = ({ data, userProfile, historyLength, onDone }) => {
  if (!data) return null;
  
  const volume = data.exercises.reduce((acc, ex) => acc + ex.sets.reduce((sAcc, s) => sAcc + getSetVolume(s.weight, s.reps, ex, userProfile), 0), 0);
  const durationMins = Math.max(1, Math.round(data.duration / 60));
  const userWeight = userProfile?.weight || 75;
  const calories = Math.round((4.5 * 3.5 * userWeight / 200) * durationMins);
  
  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
       <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-300">
         <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/10"><Trophy size={40} /></div>
         <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Workout Complete!</h2>
         <p className="text-sm font-medium text-zinc-400 mb-6">You crushed {data.routineName}</p>
         
         <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-center"><span className="block text-[10px] text-zinc-500 font-bold uppercase mb-1 tracking-wider">Volume</span><span className="text-xl font-black text-emerald-400">{volume.toLocaleString()} <span className="text-xs font-semibold">kg</span></span></div>
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-center"><span className="block text-[10px] text-zinc-500 font-bold uppercase mb-1 tracking-wider">Est. Calories</span><span className="text-xl font-black text-rose-400">{calories.toLocaleString()} <span className="text-xs font-semibold">kcal</span></span></div>
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-center"><span className="block text-[10px] text-zinc-500 font-bold uppercase mb-1 tracking-wider">Time</span><span className="text-xl font-black text-sky-400">{formatSeconds(data.duration)}</span></div>
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-center"><span className="block text-[10px] text-zinc-500 font-bold uppercase mb-1 tracking-wider">Routine Runs</span><span className="text-xl font-black text-indigo-400">#{historyLength + 1}</span></div>
         </div>
         
         <button onClick={onDone} className="w-full py-4 bg-white text-black font-bold text-sm rounded-xl active:scale-95 transition-transform shadow-xl">Save to History</button>
       </div>
    </div>
  );
};

const WipeDataConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-rose-900/50 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4 border border-rose-500/20"><Trash2 size={24} className="text-rose-500"/></div>
        <h3 className="text-xl font-bold text-white mb-2">Wipe All Data?</h3>
        <p className="text-sm text-zinc-400 mb-6">This will permanently delete all your routines, history, and goals. This action cannot be undone.</p>
        <div className="flex flex-col space-y-3">
          <button onClick={onConfirm} className="w-full py-3.5 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-900/20 active:scale-95 transition-transform">Yes, Wipe Everything</button>
          <button onClick={onCancel} className="w-full py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm active:scale-95 transition-transform">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const MessageModal = ({ isOpen, title, message, onClose, isSuccess = true }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className={`bg-[#121214] border ${isSuccess ? 'border-emerald-900/50' : 'border-indigo-900/50'} rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center`}>
         <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
            {isSuccess ? <Check size={24} className="text-emerald-500"/> : <Info size={24} className="text-indigo-400"/>}
         </div>
         <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
         <p className="text-sm text-zinc-400 mb-6">{message}</p>
         <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm shadow-lg active:scale-95 transition-transform">Got it</button>
      </div>
    </div>
  );
};

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
      const dateStr = getLocalYYYYMMDD(targetDate.toISOString());
      
      const loggedWorkouts = history.filter(h => {
        const itemDate = getLocalYYYYMMDD(h.date);
        return itemDate === dateStr;
      });

      const isToday = getLocalYYYYMMDD(new Date().toISOString()) === dateStr;

      return { name: dayName, date: targetDate, dateStr, dayNum: targetDate.getDate(), workouts: loggedWorkouts, hasWorkout: loggedWorkouts.length > 0, isToday };
    });
  }, [history]);

  return (
    <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">This Week</span>
        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">{weekDays.filter(d => d.hasWorkout).length} Days Active</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <button key={day.name} onClick={() => onSelectDay(day)} className="flex flex-col items-center group focus:outline-none">
            <span className="text-[10px] font-semibold text-zinc-500 mb-1.5">{day.name}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all active:scale-95 ${
                day.hasWorkout ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 
                day.isToday ? 'bg-zinc-800 text-white border border-zinc-600' : 'bg-transparent text-zinc-400 group-hover:bg-zinc-800'
              }`}>
              {day.dayNum}
            </div>
            <div className="h-1 mt-1">{day.hasWorkout && <div className="w-1 h-1 rounded-full bg-indigo-400 mx-auto"></div>}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const DayDetailsModal = ({ dayData, onClose, onOpenWorkout }) => {
  if (!dayData) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col p-4 pt-12 animate-in slide-in-from-bottom-10 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {dayData.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </h2>
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mt-1">
            {dayData.workouts.length} session{dayData.workouts.length === 1 ? '' : 's'} logged
          </p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors">
          <X size={20} />
        </button>
      </div>

      {dayData.workouts.length === 0 ? (
        <div className="py-12 text-center bg-[#121214] rounded-3xl border border-dashed border-zinc-800">
          <p className="text-zinc-500 text-sm font-bold">No sessions logged for this date.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {dayData.workouts.map((w, idx) => (
            <div key={w.id || idx} onClick={() => { onOpenWorkout(w); onClose(); }} className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl cursor-pointer hover:border-zinc-700 transition-all active:scale-95 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white tracking-tight">{w.routineName || 'Custom Workout'}</h4>
                <div className="flex items-center space-x-3 mt-1.5 text-xs text-zinc-400 font-medium">
                  <span className="flex items-center"><Clock size={12} className="mr-1 text-indigo-400" />{formatSeconds(w.duration)}</span>
                  <span className="flex items-center"><Dumbbell size={12} className="mr-1 text-emerald-400" />{w.exercises?.length || 0} exercises</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WeeklyPlannerModal = ({ isOpen, onClose, scheduledRoutines, customRoutines, onUpdateSchedule, initialWeeklyGoal }) => {
  const [tempSchedule, setTempSchedule] = useState(scheduledRoutines);
  const [pickerDay, setPickerDay] = useState(null); 
  
  useEffect(() => { if (isOpen) setTempSchedule(scheduledRoutines); }, [isOpen, scheduledRoutines]);

  if (!isOpen) return null;

  const handleClose = () => {
    const newCount = Object.keys(tempSchedule).filter(k => !tempSchedule[k].isRest).length;
    onUpdateSchedule(tempSchedule, newCount !== initialWeeklyGoal ? newCount : null);
    onClose();
  };

  if (pickerDay !== null) {
    const allRoutines = [...customRoutines, ...STANDARD_ROUTINES];
    return (
      <div className="fixed inset-0 z-[100] bg-[#09090b]/95 backdrop-blur-sm flex flex-col p-4 pt-12 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center mb-6 pt-safe">
          <div><h2 className="text-2xl font-bold text-white tracking-tight">Select Routine</h2><p className="text-xs font-medium text-indigo-400 mt-1 uppercase tracking-wider">For {DAYS_OF_WEEK[pickerDay]}</p></div>
          <button onClick={() => setPickerDay(null)} className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-colors"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pb-20">
          <button onClick={() => { const s = {...tempSchedule}; delete s[pickerDay]; setTempSchedule(s); setPickerDay(null); }} className="w-full p-4 rounded-2xl bg-zinc-900 border border-rose-900/50 text-rose-500 hover:bg-rose-500/10 text-sm font-bold active:scale-95 transition-all text-left flex justify-between items-center">
            <span>Clear Day (Empty Day)</span>
            <Trash2 size={16} />
          </button>
          <button onClick={() => { setTempSchedule({...tempSchedule, [pickerDay]: { id: 'rest-day', name: 'Rest Day', isRest: true }}); setPickerDay(null); }} className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-sm font-bold active:scale-95 transition-all text-left flex justify-between items-center mb-6">
            <span>Set as Rest Day</span>
            <Check size={16} />
          </button>

          {allRoutines.map(r => (
            <button key={r.id} onClick={() => { setTempSchedule({...tempSchedule, [pickerDay]: { id: r.id, name: r.name, isCustom: !r.id.startsWith('std-') }}); setPickerDay(null); }} className="w-full bg-[#121214] hover:bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-left active:scale-95 transition-all">
              <h4 className="text-base font-bold text-white tracking-tight">{r.name}</h4><p className="text-xs text-zinc-500 mt-1">{r.exercises.length} exercises</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#121214] border border-zinc-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div><h2 className="text-xl font-bold text-white tracking-tight">Weekly Planner</h2><p className="text-xs font-medium text-zinc-500 mt-1">Tap a day to assign a routine</p></div>
          <button onClick={handleClose} className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl shadow-md active:scale-95">Done</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
          {DAYS_OF_WEEK.map((day, idx) => {
            const assigned = tempSchedule[idx];
            return (
              <button key={idx} onClick={() => setPickerDay(idx)} className={`w-full p-4 rounded-2xl border transition-all active:scale-95 flex items-center justify-between ${assigned && !assigned.isRest ? 'bg-indigo-600/10 border-indigo-500/30' : assigned?.isRest ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#09090b] border-zinc-800'}`}>
                <div className="text-left"><span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">{day}</span><span className={`text-base font-bold tracking-tight ${assigned && !assigned.isRest ? 'text-indigo-400' : assigned?.isRest ? 'text-emerald-400' : 'text-zinc-500'}`}>{assigned ? assigned.name : 'Empty Day'}</span></div>
                <ChevronRight size={18} className={assigned ? 'text-zinc-400' : 'text-zinc-600'} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SyncGoalModal = ({ goalPendingSync, onConfirm, onSkip }) => {
  if (goalPendingSync === null) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Sync Weekly Goal?</h3>
        <p className="text-sm font-medium text-zinc-400 mb-6">You scheduled {goalPendingSync} active workout day(s). Want to set your weekly goal to {goalPendingSync} days automatically?</p>
        <div className="flex flex-col space-y-3">
          <button onClick={() => onConfirm(goalPendingSync)} className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform">Yes, Sync Goal</button>
          <button onClick={onSkip} className="w-full py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm active:scale-95 transition-transform">No, Keep Custom Goal</button>
        </div>
      </div>
    </div>
  );
};

const GoalSettingModal = ({ isOpen, currentGoal, onClose, onSave }) => {
  const [val, setVal] = useState(currentGoal || 4);
  useEffect(() => { if(isOpen) setVal(currentGoal || 4); }, [isOpen, currentGoal]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Weekly Goal</h3>
        <p className="text-sm text-zinc-400 mb-6">How many days do you want to workout this week? (Set 0 to remove goal)</p>
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button onClick={() => setVal(v => Math.max(0, v - 1))} className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white active:scale-95 font-bold text-xl">-</button>
          <span className="text-4xl font-black text-white w-8">{val}</span>
          <button onClick={() => setVal(v => Math.min(7, v + 1))} className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white active:scale-95 font-bold text-xl">+</button>
        </div>
        <div className="flex space-x-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm active:scale-95">Cancel</button>
          <button onClick={() => { onSave(val); onClose(); }} className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-sm active:scale-95">Save</button>
        </div>
      </div>
    </div>
  );
};

const StatsView = ({ history, userProfile }) => {
  const [statsMode, setStatsMode] = useState('1rm'); // '1rm' or 'muscle_strength'
  const [selectedExercise, setSelectedExercise] = useState('Barbell Bench Press');
  const [selectedMuscleChart, setSelectedMuscleChart] = useState('Chest');
  const [timeFilter, setTimeFilter] = useState('all_time'); // 'all_time' or 'last_30_days'
  
  const filteredHistory = useMemo(() => {
    if (timeFilter === 'all_time') return history;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return history.filter(h => new Date(h.date) >= thirtyDaysAgo);
  }, [history, timeFilter]);

  const allLoggedExercises = useMemo(() => {
    const exSet = new Set();
    history.forEach(session => session.exercises?.forEach(ex => {
      if (ex.sets && ex.sets.some(s => !s.isWarmup && s.weight !== undefined)) exSet.add(ex.name);
    }));
    return Array.from(exSet).sort();
  }, [history]);

  const chartData = useMemo(() => {
    const data = [];
    const sortedHistory = [...filteredHistory].reverse(); 

    if (statsMode === '1rm') {
      sortedHistory.forEach(session => {
        const targetEx = session.exercises?.find(e => e.name === selectedExercise);
        if (targetEx && targetEx.sets) {
          const workingSets = targetEx.sets.filter(s => !s.isWarmup && s.weight !== undefined);
          if (workingSets.length > 0) {
            const isBw = isExerciseBodyweight(targetEx);
            let bestValue = 0;
            workingSets.forEach(s => {
              if (isBw) {
                if (s.reps > bestValue) bestValue = s.reps;
              } else {
                const w = Number(s.weight);
                const current1RM = calculate1RM(w, s.reps);
                if (current1RM > bestValue) bestValue = current1RM;
              }
            });
            data.push({ date: getLocalYYYYMMDD(session.date).split('-').slice(1).join('/'), value: isBw ? bestValue : Math.round(bestValue), isBw });
          }
        }
      });
    } else {
      sortedHistory.forEach(session => {
        let totalStrength = 0;
        let exCount = 0;
        session.exercises?.forEach(ex => {
          if (normalizeMuscle(ex.muscle || ex.primaryMuscles?.[0]) === selectedMuscleChart.toLowerCase()) {
            let best1RM = 0;
            ex.sets?.forEach(s => {
              if (!s.isWarmup && s.weight !== undefined) {
                const w = isExerciseBodyweight(ex) ? (Number(s.weight) + Number(userProfile?.weight || 75)) : Number(s.weight);
                const current1RM = calculate1RM(w, s.reps);
                if (current1RM > best1RM) best1RM = current1RM;
              }
            });
            if (best1RM > 0) {
              totalStrength += best1RM;
              exCount += 1;
            }
          }
        });
        if (exCount > 0) {
          data.push({ date: getLocalYYYYMMDD(session.date).split('-').slice(1).join('/'), value: Math.round(totalStrength / exCount) });
        }
      });
    }
    return data;
  }, [filteredHistory, selectedExercise, statsMode, selectedMuscleChart, userProfile]);

  const totalWorkouts = filteredHistory.length;
  const totalVolume = filteredHistory.reduce((acc, curr) => {
    let sessionVol = 0;
    curr.exercises?.forEach(ex => ex.sets?.forEach(s => {
      if(s.weight !== undefined) sessionVol += getSetVolume(s.weight, s.reps, ex, userProfile);
    }));
    return acc + sessionVol;
  }, 0);

  // Analytics Math
  let totalSetsForRPE = 0;
  let sumRPE = 0;
  let totalDurationSecs = 0;

  filteredHistory.forEach(session => {
      totalDurationSecs += (session.duration || 0);
      session.exercises?.forEach(ex => {
          ex.sets?.forEach(s => {
              if (s.difficulty) { sumRPE += Number(s.difficulty); totalSetsForRPE += 1; }
          });
      });
  });

  const averageRPE = totalSetsForRPE > 0 ? (sumRPE / totalSetsForRPE).toFixed(1) : 0;
  const avgDurationMins = totalWorkouts > 0 ? (totalDurationSecs / totalWorkouts) / 60 : 0;
  const avgCalories = avgDurationMins > 0 ? Math.round((4.5 * 3.5 * (userProfile?.weight || 75) / 200) * avgDurationMins) : 0;

  const isBwChart = statsMode === '1rm' && chartData.length > 0 && chartData[0].isBw;
  const unitText = isBwChart ? 'reps' : 'kg';
  const metricText = statsMode === '1rm' ? (isBwChart ? 'Current Max Reps' : 'Current Est. 1RM') : 'Muscle Strength Score';

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-20">
      
      <div className="flex space-x-2 bg-[#121214] p-1.5 rounded-xl border border-zinc-800/80 shadow-sm">
        <button onClick={() => setTimeFilter('all_time')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${timeFilter === 'all_time' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>All-Time</button>
        <button onClick={() => setTimeFilter('last_30_days')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${timeFilter === 'last_30_days' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Last 30 Days</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800/80 shadow-sm flex flex-col justify-center text-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Total Volume Lifted</span>
          <span className="text-xl font-black text-indigo-400">{totalVolume.toLocaleString()} <span className="text-xs text-zinc-500">kg</span></span>
        </div>
        <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800/80 shadow-sm flex flex-col justify-center text-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Sessions Logged</span>
          <span className="text-xl font-black text-emerald-400">{totalWorkouts} <span className="text-xs text-zinc-500">workouts</span></span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800/80 shadow-sm flex flex-col justify-center items-center text-center">
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Avg Energy Burned</span>
           <span className="text-lg font-black text-rose-400">{avgCalories.toLocaleString()} <span className="text-[10px] text-zinc-500">kcal</span></span>
        </div>
        <div className="bg-[#121214] p-4 rounded-2xl border border-zinc-800/80 shadow-sm flex flex-col justify-center items-center text-center">
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Avg Effort (RPE)</span>
           <span className="text-lg font-black text-amber-400">{averageRPE} <span className="text-[10px] text-zinc-500">/ 10</span></span>
        </div>
      </div>

      <div className="flex space-x-2 bg-[#121214] p-1.5 rounded-xl border border-zinc-800/80 shadow-sm mt-4">
        <button onClick={() => setStatsMode('1rm')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${statsMode === '1rm' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>1RM / Max Reps</button>
        <button onClick={() => setStatsMode('muscle_strength')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${statsMode === 'muscle_strength' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Muscle Strength</button>
      </div>

      <div className="bg-[#121214] border border-zinc-800/80 p-4 rounded-2xl shadow-sm">
        {statsMode === '1rm' ? (
          <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 appearance-none">
            {allLoggedExercises.length > 0 ? allLoggedExercises.map(ex => <option key={ex} value={ex}>{ex}</option>) : <option>No Data Available</option>}
          </select>
        ) : (
          <select value={selectedMuscleChart} onChange={(e) => setSelectedMuscleChart(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500 appearance-none">
            {MUSCLE_GROUPS.filter(m => m !== 'All' && m !== 'Bodyweight').map(m => <option key={m} value={m}>{m} Strength Trend</option>)}
          </select>
        )}
      </div>

      {(statsMode === '1rm' && allLoggedExercises.length === 0) || chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 bg-[#121214] rounded-2xl border border-dashed border-zinc-800">
          <TrendingUp size={32} className="text-zinc-600 mb-4" />
          <h3 className="text-sm font-bold text-white mb-2">No Data Yet</h3>
          <p className="text-xs text-zinc-500">Log some working sets to generate progress charts.</p>
        </div>
      ) : (
        <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                {metricText}
              </span>
              <span className="text-3xl font-black text-white">{chartData.length > 0 ? chartData[chartData.length - 1].value.toLocaleString() : 0} <span className="text-sm text-zinc-500 font-semibold">{unitText}</span></span>
            </div>
            {chartData.length > 1 && (
              <div className={`flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded-md ${chartData[chartData.length - 1].value >= chartData[0].value ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                <span>{chartData[chartData.length - 1].value >= chartData[0].value ? '+' : ''}{(chartData[chartData.length - 1].value - chartData[0].value).toLocaleString()} {unitText}</span>
              </div>
            )}
          </div>

          {chartData.length < 2 ? (
            <div className="h-48 flex items-center justify-center border border-dashed border-zinc-800 rounded-xl">
              <span className="text-xs text-zinc-500 font-medium">Log this again to generate a trendline.</span>
            </div>
          ) : (
            <div className="relative h-56 w-full mt-4">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {(() => {
                  const maxVal = Math.max(...chartData.map(d => d.value));
                  const minVal = Math.max(0, Math.min(...chartData.map(d => d.value)) * 0.8);
                  const range = maxVal - minVal || 1;
                  
                  // Map X from 12 to 100 to leave room for Y labels
                  const mapX = (i, len) => 12 + (i / (len - 1)) * 88;
                  const mapY = (val) => 85 - ((val - minVal) / range) * 75;

                  const points = chartData.map((d, i) => `${mapX(i, chartData.length)},${mapY(d.value)}`).join(' ');

                  const midVal = Math.round((maxVal + minVal) / 2);
                  const displayMax = Math.round(maxVal);
                  const displayMin = Math.round(minVal);

                  return (
                    <>
                      {/* Grid Lines */}
                      <line x1="12" y1="10" x2="100" y2="10" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="12" y1="47.5" x2="100" y2="47.5" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="12" y1="85" x2="100" y2="85" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2 2" />
                      
                      {/* Y-Axis Labels */}
                      <text x="0" y="12" fill="#71717a" fontSize="7" fontWeight="bold">{displayMax}</text>
                      <text x="0" y="49.5" fill="#71717a" fontSize="7" fontWeight="bold">{midVal}</text>
                      <text x="0" y="87" fill="#71717a" fontSize="7" fontWeight="bold">{displayMin}</text>

                      {/* Line & Gradient */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polygon points={`12,85 ${points} 100,85`} fill="url(#chartGradient)" />
                      <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      
                      {/* Data Points */}
                      {chartData.map((d, i) => (
                        <circle key={i} cx={mapX(i, chartData.length)} cy={mapY(d.value)} r="1.5" fill="#09090b" stroke="#6366f1" strokeWidth="1" />
                      ))}
                    </>
                  );
                })()}
              </svg>
              <div className="flex justify-between w-full mt-2 pl-3 text-[10px] font-bold text-zinc-500">
                <span>{chartData[0].date}</span>
                {chartData.length > 2 && <span>{chartData[Math.floor(chartData.length / 2)].date}</span>}
                <span>{chartData[chartData.length - 1].date}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const HistoryCalendarView = ({ history, onDeleteSession, userProfile, weeklyGoal, scheduledRoutines, onSaveAsRoutine }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const targetDate = new Date(year, month, i);
      const dateStr = getLocalYYYYMMDD(targetDate);
      const workouts = history.filter(h => getLocalYYYYMMDD(new Date(h.date)) === dateStr);
      days.push({ day: i, dateStr, workouts, hasWorkout: workouts.length > 0 });
    }
    return days;
  }, [currentDate, history]);

  // Comprehensive Streak Calculator (evaluates History + Scheduled Rest Days)
  const { longestStreak } = useMemo(() => {
    const datesWithWorkouts = new Set(history.map(h => getLocalYYYYMMDD(new Date(h.date))));
    const restDaysOfWeek = Object.keys(scheduledRoutines).filter(k => scheduledRoutines[k].isRest).map(Number);
    
    const isStreakDay = (d) => {
       const dateStr = getLocalYYYYMMDD(d);
       if (datesWithWorkouts.has(dateStr)) return true;
       const myDayOfWeek = (d.getDay() + 6) % 7;
       if (restDaysOfWeek.includes(myDayOfWeek)) return true;
       return false;
    };

    let longest = 0;
    if (history.length > 0) {
        let tempLongest = 0;
        let tempCurrent = 0;
        const sortedDates = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
        const startDate = new Date(sortedDates[0].date);
        startDate.setHours(0,0,0,0);
        const endDate = new Date();
        endDate.setHours(0,0,0,0);
        
        let iterDate = new Date(startDate);
        while(iterDate <= endDate) {
            if (isStreakDay(iterDate)) {
                tempCurrent++;
                if (tempCurrent > tempLongest) tempLongest = tempCurrent;
            } else {
                tempCurrent = 0;
            }
            iterDate.setDate(iterDate.getDate() + 1);
        }
        longest = tempLongest;
    }
    return { longestStreak: longest };
  }, [history, scheduledRoutines]);

  const weeksMet = useMemo(() => {
    if (!weeklyGoal) return 0;
    const weeks = {};
    history.forEach(h => {
      const d = new Date(h.date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
      const monday = new Date(d.setDate(diff));
      const weekKey = getLocalYYYYMMDD(monday);
      if(!weeks[weekKey]) weeks[weekKey] = new Set();
      weeks[weekKey].add(getLocalYYYYMMDD(new Date(h.date)));
    });
    return Object.values(weeks).filter(daysSet => daysSet.size >= weeklyGoal).length;
  }, [history, weeklyGoal]);

  if (selectedWorkout) {
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300 pb-20">
        <button onClick={() => setSelectedWorkout(null)} className="flex items-center text-xs font-bold text-indigo-400 mb-4 bg-indigo-500/10 px-3 py-1.5 rounded-lg w-fit"><ChevronLeft size={16} className="mr-1" /> Back to Calendar</button>
        <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl mb-4 shadow-sm flex-shrink-0 relative">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button onClick={() => onSaveAsRoutine(selectedWorkout)} className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/20 transition-colors" title="Save to Library"><Layers size={14}/></button>
            <button onClick={() => { onDeleteSession(selectedWorkout.id); setSelectedWorkout(null); }} className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500/20 transition-colors" title="Delete"><Trash2 size={14}/></button>
          </div>
          <h4 className="text-lg font-bold text-white tracking-tight pr-20">{selectedWorkout.routineName}</h4>
          <p className="text-xs font-medium text-zinc-500 mt-1">{new Date(selectedWorkout.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-zinc-800/80 text-center">
            <div><span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Duration</span><span className="text-sm font-mono font-bold text-indigo-400">{formatSeconds(selectedWorkout.duration)}</span></div>
            <div><span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Rest Time</span><span className="text-sm font-mono font-bold text-amber-400">{formatSeconds(selectedWorkout.totalRestDuration || 0)}</span></div>
            <div><span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Volume</span><span className="text-sm font-mono font-bold text-emerald-400">{selectedWorkout.exercises.reduce((total, ex) => total + (ex.sets?.reduce((sTot, s) => sTot + getSetVolume(s.weight, s.reps, ex, userProfile), 0) || 0), 0).toLocaleString()} kg</span></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {selectedWorkout.exercises.map((ex, idx) => (
            <div key={idx} className="bg-[#121214] border border-zinc-800/80 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                 <ExerciseImage srcPath={ex.image} alt={ex.name} muscle={ex.muscle} className="w-12 h-12 rounded-xl bg-black object-cover border border-zinc-800" fallbackSize={18} />
                 <div><h5 className="text-sm font-bold text-white tracking-tight">{ex.name}</h5><span className="text-[11px] font-bold text-zinc-500 uppercase mt-0.5 block">{ex.sets?.length || 0} sets</span></div>
              </div>
              <div className="space-y-1.5">
                {ex.sets?.map((s, sIdx) => (
                  <div key={sIdx} className="flex justify-between text-[11px] py-1.5 px-3 rounded-lg bg-zinc-900/80 font-mono font-medium">
                    <span className={`font-mono text-xs ${s.is1RM ? 'text-fuchsia-400 font-bold' : s.isWarmup ? 'text-amber-500 font-bold' : 'text-zinc-500'}`}>
                      {s.is1RM ? '👑' : s.isWarmup ? 'W' : `Set ${sIdx + 1}`}
                    </span>
                    <span className="text-white font-bold">{s.weight} kg × {s.reps} reps</span>
                    <span className="text-zinc-500">Diff: {s.difficulty}/10</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 pb-20">
      <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400"><ChevronLeft size={18}/></button>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400"><ChevronRight size={18}/></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {DAYS_OF_WEEK.map(d => <span key={d} className="text-[10px] font-bold text-zinc-500 uppercase">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((d, i) => (
            <div key={i} className="aspect-square flex items-center justify-center p-0.5">
              {d && (
                <button 
                  onClick={() => d.hasWorkout && setSelectedWorkout(d.workouts[0])}
                  disabled={!d.hasWorkout}
                  className={`w-full h-full rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    d.hasWorkout ? 'bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 
                    d.dateStr === getLocalYYYYMMDD(new Date()) ? 'bg-zinc-800 border border-zinc-600 text-white' : 'text-zinc-600 hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-xs font-bold">{d.day}</span>
                  {d.hasWorkout && <div className="w-1.5 h-1.5 rounded-full bg-white/50 absolute bottom-1.5"></div>}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {weeklyGoal > 0 && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex flex-col justify-center items-center shadow-sm text-center">
              <div className="flex items-center space-x-1.5 mb-1">
                <Trophy size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Weekly Goals Met</span>
              </div>
              <span className="text-lg font-black text-indigo-400">{weeksMet}</span>
            </div>
          )}
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex flex-col justify-center items-center shadow-sm text-center">
            <div className="flex items-center space-x-1.5 mb-1">
              <Flame size={14} className="text-orange-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Longest Streak</span>
            </div>
            <span className="text-lg font-black text-orange-400">{longestStreak} Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressMainTab = ({ history, userProfile, onDeleteSession, weeklyGoal, scheduledRoutines, onSaveAsRoutine }) => {
  const [view, setView] = useState('stats'); 
  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <div className="mb-5 pt-2">
        <h2 className="text-2xl font-black text-white tracking-tight">My Fitness Progress</h2>
      </div>
      <div className="flex bg-[#121214] p-1.5 rounded-xl border border-zinc-800/80 mb-4 shadow-sm flex-shrink-0">
        <button onClick={() => setView('stats')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${view === 'stats' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-500 hover:text-white'}`}>Progress & Stats</button>
        <button onClick={() => setView('history')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${view === 'history' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-500 hover:text-white'}`}>Workout History</button>
      </div>
      {view === 'stats' ? <StatsView history={history} userProfile={userProfile} /> : <HistoryCalendarView history={history} userProfile={userProfile} weeklyGoal={weeklyGoal} scheduledRoutines={scheduledRoutines} onDeleteSession={onDeleteSession} onSaveAsRoutine={onSaveAsRoutine} />}
    </div>
  );
};

const StartWorkoutModal = ({ isOpen, onClose, onStartEmpty, onOpenLibrarySelection }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Start Session</h3>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"><X size={18}/></button>
        </div>
        <div className="space-y-3">
          <button onClick={onStartEmpty} className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-5 rounded-2xl text-left transition-colors flex items-center justify-between active:scale-95">
            <div>
              <div className="text-sm font-bold text-white">New Empty Workout</div>
              <p className="text-xs text-zinc-500 mt-1">Start blank and log on the fly</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center"><Plus size={18}/></div>
          </button>
          <button onClick={onOpenLibrarySelection} className="w-full bg-white text-black p-5 rounded-2xl text-left transition-colors flex items-center justify-between shadow-lg active:scale-95">
            <div>
              <div className="text-sm font-bold">Choose from Library</div>
              <p className="text-xs text-zinc-600 mt-1">Templates and custom routines</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-black/10 text-black flex items-center justify-center"><Layers size={18}/></div>
          </button>
        </div>
      </div>
    </div>
  );
};

const LibraryWorkoutPickerModal = ({ isOpen, onClose, customRoutines, onSelectRoutine }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-[#09090b]/95 backdrop-blur-sm flex flex-col p-4 pt-12 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-6 pt-safe">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Select Workout</h2>
          <p className="text-xs text-zinc-500 mt-1">Choose a routine to start</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center active:scale-95"><X size={20}/></button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-6 pb-20">
        {customRoutines.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-3">My Routines</span>
            <div className="space-y-3">
              {customRoutines.map(r => (
                <button key={r.id} onClick={() => onSelectRoutine(r)} className="w-full bg-[#121214] border border-zinc-800 p-4 rounded-2xl text-left flex items-center justify-between active:scale-95 transition-transform">
                  <div>
                    <h4 className="text-base font-bold text-white">{r.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{r.exercises.length} exercises</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center"><Play size={16} className="ml-0.5"/></div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-3">Standard Templates</span>
          <div className="space-y-3">
            {STANDARD_ROUTINES.map(r => (
              <button key={r.id} onClick={() => onSelectRoutine(r)} className="w-full bg-[#121214] border border-zinc-800 p-4 rounded-2xl text-left flex flex-col active:scale-95 transition-transform">
                <div className="flex justify-between items-center w-full mb-1">
                  <h4 className="text-base font-bold text-white">{r.name}</h4>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><Play size={16} className="ml-0.5"/></div>
                </div>
                <p className="text-xs text-zinc-500 pr-12">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4 border border-rose-500/20"><Trash2 size={24} className="text-rose-500"/></div>
        <h3 className="text-xl font-bold text-white mb-2">Delete Routine?</h3>
        <p className="text-sm font-medium text-zinc-400 mb-6">This action cannot be undone. Your logged history will remain safe.</p>
        <div className="flex space-x-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm active:scale-95">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-900/20 active:scale-95">Delete</button>
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
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-1">Save to Library?</h3>
        <p className="text-xs text-zinc-400 mb-4">Would you like to save this completed session as a routine in your library for future workouts?</p>
        <div className="mb-5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Routine Name</label>
          <input type="text" placeholder="e.g., Heavy Push Day" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"/>
        </div>
        <div className="flex space-x-2">
          <button onClick={onSkip} className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors">No, Just Finish</button>
          <button onClick={() => onSave(name.trim() || 'Custom Routine')} className="flex-1 py-2.5 rounded-xl bg-white text-black text-xs font-bold transition-colors shadow-lg">Save & Finish</button>
        </div>
      </div>
    </div>
  );
};

const ExerciseSelectorModal = ({ isOpen, onClose, exerciseDB, onSelectExercise, initialMuscle = 'All' }) => {
  const [selectedMuscle, setSelectedMuscle] = useState(initialMuscle);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) setSelectedMuscle(initialMuscle);
  }, [isOpen, initialMuscle]);

  const filteredExercises = useMemo(() => {
    let list = exerciseDB;
    if (selectedMuscle === 'Bodyweight') {
      list = list.filter(item => isExerciseBodyweight(item));
    } else if (selectedMuscle !== 'All') {
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
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-5 max-w-md w-full h-[85vh] shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-white">Select Exercise</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="relative mb-3 flex-shrink-0">
          <Search size={15} className="absolute left-3 top-3 text-zinc-400" />
          <input type="text" placeholder="Search exercises..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500" />
        </div>

        <div className="flex space-x-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none flex-shrink-0">
          {MUSCLE_GROUPS.map((mg) => (
            <button key={mg} onClick={() => setSelectedMuscle(mg)} className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${selectedMuscle === mg ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'}`}>
              {mg}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-sm">No exercises match your criteria.</div>
          ) : (
            filteredExercises.map((exercise) => {
              const imgUrl = getImageUrl(exercise.image || (exercise.images && exercise.images[0]));
              return (
                <div key={exercise.id || exercise.name} onClick={() => { onSelectExercise(exercise); onClose(); }} className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800/80 p-2.5 rounded-2xl flex items-center space-x-3 cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 flex-shrink-0 overflow-hidden border border-zinc-800 flex items-center justify-center">
                    {imgUrl ? <img src={imgUrl} alt={exercise.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }}/> : <Dumbbell size={18} className="text-zinc-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{exercise.name}</h4>
                    <p className="text-xs text-zinc-400 capitalize">{exercise.muscle || (exercise.primaryMuscles && exercise.primaryMuscles[0]) || 'General'} • {exercise.equipment || 'Any'}</p>
                  </div>
                  <Plus size={16} className="text-indigo-400 flex-shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const ActiveWorkout = ({ session, history, userProfile, onFinishWorkout, onCancelWorkout, exerciseDB }) => {
  const [exercises, setExercises] = useState(session.exercises || []);
  const [currentExIndex, setCurrentExIndex] = useState(0);

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exerciseSeconds, setExerciseSeconds] = useState(0);
  
  // Background-safe rest timer logic
  const [isResting, setIsResting] = useState(false);
  const [restEndTime, setRestEndTime] = useState(null);
  const [restRemaining, setRestRemaining] = useState(0);
  const [restTarget, setRestTarget] = useState(90);
  const [totalRestDuration, setTotalRestDuration] = useState(0);

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [difficulty, setDifficulty] = useState('8');
  const [isWarmup, setIsWarmup] = useState(false);
  const [is1RM, setIs1RM] = useState(false); // New 1RM / Max Reps toggle
  
  const [isAddExModalOpen, setIsAddExModalOpen] = useState(false);
  const [isSwapExModalOpen, setIsSwapExModalOpen] = useState(false);
  const [swapMuscleGroup, setSwapMuscleGroup] = useState('All');
  const [isEarlyFinishModalOpen, setIsEarlyFinishModalOpen] = useState(false);
  const [hasModifications, setHasModifications] = useState(false);

  const currentExercise = exercises[currentExIndex];
  const isBodyweight = isExerciseBodyweight(currentExercise);
  
  const prevExerciseStats = useMemo(() => {
    if (!currentExercise) return null;
    return getGlobalPreviousStats(currentExercise.name, history);
  }, [currentExercise?.name, history]);

  const currentSetNum = (currentExercise?.sets?.length || 0) + 1;
  const prevSetData = prevExerciseStats?.[currentSetNum - 1];

  const toggleWarmup = () => { setIsWarmup(!isWarmup); if (!isWarmup) setIs1RM(false); };
  const toggle1RM = () => { setIs1RM(!is1RM); if (!is1RM) setIsWarmup(false); };

  useEffect(() => {
    if (!currentExercise) return;
    if (currentExercise.sets && currentExercise.sets.length > 0) {
      const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
      setWeight(lastSet.weight.toString());
      setReps(lastSet.reps.toString());
      setDifficulty(lastSet.difficulty.toString());
    } else if (prevSetData) {
      let prevW = parseFloat(prevSetData.weight) || 0;
      let prevR = parseInt(prevSetData.reps) || 0;
      
      // Smart Auto Progression incorporating Reps & Weight
      if (userProfile?.autoProgression && prevSetData.difficulty < 9) {
        if (prevR < 10) prevR += 1;
        else prevW += currentExercise?.equipment === 'machine' ? 5 : 2.5;
      }
      setWeight(prevW.toString());
      setReps(prevR.toString());
      setDifficulty(prevSetData.difficulty.toString());
    } else {
      setWeight(isBodyweight ? '0' : ''); // Auto-fill 0 for bodyweight
      setReps('');
      setDifficulty('8');
    }
    
    setIsWarmup(false);
    setIs1RM(false);
    setExerciseSeconds(0);
  }, [currentExIndex, exercises.length, currentExercise, prevSetData, userProfile, isBodyweight]);

  // Main Session Timer
  useEffect(() => {
    let interval = null;
    if (!isPaused) {
      interval = setInterval(() => {
        setTotalSeconds(s => s + 1);
        if (!isResting) setExerciseSeconds(es => es + 1);
        else setTotalRestDuration(tr => tr + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isResting]);

  // Background-Safe Rest Timer with Audio Chime
  useEffect(() => {
    let interval = null;
    if (isResting && restEndTime) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((restEndTime - Date.now()) / 1000));
        setRestRemaining(remaining);
        if (remaining === 0) {
          playRestChime();
          setIsResting(false);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isResting, restEndTime]);

  const handleLogSetAndRest = () => {
    const w = weight === '' ? 0 : parseFloat(weight);
    if (reps === '' || !currentExercise) return;
    
    const newSet = { weight: w, reps: parseInt(reps, 10), difficulty: parseInt(difficulty, 10), isWarmup, is1RM, timestamp: Date.now() };
    const updatedExercises = exercises.map((ex, idx) => idx === currentExIndex ? { ...ex, sets: [...(ex.sets || []), newSet] } : ex);
    setExercises(updatedExercises);
    
    setRestEndTime(Date.now() + restTarget * 1000);
    setRestRemaining(restTarget);
    setIsResting(true);
    setIsWarmup(false); // Turn off after logging
    setIs1RM(false);
  };

  const handleAddExerciseFromModal = (ex) => {
    const newEx = { name: ex.name, muscle: ex.muscle || ex.primaryMuscles?.[0] || 'general', equipment: ex.equipment || 'standard', targetSets: 3, image: ex.image || ex.images?.[0] || null, sets: [] };
    const nextList = [...exercises, newEx];
    setExercises(nextList);
    setCurrentExIndex(nextList.length - 1);
    setHasModifications(true);
  };

  const handleSwapExerciseFromModal = (ex) => {
    const newEx = { name: ex.name, muscle: ex.muscle || ex.primaryMuscles?.[0] || 'general', equipment: ex.equipment || 'standard', targetSets: currentExercise?.targetSets || 3, image: ex.image || ex.images?.[0] || null, sets: [] };
    const nextList = [...exercises];
    nextList[currentExIndex] = newEx;
    setExercises(nextList);
    setHasModifications(true);
  };

  const unfinishedCount = exercises.filter(ex => !ex.sets || ex.sets.length === 0).length;

  const handleTryFinish = () => {
    if (unfinishedCount > 0) setIsEarlyFinishModalOpen(true);
    else executeFinish();
  };

  const executeFinish = () => {
    onFinishWorkout({ routineName: session.routineName, exercises, duration: totalSeconds, totalRestDuration, isCustomTemplate: session.isCustomTemplate, hasModifications });
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] w-full mx-auto animate-in slide-in-from-bottom-8 duration-300 relative">
      
      {isEarlyFinishModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
            <p className="text-sm text-zinc-400 mb-6">There {unfinishedCount === 1 ? 'is' : 'are'} still <span className="text-white font-bold">{unfinishedCount}</span> exercise{unfinishedCount === 1 ? '' : 's'} left. You can do it!</p>
            <div className="flex flex-col space-y-3">
              <button onClick={() => setIsEarlyFinishModalOpen(false)} className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm active:scale-95 transition-transform">No, keep going</button>
              <button onClick={() => { setIsEarlyFinishModalOpen(false); executeFinish(); }} className="w-full py-3.5 rounded-xl bg-zinc-900 text-zinc-400 font-bold text-sm border border-zinc-800 active:scale-95 transition-transform">Yes, finish session</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-[#09090b] shadow-sm z-10 pt-safe">
        <div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">Session Time</span>
          <div className="flex items-center space-x-3">
            <span className="text-xl font-mono font-bold text-white tracking-tight">{formatSeconds(totalSeconds)}</span>
            <button onClick={() => setIsPaused(!isPaused)} className={`px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1 transition-colors ${isPaused ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}>
              {isPaused ? <Play size={10} className="fill-amber-500" /> : <Pause size={10} />}<span>{isPaused ? 'Paused' : 'Pause'}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onCancelWorkout} className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs font-bold transition-colors hover:text-white flex items-center justify-center">Cancel</button>
          <button onClick={handleTryFinish} className="px-5 py-2 rounded-lg bg-white text-black text-xs font-bold active:scale-95 transition-all flex items-center justify-center shadow-lg">Finish</button>
        </div>
      </div>

      {exercises.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#09090b]">
          <div className="w-20 h-20 rounded-full bg-[#121214] border border-zinc-800 flex items-center justify-center text-zinc-600 mb-6 shadow-sm"><Dumbbell size={32} /></div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Empty Session</h3>
          <p className="text-sm text-zinc-500 max-w-xs mb-8">Add an exercise to begin tracking.</p>
          <button onClick={() => setIsAddExModalOpen(true)} className="px-6 py-4 bg-white text-black rounded-full text-sm font-bold active:scale-95 transition-transform flex items-center justify-center space-x-2"><Plus size={18} /><span>Add Exercise</span></button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between overflow-y-auto bg-[#09090b]">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Exercise {currentExIndex + 1} of {exercises.length}</span>
              <span className="text-xs font-mono font-bold text-zinc-500">{formatSeconds(exerciseSeconds)}</span>
            </div>

            <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
              <button onClick={() => {
                 const match = MUSCLE_GROUPS.find(g => g.toLowerCase() === currentExercise?.muscle?.toLowerCase());
                 setSwapMuscleGroup(match || 'All');
                 setIsSwapExModalOpen(true);
              }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white flex items-center justify-center transition-colors z-20 border border-zinc-800"><ArrowRightLeft size={14}/></button>
              <ExerciseImage srcPath={currentExercise?.image} alt={currentExercise?.name} muscle={currentExercise?.muscle} className="w-24 h-24 rounded-xl bg-black object-cover mb-4 shadow-md border border-zinc-800" fallbackSize={32} />
              
              <div className="flex items-center justify-between w-full relative z-10">
                <button disabled={currentExIndex === 0} onClick={() => setCurrentExIndex(i => i - 1)} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 disabled:opacity-30 text-white flex items-center justify-center transition-colors hover:bg-zinc-800"><ChevronLeft size={20} /></button>
                <div className="flex-1 px-3">
                  <h3 className="text-lg font-bold text-white leading-tight tracking-tight">{currentExercise.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${getMuscleColor(currentExercise.muscle)}`}>{currentExercise.muscle}</span>
                    <span className="text-xs font-medium text-zinc-400">Target: {currentExercise.targetSets || 3} Sets</span>
                  </div>
                </div>
                <button disabled={currentExIndex === exercises.length - 1} onClick={() => setCurrentExIndex(i => i + 1)} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 disabled:opacity-30 text-white flex items-center justify-center transition-colors hover:bg-zinc-800"><ChevronRight size={20} /></button>
              </div>

              {prevExerciseStats && prevExerciseStats.length > 0 && (
                <div className="mt-5 bg-[#09090b] border border-zinc-800/50 rounded-xl p-3.5 text-left w-full">
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-bold mb-2 pb-2 border-b border-zinc-800/50 uppercase tracking-wide">
                    <Activity size={12} className="text-indigo-400" />
                    <span>Previous Working Sets</span>
                  </div>
                  <div className="space-y-2">
                    {prevExerciseStats.map((s, idx) => (
                      <div key={idx} className="text-[11px] font-medium flex justify-between items-center">
                        <span className="text-zinc-500 font-mono">Set {idx + 1}</span>
                        <span className="text-zinc-300 font-mono">{s.weight} kg × {s.reps} reps <span className="text-zinc-600 font-sans ml-1">(Diff {s.difficulty})</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {currentExercise.sets && currentExercise.sets.length > 0 && (
              <div className="bg-[#121214] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-4 text-[10px] font-bold text-zinc-500 uppercase px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                  <span>Set</span><span className="text-center">{isBodyweight ? '+Weight' : 'Weight'}</span><span className="text-center">Reps</span><span className="text-right">Diff</span>
                </div>
                {currentExercise.sets.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-4 items-center px-4 py-3 text-sm font-semibold border-b border-zinc-800/50 last:border-0">
                    <span className={`font-mono text-xs ${s.is1RM ? 'text-fuchsia-400 font-bold' : s.isWarmup ? 'text-amber-500 font-bold' : 'text-zinc-500'}`}>
                      {s.is1RM ? '👑' : s.isWarmup ? 'W' : `#${idx + 1}`}
                    </span>
                    <span className="text-center text-white">{s.weight} kg</span>
                    <span className="text-center text-white">{s.reps}</span>
                    <span className="text-right text-zinc-500">{s.difficulty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-[#09090b] border-t border-zinc-900 z-10 sticky bottom-0">
            {isResting && (
              <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm animate-in fade-in zoom-in-95 duration-200 text-center mb-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-4">Rest & Recover</span>
                
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-900" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={351.8} 
                      strokeDashoffset={351.8 - (Math.min(100, (restRemaining / restTarget) * 100) / 100) * 351.8} 
                      className={`${restRemaining === 0 ? 'text-emerald-500 animate-pulse' : 'text-indigo-500'} transition-all duration-500 ease-linear`} 
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className={`text-4xl font-mono font-black ${restRemaining === 0 ? 'text-emerald-400' : 'text-white'}`}>
                      {restRemaining}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">SEC</span>
                  </div>
                </div>

                <div className="flex space-x-2 w-full mb-4">
                  {[60, 90, 120, 180].map(t => (
                    <button key={t} onClick={() => {
                      setRestTarget(t);
                      setRestEndTime(Date.now() + t * 1000);
                      setRestRemaining(t);
                    }} className={`flex-1 py-2 rounded-lg text-[11px] font-bold border transition-colors ${restTarget === t ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>{t}s</button>
                  ))}
                </div>

                <button onClick={() => setIsResting(false)} className="w-full py-4 rounded-xl bg-white text-black text-sm font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform"><Play size={16} className="fill-black" /><span>Resume Now</span></button>
              </div>
            )}
            
            {!isResting && (
              <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-4 mb-4 shadow-sm relative">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Log Set #{currentSetNum}</span>
                   <div className="flex space-x-2">
                     <button onClick={toggle1RM} className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border ${is1RM ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                       {isBodyweight ? 'MAX REPS' : '1RM'}
                     </button>
                     <button onClick={toggleWarmup} className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border ${isWarmup ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                       Warm-up
                     </button>
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1.5 text-center truncate">{isBodyweight ? '+ Added Wt (kg)' : 'Weight (kg)'}</label>
                    <input type="number" step="0.5" placeholder="0" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-center text-lg font-bold text-white outline-none focus:border-indigo-500 transition-colors"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1.5 text-center">Reps</label>
                    <input type="number" placeholder="0" value={reps} onChange={(e) => setReps(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-center text-lg font-bold text-white outline-none focus:border-indigo-500 transition-colors"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1.5 text-center">Diff (1-10)</label>
                    <input type="number" min="1" max="10" value={difficulty} onChange={(e) => {
                       let val = e.target.value;
                       if (val !== '' && Number(val) > 10) val = '10';
                       if (val !== '' && Number(val) < 1) val = '1';
                       setDifficulty(val);
                    }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-center text-lg font-bold text-white outline-none focus:border-indigo-500 transition-colors"/>
                  </div>
                </div>
                
                <button onClick={handleLogSetAndRest} disabled={reps === '' || weight === ''} className="w-full py-4 mt-4 bg-white disabled:opacity-30 disabled:hover:bg-white hover:bg-zinc-200 text-black rounded-xl text-sm font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-sm">
                  <Check size={18} strokeWidth={3} /><span>Log Set & Rest</span>
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1">
              {currentExIndex < exercises.length - 1 ? (
                <button onClick={() => setCurrentExIndex(i => i + 1)} className="py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-sm font-bold flex items-center justify-center active:scale-95 transition-all">
                  <span>Next Exercise</span><ChevronRight size={18} className="ml-1"/>
                </button>
              ) : (
                <button onClick={() => setIsAddExModalOpen(true)} className="py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-sm font-bold flex items-center justify-center active:scale-95 transition-all">
                  <Plus size={16} className="mr-1"/><span>Add Exercise</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <ExerciseSelectorModal isOpen={isAddExModalOpen} onClose={() => setIsAddExModalOpen(false)} exerciseDB={exerciseDB} onSelectExercise={handleAddExerciseFromModal}/>
      <ExerciseSelectorModal isOpen={isSwapExModalOpen} onClose={() => setIsSwapExModalOpen(false)} exerciseDB={exerciseDB} onSelectExercise={handleSwapExerciseFromModal} initialMuscle={swapMuscleGroup}/>
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
    <div className="flex flex-col h-full bg-[#09090b] animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center p-4 border-b border-zinc-900 bg-[#09090b] shadow-sm z-10 pt-safe">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors active:scale-95 flex items-center justify-center">
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-bold text-white tracking-tight">{routine ? 'Edit Routine' : 'New Routine'}</h3>
        <button onClick={() => { if (name.trim()) onSave({ id: routine?.id || `r_${Date.now()}`, name: name.trim(), exercises }); }} disabled={!name.trim() || exercises.length === 0} className="bg-white disabled:opacity-40 hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm active:scale-95">
          Save
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-4 shadow-sm mb-6">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Routine Title</label>
          <input type="text" placeholder="e.g., Heavy Leg Day" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"/>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Exercises ({exercises.length})</span>
        </div>

        <div className="space-y-3 pb-20">
          {exercises.map((ex, idx) => {
            return (
              <div key={idx} className="bg-[#121214] border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4 min-w-0">
                  <ExerciseImage srcPath={ex.image} alt={ex.name} muscle={ex.muscle} className="w-12 h-12 rounded-xl bg-black object-cover border border-zinc-800 flex-shrink-0" fallbackSize={18} />
                  <div className="truncate pr-2">
                    <h4 className="text-sm font-bold text-white truncate tracking-tight">{ex.name}</h4>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mt-0.5">{ex.muscle}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                  <button onClick={() => setExercises(exercises.filter((_, i) => i !== idx))} className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 transition-colors"><Trash2 size={14} /></button>
                  <div className="flex items-center space-x-1.5 bg-zinc-900 px-2 py-1.5 rounded-lg border border-zinc-800">
                    <button onClick={() => setExercises(exercises.map((e, i) => i === idx ? { ...e, targetSets: Math.max(1, (e.targetSets || 3) - 1) } : e))} className="text-zinc-400 hover:text-white px-1 font-bold text-sm leading-none transition-colors">-</button>
                    <span className="text-xs font-mono font-bold text-white px-1">{ex.targetSets || 3} <span className="text-[10px] text-zinc-500 font-sans">sets</span></span>
                    <button onClick={() => setExercises(exercises.map((e, i) => i === idx ? { ...e, targetSets: (e.targetSets || 3) + 1 } : e))} className="text-zinc-400 hover:text-white px-1 font-bold text-sm leading-none transition-colors">+</button>
                  </div>
                </div>
              </div>
            );
          })}
          
          <button onClick={() => setIsSelectorOpen(true)} className={`w-full bg-[#09090b] border border-dashed border-zinc-700 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all active:scale-95 ${exercises.length === 0 ? 'py-12' : 'py-5 mt-2'}`}>
             <Plus size={24} className="mb-2" />
             <span className="text-sm font-bold">{exercises.length === 0 ? "Add Your First Exercise" : "Add Another Exercise"}</span>
          </button>
        </div>
      </div>
      <ExerciseSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} exerciseDB={exerciseDB} onSelectExercise={handleAddExercise}/>
    </div>
  );
};

const RoutinePreviewModal = ({ routine, isOpen, onClose }) => {
  if (!isOpen || !routine) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="pr-4"><h3 className="text-lg font-bold text-white tracking-tight">{routine.name}</h3><p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider">{routine.exercises.length} Exercises Preview</p></div>
          <button onClick={onClose} className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex-shrink-0"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {routine.exercises.map((ex, idx) => (
            <div key={idx} className="bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-2xl flex items-center space-x-4">
              <ExerciseImage srcPath={ex.image} alt={ex.name} muscle={ex.muscle} className="w-12 h-12 rounded-xl bg-black object-cover border border-zinc-800" fallbackSize={16}/>
              <div><h4 className="text-sm font-bold text-white tracking-tight">{ex.name}</h4><div className="flex space-x-2 mt-1"><span className="text-[10px] font-bold text-zinc-500 uppercase">{ex.muscle}</span><span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{ex.targetSets} Sets</span></div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LibraryTab = ({ customRoutines, setCustomRoutines, onStartRoutine, exerciseDB }) => {
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showStandard, setShowStandard] = useState(true);
  const [previewRoutine, setPreviewRoutine] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const pressTimer = useRef(null);

  const handlePressStart = (routine) => { pressTimer.current = setTimeout(() => setPreviewRoutine(routine), 500); };
  const handlePressEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  if (editingRoutine || isCreatingNew) {
    return (
      <RoutineEditor
        routine={editingRoutine} exerciseDB={exerciseDB}
        onCancel={() => { setEditingRoutine(null); setIsCreatingNew(false); }}
        onSave={(savedRoutine) => {
          const existingIdx = customRoutines.findIndex(r => r.id === savedRoutine.id);
          if (existingIdx >= 0) {
            const updated = [...customRoutines];
            updated[existingIdx] = savedRoutine;
            setCustomRoutines(updated);
          } else {
            setCustomRoutines([...customRoutines, savedRoutine]);
          }
          setEditingRoutine(null); setIsCreatingNew(false);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#09090b] p-4 relative animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 pt-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Workout Library</h2>
          <p className="text-xs font-medium text-zinc-500 mt-1">Tap & hold to preview routines</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-1 pb-24">
        <div>
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1 block mb-3">My Routines ({customRoutines.length})</span>
          <div className="space-y-3">
            
            <button onClick={() => setIsCreatingNew(true)} className="w-full bg-[#09090b] border border-dashed border-zinc-700 p-5 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all active:scale-95">
               <Plus size={24} className="mb-2" />
               <span className="text-sm font-bold">Create a New Routine</span>
            </button>

            {customRoutines.map(routine => (
                <div key={routine.id} className="bg-[#121214] border border-zinc-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-sm select-none" onTouchStart={() => handlePressStart(routine)} onTouchEnd={handlePressEnd} onMouseDown={() => handlePressStart(routine)} onMouseUp={handlePressEnd} onMouseLeave={handlePressEnd}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="min-w-0 pr-4 flex-1">
                      <h3 className="text-lg font-bold text-white tracking-tight truncate">{routine.name}</h3>
                      <p className="text-xs font-medium text-zinc-500 mt-1.5">{routine.exercises.length} exercises</p>
                    </div>
                    <button onClick={() => onStartRoutine(routine)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg flex-shrink-0 active:scale-95" title="Start">
                      <Play size={20} className="fill-black translate-x-0.5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-zinc-800/80">
                    <button onClick={() => setEditingRoutine(routine)} className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold flex-1 mr-2 flex justify-center items-center active:scale-95"><Edit2 size={14} className="mr-1.5"/> Edit</button>
                    <button onClick={() => setDeleteConfirm(routine.id)} className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center active:scale-95"><Trash2 size={16}/></button>
                  </div>
                </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center px-1 mb-3">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Standard Templates</span>
            <button onClick={() => setShowStandard(!showStandard)} className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-1 rounded-md">{showStandard ? 'Hide' : 'Show'}</button>
          </div>
          {showStandard && (
            <div className="space-y-3">
              {STANDARD_ROUTINES.map(routine => (
                <div key={routine.id} className="bg-[#121214] border border-zinc-800/80 p-4 rounded-3xl flex flex-col justify-between shadow-sm select-none" onTouchStart={() => handlePressStart(routine)} onTouchEnd={handlePressEnd} onMouseDown={() => handlePressStart(routine)} onMouseUp={handlePressEnd} onMouseLeave={handlePressEnd}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="min-w-0 pr-4 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-white tracking-tight truncate">{routine.name}</h3>
                        <span className="text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded flex-shrink-0">PRO</span>
                      </div>
                      <p className="text-xs font-medium text-zinc-400 mt-1 leading-relaxed truncate">{routine.desc}</p>
                    </div>
                    <button onClick={() => onStartRoutine(routine)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg flex-shrink-0 active:scale-95" title="Start Workout">
                      <Play size={20} className="fill-black translate-x-0.5" />
                    </button>
                  </div>
                  <div className="pt-3 border-t border-zinc-800/80">
                    <button onClick={() => setEditingRoutine({ id: `copy_${Date.now()}`, name: `${routine.name.split(' (')[0]} (Copy)`, exercises: [...routine.exercises] })} className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold flex justify-center items-center active:scale-95"><Edit2 size={14} className="mr-1.5"/> Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <RoutinePreviewModal routine={previewRoutine} isOpen={!!previewRoutine} onClose={() => setPreviewRoutine(null)} />
      <DeleteConfirmModal isOpen={!!deleteConfirm} onCancel={() => setDeleteConfirm(null)} onConfirm={() => { setCustomRoutines(customRoutines.filter(r => r.id !== deleteConfirm)); setDeleteConfirm(null); }} />
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSession, setActiveSession] = useState(null);
  const [exerciseDB, setExerciseDB] = useState(FALLBACK_DB);
  
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isLibraryPickerOpen, setIsLibraryPickerOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isWipeDataModalOpen, setIsWipeDataModalOpen] = useState(false);
  const [isDummyLoadedModalOpen, setIsDummyLoadedModalOpen] = useState(false);
  
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [goalPendingSync, setGoalPendingSync] = useState(null);
  const [saveRoutinePrompt, setSaveRoutinePrompt] = useState(null);
  const [workoutRecapData, setWorkoutRecapData] = useState(null);
  const fileInputRef = useRef(null);

  const [userProfile, setUserProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('fitTrack_profile')) || null; } catch { return null; } });
  const [weeklyGoal, setWeeklyGoal] = useState(() => { try { return parseInt(localStorage.getItem('fitTrack_goal')) || 0; } catch { return 0; } });
  const [customRoutines, setCustomRoutines] = useState(() => { try { return JSON.parse(localStorage.getItem('fitTrack_routines')) || []; } catch { return []; } });
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('fitTrack_history')) || []; } catch { return []; } });
  const [scheduledRoutines, setScheduledRoutines] = useState(() => { try { return JSON.parse(localStorage.getItem('fitTrack_schedule')) || {}; } catch { return {}; } });

  useEffect(() => {
    if (!localStorage.getItem('fitTrack_hasSeenTutorial')) {
      setIsTutorialOpen(true);
      localStorage.setItem('fitTrack_hasSeenTutorial', 'true');
    }
  }, []);

  useEffect(() => { if (userProfile) localStorage.setItem('fitTrack_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('fitTrack_goal', weeklyGoal.toString()); }, [weeklyGoal]);
  useEffect(() => { localStorage.setItem('fitTrack_routines', JSON.stringify(customRoutines)); }, [customRoutines]);
  useEffect(() => { localStorage.setItem('fitTrack_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('fitTrack_schedule', JSON.stringify(scheduledRoutines)); }, [scheduledRoutines]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setExerciseDB(data); })
      .catch(() => {});
  }, []);

  const handleStartEmpty = () => setActiveSession({ routineName: 'Empty Workout', isCustomTemplate: false, exercises: [] });
  const handleStartRoutine = (routine) => setActiveSession({ routineName: routine.name, isCustomTemplate: !routine.id.startsWith('std-'), exercises: routine.exercises.map(e => ({ ...e, sets: [] })) });

  const handleFinishWorkout = (finishedData) => {
    if (finishedData.exercises.length === 0) { setActiveSession(null); return; }
    setWorkoutRecapData(finishedData);
    setActiveSession(null);
  };

  const handleCloseRecap = () => {
    const isNewUntracked = workoutRecapData.routineName === 'Empty Workout' || (!workoutRecapData.isCustomTemplate && workoutRecapData.hasModifications);
    if (isNewUntracked && workoutRecapData.exercises.length > 0) {
      setSaveRoutinePrompt(workoutRecapData);
    } else {
      finalizeSaveWorkout(workoutRecapData);
    }
    setWorkoutRecapData(null);
  };

  const finalizeSaveWorkout = (finishedData) => {
    const newHistoryItem = { id: `h_${Date.now()}`, routineName: finishedData.routineName, date: new Date().toISOString(), duration: finishedData.duration, totalRestDuration: finishedData.totalRestDuration, exercises: finishedData.exercises };
    setHistory([newHistoryItem, ...history]);
    setSaveRoutinePrompt(null);
  };

  const handleSaveRoutineAndFinish = (routineName) => {
    if (saveRoutinePrompt) {
      const newRoutine = { id: `r_${Date.now()}`, name: routineName, exercises: saveRoutinePrompt.exercises.map(e => ({ name: e.name, muscle: e.muscle, equipment: e.equipment, targetSets: e.sets?.length || 3, image: e.image })) };
      setCustomRoutines([...customRoutines, newRoutine]);
      finalizeSaveWorkout({ ...saveRoutinePrompt, routineName });
    }
  };

  const handleExportData = () => {
    const data = JSON.stringify({ customRoutines, history, scheduledRoutines, weeklyGoal, userProfile }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `FitTrackPro_Backup_${getLocalYYYYMMDD()}.json`; a.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if(data.history) setHistory(data.history);
        if(data.customRoutines) setCustomRoutines(data.customRoutines);
        if(data.scheduledRoutines) setScheduledRoutines(data.scheduledRoutines);
        if(data.userProfile) setUserProfile(data.userProfile);
        if(data.weeklyGoal !== undefined) setWeeklyGoal(data.weeklyGoal);
        setIsOptionsOpen(false);
      } catch(err) {}
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const loadDummyData = () => {
    const newHistory = [];
    const now = Date.now();
    const dayMs = 86400000;
    let benchWeight = 40;
    let squatWeight = 60;
    let pullupReps = 5;

    for (let i = 0; i < 60; i++) {
        const date = new Date(now - (60 - i) * 2.25 * dayMs).toISOString(); // Over 4.5 months
        if (i % 4 === 0) { benchWeight += 2.5; squatWeight += 5; pullupReps += 1; }
        
        const type = i % 3;
        let routineName, exercises;

        if (type === 0) {
            routineName = 'Push (Hypertrophy Focus)';
            exercises = [
                { name: 'Barbell Bench Press', muscle: 'chest', equipment: 'barbell', sets: [{ weight: benchWeight, reps: 8, difficulty: 8, isWarmup: false }, { weight: benchWeight, reps: 8, difficulty: 8.5, isWarmup: false }] },
                { name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell', sets: [{ weight: benchWeight * 0.7, reps: 8, difficulty: 8, isWarmup: false }] }
            ];
        } else if (type === 1) {
            routineName = 'Pull (Width & Thickness)';
            exercises = [
                { name: 'Pull-up', muscle: 'back', equipment: 'bodyweight', sets: [{ weight: 0, reps: pullupReps, difficulty: 8, isWarmup: false }, { weight: 0, reps: Math.max(1, pullupReps - 1), difficulty: 9, isWarmup: false }] },
                { name: 'Barbell Bent Over Row', muscle: 'back', equipment: 'barbell', sets: [{ weight: benchWeight * 1.2, reps: 8, difficulty: 8, isWarmup: false }] }
            ];
        } else {
            routineName = 'Legs (Quad & Ham Balance)';
            exercises = [
                { name: 'Barbell Squat', muscle: 'legs', equipment: 'barbell', sets: [{ weight: squatWeight, reps: 6, difficulty: 8, isWarmup: false }, { weight: squatWeight, reps: 6, difficulty: 9, isWarmup: false }] },
                { name: 'Romanian Deadlift', muscle: 'legs', equipment: 'barbell', sets: [{ weight: squatWeight * 0.8, reps: 8, difficulty: 7, isWarmup: false }] }
            ];
        }

        newHistory.unshift({
            id: `dummy_${Date.now()}_${i}`, date: date, duration: 2400 + Math.floor(Math.random() * 600),
            routineName: routineName,
            totalRestDuration: 600,
            exercises: exercises
        });
    }
    setHistory(newHistory);
    setScheduledRoutines({ 0: { id: 'std-push', name: 'Push (Hypertrophy Focus)' }, 2: { id: 'std-legs', name: 'Legs (Quad & Ham Balance)' }, 4: { id: 'std-pull', name: 'Pull (Width & Thickness)' } });
    setWeeklyGoal(4);
    setIsOptionsOpen(false);
    setIsDummyLoadedModalOpen(true);
  };

  const executeWipeData = () => {
    setHistory([]); setCustomRoutines([]); setScheduledRoutines({}); setWeeklyGoal(0); setUserProfile(null);
    localStorage.removeItem('fitTrack_routines'); localStorage.removeItem('fitTrack_history');
    localStorage.removeItem('fitTrack_schedule'); localStorage.removeItem('fitTrack_goal'); localStorage.removeItem('fitTrack_profile');
    setIsWipeDataModalOpen(false);
    setIsOptionsOpen(false);
  };

  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const todayProgram = scheduledRoutines[currentDayIndex];
  
  const workoutsThisWeek = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    monday.setHours(0,0,0,0);
    const thisWeekHistory = history.filter(h => new Date(h.date) >= monday);
    const uniqueDays = new Set(thisWeekHistory.map(h => getLocalYYYYMMDD(new Date(h.date))));
    return uniqueDays.size;
  }, [history]);

  // Swipe Navigation Logic
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const tabs = ['home', 'library', 'progress'];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (isLeftSwipe && currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
    if (isRightSwipe && currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
  };

  // Streak logic factoring in rest days
  const currentStreak = useMemo(() => {
    const datesWithWorkouts = new Set(history.map(h => getLocalYYYYMMDD(new Date(h.date))));
    const restDaysOfWeek = Object.keys(scheduledRoutines).filter(k => scheduledRoutines[k].isRest).map(Number);
    
    const isStreakDay = (d) => {
       const dateStr = getLocalYYYYMMDD(d);
       if (datesWithWorkouts.has(dateStr)) return true;
       const myDayOfWeek = (d.getDay() + 6) % 7;
       if (restDaysOfWeek.includes(myDayOfWeek)) return true;
       return false;
    };

    let current = 0;
    let checkDate = new Date();
    checkDate.setHours(0,0,0,0);
    const todayStr = getLocalYYYYMMDD(checkDate);

    if (isStreakDay(checkDate)) {
       current++;
       checkDate.setDate(checkDate.getDate() - 1);
    } else {
       const yesterday = new Date(checkDate);
       yesterday.setDate(yesterday.getDate() - 1);
       if (isStreakDay(yesterday)) {
           checkDate = yesterday;
       } else {
           current = 0;
       }
    }

    if (current > 0) {
        while(true) {
            if (getLocalYYYYMMDD(checkDate) === todayStr) {
               checkDate.setDate(checkDate.getDate() - 1);
               continue;
            }
            if (isStreakDay(checkDate)) {
                current++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }
    return current;
  }, [history, scheduledRoutines]);

  return (
    <div className="flex justify-center w-full h-[100dvh] bg-black font-sans text-white select-none overflow-hidden">
      <div className="w-full max-w-md h-full flex flex-col bg-[#09090b] shadow-2xl relative">
        
        {isTutorialOpen && <TutorialOverlay onClose={() => setIsTutorialOpen(false)} />}
        {!isTutorialOpen && !userProfile && <UserProfileModal isOpen={true} onSave={(profile) => setUserProfile(profile)} />}
        <UserProfileModal isOpen={isProfileModalOpen} onSave={(profile) => { setUserProfile(profile); setIsProfileModalOpen(false); }} />
        {workoutRecapData && <WorkoutRecapModal data={workoutRecapData} userProfile={userProfile} historyLength={history.filter(h => h.routineName === workoutRecapData.routineName).length} onDone={handleCloseRecap} />}
        
        {activeSession ? (
          <ActiveWorkout session={activeSession} history={history} userProfile={userProfile} exerciseDB={exerciseDB} onCancelWorkout={() => setActiveSession(null)} onFinishWorkout={handleFinishWorkout} />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden pb-[70px]" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndEvent}>
            {activeTab === 'home' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pt-2 mb-4">
                  <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter flex items-center space-x-2"><span>FitTrack</span><span className="text-indigo-500">.PRO</span></h1>
                    <p className="text-xs font-medium text-zinc-400 mt-0.5">Track overload & rest efficiently</p>
                  </div>
                  <div className="relative z-50">
                    <button onClick={() => setIsOptionsOpen(!isOptionsOpen)} className="w-12 h-12 rounded-full bg-[#121214] border border-zinc-800 text-white flex items-center justify-center shadow-sm active:scale-95 transition-colors"><Menu size={20} /></button>
                    {isOptionsOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOptionsOpen(false)} />
                        <div className="absolute right-0 top-14 w-56 bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                          <button onClick={() => { setIsProfileModalOpen(true); setIsOptionsOpen(false); }} className="w-full text-left px-4 py-3.5 text-sm font-bold text-white hover:bg-zinc-900 flex items-center"><User size={16} className="mr-3 text-sky-400"/> Edit Profile</button>
                          <div className="h-[1px] bg-zinc-800"></div>
                          <button onClick={() => { setIsTutorialOpen(true); setIsOptionsOpen(false); }} className="w-full text-left px-4 py-3.5 text-sm font-bold text-white hover:bg-zinc-900 flex items-center"><Info size={16} className="mr-3 text-indigo-400"/> Replay Tutorial</button>
                          <div className="h-[1px] bg-zinc-800"></div>
                          <button onClick={() => loadDummyData()} className="w-full text-left px-4 py-3.5 text-sm font-bold text-white hover:bg-zinc-900 flex items-center"><DatabaseZap size={16} className="mr-3 text-emerald-400"/> Load Dummy Data</button>
                          <button onClick={() => handleExportData()} className="w-full text-left px-4 py-3.5 text-sm font-bold text-white hover:bg-zinc-900 flex items-center"><Download size={16} className="mr-3 text-sky-400"/> Export JSON Data</button>
                          <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportData} className="hidden" />
                          <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-3.5 text-sm font-bold text-white hover:bg-zinc-900 flex items-center"><Layers size={16} className="mr-3 text-amber-400"/> Import JSON Data</button>
                          <div className="h-[1px] bg-zinc-800"></div>
                          <button onClick={() => setIsWipeDataModalOpen(true)} className="w-full text-left px-4 py-3.5 text-sm font-bold text-rose-500 hover:bg-zinc-900 flex items-center"><Trash2 size={16} className="mr-3"/> Wipe All Data</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4 flex justify-between items-center px-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl drop-shadow-md">🔥</span>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block">Current Streak</span>
                      <span className="text-sm font-black text-white">{currentStreak} Day{currentStreak !== 1 && 's'}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                   <WeeklyTracker history={history} onSelectDay={(day) => setSelectedDayData(day)} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-2 text-indigo-400">
                        <CalendarCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Today</span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight leading-tight">{todayProgram ? todayProgram.name : 'Empty Day'}</h3>
                    </div>
                    {todayProgram && !todayProgram.isRest ? (
                      <button onClick={() => {
                        const rToStart = customRoutines.find(r => r.id === todayProgram.id) || STANDARD_ROUTINES.find(r => r.id === todayProgram.id);
                        if (rToStart) handleStartRoutine(rToStart);
                      }} className="mt-4 w-full py-2.5 bg-white text-black rounded-xl text-xs font-bold active:scale-95 transition-transform shadow-lg">Start</button>
                    ) : (
                      <button onClick={() => setIsPlannerOpen(true)} className="mt-4 w-full py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform">Planner</button>
                    )}
                  </div>
                  
                  <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-2 text-emerald-400">
                        <Trophy size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Goal</span>
                      </div>
                      {weeklyGoal > 0 ? (
                        <div>
                           <div className="flex items-end space-x-1 mb-1"><span className="text-2xl font-black text-white leading-none">{workoutsThisWeek}</span><span className="text-sm font-bold text-zinc-500 mb-0.5">/ {weeklyGoal}</span></div>
                           <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.min(100, (workoutsThisWeek/weeklyGoal)*100)}%`}}></div></div>
                        </div>
                      ) : (
                        <h3 className="text-sm font-bold text-zinc-500 tracking-tight leading-tight mt-1">No goal set.</h3>
                      )}
                    </div>
                    <button onClick={() => setIsGoalModalOpen(true)} className="mt-4 w-full py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform">{weeklyGoal === 0 ? 'Set Goal' : 'Edit Goal'}</button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-end pb-4">
                  <button onClick={() => setIsStartModalOpen(true)} className="w-full bg-white text-black py-5 rounded-2xl shadow-xl active:scale-95 transition-transform flex flex-col items-center justify-center relative overflow-hidden">
                    <span className="text-xl font-black tracking-tight z-10 uppercase">Start Workout</span>
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'library' && <LibraryTab customRoutines={customRoutines} setCustomRoutines={setCustomRoutines} onStartRoutine={handleStartRoutine} exerciseDB={exerciseDB} />}
            {activeTab === 'progress' && <ProgressMainTab history={history} userProfile={userProfile} weeklyGoal={weeklyGoal} scheduledRoutines={scheduledRoutines} onDeleteSession={(id) => setHistory(history.filter(h => h.id !== id))} onSaveAsRoutine={setSaveRoutinePrompt} />}
          </div>
        )}

        {!activeSession && !workoutRecapData && (
          <div className="absolute bottom-0 inset-x-0 h-[70px] bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-900 flex items-center justify-around z-40 pb-safe">
            <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${activeTab === 'home' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
              <Flame size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} className={activeTab === 'home' ? 'text-indigo-400' : ''} /><span className="text-[10px] font-bold">Home</span>
            </button>
            <button onClick={() => setActiveTab('library')} className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${activeTab === 'library' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
               <Layers size={24} strokeWidth={activeTab === 'library' ? 2.5 : 2} className={activeTab === 'library' ? 'text-indigo-400' : ''} /><span className="text-[10px] font-bold">Library</span>
            </button>
            <button onClick={() => setActiveTab('progress')} className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${activeTab === 'progress' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
               <TrendingUp size={24} strokeWidth={activeTab === 'progress' ? 2.5 : 2} className={activeTab === 'progress' ? 'text-indigo-400' : ''} /><span className="text-[10px] font-bold">Progress</span>
            </button>
          </div>
        )}

        <StartWorkoutModal isOpen={isStartModalOpen} onClose={() => setIsStartModalOpen(false)} onStartEmpty={() => { setIsStartModalOpen(false); handleStartEmpty(); }} onOpenLibrarySelection={() => { setIsStartModalOpen(false); setIsLibraryPickerOpen(true); }} />
        <LibraryWorkoutPickerModal isOpen={isLibraryPickerOpen} onClose={() => setIsLibraryPickerOpen(false)} customRoutines={customRoutines} onSelectRoutine={(r) => { setIsLibraryPickerOpen(false); handleStartRoutine(r); }} />
        <DayDetailsModal dayData={selectedDayData} onClose={() => setSelectedDayData(null)} onOpenWorkout={() => setActiveTab('progress')} />
        <SaveRoutinePromptModal isOpen={!!saveRoutinePrompt} onSave={handleSaveRoutineAndFinish} onSkip={() => finalizeSaveWorkout(saveRoutinePrompt)} />
        
        <GoalSettingModal isOpen={isGoalModalOpen} currentGoal={weeklyGoal} onClose={() => setIsGoalModalOpen(false)} onSave={(val) => setWeeklyGoal(val)} />
        <WeeklyPlannerModal isOpen={isPlannerOpen} onClose={() => setIsPlannerOpen(false)} scheduledRoutines={scheduledRoutines} customRoutines={customRoutines} initialWeeklyGoal={weeklyGoal} onUpdateSchedule={(newSchedule, pendingSyncCount) => { setScheduledRoutines(newSchedule); if (pendingSyncCount !== null) setGoalPendingSync(pendingSyncCount); }} />
        <SyncGoalModal goalPendingSync={goalPendingSync} onConfirm={(days) => { setWeeklyGoal(days); setGoalPendingSync(null); }} onSkip={() => setGoalPendingSync(null)} />
        
        <WipeDataConfirmModal isOpen={isWipeDataModalOpen} onConfirm={executeWipeData} onCancel={() => setIsWipeDataModalOpen(false)} />
        <MessageModal isOpen={isDummyLoadedModalOpen} title="Data Loaded!" message="60 sessions of dummy data have been injected. Check your Progress tab!" onClose={() => setIsDummyLoadedModalOpen(false)} isSuccess={true} />
      </div>
    </div>
  );
}