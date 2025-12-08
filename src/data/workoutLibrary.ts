/**
 * Workout Library Data
 * Comprehensive triathlon workout database
 */

import type { LibraryWorkout } from '../types/workoutLibrary';

// ============================================
// Swim Workouts
// ============================================

export const SWIM_WORKOUTS: LibraryWorkout[] = [
    {
        id: 'swim-css-test',
        discipline: 'swim',
        category: 'test',
        title: 'CSS Test (Critical Swim Speed)',
        description: 'Determine your threshold pace for structured swim training',
        difficulty: 'intermediate',
        equipment: ['pool', 'stopwatch'],
        variations: [
            {
                id: 'swim-css-test-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: '400m easy freestyle with focus on form', targetHeartRateZone: 1 },
                    { name: 'Drill Set', duration: '5 min', intensity: 'easy', instructions: '4x50m drills: catch-up, fingertip drag, fist swim, normal', targetHeartRateZone: 1 },
                    { name: '400m Time Trial', duration: '8 min', intensity: 'threshold', instructions: 'All-out 400m effort. Record your time.', targetHeartRateZone: 4 },
                    { name: 'Recovery', duration: '5 min', intensity: 'recovery', instructions: 'Easy backstroke', targetHeartRateZone: 1 },
                    { name: '200m Time Trial', duration: '4 min', intensity: 'threshold', instructions: 'All-out 200m effort. Record your time.', targetHeartRateZone: 5 },
                    { name: 'Cool-down', duration: '13 min', intensity: 'recovery', instructions: 'Easy swim, stretch at wall', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['CSS = (400m time - 200m time) / 2 = your pace per 100m', 'Retest every 6-8 weeks to track progress'],
    },
    {
        id: 'swim-endurance-steady',
        discipline: 'swim',
        category: 'endurance',
        title: 'Steady State Endurance',
        description: 'Build aerobic base with continuous swimming',
        difficulty: 'beginner',
        equipment: ['pool'],
        variations: [
            {
                id: 'swim-endurance-steady-30',
                duration: 30,
                label: '30 min',
                steps: [
                    { name: 'Warm-up', duration: '5 min', intensity: 'easy', instructions: 'Easy freestyle, focus on breathing', targetHeartRateZone: 1 },
                    { name: 'Main Set', duration: '20 min', intensity: 'moderate', instructions: 'Continuous swim at conversational pace. Bilateral breathing every 3 strokes.', targetHeartRateZone: 2 },
                    { name: 'Cool-down', duration: '5 min', intensity: 'recovery', instructions: 'Easy backstroke', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'swim-endurance-steady-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '8 min', intensity: 'easy', instructions: 'Easy freestyle, focus on breathing', targetHeartRateZone: 1 },
                    { name: 'Main Set', duration: '30 min', intensity: 'moderate', instructions: 'Continuous swim at conversational pace. Bilateral breathing every 3 strokes.', targetHeartRateZone: 2 },
                    { name: 'Cool-down', duration: '7 min', intensity: 'recovery', instructions: 'Easy backstroke and stretching', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'swim-endurance-steady-60',
                duration: 60,
                label: '60 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy freestyle with drills', targetHeartRateZone: 1 },
                    { name: 'Main Set', duration: '42 min', intensity: 'moderate', instructions: 'Continuous swim at conversational pace. Bilateral breathing every 3 strokes. Brief wall touches OK.', targetHeartRateZone: 2 },
                    { name: 'Cool-down', duration: '8 min', intensity: 'recovery', instructions: 'Easy backstroke and stretching', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Focus on stroke efficiency over speed', 'Count strokes per length to monitor fatigue'],
    },
    {
        id: 'swim-intervals-100s',
        discipline: 'swim',
        category: 'intervals',
        title: '100m Repeats',
        description: 'Build speed and lactate threshold with structured intervals',
        difficulty: 'intermediate',
        equipment: ['pool', 'pace clock'],
        variations: [
            {
                id: 'swim-intervals-100s-30',
                duration: 30,
                label: '30 min',
                steps: [
                    { name: 'Warm-up', duration: '8 min', intensity: 'easy', instructions: '300m easy with drills', targetHeartRateZone: 1 },
                    { name: 'Main Set', duration: '18 min', intensity: 'threshold', instructions: '6x100m at CSS pace. 20 sec rest between each.', targetHeartRateZone: 4 },
                    { name: 'Cool-down', duration: '4 min', intensity: 'recovery', instructions: 'Easy swim', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'swim-intervals-100s-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: '400m easy with drills', targetHeartRateZone: 1 },
                    { name: 'Pre-set', duration: '5 min', intensity: 'moderate', instructions: '4x50m build to race pace', targetHeartRateZone: 2 },
                    { name: 'Main Set', duration: '24 min', intensity: 'threshold', instructions: '8x100m at CSS pace. 20 sec rest between each.', targetHeartRateZone: 4 },
                    { name: 'Cool-down', duration: '6 min', intensity: 'recovery', instructions: 'Easy swim and stretch', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Maintain consistent splits across all repeats', 'Focus on strong underwater push-off'],
    },
    {
        id: 'swim-technique-drills',
        discipline: 'swim',
        category: 'technique',
        title: 'Technique & Drill Focus',
        description: 'Improve swim efficiency with targeted drills',
        difficulty: 'beginner',
        equipment: ['pool', 'pull buoy', 'kickboard'],
        variations: [
            {
                id: 'swim-technique-drills-30',
                duration: 30,
                label: '30 min',
                steps: [
                    { name: 'Warm-up', duration: '5 min', intensity: 'easy', instructions: 'Easy freestyle', targetHeartRateZone: 1 },
                    { name: 'Catch-up Drill', duration: '5 min', intensity: 'easy', instructions: '4x50m catch-up drill. Touch hands before next stroke.', targetHeartRateZone: 1 },
                    { name: 'Fingertip Drag', duration: '5 min', intensity: 'easy', instructions: '4x50m fingertip drag drill. High elbow recovery.', targetHeartRateZone: 1 },
                    { name: 'Pull Buoy', duration: '8 min', intensity: 'moderate', instructions: '300m with pull buoy. Focus on rotation and catch.', targetHeartRateZone: 2 },
                    { name: 'Technique Swim', duration: '5 min', intensity: 'moderate', instructions: 'Apply drill focus to normal swimming', targetHeartRateZone: 2 },
                    { name: 'Cool-down', duration: '2 min', intensity: 'recovery', instructions: 'Easy backstroke', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Slow down to focus on form', 'Video yourself if possible to check technique'],
    },
    {
        id: 'swim-pyramid',
        discipline: 'swim',
        category: 'intervals',
        title: 'Pyramid Set',
        description: 'Build speed and endurance with ascending/descending intervals',
        difficulty: 'intermediate',
        equipment: ['pool', 'pace clock'],
        variations: [
            {
                id: 'swim-pyramid-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: '400m easy mix of strokes', targetHeartRateZone: 1 },
                    { name: 'Pyramid Up', duration: '12 min', intensity: 'threshold', instructions: '50m, 100m, 150m, 200m at CSS pace. 15 sec rest between.', targetHeartRateZone: 4 },
                    { name: 'Recovery', duration: '3 min', intensity: 'recovery', instructions: 'Easy backstroke', targetHeartRateZone: 1 },
                    { name: 'Pyramid Down', duration: '12 min', intensity: 'threshold', instructions: '200m, 150m, 100m, 50m at CSS pace. 15 sec rest between.', targetHeartRateZone: 4 },
                    { name: 'Cool-down', duration: '8 min', intensity: 'recovery', instructions: 'Easy swim with stretching', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Maintain consistent pace throughout', 'The 200m should feel manageable, not maximal'],
    },
    {
        id: 'swim-open-water-prep',
        discipline: 'swim',
        category: 'technique',
        title: 'Open Water Preparation',
        description: 'Practice sighting and race-specific skills',
        difficulty: 'intermediate',
        equipment: ['pool'],
        variations: [
            {
                id: 'swim-open-water-prep-40',
                duration: 40,
                label: '40 min',
                steps: [
                    { name: 'Warm-up', duration: '8 min', intensity: 'easy', instructions: 'Easy freestyle', targetHeartRateZone: 1 },
                    { name: 'Sighting Practice', duration: '10 min', intensity: 'moderate', instructions: '8x50m: Lift head to sight every 6 strokes. Look forward, not up.', targetHeartRateZone: 2 },
                    { name: 'Race Start Sim', duration: '8 min', intensity: 'intervals', instructions: '4x25m sprint from push-off, settle into pace for next 75m', targetHeartRateZone: 4 },
                    { name: 'Draft Practice', duration: '8 min', intensity: 'moderate', instructions: 'Swim close to lane line, practice navigation', targetHeartRateZone: 2 },
                    { name: 'Cool-down', duration: '6 min', intensity: 'recovery', instructions: 'Easy swimming', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Practice sighting without breaking rhythm', 'Simulate race-day goggles and cap'],
    },
];

// ============================================
// Bike Workouts
// ============================================

export const BIKE_WORKOUTS: LibraryWorkout[] = [
    {
        id: 'bike-ftp-test',
        discipline: 'bike',
        category: 'test',
        title: 'FTP Test (20 min)',
        description: 'Determine your Functional Threshold Power for training zones',
        difficulty: 'advanced',
        equipment: ['bike', 'power meter or trainer'],
        variations: [
            {
                id: 'bike-ftp-test-60',
                duration: 60,
                label: '60 min',
                steps: [
                    { name: 'Warm-up', duration: '15 min', intensity: 'easy', instructions: 'Easy spinning, gradually increase effort', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                    { name: 'Openers', duration: '5 min', intensity: 'moderate', instructions: '3x1 min at tempo with 1 min easy between', targetHeartRateZone: 3, cadence: '90-95 rpm' },
                    { name: 'Recovery', duration: '5 min', intensity: 'recovery', instructions: 'Easy spinning, prepare mentally', targetHeartRateZone: 1, cadence: '90 rpm' },
                    { name: '20 min FTP Test', duration: '20 min', intensity: 'threshold', instructions: 'Maximum sustainable effort for 20 min. Pace evenly - don\'t go out too hard!', targetHeartRateZone: 4, cadence: '85-95 rpm' },
                    { name: 'Cool-down', duration: '15 min', intensity: 'recovery', instructions: 'Very easy spinning', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                ],
            },
        ],
        tips: ['FTP = 20 min average power × 0.95', 'Be well-rested for accurate results', 'Retest every 6-8 weeks'],
    },
    {
        id: 'bike-endurance-base',
        discipline: 'bike',
        category: 'endurance',
        title: 'Aerobic Base Ride',
        description: 'Build aerobic foundation with steady-state riding',
        difficulty: 'beginner',
        equipment: ['bike'],
        variations: [
            {
                id: 'bike-endurance-base-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'Main Ride', duration: '30 min', intensity: 'moderate', instructions: 'Steady effort at conversational pace', targetHeartRateZone: 2, cadence: '85-95 rpm' },
                    { name: 'Cool-down', duration: '5 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
            {
                id: 'bike-endurance-base-60',
                duration: 60,
                label: '60 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'Main Ride', duration: '45 min', intensity: 'moderate', instructions: 'Steady effort at conversational pace', targetHeartRateZone: 2, cadence: '85-95 rpm' },
                    { name: 'Cool-down', duration: '5 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
            {
                id: 'bike-endurance-base-90',
                duration: 90,
                label: '90 min',
                steps: [
                    { name: 'Warm-up', duration: '15 min', intensity: 'easy', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'Main Ride', duration: '65 min', intensity: 'moderate', instructions: 'Steady effort. Fuel every 30 min.', targetHeartRateZone: 2, cadence: '85-95 rpm' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
            {
                id: 'bike-endurance-base-120',
                duration: 120,
                label: '2 hours',
                steps: [
                    { name: 'Warm-up', duration: '15 min', intensity: 'easy', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'Main Ride', duration: '95 min', intensity: 'moderate', instructions: 'Long steady effort. Fuel 30-60g carbs/hour.', targetHeartRateZone: 2, cadence: '85-95 rpm' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
        ],
        tips: ['Stay in zone 2 - resist the urge to push harder', 'Hydrate regularly'],
    },
    {
        id: 'bike-vo2max-intervals',
        discipline: 'bike',
        category: 'intervals',
        title: 'VO2max Intervals',
        description: 'High-intensity intervals to build aerobic capacity',
        difficulty: 'advanced',
        equipment: ['bike', 'power meter or heart rate monitor'],
        variations: [
            {
                id: 'bike-vo2max-intervals-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '12 min', intensity: 'easy', instructions: 'Progressive warm-up with 2x30 sec pickups', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                    { name: 'Interval Set', duration: '24 min', intensity: 'intervals', instructions: '5x3 min at 110-120% FTP. 3 min easy between each.', targetHeartRateZone: 5, cadence: '95-105 rpm' },
                    { name: 'Cool-down', duration: '9 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                ],
            },
            {
                id: 'bike-vo2max-intervals-60',
                duration: 60,
                label: '60 min',
                steps: [
                    { name: 'Warm-up', duration: '15 min', intensity: 'easy', instructions: 'Progressive warm-up with 3x30 sec pickups', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                    { name: 'Interval Set', duration: '36 min', intensity: 'intervals', instructions: '6x3 min at 110-120% FTP. 3 min easy between each.', targetHeartRateZone: 5, cadence: '95-105 rpm' },
                    { name: 'Cool-down', duration: '9 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                ],
            },
        ],
        tips: ['These should feel HARD - you should want to stop', 'Maintain high cadence throughout intervals'],
    },
    {
        id: 'bike-sweet-spot',
        discipline: 'bike',
        category: 'tempo',
        title: 'Sweet Spot Training',
        description: 'Build sustained power at 88-94% of FTP',
        difficulty: 'intermediate',
        equipment: ['bike', 'power meter or trainer'],
        variations: [
            {
                id: 'bike-sweet-spot-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Progressive warm-up', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'Sweet Spot 1', duration: '12 min', intensity: 'tempo', instructions: '12 min at 88-94% FTP', targetHeartRateZone: 3, cadence: '85-95 rpm' },
                    { name: 'Recovery', duration: '3 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90 rpm' },
                    { name: 'Sweet Spot 2', duration: '12 min', intensity: 'tempo', instructions: '12 min at 88-94% FTP', targetHeartRateZone: 3, cadence: '85-95 rpm' },
                    { name: 'Cool-down', duration: '8 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
            {
                id: 'bike-sweet-spot-60',
                duration: 60,
                label: '60 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Progressive warm-up', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'Sweet Spot 1', duration: '15 min', intensity: 'tempo', instructions: '15 min at 88-94% FTP', targetHeartRateZone: 3, cadence: '85-95 rpm' },
                    { name: 'Recovery', duration: '5 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90 rpm' },
                    { name: 'Sweet Spot 2', duration: '15 min', intensity: 'tempo', instructions: '15 min at 88-94% FTP', targetHeartRateZone: 3, cadence: '85-95 rpm' },
                    { name: 'Recovery', duration: '5 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90 rpm' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
        ],
        tips: ['Sweet spot should feel "comfortably hard"', 'Great for time-crunched athletes'],
    },
    {
        id: 'bike-hill-repeats',
        discipline: 'bike',
        category: 'intervals',
        title: 'Hill Repeats',
        description: 'Build climbing strength and power',
        difficulty: 'intermediate',
        equipment: ['bike with hills or trainer with incline'],
        variations: [
            {
                id: 'bike-hill-repeats-50',
                duration: 50,
                label: '50 min',
                steps: [
                    { name: 'Warm-up', duration: '15 min', intensity: 'easy', instructions: 'Easy spinning on flat or slight incline', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                    { name: 'Hill Repeats', duration: '25 min', intensity: 'threshold', instructions: '5x3 min climbing at threshold. Descend/recover 2 min between.', targetHeartRateZone: 4, cadence: '70-85 rpm' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy flat spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
        ],
        tips: ['Alternate seated and standing on climbs', 'Use lower cadence for strength focus'],
    },
    {
        id: 'bike-tempo-cruise',
        discipline: 'bike',
        category: 'tempo',
        title: 'Tempo Cruise',
        description: 'Sustained race-pace effort for endurance',
        difficulty: 'intermediate',
        equipment: ['bike'],
        variations: [
            {
                id: 'bike-tempo-cruise-60',
                duration: 60,
                label: '60 min',
                steps: [
                    { name: 'Warm-up', duration: '15 min', intensity: 'easy', instructions: 'Progressive warm-up', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'Tempo Block', duration: '35 min', intensity: 'tempo', instructions: 'Steady tempo at 76-90% FTP. Race simulation pace.', targetHeartRateZone: 3, cadence: '85-95 rpm' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
            {
                id: 'bike-tempo-cruise-90',
                duration: 90,
                label: '90 min',
                steps: [
                    { name: 'Warm-up', duration: '15 min', intensity: 'easy', instructions: 'Progressive warm-up', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'Tempo Block 1', duration: '25 min', intensity: 'tempo', instructions: 'Tempo at 76-90% FTP', targetHeartRateZone: 3, cadence: '85-95 rpm' },
                    { name: 'Active Recovery', duration: '5 min', intensity: 'easy', instructions: 'Easy spinning, hydrate', targetHeartRateZone: 1, cadence: '90 rpm' },
                    { name: 'Tempo Block 2', duration: '25 min', intensity: 'tempo', instructions: 'Tempo at 76-90% FTP', targetHeartRateZone: 3, cadence: '85-95 rpm' },
                    { name: 'Cool-down', duration: '20 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
        ],
        tips: ['Practice race nutrition during tempo blocks', 'Focus on aero position when safe'],
    },
    {
        id: 'bike-recovery',
        discipline: 'bike',
        category: 'recovery',
        title: 'Active Recovery Ride',
        description: 'Easy spinning to promote recovery',
        difficulty: 'beginner',
        equipment: ['bike'],
        variations: [
            {
                id: 'bike-recovery-30',
                duration: 30,
                label: '30 min',
                steps: [
                    { name: 'Easy Spin', duration: '30 min', intensity: 'recovery', instructions: 'Very easy spinning. Keep heart rate low. Resist the urge to push.', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
            {
                id: 'bike-recovery-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Easy Spin', duration: '45 min', intensity: 'recovery', instructions: 'Very easy spinning. Keep heart rate low. Focus on smooth pedaling.', targetHeartRateZone: 1, cadence: '90-100 rpm' },
                ],
            },
        ],
        tips: ['This should feel TOO easy', 'Great opportunity to work on pedaling technique'],
    },
    {
        id: 'bike-cadence-drills',
        discipline: 'bike',
        category: 'technique',
        title: 'Cadence & Efficiency Drills',
        description: 'Improve pedaling efficiency with cadence work',
        difficulty: 'beginner',
        equipment: ['bike with cadence sensor'],
        variations: [
            {
                id: 'bike-cadence-drills-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy spinning at natural cadence', targetHeartRateZone: 1, cadence: '85-90 rpm' },
                    { name: 'High Cadence', duration: '5 min', intensity: 'moderate', instructions: 'Light gear, spin at 100-110 rpm', targetHeartRateZone: 2, cadence: '100-110 rpm' },
                    { name: 'Low Cadence', duration: '5 min', intensity: 'moderate', instructions: 'Bigger gear, grind at 60-70 rpm', targetHeartRateZone: 2, cadence: '60-70 rpm' },
                    { name: 'Normal', duration: '5 min', intensity: 'moderate', instructions: 'Return to 85-95 rpm', targetHeartRateZone: 2, cadence: '85-95 rpm' },
                    { name: 'Single Leg', duration: '6 min', intensity: 'easy', instructions: '3x1 min each leg, unclip other foot', targetHeartRateZone: 1, cadence: '80-90 rpm' },
                    { name: 'Spin-ups', duration: '6 min', intensity: 'moderate', instructions: '4x30 sec build from 90 to max sustainable cadence', targetHeartRateZone: 2, cadence: '90-120 rpm' },
                    { name: 'Cool-down', duration: '8 min', intensity: 'recovery', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '90-95 rpm' },
                ],
            },
        ],
        tips: ['Focus on smooth circles, not mashing', 'Eliminate dead spots in pedal stroke'],
    },
];

// ============================================
// Run Workouts
// ============================================

export const RUN_WORKOUTS: LibraryWorkout[] = [
    {
        id: 'run-easy-recovery',
        discipline: 'run',
        category: 'recovery',
        title: 'Easy Recovery Run',
        description: 'Active recovery with very easy effort',
        difficulty: 'beginner',
        equipment: [],
        variations: [
            {
                id: 'run-easy-recovery-20',
                duration: 20,
                label: '20 min',
                steps: [
                    { name: 'Easy Run', duration: '20 min', intensity: 'easy', instructions: 'Very easy pace, conversational. Walk breaks OK.', targetHeartRateZone: 1, targetPace: 'Easy' },
                ],
            },
            {
                id: 'run-easy-recovery-30',
                duration: 30,
                label: '30 min',
                steps: [
                    { name: 'Walk/Jog Warm-up', duration: '3 min', intensity: 'recovery', instructions: 'Brisk walk to easy jog', targetHeartRateZone: 1 },
                    { name: 'Easy Run', duration: '24 min', intensity: 'easy', instructions: 'Very easy pace, conversational', targetHeartRateZone: 1, targetPace: 'Easy' },
                    { name: 'Cool-down Walk', duration: '3 min', intensity: 'recovery', instructions: 'Walk and stretch', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['This should feel TOO easy', 'Great for recovery after hard sessions'],
    },
    {
        id: 'run-aerobic-base',
        discipline: 'run',
        category: 'endurance',
        title: 'Aerobic Base Run',
        description: 'Build running endurance at moderate effort',
        difficulty: 'beginner',
        equipment: [],
        variations: [
            {
                id: 'run-aerobic-base-30',
                duration: 30,
                label: '30 min',
                steps: [
                    { name: 'Warm-up', duration: '5 min', intensity: 'easy', instructions: 'Easy jog, dynamic stretches', targetHeartRateZone: 1 },
                    { name: 'Aerobic Run', duration: '22 min', intensity: 'moderate', instructions: 'Steady effort, can speak in sentences', targetHeartRateZone: 2, targetPace: 'Moderate' },
                    { name: 'Cool-down', duration: '3 min', intensity: 'recovery', instructions: 'Easy jog to walk', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'run-aerobic-base-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '8 min', intensity: 'easy', instructions: 'Easy jog, dynamic stretches', targetHeartRateZone: 1 },
                    { name: 'Aerobic Run', duration: '32 min', intensity: 'moderate', instructions: 'Steady effort, can speak in sentences', targetHeartRateZone: 2, targetPace: 'Moderate' },
                    { name: 'Cool-down', duration: '5 min', intensity: 'recovery', instructions: 'Easy jog to walk, stretch', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'run-aerobic-base-60',
                duration: 60,
                label: '60 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy jog, dynamic stretches', targetHeartRateZone: 1 },
                    { name: 'Aerobic Run', duration: '42 min', intensity: 'moderate', instructions: 'Steady effort at conversational pace', targetHeartRateZone: 2, targetPace: 'Moderate' },
                    { name: 'Cool-down', duration: '8 min', intensity: 'recovery', instructions: 'Easy jog to walk, full stretch routine', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Stay in zone 2 - build the aerobic engine', 'High cadence (170-180 spm) reduces injury risk'],
    },
    {
        id: 'run-tempo',
        discipline: 'run',
        category: 'tempo',
        title: 'Tempo Run',
        description: 'Build lactate threshold with sustained hard effort',
        difficulty: 'intermediate',
        equipment: [],
        variations: [
            {
                id: 'run-tempo-30',
                duration: 30,
                label: '30 min',
                steps: [
                    { name: 'Warm-up', duration: '8 min', intensity: 'easy', instructions: 'Easy jog with 4x20 sec strides', targetHeartRateZone: 1 },
                    { name: 'Tempo', duration: '15 min', intensity: 'tempo', instructions: 'Comfortably hard - can speak a few words', targetHeartRateZone: 3, targetPace: '10K Race Pace' },
                    { name: 'Cool-down', duration: '7 min', intensity: 'recovery', instructions: 'Easy jog to walk', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'run-tempo-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy jog with 4x20 sec strides', targetHeartRateZone: 1 },
                    { name: 'Tempo', duration: '25 min', intensity: 'tempo', instructions: 'Comfortably hard - can speak a few words', targetHeartRateZone: 3, targetPace: '10K Race Pace' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy jog to walk, stretch', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Start conservative - finish strong', 'This is a controlled hard effort, not a race'],
    },
    {
        id: 'run-track-intervals',
        discipline: 'run',
        category: 'intervals',
        title: 'Track Intervals (400m)',
        description: 'Build speed and running economy with short intervals',
        difficulty: 'intermediate',
        equipment: ['track or measured path'],
        variations: [
            {
                id: 'run-track-intervals-35',
                duration: 35,
                label: '35 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy jog with dynamic drills', targetHeartRateZone: 1 },
                    { name: 'Strides', duration: '3 min', intensity: 'moderate', instructions: '4x80m strides with walk back', targetHeartRateZone: 2 },
                    { name: 'Intervals', duration: '15 min', intensity: 'intervals', instructions: '6x400m at 5K pace. 90 sec jog recovery.', targetHeartRateZone: 4, targetPace: '5K Pace' },
                    { name: 'Cool-down', duration: '7 min', intensity: 'recovery', instructions: 'Easy jog, walk, stretch', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'run-track-intervals-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Warm-up', duration: '12 min', intensity: 'easy', instructions: 'Easy jog with dynamic drills', targetHeartRateZone: 1 },
                    { name: 'Strides', duration: '3 min', intensity: 'moderate', instructions: '4x80m strides with walk back', targetHeartRateZone: 2 },
                    { name: 'Intervals', duration: '20 min', intensity: 'intervals', instructions: '8x400m at 5K pace. 90 sec jog recovery.', targetHeartRateZone: 4, targetPace: '5K Pace' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy jog, walk, stretch', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Consistent splits are key', 'Focus on running relaxed at speed'],
    },
    {
        id: 'run-fartlek',
        discipline: 'run',
        category: 'intervals',
        title: 'Fartlek (Speed Play)',
        description: 'Unstructured speed work with natural terrain changes',
        difficulty: 'intermediate',
        equipment: [],
        variations: [
            {
                id: 'run-fartlek-40',
                duration: 40,
                label: '40 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy jog', targetHeartRateZone: 1 },
                    { name: 'Fartlek', duration: '22 min', intensity: 'intervals', instructions: 'Alternate: 2 min hard / 2 min easy for 5 rounds, then 2 min steady', targetHeartRateZone: 3 },
                    { name: 'Cool-down', duration: '8 min', intensity: 'recovery', instructions: 'Easy jog to walk', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Use landmarks for surges', 'Keep "easy" truly easy'],
    },
    {
        id: 'run-long',
        discipline: 'run',
        category: 'endurance',
        title: 'Long Run',
        description: 'Build endurance with extended aerobic running',
        difficulty: 'intermediate',
        equipment: [],
        variations: [
            {
                id: 'run-long-60',
                duration: 60,
                label: '60 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Start very easy', targetHeartRateZone: 1 },
                    { name: 'Long Run', duration: '42 min', intensity: 'moderate', instructions: 'Steady conversational pace. Walk breaks OK.', targetHeartRateZone: 2, targetPace: 'Easy to Moderate' },
                    { name: 'Cool-down', duration: '8 min', intensity: 'recovery', instructions: 'Easy jog to walk', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'run-long-75',
                duration: 75,
                label: '75 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Start very easy', targetHeartRateZone: 1 },
                    { name: 'Long Run', duration: '55 min', intensity: 'moderate', instructions: 'Steady conversational pace. Practice race nutrition.', targetHeartRateZone: 2, targetPace: 'Easy to Moderate' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy jog to walk, stretch well', targetHeartRateZone: 1 },
                ],
            },
            {
                id: 'run-long-90',
                duration: 90,
                label: '90 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Start very easy', targetHeartRateZone: 1 },
                    { name: 'Long Run', duration: '70 min', intensity: 'moderate', instructions: 'Steady effort. Fuel every 30-45 min. Stay hydrated.', targetHeartRateZone: 2, targetPace: 'Easy to Moderate' },
                    { name: 'Cool-down', duration: '10 min', intensity: 'recovery', instructions: 'Easy jog to walk, full stretch routine', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Run the first half slower than you think', 'Practice race-day nutrition'],
    },
    {
        id: 'run-hill-repeats',
        discipline: 'run',
        category: 'intervals',
        title: 'Hill Repeats',
        description: 'Build running strength and power on inclines',
        difficulty: 'intermediate',
        equipment: ['hill or treadmill with incline'],
        variations: [
            {
                id: 'run-hill-repeats-35',
                duration: 35,
                label: '35 min',
                steps: [
                    { name: 'Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy jog on flat ground', targetHeartRateZone: 1 },
                    { name: 'Hill Repeats', duration: '18 min', intensity: 'threshold', instructions: '6x60 sec uphill at hard effort. Jog down recovery.', targetHeartRateZone: 4 },
                    { name: 'Cool-down', duration: '7 min', intensity: 'recovery', instructions: 'Easy jog on flat, stretch', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Drive knees and arms on the uphill', 'Control the descent - don\'t pound'],
    },
    {
        id: 'run-progression',
        discipline: 'run',
        category: 'tempo',
        title: 'Progression Run',
        description: 'Start easy and progressively increase pace',
        difficulty: 'intermediate',
        equipment: [],
        variations: [
            {
                id: 'run-progression-40',
                duration: 40,
                label: '40 min',
                steps: [
                    { name: 'Easy', duration: '15 min', intensity: 'easy', instructions: 'Very easy pace', targetHeartRateZone: 1, targetPace: 'Easy' },
                    { name: 'Moderate', duration: '12 min', intensity: 'moderate', instructions: 'Pick up to aerobic pace', targetHeartRateZone: 2, targetPace: 'Moderate' },
                    { name: 'Tempo', duration: '8 min', intensity: 'tempo', instructions: 'Push to tempo effort', targetHeartRateZone: 3, targetPace: 'Tempo' },
                    { name: 'Cool-down', duration: '5 min', intensity: 'recovery', instructions: 'Easy jog to walk', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['The finish should feel like a race effort', 'Great for race simulation'],
    },
];

// ============================================
// Brick Workouts
// ============================================

export const BRICK_WORKOUTS: LibraryWorkout[] = [
    {
        id: 'brick-short',
        discipline: 'brick',
        category: 'tempo',
        title: 'Short Brick',
        description: 'Quick bike-to-run transition practice',
        difficulty: 'beginner',
        equipment: ['bike', 'running shoes'],
        variations: [
            {
                id: 'brick-short-45',
                duration: 45,
                label: '45 min',
                steps: [
                    { name: 'Bike Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                    { name: 'Bike Main', duration: '20 min', intensity: 'moderate', instructions: 'Steady effort, last 5 min increase cadence', targetHeartRateZone: 2, cadence: '90-100 rpm' },
                    { name: 'Transition', duration: '2 min', intensity: 'recovery', instructions: 'Quick change to run gear', targetHeartRateZone: 1 },
                    { name: 'Run', duration: '13 min', intensity: 'moderate', instructions: 'Start easy, find your rhythm by 5 min', targetHeartRateZone: 2 },
                ],
            },
        ],
        tips: ['Practice fast transitions', 'Expect heavy legs - they will come around'],
    },
    {
        id: 'brick-race-sim',
        discipline: 'brick',
        category: 'tempo',
        title: 'Race Simulation Brick',
        description: 'Full race-pace bike and run simulation',
        difficulty: 'advanced',
        equipment: ['bike', 'running shoes', 'race nutrition'],
        variations: [
            {
                id: 'brick-race-sim-90',
                duration: 90,
                label: '90 min',
                steps: [
                    { name: 'Bike Warm-up', duration: '10 min', intensity: 'easy', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                    { name: 'Bike Race Pace', duration: '45 min', intensity: 'tempo', instructions: 'Race effort. Practice aero position. Fuel as in race.', targetHeartRateZone: 3, cadence: '85-95 rpm' },
                    { name: 'Bike Wind-down', duration: '5 min', intensity: 'easy', instructions: 'High cadence spin-out', targetHeartRateZone: 1, cadence: '95-100 rpm' },
                    { name: 'T2', duration: '2 min', intensity: 'recovery', instructions: 'Fast transition', targetHeartRateZone: 1 },
                    { name: 'Run Build', duration: '8 min', intensity: 'moderate', instructions: 'Patient build into pace', targetHeartRateZone: 2 },
                    { name: 'Run Race Pace', duration: '18 min', intensity: 'tempo', instructions: 'Settle into race effort', targetHeartRateZone: 3 },
                    { name: 'Cool-down', duration: '5 min', intensity: 'recovery', instructions: 'Walk/jog', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['Practice everything as you would race', 'Test your nutrition strategy'],
    },
    {
        id: 'brick-long',
        discipline: 'brick',
        category: 'endurance',
        title: 'Long Endurance Brick',
        description: 'Extended bike-to-run for half/full distance prep',
        difficulty: 'advanced',
        equipment: ['bike', 'running shoes', 'nutrition'],
        variations: [
            {
                id: 'brick-long-150',
                duration: 150,
                label: '2.5 hours',
                steps: [
                    { name: 'Bike Warm-up', duration: '15 min', intensity: 'easy', instructions: 'Easy spinning', targetHeartRateZone: 1, cadence: '85-95 rpm' },
                    { name: 'Bike Endurance', duration: '90 min', intensity: 'moderate', instructions: 'Steady aerobic effort. Fuel 30-60g carbs/hour.', targetHeartRateZone: 2, cadence: '85-95 rpm' },
                    { name: 'Bike Spin-out', duration: '5 min', intensity: 'easy', instructions: 'High cadence to prep for run', targetHeartRateZone: 1, cadence: '95-100 rpm' },
                    { name: 'T2', duration: '3 min', intensity: 'recovery', instructions: 'Transition practice', targetHeartRateZone: 1 },
                    { name: 'Run', duration: '35 min', intensity: 'moderate', instructions: 'Start easy, settle into steady effort', targetHeartRateZone: 2 },
                    { name: 'Cool-down', duration: '5 min', intensity: 'recovery', instructions: 'Easy walk', targetHeartRateZone: 1 },
                ],
            },
        ],
        tips: ['This is about time on feet, not speed', 'Recovery is crucial after long bricks'],
    },
];

// ============================================
// Strength Workouts
// ============================================

export const STRENGTH_WORKOUTS: LibraryWorkout[] = [
    {
        id: 'strength-core',
        discipline: 'strength',
        category: 'strength',
        title: 'Core Circuit',
        description: 'Build core stability for all three disciplines',
        difficulty: 'beginner',
        equipment: ['mat'],
        variations: [
            {
                id: 'strength-core-20',
                duration: 20,
                label: '20 min',
                steps: [
                    { name: 'Plank', duration: '3x45 sec', intensity: 'moderate', instructions: 'Forearm plank, hold with body straight' },
                    { name: 'Side Plank', duration: '2x30 sec/side', intensity: 'moderate', instructions: 'Side plank each side' },
                    { name: 'Dead Bug', duration: '3x10/side', intensity: 'moderate', instructions: 'Lie on back, opposite arm/leg extension' },
                    { name: 'Bird Dog', duration: '3x10/side', intensity: 'moderate', instructions: 'On all fours, opposite arm/leg extension' },
                    { name: 'Glute Bridge', duration: '3x15', intensity: 'moderate', instructions: 'Drive hips up, squeeze glutes' },
                    { name: 'Stretch', duration: '5 min', intensity: 'recovery', instructions: 'Cat-cow, child\'s pose' },
                ],
            },
        ],
        tips: ['Quality over quantity', 'Breathe steadily throughout'],
    },
    {
        id: 'strength-runner',
        discipline: 'strength',
        category: 'strength',
        title: 'Runner\'s Strength',
        description: 'Build running-specific strength and injury prevention',
        difficulty: 'intermediate',
        equipment: ['mat', 'optional dumbbells'],
        variations: [
            {
                id: 'strength-runner-30',
                duration: 30,
                label: '30 min',
                steps: [
                    { name: 'Warm-up', duration: '5 min', intensity: 'easy', instructions: 'Dynamic stretches, leg swings' },
                    { name: 'Squats', duration: '3x12', intensity: 'moderate', instructions: 'Bodyweight or goblet squats' },
                    { name: 'Lunges', duration: '3x10/leg', intensity: 'moderate', instructions: 'Forward or reverse lunges' },
                    { name: 'Single-Leg Deadlift', duration: '3x8/leg', intensity: 'moderate', instructions: 'Balance on one leg, hinge forward' },
                    { name: 'Calf Raises', duration: '3x15', intensity: 'moderate', instructions: 'Single leg for progression' },
                    { name: 'Hip Thrusts', duration: '3x12', intensity: 'moderate', instructions: 'Back on bench or floor' },
                    { name: 'Stretch', duration: '5 min', intensity: 'recovery', instructions: 'Hip flexors, quads, calves' },
                ],
            },
        ],
        tips: ['Focus on single-leg strength', 'Builds injury resistance'],
    },
    {
        id: 'strength-full-body',
        discipline: 'strength',
        category: 'strength',
        title: 'Full Body Strength',
        description: 'Comprehensive strength session for overall fitness',
        difficulty: 'intermediate',
        equipment: ['mat', 'dumbbells or resistance bands'],
        variations: [
            {
                id: 'strength-full-body-40',
                duration: 40,
                label: '40 min',
                steps: [
                    { name: 'Warm-up', duration: '5 min', intensity: 'easy', instructions: 'Jumping jacks, arm circles, leg swings' },
                    { name: 'Squats', duration: '3x12', intensity: 'moderate', instructions: 'Goblet or barbell squats' },
                    { name: 'Push-ups', duration: '3x12', intensity: 'moderate', instructions: 'Modify on knees if needed' },
                    { name: 'Rows', duration: '3x12', intensity: 'moderate', instructions: 'Dumbbell or band rows' },
                    { name: 'Lunges', duration: '3x10/leg', intensity: 'moderate', instructions: 'Walking or stationary' },
                    { name: 'Plank', duration: '3x45 sec', intensity: 'moderate', instructions: 'Forearm plank' },
                    { name: 'Shoulder Press', duration: '3x10', intensity: 'moderate', instructions: 'Dumbbells or bands' },
                    { name: 'Stretch', duration: '5 min', intensity: 'recovery', instructions: 'Full body stretch routine' },
                ],
            },
        ],
        tips: ['Rest 60-90 sec between sets', 'Increase weight progressively'],
    },
    {
        id: 'strength-swim-dryland',
        discipline: 'strength',
        category: 'strength',
        title: 'Swimmer\'s Dryland',
        description: 'Build swim-specific strength out of the pool',
        difficulty: 'intermediate',
        equipment: ['mat', 'resistance band'],
        variations: [
            {
                id: 'strength-swim-dryland-25',
                duration: 25,
                label: '25 min',
                steps: [
                    { name: 'Warm-up', duration: '4 min', intensity: 'easy', instructions: 'Arm circles, shoulder stretches' },
                    { name: 'Band Pull-aparts', duration: '3x15', intensity: 'moderate', instructions: 'Hold band at shoulder height, pull apart' },
                    { name: 'YTW Raises', duration: '2 sets', intensity: 'moderate', instructions: 'Y, T, and W positions face down' },
                    { name: 'Push-ups', duration: '3x12', intensity: 'moderate', instructions: 'Focus on full range of motion' },
                    { name: 'Plank with Reach', duration: '3x8/side', intensity: 'moderate', instructions: 'Plank, extend one arm forward' },
                    { name: 'Band Lat Pulldown', duration: '3x12', intensity: 'moderate', instructions: 'Anchor band high, pull down' },
                    { name: 'Stretch', duration: '4 min', intensity: 'recovery', instructions: 'Shoulder and lat stretches' },
                ],
            },
        ],
        tips: ['Focus on shoulder stabilization', 'Prevent swimmer\'s shoulder'],
    },
];

// ============================================
// Combined Library Export
// ============================================

export const WORKOUT_LIBRARY: LibraryWorkout[] = [
    ...SWIM_WORKOUTS,
    ...BIKE_WORKOUTS,
    ...RUN_WORKOUTS,
    ...BRICK_WORKOUTS,
    ...STRENGTH_WORKOUTS,
];

/**
 * Get workouts filtered by discipline
 */
export function getWorkoutsByDiscipline(discipline: LibraryWorkout['discipline']): LibraryWorkout[] {
    return WORKOUT_LIBRARY.filter(workout => workout.discipline === discipline);
}

/**
 * Get workouts filtered by category
 */
export function getWorkoutsByCategory(category: LibraryWorkout['category']): LibraryWorkout[] {
    return WORKOUT_LIBRARY.filter(workout => workout.category === category);
}

/**
 * Find a specific workout by ID
 */
export function getWorkoutById(id: string): LibraryWorkout | undefined {
    return WORKOUT_LIBRARY.find(workout => workout.id === id);
}

/**
 * Get a specific variation from a library workout
 */
export function getVariationById(workoutId: string, variationId: string) {
    const workout = getWorkoutById(workoutId);
    return workout?.variations.find(v => v.id === variationId);
}
