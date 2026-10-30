# הפעלת Naya CRM Cloud כאתר

הפרויקט כולל התחברות אמיתית דרך Supabase, הרשמה, סוכנויות נפרדות, ניהול מודליסטיות ומנויים, הזמנות עובדים רשומים, משימות וקמפיינים כטיוטות.

1. צור פרויקט ב־https://supabase.com/dashboard.
2. SQL Editor: הרץ לפי הסדר את `supabase/migrations/001_initial.sql` ואז `002_invites.sql` בפרויקט חדש וריק בלבד.
3. תחת Project Settings / API העתק את Project URL ואת ה־anon/publishable key.
4. ב־GitHub צור repository פרטי והעלה אליו את כל קבצי הפרויקט, ללא `.env.local`.
5. ב־https://vercel.com/new ייבא את ה־repository והגדר `NEXT_PUBLIC_SUPABASE_URL` ו־`NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. לחץ Deploy. העתק את כתובת האתר.
7. ב־Supabase > Authentication > URL Configuration הגדר Site URL ו־Redirect URLs של האתר שפרסת. הפעל Email authentication ואימות אימייל.
8. בדוק הרשמה, אימות, התחברות, יצירת סוכנות, הוספת מודליסטית ומנוי, משימות, קמפיינים והזמנת משתמש קיים.

## מגבלות חשובות
- **לא** פורסם אתר ולא חובר Supabase; נדרשים חשבונות ופרטי הפרויקט שלך.
- **לא** קיימת עדיין מערכת Super Admin מרכזית, חיוב תלמידים, משלוח אימייל להזמנה, חיבור OnlyFans, צ'אט אמיתי או AI פעיל.
- **לא** מתאים לנתונים אמיתיים או לצוותים חיצוניים לפני צמצום הרשאות לפי מודליסטית, בדיקות RLS, בדיקת אבטחה, מדיניות פרטיות וגיבויים.
- חשבונות תלמידים יכולים להירשם בעצמם בגרסת הבסיס. הגבלת ההרשמה לתלמידים מאושרים דורשת פיתוח נוסף.


## תיקון שלב 7 — התחברות אחרי אימות אימייל
- ב-Vercel → Settings → Environment Variables הוסף `NEXT_PUBLIC_SITE_URL` עם כתובת האתר המלאה, לדוגמה `https://naya-crm-cloud.vercel.app` (בלי `/` בסוף).
- ב-Supabase → Authentication → URL Configuration הגדר Site URL לכתובת האתר, והוסף Redirect URL מדויק: `https://YOUR-DEPLOYMENT.vercel.app/auth/callback`.
- השתמש בגרסה המעודכנת של הקוד; העלה אותה ל-GitHub והפעל Redeploy ב-Vercel.
- בדוק את הסטטוס ב-Vercel → Deployments. אם מופיע Error, היכנס ל-Build Logs ולאחר מכן שלח את הודעת השגיאה (ללא מפתחות וסיסמאות).
- חשוב: לא ניתן לקבוע מה התקלה הספציפית בלי הודעת השגיאה. אם אימות המייל אצלך משתמש ב-`token_hash` במקום ב-`code`, צריך להתאים את תבנית המייל או את נקודת האימות.
