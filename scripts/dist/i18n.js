const STORAGE_KEY = 'lang';
const en = {
    'meta.title': 'Roy Cuperman | Team Lead & Senior .NET Developer',
    'meta.description': 'Roy Cuperman - Team Lead and Senior Full Stack Developer (C# / .NET / SQL Server) with 14+ years in hi-tech. Looking for a Team Lead or Senior .NET Developer role.',
    'skip': 'Skip to content',
    'aria.home': 'Back to top',
    'aria.nav': 'Main navigation',
    'aria.lang': 'החלפה לעברית',
    'aria.theme': 'Toggle dark mode',
    'aria.menu': 'Open menu',
    'lang.button': 'עב',
    'nav.strengths': 'Strengths',
    'nav.experience': 'Experience',
    'nav.stack': 'Tech',
    'nav.learning': 'Learning',
    'nav.contact': 'Contact',
    'hero.status': 'Open to new opportunities',
    'hero.hi': "Hi there, I'm",
    'hero.name': 'Roy Cuperman',
    'hero.lead': '14+ years in hi-tech. I led a team of 10 developers at Commbox while staying hands-on in the code, and worked directly with enterprise customers all the way - from specification, through cloud and on-premises deployment, to ongoing support.',
    'hero.cta': "Let's talk",
    'hero.photoAlt': 'Roy Cuperman',
    'hero.badge': 'Team of 10',
    'hero.badgeLead': 'Hands-on Team Lead',
    'stats.years': 'years in hi-tech',
    'stats.team': 'developers in the team I led',
    'stats.mgmt': 'development management roles',
    'stats.commbox': 'years at Commbox',
    'strengths.eyebrow': 'What I bring',
    'strengths.title': 'My strengths',
    's1.title': 'Team leadership',
    's1.text': 'Led a Professional Services team of 10 developers: mentoring, code reviews, architectural guidance and ownership of technical decisions in customer projects.',
    's2.title': 'Full stack in C# / .NET',
    's2.text': 'C#, ASP.NET MVC, .NET Core, REST APIs and Entity Framework on the server, JavaScript on the client. OOP, SOLID and design patterns as the foundation.',
    's3.title': 'Databases',
    's3.text': 'SQL Server throughout my career: table design, T-SQL, stored procedures, LINQ and performance tuning.',
    's4.title': 'Enterprise integrations',
    's4.text': 'Designed and built complex integrations with CRM, BI, Exchange Web Services (EWS) and file sanitization (CDR) systems.',
    's5.title': 'Customer-facing delivery',
    's5.text': 'Requirements, technical specification, cloud and on-premises deployments, ongoing support for large organizations, and work with external vendors.',
    's6.title': 'DevOps & AI',
    's6.text': 'Always learning: Docker, Kubernetes, Jenkins and AWS in the DevOps program, and building AI agents with Claude Code, MCP and n8n in the AI Builder program.',
    'exp.eyebrow': '14+ years',
    'exp.title': 'My journey',
    'exp.commbox': 'Led a team of 10 developers while remaining a hands-on developer. Worked directly with enterprise customers, deployed the platform in the cloud and on-premises, and built integrations with CRM, BI, EWS and CDR.',
    'exp.weekend': 'Managed web development, including external vendors. Built websites and web apps for mobile and desktop with ASP.NET MVC and RESTful services, on SQL Server with Entity Framework.',
    'exp.hoogel': 'Managed development of a classes and hobbies website, including external vendors. ASP.NET on an N-tier architecture, with T-SQL on SQL Server.',
    'exp.telline': 'Developed and maintained web and mobile sites in ASP.NET MVC, including telesport.co.il and livegames.co.il, as well as IVR systems.',
    'stack.eyebrow': 'My toolbox',
    'stack.title': 'Technologies',
    'learn.eyebrow': 'Always learning',
    'learn.title': 'Education & training',
    'learn.inProgress': 'In progress',
    'learn.ai': 'Building AI agents with Claude Code and MCP, prompt and context engineering, and automations in n8n.',
    'learn.devops': 'Linux, Git, Docker, Jenkins, CI/CD, Kubernetes, AWS and Ansible.',
    'learn.ruppin.title': 'Software Engineering Practitioner',
    'learn.ruppin.meta': 'Ruppin Academic Center · 2009 – 2011',
    'learn.ruppin': 'The foundation: programming, data structures and databases.',
    'contact.eyebrow': 'Get in touch',
    'contact.title': 'Looking for a Team Lead or a Senior .NET Developer?',
    'contact.text': "Leave your details and I'll get back to you soon. You can also reach me directly on LinkedIn.",
    'form.name': 'Full name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.company': 'Company',
    'form.message': 'Message',
    'form.optional': '(optional)',
    'form.submit': 'Send message',
    'form.err.required': 'This field is required',
    'form.err.name': 'Name must be 2-100 characters',
    'form.err.email': 'Please enter a valid email',
    'form.err.phone': 'Please enter a valid phone number',
    'form.err.company': 'Up to 100 characters',
    'form.err.message': 'Message must be 10-2000 characters',
    'form.sending': 'Sending...',
    'form.success': "Thanks! Your message was received - I'll get back to you soon.",
    'form.failed': 'Sending failed. Please try again in a moment, or reach me on LinkedIn.',
    'form.rateLimited': 'Too many messages were sent. Please try again in a few minutes.',
};
const he = {
    'meta.title': 'רעי קופרמן | Team Lead & Senior .NET Developer',
    'meta.description': 'רעי קופרמן - ראש צוות ומפתח Full Stack בכיר (C# / .NET / SQL Server) עם 14+ שנות ניסיון בהייטק. מחפש תפקיד Team Lead או Senior .NET Developer.',
    'skip': 'דלג לתוכן',
    'aria.home': 'לראש הדף',
    'aria.nav': 'ניווט ראשי',
    'aria.lang': 'Switch to English',
    'aria.theme': 'החלפת מצב תצוגה',
    'aria.menu': 'פתיחת תפריט',
    'lang.button': 'EN',
    'nav.strengths': 'חוזקות',
    'nav.experience': 'ניסיון',
    'nav.stack': 'טכנולוגיות',
    'nav.learning': 'לימודים',
    'nav.contact': 'צור קשר',
    'hero.status': 'פתוח להצעות עבודה',
    'hero.hi': 'היי, אני',
    'hero.name': 'רעי קופרמן',
    'hero.lead': '14+ שנים בהייטק. הובלתי צוות של 10 מפתחים ב-Commbox, ונשארתי עם הידיים בקוד. עבדתי מול לקוחות Enterprise לאורך כל הדרך: מהאפיון, דרך ההתקנה בענן ואצל הלקוח, ועד הליווי השוטף.',
    'hero.cta': 'בואו נדבר',
    'hero.photoAlt': 'רעי קופרמן',
    'hero.badge': 'צוות של 10',
    'hero.badgeLead': 'ראש צוות שנשאר בקוד',
    'stats.years': 'שנים בהייטק',
    'stats.team': 'מפתחים בצוות שהובלתי',
    'stats.mgmt': 'תפקידי ניהול פיתוח',
    'stats.commbox': 'שנים ב-Commbox',
    'strengths.eyebrow': 'מה אני מביא',
    'strengths.title': 'החוזקות שלי',
    's1.title': 'הובלת צוות',
    's1.text': 'הובלתי צוות Professional Services של 10 מפתחים: חניכה, Code Review, הכוונה ארכיטקטונית ואחריות על ההחלטות הטכניות בפרויקטים של לקוחות.',
    's2.title': 'פיתוח Full Stack',
    's2.text': 'C#, ASP.NET MVC, .NET Core, REST APIs ו-Entity Framework בצד השרת. JavaScript בצד הלקוח. OOP, SOLID ו-Design Patterns כבסיס.',
    's3.title': 'מסדי נתונים',
    's3.text': 'SQL Server לאורך כל הקריירה: תכנון טבלאות, T-SQL, Stored Procedures, LINQ ושיפור ביצועים.',
    's4.title': 'אינטגרציות Enterprise',
    's4.text': 'תכננתי ופיתחתי אינטגרציות מורכבות עם מערכות CRM, BI, Exchange Web Services (EWS) וניטרול קבצים (CDR).',
    's5.title': 'עבודה מול לקוחות',
    's5.text': 'איסוף דרישות, אפיון טכני, התקנות בענן ו-On-Premises, ליווי שוטף של ארגונים גדולים, ועבודה מול ספקים חיצוניים.',
    's6.title': 'DevOps ו-AI',
    's6.text': 'לומד כל הזמן: Docker, Kubernetes, Jenkins ו-AWS במסלול DevOps, ובניית סוכני AI עם Claude Code, MCP ו-n8n במסלול AI Builder.',
    'exp.eyebrow': '14+ שנים',
    'exp.title': 'הדרך המקצועית',
    'exp.commbox': 'הובלתי צוות של 10 מפתחים ונשארתי מפתח פעיל. עבדתי ישירות מול לקוחות Enterprise, התקנתי את הפלטפורמה בענן ואצל הלקוח, ופיתחתי אינטגרציות עם CRM, BI, EWS ו-CDR.',
    'exp.weekend': 'ניהלתי את פיתוח הווב, כולל עבודה מול ספקים חיצוניים. אתרים ואפליקציות ווב למובייל ולדסקטופ ב-ASP.NET MVC וב-RESTful services, ו-SQL Server עם Entity Framework.',
    'exp.hoogel': 'ניהלתי את הפיתוח של אתר חוגים ותחביבים, כולל עבודה מול ספקים. ASP.NET בארכיטקטורת N-tier, ו-T-SQL ב-SQL Server.',
    'exp.telline': 'פיתחתי ותחזקתי אתרי ווב ומובייל ב-ASP.NET MVC, ביניהם telesport.co.il ו-livegames.co.il, ומערכות IVR.',
    'stack.eyebrow': 'ארגז הכלים',
    'stack.title': 'טכנולוגיות',
    'learn.eyebrow': 'תמיד לומד',
    'learn.title': 'השכלה והכשרות',
    'learn.inProgress': 'בתהליך',
    'learn.ai': 'בניית סוכני AI עם Claude Code ו-MCP, הנדסת פרומפטים והקשר, ואוטומציות ב-n8n.',
    'learn.devops': 'Linux, Git, Docker, Jenkins, CI/CD, Kubernetes, AWS ו-Ansible.',
    'learn.ruppin.title': 'הנדסאי תוכנה',
    'learn.ruppin.meta': 'המרכז האקדמי רופין · 2009 – 2011',
    'learn.ruppin': 'הבסיס: תכנות, מבני נתונים ומסדי נתונים.',
    'contact.eyebrow': 'צור קשר',
    'contact.title': 'מחפשים ראש צוות או מפתח .NET בכיר?',
    'contact.text': 'השאירו פרטים ואחזור אליכם בהקדם. אפשר גם לפנות אליי ישירות ב-LinkedIn.',
    'form.name': 'שם מלא',
    'form.email': 'אימייל',
    'form.phone': 'טלפון',
    'form.company': 'חברה',
    'form.message': 'הודעה',
    'form.optional': '(רשות)',
    'form.submit': 'שליחה',
    'form.err.required': 'שדה חובה',
    'form.err.name': 'שם באורך 2 עד 100 תווים',
    'form.err.email': 'כתובת אימייל לא תקינה',
    'form.err.phone': 'מספר טלפון לא תקין',
    'form.err.company': 'עד 100 תווים',
    'form.err.message': 'הודעה באורך 10 עד 2000 תווים',
    'form.sending': 'שולח...',
    'form.success': 'תודה! ההודעה התקבלה, אחזור אליך בהקדם.',
    'form.failed': 'השליחה נכשלה. נסו שוב בעוד רגע, או פנו אליי ב-LinkedIn.',
    'form.rateLimited': 'נשלחו יותר מדי הודעות. נסו שוב בעוד כמה דקות.',
};
const dict = { en, he };
let current = 'en';
export function t(key) {
    return dict[current][key];
}
export function getLang() {
    return current;
}
function initialLang() {
    try {
        const fromUrl = new URLSearchParams(location.search).get('lang');
        if (fromUrl === 'he' || fromUrl === 'en')
            return fromUrl;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'he' || saved === 'en')
            return saved;
    }
    catch {
        // Storage blocked - fall back to English
    }
    return 'en';
}
function apply(lang) {
    current = lang;
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (key in en)
            el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
        for (const pair of (el.dataset.i18nAttr ?? '').split(';')) {
            const [attr, key] = pair.split(':');
            if (attr && key in en)
                el.setAttribute(attr, t(key));
        }
    });
    root.classList.remove('lang-loading');
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}
export function setLang(lang) {
    apply(lang);
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    }
    catch {
        // Storage blocked - the switch still works for this visit
    }
}
export function initI18n() {
    apply(initialLang());
    document.getElementById('lang-toggle')?.addEventListener('click', () => {
        setLang(current === 'en' ? 'he' : 'en');
    });
}
