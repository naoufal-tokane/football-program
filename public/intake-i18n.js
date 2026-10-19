// English <-> Moroccan Darija (Arabic script) for the intake form.
// Stored answers stay in English; only what the person sees is translated.
window.I18N = (function () {
  const AR = {
    // header / steps
    'Athlete Intake': 'استمارة الرياضي',
    'About': 'عليك', 'Training': 'التداريب', 'Nutrition': 'الماكلة', 'Review': 'المراجعة',
    'About you': 'معلومات عليك', 'Nutrition goals': 'أهداف الماكلة', 'About the person': 'معلومات عليك',
    // about
    'Name *': 'السمية *', 'Name': 'السمية',
    'Email / phone': 'الإيميل / التيليفون',
    'Age': 'العمر', 'Sex': 'الجنس', 'Male': 'راجل', 'Female': 'مرا',
    'Height (cm)': 'الطول (cm)', 'Current weight (kg)': 'الوزن دابا (kg)',
    'Main goal': 'الهدف ديالك', 'select all that apply': 'تقدر تختار بزاف',
    'Fat loss': 'نقص الشحمة', 'Muscle gain': 'زيد العضلات', 'Recomposition': 'نقص الشحمة وزيد العضل',
    'Body recomposition': 'نقص الشحمة وزيد العضل', 'Sports performance': 'الأداء الرياضي',
    'Maintenance': 'نحافظ على الوزن', 'Other': 'حاجة أخرى',
    'Describe your goal': 'شرح الهدف ديالك',
    'Target weight (kg)': 'الوزن اللي بغيتي توصل ليه (kg)', 'optional': 'اختياري',
    'Timeline': 'المدة', 'e.g. 12 weeks, before season': 'مثلا 12 سيمانة، قبل الموسم',
    'Goal (other)': 'هدف آخر',
    // training
    'Sport / context': 'الرياضة / النشاط',
    'Football / soccer': 'الكورة', 'Gym only': 'غير الجيم', 'General fitness': 'لياقة عامة', 'Running': 'الجري',
    'Which sport / context?': 'شمن رياضة؟', 'Sport (other)': 'رياضة أخرى',
    'Days per week': 'شحال من نهار فالسيمانة', 'Time per session': 'الوقت ديال كل حصة',
    'Session length (min)': 'الوقت ديال الحصة (دقيقة)',
    'Team sessions or fixed commitments to build around?': 'عندك تداريب مع الفرقة ولا مواعيد ثابتة؟',
    'Yes': 'إيه', 'No': 'لا',
    'Do you train twice a day?': 'واش كتدرب جوج مرات فالنهار؟',
    'How many days per week do you train twice?': 'شحال من نهار فالسيمانة كتدرب جوج مرات؟',
    'Trains twice a day': 'كيتدرب جوج مرات فالنهار', 'Days per week training twice': 'أيام جوج حصص فالسيمانة', 'Which days?': 'شمن أيام؟',
    'Mon': 'الاثنين', 'Tue': 'الثلاثاء', 'Wed': 'الأربعاء', 'Thu': 'الخميس', 'Fri': 'الجمعة', 'Sat': 'السبت', 'Sun': 'الحد',
    'Details': 'التفاصيل',
    'e.g. Team session 11:30 Tue/Thu, match Sunday': 'مثلا تدريب مع الفرقة 11:30 الثلاثاء/الخميس، ماتش نهار الحد',
    'Fixed commitments': 'مواعيد ثابتة', 'Commitment days': 'أيام المواعيد', 'Commitment details': 'تفاصيل المواعيد',
    'Equipment access': 'المعدات اللي عندك', 'Equipment': 'المعدات',
    'Full gym': 'جيم كامل', 'Home / minimal': 'فالدار / شوية ديال المعدات', 'Bodyweight only': 'غير بوزن الجسم',
    'Experience level': 'المستوى ديالك', 'Beginner': 'مبتدئ', 'Intermediate': 'متوسط', 'Advanced': 'متقدم',
    'Injuries, limitations or exercises to avoid': 'شي إصابة، شي حاجة ما تقدرش تديرها، ولا تمارين خاصك تبعد عليهم',
    'Injuries / limitations / exercises to avoid': 'الإصابات / التمارين اللي خاصك تبعد عليهم',
    'None, or describe…': 'والو، ولا شرح…',
    'Emphasis': 'على شنو بغيتي تركز', 'Strength': 'القوة', 'Conditioning / speed': 'النفس / السرعة',
    'Mobility': 'المرونة', 'Balanced': 'متوازن', 'Anything else? (optional)': 'شي حاجة أخرى؟ (اختياري)',
    'Emphasis notes': 'ملاحظات',
    // nutrition
    'Daily macro targets': 'الماكرو ديال كل نهار', 'Daily targets': 'الأهداف اليومية',
    'Calculate for me': 'حسبهم ليا', 'I have my own targets': 'عندي الأرقام ديالي',
    'Protein (g)': 'البروتين (g)', 'Carbs (g)': 'الكاربوهيدرات (g)', 'Fats (g)': 'الدهون (g)',
    'Calories (auto)': 'الكالوري (أوتوماتيك)', 'Calories (kcal)': 'الكالوري (kcal)', 'auto': 'أوتو',
    'Activity level': 'شحال كتتحرك',
    'Sedentary': 'قليل الحركة', 'Desk job, little exercise': 'خدمة فالبيرو، رياضة قليلة',
    'Lightly active': 'نشيط شوية', '1–3 sessions / week': '1–3 حصص فالسيمانة',
    'Moderately active': 'نشيط متوسط', '3–5 sessions / week': '3–5 حصص فالسيمانة',
    'Very active': 'نشيط بزاف', '6–7 sessions / week': '6–7 حصص فالسيمانة',
    'Extremely active': 'نشيط بزاف بزاف', '2x / day or physical job': 'جوج مرات فالنهار ولا خدمة فيها المجهود',
    'Dietary preferences / restrictions': 'شنو كتاكل / شنو ما كتاكلش',
    'None': 'والو', 'Vegetarian': 'نباتي', 'Vegan': 'نباتي كامل (ڤيغان)', 'Halal': 'حلال', 'Kosher': 'كوشر',
    'Gluten-free': 'بلا گلوتين', 'Lactose-free': 'بلا لاكتوز (حليب)',
    'Allergies or other restrictions': 'الحساسية ولا شي ماكلة ما كتاكلهاش',
    'Diet (other / allergies)': 'الماكلة (حساسية / أخرى)',
    'Water target': 'شحال د الما فالنهار', 'Water target (ml)': 'الما فالنهار (ml)',
    // review / buttons / done
    'Check your answers. Tap a section to edit it.': 'شوف الأجوبة ديالك. ضغط على شي جزء باش تبدلو.',
    'Edit': 'بدل', 'Nothing filled in': 'ما عمرتي والو',
    '← Back': '→ رجع', 'Next →': 'التالي ←', 'Submit': 'صيفط', 'Sending…': 'كنصيفطو…',
    'Thanks, your answers were sent.': 'شكرا، الأجوبة ديالك تصيفطو.',
    'Keep a copy for yourself:': 'خلي عندك نسخة:',
    'Copy answers': 'نسخ الأجوبة', 'Download JSON': 'تحميل JSON', 'Fill in another form': 'عمر استمارة أخرى',
    'Copied ✓': 'تنسخ ✓', 'Copy failed': 'النسخ ما خدمش',
    'Please enter a name to continue.': 'كتب السمية ديالك باش تكمل.',
    'Network error, please try again.': 'مشكل فالكونيكسيون، عاود جرب.',
    'Draft saved on this device': 'المسودة تسجلات فهاد الجهاز', 'Restored your saved draft': 'رجعنا ليك المسودة ديالك',
    'Done': 'سالينا',
    // live widgets
    'Underweight': 'وزن ناقص', 'Normal range': 'عادي', 'Above normal': 'فوق العادي', 'High': 'مرتفع',
    'Target equals current weight': 'الهدف هو نفس الوزن ديالك دابا',
    'to gain': 'خاصك تزيد', 'to lose': 'خاصك تنقص',
    'Protein': 'البروتين', 'Carbs': 'الكاربو', 'Fats': 'الدهون', 'g protein / kg': 'غرام بروتين / كيلو',
    'ATHLETE INTAKE FORM': 'استمارة الرياضي', 'Submitted': 'تصيفطات',
  };

  let lang = 'en';
  try { lang = new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : (localStorage.getItem('fp_intake_lang') || 'en'); } catch (e) {}

  // Translate a string; keeps a leading emoji (e.g. "🔥 Fat loss").
  function t(s) {
    if (lang !== 'ar' || s == null) return s;
    s = String(s);
    if (AR[s]) return AR[s];
    const m = s.match(/^([^\p{L}\d←→]+\s)(.+)$/u);
    if (m && AR[m[2]]) return m[1] + AR[m[2]];
    return s;
  }

  // Formatted dynamic strings
  const f = {
    step: (i, n, name) => lang === 'ar' ? 'المرحلة ' + i + ' من ' + n + ' · ' + t(name) : 'Step ' + i + ' of ' + n + ' · ' + name,
    days: (d) => lang === 'ar' ? (d === 1 ? 'نهار واحد' : d === 2 ? 'جوج أيام' : d + ' أيام') : d + (d === 1 ? ' day' : ' days'),
    mins: (m) => (m >= 150 ? '150+' : m) + (lang === 'ar' ? ' دقيقة' : ' min'),
    volume: (h) => lang === 'ar' ? '≈ <b>' + h + ' ساعات</b> ديال التداريب فالسيمانة' : '≈ <b>' + h + ' h</b> of training per week',
    glasses: (n) => lang === 'ar' ? n + ' كيسان ديال 250 مل' : n + ' glasses of 250 ml',
    water: (l) => lang === 'ar' ? l + ' لتر' : l + ' L',
  };

  // Walk static text + placeholders, skipping [data-dyn] subtrees.
  function applyStatic(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement.closest('script,style,[data-dyn]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    let n;
    while ((n = walker.nextNode())) {
      if (n.__en == null) n.__en = n.nodeValue;
      const raw = n.__en, key = raw.trim();
      if (!key) continue;
      n.nodeValue = raw.replace(key, t(key));
    }
    root.querySelectorAll('[placeholder]').forEach((el) => {
      if (el.__enPh == null) el.__enPh = el.getAttribute('placeholder');
      el.setAttribute('placeholder', t(el.__enPh));
    });
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar' ? 'استمارة الرياضي' : 'Athlete Intake Form';
  }

  function set(l) { lang = l; try { localStorage.setItem('fp_intake_lang', l); } catch (e) {} }

  return { t, f, applyStatic, set, get lang() { return lang; } };
})();
