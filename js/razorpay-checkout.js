/**
 * Razorpay Checkout for Pro subscription.
 * Requires: window.RAZORPAY_KEY_ID, window.SUPABASE_URL, window.SUPABASE_ANON_KEY,
 * and window.FKTI_Auth.getSession() (supabase-auth.js).
 * Call FKTI_RazorpayCheckout.openProCheckout() when user clicks Upgrade to Pro.
 */
(function () {
    'use strict';

    function getBasePath() {
        if (window.FKTI_BASE_URL) return window.FKTI_BASE_URL.replace(/\/$/, '');
        var path = window.location.pathname || '';
        var parts = path.split('/').filter(Boolean);
        var reserved = ['auth', 'css', 'js', 'api'];
        if (parts.length === 0 || reserved.indexOf(parts[0]) !== -1) return '';
        if (parts.length > 1) return '/' + parts[0];
        return '';
    }

    function resolveUrl(relative) {
        var base = getBasePath();
        return base ? base + '/' + relative.replace(/^\//, '') : relative;
    }

    function openProCheckout() {
        var keyId = window.RAZORPAY_KEY_ID;
        var supabaseUrl = (window.SUPABASE_URL || '').replace(/\/$/, '');
        var auth = window.FKTI_Auth;

        if (!keyId) {
            fallbackToPaymentLink();
            return;
        }

        if (!auth || !auth.getSession) {
            window.location.href = resolveUrl('auth/login.html') + '?returnTo=' + encodeURIComponent(window.location.href);
            return;
        }

        auth.getSession().then(function (res) {
            var session = res.data && res.data.session;
            if (!session) {
                window.location.href = resolveUrl('auth/login.html') + '?returnTo=' + encodeURIComponent(window.location.href);
                return;
            }

            var user = session.user;
            var userId = user.id;
            var email = user.email || '';
            var name = (user.user_metadata && user.user_metadata.full_name) || email.split('@')[0] || '';
            var contact = (user.user_metadata && (user.user_metadata.phone || user.user_metadata.country_code))
                ? (user.user_metadata.country_code || '') + (user.user_metadata.phone || '')
                : '';

            var origin = window.location.origin || '';
            var isSecure = origin.indexOf('https://') === 0;
            var profilePath = resolveUrl('auth/profile.html');
            var absProfile = (profilePath.indexOf('/') === 0 ? profilePath : '/' + profilePath);
            var callbackUrl = isSecure ? (origin + absProfile + '?subscription=success') : ('https://datafordummies.in' + absProfile + '?subscription=success');

            if (supabaseUrl && supabaseUrl.indexOf('supabase') !== -1) {
                fetch(supabaseUrl + '/functions/v1/create-subscription', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + session.access_token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: userId })
                })
                    .then(function (r) {
                        return r.text().then(function (text) {
                            var data;
                            try { data = text ? JSON.parse(text) : {}; } catch (e) { data = {}; }
                            return { ok: r.ok, status: r.status, data: data, text: text };
                        });
                    })
                    .then(function (result) {
                        var data = result.data;
                        if (result.ok && data.subscription_id) {
                            openRazorpay(keyId, data.subscription_id, name, email, contact, callbackUrl, userId);
                        } else {
                            var msg = (data && data.error) ? data.error : 'Could not start subscription. Please try again later or contact support.';
                            showSubscriptionError(msg);
                        }
                    })
                    .catch(function (err) {
                        showSubscriptionError(err && err.message ? err.message : 'Could not start subscription. Please check your connection and try again.');
                    });
            } else {
                showSubscriptionError('Subscription service not configured. Please try again later.');
            }
        });
    }

    function fallbackToPaymentLink() {
        var link = window.RAZORPAY_SUBSCRIPTION_LINK || '';
        if (link) {
            window.location.href = link;
        } else {
            window.location.href = resolveUrl('auth/profile.html');
        }
    }

    function showSubscriptionError(message) {
        var goProfile = resolveUrl('auth/profile.html') + '?error=subscription_unavailable' + (message ? '&msg=' + encodeURIComponent(message) : '');
        window.location.href = goProfile;
    }

    function openRazorpay(keyId, subscriptionId, name, email, contact, callbackUrl, userId) {
        if (typeof Razorpay === 'undefined') {
            var s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.async = true;
            document.head.appendChild(s);
            s.onload = function () {
                doOpen();
            };
        } else {
            doOpen();
        }

        function doOpen() {
            var options = {
                key: keyId,
                subscription_id: subscriptionId,
                name: 'Data For Dummies',
                description: 'Pro — ₹499/month',
                image: window.location.origin + '/logo.png',
                callback_url: callbackUrl,
                prefill: {
                    name: name,
                    email: email,
                    contact: contact
                },
                notes: {
                    user_id: userId
                },
                theme: { color: '#4f46e5' }
            };
            var rzp = new Razorpay(options);
            rzp.open();
        }
    }

    window.FKTI_RazorpayCheckout = {
        openProCheckout: openProCheckout
    };
})();
