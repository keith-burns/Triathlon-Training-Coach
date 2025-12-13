/**
 * Training Plan Generator
 * Professional triathlon training plan generation with periodization
 */

import type {
    RaceConfig,
    TrainingPlan,
    TrainingWeek,
    TrainingDay,
    Workout,
    WorkoutStep,
    TrainingPhase,
    RaceDistanceId,
} from '../types/race';

import type { AthleteProfile, DisciplineSplit, StrengthWeakness, DayOfWeek } from '../types/athlete';
import { adjustRestDays } from './trainingPlanLogic';
import {
    parseLocalDate,
    formatLocalDate,
    getDayOfWeek,
    addDays,
    getWeeksBetween
} from './dateUtils';

// ============================================
// Helper Functions
// ============================================

function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

// ============================================
// Workout Templates
// ============================================

const createSwimWorkout = (duration: number, type: 'endurance' | 'intervals' | 'technique', phase: TrainingPhase): Workout => {
    const warmupTime = Math.min(10, Math.floor(duration * 0.15));
    const cooldownTime = Math.min(10, Math.floor(duration * 0.15));
    const mainSetTime = duration - warmupTime - cooldownTime;

    let steps: WorkoutStep[] = [];
    let title = '';
    let description = '';

    if (type === 'endurance') {
        title = 'Endurance Swim';
        description = 'Build aerobic base with steady-state swimming';
        steps = [
            {
                name: 'Warm-up',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: 'Easy freestyle, focus on long strokes and relaxed breathing. Alternate 50m freestyle with 25m drill (catch-up or fingertip drag).',
                targetHeartRateZone: 1,
            },
            {
                name: 'Main Set - Steady Swim',
                duration: `${mainSetTime} min`,
                intensity: 'moderate',
                instructions: `Swim continuously at conversational pace. Focus on bilateral breathing (every 3 strokes). Maintain stroke count per length. If needed, take 10-second breaks at the wall every 200m.`,
                targetHeartRateZone: 2,
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: 'Easy backstroke or freestyle with focus on full exhale underwater. Stretch shoulders at the wall.',
                targetHeartRateZone: 1,
            },
        ];
    } else if (type === 'intervals') {
        title = 'Swim Intervals';
        description = 'Build speed and lactate threshold with structured intervals';
        const reps = Math.max(4, Math.floor(mainSetTime / 5));
        steps = [
            {
                name: 'Warm-up',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: '200m easy freestyle, 4x50m drill/swim by 25m (catch-up drill, then swim). Rest 10 seconds between 50s.',
                targetHeartRateZone: 1,
            },
            {
                name: 'Pre-set',
                duration: '4 min',
                intensity: 'moderate',
                instructions: '4x25m build: start easy, finish at 80% effort. 10 seconds rest between each.',
                targetHeartRateZone: 2,
            },
            {
                name: 'Main Set - Threshold Intervals',
                duration: `${mainSetTime - 4} min`,
                intensity: 'threshold',
                instructions: `${reps}x100m at threshold pace (comfortably hard, can speak a few words). Take 15-20 seconds rest between each 100m. Focus on high elbow catch and strong kick.`,
                targetHeartRateZone: 4,
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: '100m easy backstroke, 100m easy freestyle with long glide. Focus on releasing tension.',
                targetHeartRateZone: 1,
            },
        ];
    } else {
        title = 'Technique Swim';
        description = 'Improve swim efficiency with drills and focused practice';
        steps = [
            {
                name: 'Warm-up',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: 'Easy freestyle with focus on exhaling fully underwater. Count strokes per length.',
                targetHeartRateZone: 1,
            },
            {
                name: 'Drill Set - Catch',
                duration: `${Math.floor(mainSetTime * 0.3)} min`,
                intensity: 'easy',
                instructions: '6x50m alternating: Catch-up drill (touch hands before next stroke) and Fingertip drag drill. 15 seconds rest between each. Focus on high elbow and feeling the water.',
                targetHeartRateZone: 1,
            },
            {
                name: 'Drill Set - Balance',
                duration: `${Math.floor(mainSetTime * 0.3)} min`,
                intensity: 'easy',
                instructions: '4x50m side-kick drill (kick on your side, bottom arm extended, top arm at side). Switch sides each 25m. 15 seconds rest.',
                targetHeartRateZone: 1,
            },
            {
                name: 'Technique Application',
                duration: `${Math.floor(mainSetTime * 0.4)} min`,
                intensity: 'moderate',
                instructions: 'Swim freestyle applying drill focus. Every 25m, consciously check: high elbow catch, hip rotation, steady kick. Count strokes and try to reduce by 1-2 per length.',
                targetHeartRateZone: 2,
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: 'Easy backstroke, focus on relaxation and breathing.',
                targetHeartRateZone: 1,
            },
        ];
    }

    return {
        id: generateId(),
        discipline: 'swim',
        title,
        description,
        totalDuration: duration,
        steps,
        tips: [
            'Stay hydrated - drink water before and after',
            'If sharing lanes, follow circle swimming etiquette',
            phase === 'taper' ? 'Focus on feeling smooth, not fast' : 'Challenge yourself but maintain good form',
        ],
    };
};

const createBikeWorkout = (duration: number, type: 'endurance' | 'intervals' | 'tempo', phase: TrainingPhase): Workout => {
    const warmupTime = Math.min(15, Math.floor(duration * 0.15));
    const cooldownTime = Math.min(10, Math.floor(duration * 0.12));
    const mainSetTime = duration - warmupTime - cooldownTime;

    let steps: WorkoutStep[] = [];
    let title = '';
    let description = '';

    if (type === 'endurance') {
        title = 'Endurance Ride';
        description = 'Build aerobic base with steady-state cycling';
        steps = [
            {
                name: 'Warm-up',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: 'Easy spinning in a light gear. Gradually increase cadence from 75 to 90 rpm. Stay seated, keep upper body relaxed.',
                targetHeartRateZone: 1,
                cadence: '75-90 rpm',
            },
            {
                name: 'Main Set - Steady Ride',
                duration: `${mainSetTime} min`,
                intensity: 'moderate',
                instructions: 'Maintain steady effort at conversational pace. Keep cadence between 85-95 rpm. On hills, shift to maintain cadence rather than grinding. Stay aero when safe on flats. Drink every 15-20 minutes.',
                targetHeartRateZone: 2,
                cadence: '85-95 rpm',
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: 'Easy spinning in light gear. Let heart rate drop. Spin out the legs with high cadence, low resistance.',
                targetHeartRateZone: 1,
                cadence: '90-100 rpm',
            },
        ];
    } else if (type === 'intervals') {
        title = 'Bike Intervals';
        description = 'Build power and VO2max with high-intensity efforts';
        const intervalReps = Math.max(3, Math.min(8, Math.floor(mainSetTime / 8)));
        steps = [
            {
                name: 'Warm-up',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: 'Progressive warm-up: 5 min very easy, then 5 min moderate with 3x30-second spin-ups to open the legs. Recover 30 seconds between spin-ups.',
                targetHeartRateZone: 1,
                cadence: '75-95 rpm',
            },
            {
                name: 'Pre-set Activation',
                duration: '5 min',
                intensity: 'moderate',
                instructions: '2x1 min at tempo effort with 1 min easy between. Prepares legs for hard efforts.',
                targetHeartRateZone: 3,
                cadence: '90-95 rpm',
            },
            {
                name: 'Main Set - VO2max Intervals',
                duration: `${mainSetTime - 5} min`,
                intensity: 'intervals',
                instructions: `${intervalReps}x3 min at hard effort (can't hold a conversation, but not all-out). Recovery: 2 min easy spinning between each. Maintain high cadence throughout. Stay seated for power, stand briefly if needed to reset.`,
                targetHeartRateZone: 5,
                cadence: '95-105 rpm',
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: 'Very easy spinning. Let heart rate drop below 60% max. Deep breathing, relax shoulders and grip.',
                targetHeartRateZone: 1,
                cadence: '85-95 rpm',
            },
        ];
    } else {
        title = 'Tempo Ride';
        description = 'Build sustained power at race-like intensity';
        steps = [
            {
                name: 'Warm-up',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: 'Progressive warm-up with gradual increase in effort. Include 2x1 min at moderate effort to open legs.',
                targetHeartRateZone: 1,
                cadence: '80-90 rpm',
            },
            {
                name: 'Main Set - Tempo Block 1',
                duration: `${Math.floor(mainSetTime * 0.45)} min`,
                intensity: 'tempo',
                instructions: 'Steady tempo effort - comfortably hard, can speak in short sentences. Maintain consistent power regardless of terrain. Focus on smooth pedaling circles.',
                targetHeartRateZone: 3,
                cadence: '85-95 rpm',
            },
            {
                name: 'Active Recovery',
                duration: '5 min',
                intensity: 'easy',
                instructions: 'Easy spinning, shake out legs, hydrate.',
                targetHeartRateZone: 1,
                cadence: '90-100 rpm',
            },
            {
                name: 'Main Set - Tempo Block 2',
                duration: `${Math.floor(mainSetTime * 0.45)} min`,
                intensity: 'tempo',
                instructions: 'Return to tempo effort. Practice race-day focus: check position, nutrition, pacing. Maintain effort even when legs feel heavy.',
                targetHeartRateZone: 3,
                cadence: '85-95 rpm',
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: 'Easy spinning to flush legs. Reflect on the session - how did pacing feel?',
                targetHeartRateZone: 1,
                cadence: '85-95 rpm',
            },
        ];
    }

    return {
        id: generateId(),
        discipline: 'bike',
        title,
        description,
        totalDuration: duration,
        steps,
        tips: [
            'Fuel with 30-60g carbs per hour for rides over 90 minutes',
            'Check tire pressure and brakes before every ride',
            phase === 'build' || phase === 'peak' ? 'Push through discomfort but respect early signs of injury' : 'Focus on consistency over intensity',
        ],
    };
};

const createRunWorkout = (duration: number, type: 'endurance' | 'intervals' | 'tempo' | 'long', _phase: TrainingPhase): Workout => {
    const warmupTime = Math.min(12, Math.floor(duration * 0.15));
    const cooldownTime = Math.min(10, Math.floor(duration * 0.12));
    const mainSetTime = duration - warmupTime - cooldownTime;

    let steps: WorkoutStep[] = [];
    let title = '';
    let description = '';

    if (type === 'endurance' || type === 'long') {
        title = type === 'long' ? 'Long Run' : 'Easy Run';
        description = type === 'long' ? 'Build endurance with extended aerobic running' : 'Recovery and aerobic base building';
        steps = [
            {
                name: 'Warm-up Walk/Jog',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: 'Start with 3 min brisk walk, then transition to very easy jog. Include leg swings and high knees for 30 seconds each. Build into your running rhythm gradually.',
                targetHeartRateZone: 1,
            },
            {
                name: 'Main Run',
                duration: `${mainSetTime} min`,
                intensity: type === 'long' ? 'moderate' : 'easy',
                instructions: `Run at conversational pace - you should be able to speak in full sentences. ${type === 'long' ? 'Take walk breaks if needed (1 min walk every 15-20 min is fine). Practice race-day nutrition by consuming gels/water.' : 'Focus on relaxed form: shoulders down, arms loose, quick light steps.'} Cadence around 170-180 steps per minute.`,
                targetHeartRateZone: 2,
                targetPace: 'Conversational',
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: 'Slow jog transitioning to walk. 5 min slow jog, then 5 min walk with gentle stretching: calf stretch, quad stretch, hip flexor stretch (30 seconds each leg).',
                targetHeartRateZone: 1,
            },
        ];
    } else if (type === 'intervals') {
        title = 'Run Intervals';
        description = 'Build speed and running economy with structured intervals';
        const reps = Math.max(4, Math.min(10, Math.floor(mainSetTime / 5)));
        steps = [
            {
                name: 'Warm-up Jog',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: 'Easy jog building from very slow to moderate. Last 2 min include 4x15-second strides (quick but controlled accelerations) with 30-second easy jog between.',
                targetHeartRateZone: 1,
            },
            {
                name: 'Dynamic Drills',
                duration: '3 min',
                intensity: 'easy',
                instructions: 'High knees (30 sec), butt kicks (30 sec), A-skips (30 sec), B-skips (30 sec). Walk back between each drill.',
                targetHeartRateZone: 1,
            },
            {
                name: 'Main Set - Speed Intervals',
                duration: `${mainSetTime - 3} min`,
                intensity: 'intervals',
                instructions: `${reps}x2 min at hard effort (can say a few words, not more). Recovery: 90 seconds easy jog between each. Focus on quick turnover and strong arm drive. Stay tall and relaxed even when tired.`,
                targetHeartRateZone: 4,
                targetPace: 'Comfortably Hard',
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: 'Easy jog for 5 min, then walk for 5 min. Stretch: standing quad, calf on step, seated hamstring. Hold each 30-45 seconds.',
                targetHeartRateZone: 1,
            },
        ];
    } else {
        title = 'Tempo Run';
        description = 'Build lactate threshold with sustained race-pace effort';
        steps = [
            {
                name: 'Warm-up',
                duration: `${warmupTime} min`,
                intensity: 'easy',
                instructions: 'Easy jog progressively building effort. Include 4x20-second pickups in the last 3 min to prime legs.',
                targetHeartRateZone: 1,
            },
            {
                name: 'Main Set - Tempo Block',
                duration: `${mainSetTime} min`,
                intensity: 'tempo',
                instructions: 'Run at "comfortably hard" pace - you can speak a few words but prefer not to. This is near your 10K race pace or slightly slower. Maintain consistent effort on hills (slow slightly on ups, don\'t surge on downs). Focus: relaxed shoulders, forward lean, quick feet.',
                targetHeartRateZone: 3,
                targetPace: '10K Race Pace',
            },
            {
                name: 'Cool-down',
                duration: `${cooldownTime} min`,
                intensity: 'recovery',
                instructions: 'Gradually slow to easy jog, then walk. Include standing stretches and foam roll if available.',
                targetHeartRateZone: 1,
            },
        ];
    }

    return {
        id: generateId(),
        discipline: 'run',
        title,
        description,
        totalDuration: duration,
        steps,
        tips: [
            'Run on softer surfaces when possible to reduce impact',
            type === 'long' ? 'Practice your race-day nutrition strategy' : 'Focus on form, especially when tired',
            'Strength training helps prevent running injuries',
        ],
    };
};

const createBrickWorkout = (bikeDuration: number, runDuration: number, _phase: TrainingPhase): Workout => {
    return {
        id: generateId(),
        discipline: 'brick',
        title: 'Brick Workout (Bike + Run)',
        description: 'Practice bike-to-run transition with back-to-back workouts',
        totalDuration: bikeDuration + runDuration + 5,
        steps: [
            {
                name: 'Bike Warm-up',
                duration: '10 min',
                intensity: 'easy',
                instructions: 'Easy spinning building to moderate effort. Focus on getting legs moving smoothly.',
                targetHeartRateZone: 1,
                cadence: '85-95 rpm',
            },
            {
                name: 'Bike Main Set',
                duration: `${bikeDuration - 15} min`,
                intensity: 'moderate',
                instructions: 'Steady ride at race effort. Last 10 min, increase cadence to 95+ rpm to prepare legs for the run. Stay hydrated.',
                targetHeartRateZone: 2,
                cadence: '90-100 rpm',
            },
            {
                name: 'Bike Wind-down',
                duration: '5 min',
                intensity: 'easy',
                instructions: 'Easy spinning, high cadence. Mentally prepare for transition. Have run gear ready.',
                targetHeartRateZone: 1,
                cadence: '95-100 rpm',
            },
            {
                name: 'T2 Transition Practice',
                duration: '2-3 min',
                intensity: 'recovery',
                instructions: 'Quick transition! Rack bike, helmet off, running shoes on. Practice race-day efficiency. Target under 2 minutes.',
            },
            {
                name: 'Run - First Mile',
                duration: '8-10 min',
                intensity: 'easy',
                instructions: 'Your legs will feel heavy and awkward - this is normal! Start EASY. Focus on quick, short steps. Let your body adjust to running after cycling. Cadence 175+ steps/min.',
                targetHeartRateZone: 2,
            },
            {
                name: 'Run - Settle In',
                duration: `${runDuration - 15} min`,
                intensity: 'moderate',
                instructions: 'Gradually find your rhythm. Build to a comfortable sustainable pace. Practice the mental shift from cycling to running. Stay relaxed and patient.',
                targetHeartRateZone: 2,
            },
            {
                name: 'Run Cool-down',
                duration: '5 min',
                intensity: 'recovery',
                instructions: 'Easy jog slowing to walk. Stretch quads, hip flexors, and calves well - they worked hard today!',
                targetHeartRateZone: 1,
            },
        ],
        tips: [
            'Set up transition area before starting bike',
            'Elastic laces make shoe transitions faster',
            'Brick legs get better with practice - trust the process',
            'Hydrate and take in nutrition during the bike to fuel the run',
        ],
    };
};

const createStrengthWorkout = (duration: number, focus: 'core' | 'full'): Workout => {
    const exercises: WorkoutStep[] = focus === 'core'
        ? [
            {
                name: 'Warm-up',
                duration: '5 min',
                intensity: 'easy',
                instructions: 'Light cardio: jumping jacks, high knees, arm circles. Get blood flowing.',
            },
            {
                name: 'Plank Hold',
                duration: '3 sets x 45 sec',
                intensity: 'moderate',
                instructions: 'Hold plank position on forearms. Keep body straight, core tight, don\'t let hips sag. Rest 30 sec between sets.',
            },
            {
                name: 'Side Plank',
                duration: '2 sets x 30 sec each side',
                intensity: 'moderate',
                instructions: 'Side plank on forearm. Stack feet or stagger for stability. Keep hips lifted. Rest 20 sec between sides.',
            },
            {
                name: 'Dead Bug',
                duration: '3 sets x 10 reps each side',
                intensity: 'moderate',
                instructions: 'Lie on back, arms up, knees at 90°. Lower opposite arm and leg while keeping lower back pressed to floor. Alternate sides.',
            },
            {
                name: 'Bird Dog',
                duration: '3 sets x 10 reps each side',
                intensity: 'moderate',
                instructions: 'On hands and knees, extend opposite arm and leg. Hold 2 seconds, return. Keep core stable, don\'t rotate hips.',
            },
            {
                name: 'Glute Bridge',
                duration: '3 sets x 15 reps',
                intensity: 'moderate',
                instructions: 'Lie on back, feet flat was, drive hips up squeezing glutes. Hold 2 seconds at top. Don\'t hyperextend lower back.',
            },
            {
                name: 'Cool-down Stretch',
                duration: '5 min',
                intensity: 'recovery',
                instructions: 'Cat-cow stretches, child\'s pose, and gentle spinal twists. Breathe deeply.',
            },
        ]
        : [
            {
                name: 'Warm-up',
                duration: '5 min',
                intensity: 'easy',
                instructions: 'Dynamic stretches and light cardio to prepare muscles.',
            },
            {
                name: 'Squats',
                duration: '3 sets x 12 reps',
                intensity: 'moderate',
                instructions: 'Feet shoulder-width apart, sit back and down, keep chest up and knees tracking over toes. Go to parallel or below if mobility allows. Rest 60 sec between sets.',
            },
            {
                name: 'Lunges',
                duration: '3 sets x 10 reps each leg',
                intensity: 'moderate',
                instructions: 'Step forward, lower until both knees at 90°. Keep front knee over ankle. Push back to start. Alternate legs.',
            },
            {
                name: 'Single-Leg Deadlift',
                duration: '3 sets x 8 reps each leg',
                intensity: 'moderate',
                instructions: 'Stand on one leg, hinge at hip, extend free leg behind. Keep back flat, feel hamstring stretch. Use wall for balance if needed.',
            },
            {
                name: 'Push-ups',
                duration: '3 sets x 10-15 reps',
                intensity: 'moderate',
                instructions: 'Hands slightly wider than shoulders. Lower chest to floor, push back up. Modify on knees if needed.',
            },
            {
                name: 'Plank Hold',
                duration: '3 sets x 45 sec',
                intensity: 'moderate',
                instructions: 'Forearm plank, body straight, core engaged. Rest 30 sec between.',
            },
            {
                name: 'Cool-down',
                duration: '5 min',
                intensity: 'recovery',
                instructions: 'Full body stretching: quads, hamstrings, hip flexors, chest, shoulders. Hold each 30 seconds.',
            },
        ];

    return {
        id: generateId(),
        discipline: 'strength',
        title: focus === 'core' ? 'Core Strength' : 'Full Body Strength',
        description: focus === 'core'
            ? 'Build core stability for better swim, bike, and run performance'
            : 'Build overall strength to improve power and prevent injuries',
        totalDuration: duration,
        steps: exercises,
        tips: [
            'Quality over quantity - maintain good form throughout',
            'Breathe steadily, don\'t hold your breath',
            'Increase difficulty gradually over weeks',
        ],
    };
};

const createRestDay = (): Workout => {
    return {
        id: generateId(),
        discipline: 'rest',
        title: 'Rest Day',
        description: 'Recovery is when your body adapts and gets stronger',
        totalDuration: 0,
        steps: [
            {
                name: 'Active Recovery (Optional)',
                duration: '20-30 min',
                intensity: 'recovery',
                instructions: 'Very easy activity if desired: gentle walk, light stretching, yoga, or foam rolling. Listen to your body - if fatigued, complete rest is best.',
            },
            {
                name: 'Self-Care',
                duration: 'As needed',
                intensity: 'recovery',
                instructions: 'Prioritize sleep (8+ hours). Eat nutritious meals. Stay hydrated. Consider massage or compression. Mental recovery matters too!',
            },
        ],
        tips: [
            'Rest is not laziness - it\'s essential for improvement',
            'Monitor for signs of overtraining: persistent fatigue, elevated resting HR, poor sleep',
            'Use this time to prep gear and plan upcoming workouts',
        ],
    };
};

// ============================================
// Weekly Plan Generation
// ============================================

function getPhaseDistribution(totalWeeks: number): { base: number; build: number; peak: number; taper: number } {
    // Standard periodization percentages
    const basePercent = 0.35;
    const buildPercent = 0.35;
    const peakPercent = 0.15;
    const taperPercent = 0.15;

    let base = Math.max(2, Math.round(totalWeeks * basePercent));
    let build = Math.max(2, Math.round(totalWeeks * buildPercent));
    let peak = Math.max(1, Math.round(totalWeeks * peakPercent));
    let taper = Math.max(1, Math.round(totalWeeks * taperPercent));

    // Adjust to match total
    const sum = base + build + peak + taper;
    if (sum !== totalWeeks) {
        base += totalWeeks - sum;
    }

    return { base, build, peak, taper };
}

function getWeeklyVolume(weekNumber: number, totalWeeks: number, maxHours: number, phase: TrainingPhase): number {
    // Progressive build with recovery weeks every 4th week
    const isRecoveryWeek = weekNumber % 4 === 0;

    let volumeMultiplier: number;

    switch (phase) {
        case 'base':
            volumeMultiplier = 0.6 + (0.2 * (weekNumber / totalWeeks));
            break;
        case 'build':
            volumeMultiplier = 0.75 + (0.2 * (weekNumber / totalWeeks));
            break;
        case 'peak':
            volumeMultiplier = 0.95 + (0.05 * (weekNumber / totalWeeks));
            break;
        case 'taper':
            // Progressive reduction
            volumeMultiplier = 0.7 - (0.3 * (weekNumber / totalWeeks));
            break;
    }

    if (isRecoveryWeek && phase !== 'taper') {
        volumeMultiplier *= 0.7;
    }

    return Math.round(maxHours * volumeMultiplier * 60) / 60; // Round to nearest minute
}

function generateWeekWorkouts(
    phase: TrainingPhase,
    weeklyHours: number,
    raceDistance: RaceDistanceId,
    weekNumber: number,
    startDate: Date,
    disciplineSplit?: DisciplineSplit,
    strengthWeakness?: StrengthWeakness,
    preferredRestDays?: DayOfWeek[]
): TrainingDay[] {
    const days: TrainingDay[] = [];
    const minutesAvailable = weeklyHours * 60;

    // Use profile discipline split if available, otherwise defaults
    const baseSplit = disciplineSplit || { swim: 20, bike: 45, run: 35 };

    // Adjust split based on strength/weakness: give 5% extra to weakest discipline
    let swimPercent = baseSplit.swim / 100;
    let bikePercent = baseSplit.bike / 100;
    let runPercent = baseSplit.run / 100;

    if (strengthWeakness) {
        const weakBonus = 0.05;
        const strongReduction = 0.03;

        // Boost weakest
        if (strengthWeakness.weakest === 'swim') swimPercent += weakBonus;
        else if (strengthWeakness.weakest === 'bike') bikePercent += weakBonus;
        else if (strengthWeakness.weakest === 'run') runPercent += weakBonus;

        // Slightly reduce strongest
        if (strengthWeakness.strongest === 'swim') swimPercent -= strongReduction;
        else if (strengthWeakness.strongest === 'bike') bikePercent -= strongReduction;
        else if (strengthWeakness.strongest === 'run') runPercent -= strongReduction;
    }

    // Reserve 5% for strength
    const strengthPercent = 0.05;
    const totalDiscipline = swimPercent + bikePercent + runPercent;
    const scaleFactor = (1 - strengthPercent) / totalDiscipline;
    swimPercent *= scaleFactor;
    bikePercent *= scaleFactor;
    runPercent *= scaleFactor;

    // Weekly structure by phase
    interface DayPlan {
        workouts: Workout[];
    }

    const generateDay = (dayIndex: number): DayPlan => {
        const dayNumber = dayIndex; // 0 = Monday
        const workouts: Workout[] = [];

        // Longer races need more volume on key days
        const volumeMultiplier = raceDistance === 'full' ? 1.3 : raceDistance === 'half' ? 1.15 : 1;

        switch (dayNumber) {
            case 0: // Monday - Swim or Rest
                if (phase === 'taper') {
                    workouts.push(createSwimWorkout(Math.floor(minutesAvailable * 0.08), 'technique', phase));
                } else {
                    workouts.push(createSwimWorkout(Math.floor(minutesAvailable * swimPercent * 0.5), phase === 'base' ? 'technique' : 'intervals', phase));
                }
                break;

            case 1: // Tuesday - Bike Intervals
                if (phase === 'taper') {
                    workouts.push(createBikeWorkout(Math.floor(minutesAvailable * 0.1), 'endurance', phase));
                } else {
                    workouts.push(createBikeWorkout(Math.floor(minutesAvailable * bikePercent * 0.35), phase === 'base' ? 'endurance' : 'intervals', phase));
                }
                break;

            case 2: // Wednesday - Run + Strength
                if (phase === 'taper') {
                    workouts.push(createRunWorkout(Math.floor(minutesAvailable * 0.08), 'endurance', phase));
                } else {
                    workouts.push(createRunWorkout(Math.floor(minutesAvailable * runPercent * 0.4), phase === 'base' ? 'endurance' : 'tempo', phase));
                    workouts.push(createStrengthWorkout(Math.floor(minutesAvailable * strengthPercent), phase === 'base' ? 'full' : 'core'));
                }
                break;

            case 3: // Thursday - Swim
                if (phase === 'taper') {
                    workouts.push(createSwimWorkout(Math.floor(minutesAvailable * 0.06), 'endurance', phase));
                } else {
                    workouts.push(createSwimWorkout(Math.floor(minutesAvailable * swimPercent * 0.5), 'endurance', phase));
                }
                break;

            case 4: // Friday - Rest or Easy
                if (phase === 'build' || phase === 'peak') {
                    workouts.push(createRunWorkout(Math.floor(minutesAvailable * 0.08), 'endurance', phase));
                } else {
                    workouts.push(createRestDay());
                }
                break;

            case 5: // Saturday - Long Bike (with brick in build/peak)
                const bikeDuration = Math.floor(minutesAvailable * bikePercent * 0.65 * volumeMultiplier);
                if ((phase === 'build' || phase === 'peak') && weekNumber % 2 === 0) {
                    const runDuration = Math.floor(minutesAvailable * runPercent * 0.25);
                    workouts.push(createBrickWorkout(bikeDuration, runDuration, phase));
                } else if (phase === 'taper') {
                    workouts.push(createBikeWorkout(Math.floor(minutesAvailable * 0.15), 'endurance', phase));
                } else {
                    workouts.push(createBikeWorkout(bikeDuration, 'endurance', phase));
                }
                break;

            case 6: // Sunday - Long Run
                if (phase === 'taper') {
                    workouts.push(createRunWorkout(Math.floor(minutesAvailable * 0.1), 'endurance', phase));
                } else {
                    const runDuration = Math.floor(minutesAvailable * runPercent * 0.6 * volumeMultiplier);
                    workouts.push(createRunWorkout(runDuration, 'long', phase));
                }
                break;
        }

        return { workouts };
    };

    for (let i = 0; i < 7; i++) {
        const dayDate = addDays(startDate, i);
        const dayPlan = generateDay(i);
        const isRest = dayPlan.workouts.length === 1 && dayPlan.workouts[0].discipline === 'rest';

        days.push({
            date: formatLocalDate(dayDate),
            dayOfWeek: getDayOfWeek(dayDate),
            workouts: dayPlan.workouts,
            isRestDay: isRest,
        });
    }

    return adjustRestDays(days, preferredRestDays || []);
}

// ============================================
// Main Generator Function
// ============================================

export function generateTrainingPlan(config: RaceConfig, profile?: AthleteProfile): TrainingPlan {
    const today = new Date();
    const raceDate = parseLocalDate(config.raceDate);
    const totalWeeks = getWeeksBetween(today, raceDate);

    const phases = getPhaseDistribution(totalWeeks);
    const weeks: TrainingWeek[] = [];

    let currentWeek = 1;
    let weekStartDate = new Date(today);
    // Start on Monday of the CURRENT week
    const dayOfWeek = weekStartDate.getDay(); // 0 (Sun) to 6 (Sat)
    // If today is Monday(1), diff is 0. If Tuesday(2), diff is 1. Sun(0) -> 6.
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    weekStartDate = addDays(weekStartDate, -daysSinceMonday);

    const phaseOrder: TrainingPhase[] = ['base', 'build', 'peak', 'taper'];

    for (const phase of phaseOrder) {
        const phaseWeeks = phases[phase];
        const phaseFocus = {
            base: 'Building aerobic foundation and technique',
            build: 'Increasing intensity and race-specific fitness',
            peak: 'Maximum fitness and race simulation',
            taper: 'Recovery and sharpening for race day',
        };

        for (let phaseWeek = 1; phaseWeek <= phaseWeeks && currentWeek <= totalWeeks; phaseWeek++) {
            const weeklyHours = getWeeklyVolume(currentWeek, totalWeeks, config.maxWeeklyHours, phase);
            const days = generateWeekWorkouts(
                phase,
                weeklyHours,
                config.distance.id,
                currentWeek,
                weekStartDate,
                profile?.disciplineSplit,
                profile?.strengthWeakness,
                profile?.restDayPreferences
            );

            weeks.push({
                weekNumber: currentWeek,
                phase,
                phaseWeek,
                focus: phaseFocus[phase],
                totalHours: weeklyHours,
                days,
            });

            currentWeek++;
            weekStartDate = addDays(weekStartDate, 7);
        }
    }

    return {
        id: generateId(),
        createdAt: new Date().toISOString(),
        raceConfig: config,
        totalWeeks,
        phases,
        weeks,
    };
}
