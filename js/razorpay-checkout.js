/**
 * Razorpay Checkout for Pro subscription.
 * Requires: window.RAZORPAY_KEY_ID, window.SUPABASE_URL, window.SUPABASE_ANON_KEY,
 * and window.FKTI_Auth.getSession() (supabase-auth.js).
 *
 * Optional fallback: window.RAZORPAY_SUBSCRIPTION_LINK — if set, used when the
 * Edge Function is unreachable or misconfigured so users can still subscribe.
 */
(function () {
    'use strict';

    function authPageUrl(page) {
        return window.location.origin + '/auth/' + page;
    }

    function getFallbackLink() {
        return window.RAZORPAY_SUBSCRIPTION_LINK || '';
    }

    function openProCheckout() {
        var keyId = window.RAZORPAY_KEY_ID;
        var supabaseUrl = (window.SUPABASE_URL || '').replace(/\/$/, '');
        var anonKey = window.SUPABASE_ANON_KEY || '';
        var auth = window.FKTI_Auth;

        if (!keyId || !supabaseUrl || !anonKey) {
            if (getFallbackLink()) {
                window.location.href = getFallbackLink();
                return;
            }
            redirectToProfileWithError('Payment not configured. Please contact support.');
            return;
        }

        if (!auth || !auth.getSession) {
            window.location.href = authPageUrl('login.html') + '?returnTo=' + encodeURIComponent(window.location.href);
            return;
        }

        auth.getSession().then(function (res) {
            var session = res.data && res.data.session;
            if (!session) {
                window.location.href = authPageUrl('login.html') + '?returnTo=' + encodeURIComponent(window.location.href);
                return;
            }

            var user = session.user;
            var userId = user.id;
            var email = user.email || '';
            var name = (user.user_metadata && user.user_metadata.full_name) || email.split('@')[0] || '';
            var contact = (user.user_metadata && (user.user_metadata.phone || user.user_metadata.country_code))
                ? (user.user_metadata.country_code || '') + (user.user_metadata.phone || '')
                : '';

            var baseUrl = (typeof window !== 'undefined' && window.location && window.location.origin)
                ? window.location.origin.replace(/\/$/, '')
                : '';
            var callbackUrl = (supabaseUrl + '/functions/v1/razorpay-callback') +
                (baseUrl ? '?redirect=' + encodeURIComponent(baseUrl) : '');

            fetch(supabaseUrl + '/functions/v1/create-subscription', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + session.access_token,
                    'apikey': anonKey,
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
                        var checkoutKey = (data.key_id && data.key_id.trim()) ? data.key_id.trim() : keyId;
                        openRazorpay(checkoutKey, data.subscription_id, name, email, contact, callbackUrl, userId);
                    } else {
                        var userMsg = (data && data.error) || '';
                        var isFatalConfig = result.status === 503 || result.status === 502
                            || (result.status === 400 && userMsg.indexOf('setup issue') >= 0);

                        if (isFatalConfig && getFallbackLink()) {
                            window.location.href = getFallbackLink();
                        } else {
                            redirectToProfileWithError(
                                userMsg || 'Could not start subscription. Please try again.'
                            );
                        }
                    }
                })
                .catch(function () {
                    if (getFallbackLink()) {
                        window.location.href = getFallbackLink();
                    } else {
                        redirectToProfileWithError('Network error. Please check your connection and try again.');
                    }
                });
        });
    }

    function redirectToProfileWithError(message) {
        var q = '?error=subscription_unavailable' + (message ? '&msg=' + encodeURIComponent(message) : '');
        window.location.href = authPageUrl('profile.html') + q;
    }

    function openRazorpay(keyId, subscriptionId, name, email, contact, callbackUrl, userId) {
        if (typeof Razorpay === 'undefined') {
            var s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.async = true;
            document.head.appendChild(s);
            s.onload = function () { doOpen(); };
            s.onerror = function () {
                if (getFallbackLink()) {
                    window.location.href = getFallbackLink();
                } else {
                    redirectToProfileWithError('Could not load payment gateway. Please try again.');
                }
            };
        } else {
            doOpen();
        }

        function doOpen() {
            var imgUrl = (typeof window !== 'undefined' && window.location && window.location.origin)
                ? window.location.origin.replace(/\/$/, '') + '/logo.png'
                : '';
            var prefill = { name: name || 'Customer', email: email || '' };
            if (contact && /^[\d+]/.test(String(contact).replace(/\s/g, ''))) {
                prefill.contact = String(contact).replace(/\s/g, '');
            }
            var options = {
                key: keyId,
                subscription_id: subscriptionId,
                name: 'Data For Dummies',
                description: 'Pro — ₹99/week',
                callback_url: callbackUrl,
                prefill: prefill,
                notes: { user_id: userId },
                theme: { color: '#4f46e5' },
                modal: { ondismiss: function () {} }
            };
            if (imgUrl) options.image = imgUrl;
            try {
                var rzp = new Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    var desc = (response.error && response.error.description) || 'Payment failed. Please try again.';
                    redirectToProfileWithError(desc);
                });
                rzp.open();
            } catch (e) {
                if (getFallbackLink()) {
                    window.location.href = getFallbackLink();
                } else {
                    redirectToProfileWithError('Could not open payment window. Please try again.');
                }
            }
        }
    }

    window.FKTI_RazorpayCheckout = {
        openProCheckout: openProCheckout
    };
})();
