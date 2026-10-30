# פרסום Naya CRM — סדר פעולות

1. פתח Supabase בכתובת https://supabase.com/dashboard ויצור פרויקט `naya-crm-cloud`.
2. עבור אל SQL Editor והרץ על פרויקט חדש וריק את `supabase/migrations/001_initial.sql`, ואחריו את `supabase/migrations/002_invites.sql` (כל קובץ בנפרד).
3. בפרויקט ב-Supabase: Project Settings → API Keys. העתק את Project URL ואת המפתח הציבורי Publishable/Anon. **אל תשתמש ב-secret או service_role**.
4. פתח https://github.com/new, צור מאגר פרטי `naya-crm-cloud`, והעלה אליו את קובצי הפרויקט שחילצת, כולל התיקיות `app`, `lib`, `supabase`. אל תעלה סיסמאות או `.env.local`.
5. פתח https://vercel.com/signup והתחבר ב-GitHub. ב-https://vercel.com/new ייבא את המאגר.
6. במסך הפריסה, הגדר משתני סביבה:
   - `NEXT_PUBLIC_SUPABASE_URL` = כתובת הפרויקט ב-Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = המפתח הציבורי המתאים
   בחר Next.js, ולחץ Deploy.
7. לאחר קבלת כתובת https://...vercel.app, חזור ל-Supabase → Authentication → URL Configuration: הגדר את Site URL לכתובת האתר, והוסף אותה לרשימת Redirect URLs לפי הצורך. ודא שאימות באמצעות אימייל פועל.
8. בצע הרשמה, אימות כתובת אימייל, התחברות, יצירת סוכנות והוספת נתוני בדיקה בלבד. בדוק שני משתמשים וסוכנויות נפרדות.

**הפעלה ראשונית בלבד:** הגרסה עדיין אינה מוכנה למסירת גישה מסחרית או מידע אישי אמיתי. חסרים הגבלת הרשמה לתלמידים מאושרים, הרשאות לפי מודליסטית/עובד, בדיקות אבטחה מלאות, AI, אינטגרציות חיות, Super Admin וחיוב. חבילת Vercel Hobby אינה מיועדת להפעלה מסחרית לפי תנאיה.


## תיקון שלב 7 — התחברות אחרי אימות אימייל
- ב-Vercel → Settings → Environment Variables הוסף `NEXT_PUBLIC_SITE_URL` עם כתובת האתר המלאה, לדוגמה `https://naya-crm-cloud.vercel.app` (בלי `/` בסוף).
- ב-Supabase → Authentication → URL Configuration הגדר Site URL לכתובת האתר, והוסף Redirect URL מדויק: `https://YOUR-DEPLOYMENT.vercel.app/auth/callback`.
- השתמש בגרסה המעודכנת של הקוד; העלה אותה ל-GitHub והפעל Redeploy ב-Vercel.
- בדוק את הסטטוס ב-Vercel → Deployments. אם מופיע Error, היכנס ל-Build Logs ולאחר מכן שלח את הודעת השגיאה (ללא מפתחות וסיסמאות).
- חשוב: לא ניתן לקבוע מה התקלה הספציפית בלי הודעת השגיאה. אם אימות המייל אצלך משתמש ב-`token_hash` במקום ב-`code`, צריך להתאים את תבנית המייל או את נקודת האימות.
