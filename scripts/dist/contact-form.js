// Contact form: client-side validation, then POST to the .NET API (which saves to Supabase)
import { t } from './i18n.js';
const API_URL = '/api/contact';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+\-\s()]{7,30}$/;
function validate(data) {
    const errors = {};
    const name = data.name.trim();
    const message = data.message.trim();
    if (!name)
        errors.name = 'form.err.required';
    else if (name.length < 2 || name.length > 100)
        errors.name = 'form.err.name';
    if (!data.email.trim())
        errors.email = 'form.err.required';
    else if (!EMAIL_RE.test(data.email.trim()))
        errors.email = 'form.err.email';
    if (data.phone.trim() && !PHONE_RE.test(data.phone.trim()))
        errors.phone = 'form.err.phone';
    if (!message)
        errors.message = 'form.err.required';
    else if (message.length < 10 || message.length > 2000)
        errors.message = 'form.err.message';
    return errors;
}
// The server only tells us which fields failed - the text comes from our dictionary
const FIELDS = new Set(['name', 'email', 'phone', 'company', 'message']);
function serverErrors(body) {
    const out = {};
    for (const field of Object.keys(body.errors ?? {})) {
        const name = field.charAt(0).toLowerCase() + field.slice(1);
        if (FIELDS.has(name))
            out[name] = `form.err.${name}`;
    }
    return out;
}
function readForm(form) {
    const fd = new FormData(form);
    const get = (k) => String(fd.get(k) ?? '');
    return {
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        company: get('company'),
        message: get('message'),
        website: get('website'),
    };
}
export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form)
        return;
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    let errors = {};
    let statusKey = null;
    let statusKind = '';
    const renderErrors = () => {
        form.querySelectorAll('.field').forEach((field) => {
            const input = field.querySelector('input, textarea');
            const slot = field.querySelector('.field-error');
            if (!input || !slot)
                return;
            const key = errors[input.name];
            slot.textContent = key ? t(key) : '';
            field.classList.toggle('invalid', Boolean(key));
            input.setAttribute('aria-invalid', String(Boolean(key)));
        });
    };
    const setStatus = (key, kind = '') => {
        statusKey = key;
        statusKind = kind;
        status.textContent = key ? t(key) : '';
        status.className = `form-status ${kind}`.trim();
    };
    // Re-render messages when the language changes
    document.addEventListener('langchange', () => {
        renderErrors();
        setStatus(statusKey, statusKind);
    });
    // Clear a field's error as soon as the user edits it
    form.addEventListener('input', (e) => {
        const name = e.target.name;
        if (name && errors[name]) {
            delete errors[name];
            renderErrors();
        }
    });
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = readForm(form);
        errors = validate(data);
        renderErrors();
        if (Object.keys(errors).length > 0) {
            form.querySelector('.field.invalid input, .field.invalid textarea')?.focus();
            return;
        }
        button.disabled = true;
        button.classList.add('is-sending');
        setStatus('form.sending');
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                form.reset();
                setStatus('form.success', 'success');
            }
            else if (res.status === 400) {
                const body = (await res.json().catch(() => ({})));
                errors = serverErrors(body);
                renderErrors();
                setStatus(null);
            }
            else if (res.status === 429) {
                setStatus('form.rateLimited', 'error');
            }
            else {
                setStatus('form.failed', 'error');
            }
        }
        catch {
            setStatus('form.failed', 'error');
        }
        finally {
            button.disabled = false;
            button.classList.remove('is-sending');
        }
    });
}
