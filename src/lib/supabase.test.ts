/**
 * Tests for Supabase client configuration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Supabase Client', () => {
    const originalEnv = { ...import.meta.env };

    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        // Restore original env
        Object.assign(import.meta.env, originalEnv);
    });

    it('should create a supabase client when env vars are present', async () => {
        // Set valid env vars
        import.meta.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
        import.meta.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';

        // Import the module fresh
        const { supabase } = await import('../lib/supabase');

        expect(supabase).toBeDefined();
    });

    it('should throw an error when VITE_SUPABASE_URL is missing', async () => {
        // Remove URL
        import.meta.env.VITE_SUPABASE_URL = '';
        import.meta.env.VITE_SUPABASE_ANON_KEY = 'test-key';

        await expect(import('../lib/supabase')).rejects.toThrow(
            'Missing Supabase environment variables'
        );
    });

    it('should throw an error when VITE_SUPABASE_ANON_KEY is missing', async () => {
        // Remove key
        import.meta.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
        import.meta.env.VITE_SUPABASE_ANON_KEY = '';

        await expect(import('../lib/supabase')).rejects.toThrow(
            'Missing Supabase environment variables'
        );
    });
});
