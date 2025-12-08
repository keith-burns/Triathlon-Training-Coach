/**
 * Supabase Client Configuration
 * Triathlon Training Coach
 */

import { createClient } from '@supabase/supabase-js';

// These are safe to expose - they're designed for client-side use
// Row Level Security in Supabase protects the data
const supabaseUrl = 'https://xkqzswbzgqvpzsvbsizf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrcXpzd2J6Z3F2cHpzdmJzaXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMjAxMzMsImV4cCI6MjA4MDY5NjEzM30.lM4CEBc1bkpCQZdeiZxqm75GchleZAu2qKmwG4RUxro';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
