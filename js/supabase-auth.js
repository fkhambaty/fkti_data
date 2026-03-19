/**
 * Supabase Auth — session, login, signup, OTP verify, profile.
 * Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project values.
 */
(function () {
    'use strict';

    var SUPABASE_URL = window.SUPABASE_URL || '';
    var SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn('Supabase credentials not set. Set window.SUPABASE_URL and window.SUPABASE_ANON_KEY (e.g. in auth pages).');
    }

    var supabase = null;
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    function getSupabase() {
        return supabase;
    }

    function getSession() {
        return supabase ? supabase.auth.getSession() : Promise.resolve({ data: { session: null }, error: null });
    }

    function getUser() {
        return supabase ? supabase.auth.getUser() : Promise.resolve({ data: { user: null }, error: null });
    }

    function onAuthStateChange(callback) {
        if (!supabase) return function () {};
        var sub = supabase.auth.onAuthStateChange(function (event, session) {
            callback(event, session);
        });
        return function () {
            if (sub && sub.unsubscribe) sub.unsubscribe();
        };
    }

    function signInWithPassword(email, password) {
        if (!supabase) return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
        return supabase.auth.signInWithPassword({ email: email, password: password });
    }

    function signUp(email, password, options) {
        if (!supabase) return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
        var redirectTo = (typeof window !== 'undefined' && window.location && window.location.origin)
            ? window.location.origin + '/auth/confirm.html'
            : '';
        return supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: redirectTo,
                data: (options && options.data) || {}
            }
        });
    }

    function signInWithOtp(email) {
        if (!supabase) return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
        return supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: true,
                data: {}
            }
        });
    }

    function verifyOtp(email, token) {
        if (!supabase) return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
        return supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'email'
        });
    }

    function updateUserPassword(password) {
        if (!supabase) return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
        return supabase.auth.updateUser({ password: password });
    }

    function updateUserMetadata(meta) {
        if (!supabase) return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
        return supabase.auth.updateUser({ data: meta });
    }

    function signOut() {
        if (!supabase) return Promise.resolve({ error: null });
        return supabase.auth.signOut();
    }

    function getProfile(userId) {
        if (!supabase) return Promise.resolve({ data: null, error: null });
        return supabase.from('profiles').select('*').eq('id', userId).single();
    }

    function upsertProfile(profile) {
        if (!supabase) return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
        return supabase.from('profiles').upsert(profile, { onConflict: 'id' });
    }

    function ensureProfile(user) {
        if (!supabase || !user || !user.id) return Promise.resolve();
        return supabase.from('profiles').select('id').eq('id', user.id).single().then(function (res) {
            if (res.data) return;
            return supabase.from('profiles').insert({
                id: user.id,
                email: user.email || null,
                full_name: (user.user_metadata && user.user_metadata.full_name) || null,
                subscription_status: 'free',
                updated_at: new Date().toISOString()
            });
        }).catch(function () {});
    }

    if (supabase) {
        supabase.auth.onAuthStateChange(function (event, session) {
            if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session && session.user) {
                ensureProfile(session.user);
            }
        });
    }

    window.FKTI_Auth = {
        getSupabase: getSupabase,
        getSession: getSession,
        getUser: getUser,
        onAuthStateChange: onAuthStateChange,
        signUp: signUp,
        signInWithPassword: signInWithPassword,
        signInWithOtp: signInWithOtp,
        verifyOtp: verifyOtp,
        updateUserPassword: updateUserPassword,
        updateUserMetadata: updateUserMetadata,
        signOut: signOut,
        getProfile: getProfile,
        upsertProfile: upsertProfile
    };
})();
