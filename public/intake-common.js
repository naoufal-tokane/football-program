// Shared by /intake and /intake-submissions: labels + text/JSON export.
window.INTAKE = (function () {
  const SECTIONS = [
    ['About the person', [
      ['full_name', 'Name'], ['contact', 'Email / phone'],
      ['age', 'Age'], ['height_cm', 'Height (cm)'], ['weight_kg', 'Current weight (kg)'], ['sex', 'Sex'],
      ['goal', 'Main goal'], ['goal_other', 'Goal (other)'],
      ['target_weight_kg', 'Target weight (kg)'], ['timeline', 'Timeline'],
    ]],
    ['Training', [
      ['sport', 'Sport / context'], ['sport_other', 'Sport (other)'],
      ['days_per_week', 'Days per week'], ['session_minutes', 'Session length (min)'],
      ['has_commitments', 'Fixed commitments'], ['commitment_days', 'Commitment days'], ['commitment_details', 'Commitment details'],
      ['equipment', 'Equipment'], ['experience', 'Experience level'],
      ['injuries', 'Injuries / limitations / exercises to avoid'],
      ['emphasis', 'Emphasis'], ['emphasis_notes', 'Emphasis notes'],
    ]],
    ['Nutrition goals', [
      ['targets_mode', 'Daily targets'],
      ['protein_g', 'Protein (g)'], ['carbs_g', 'Carbs (g)'], ['fats_g', 'Fats (g)'], ['calories', 'Calories (kcal)'],
      ['activity_level', 'Activity level'],
      ['diet', 'Dietary preferences / restrictions'], ['diet_other', 'Diet (other / allergies)'],
      ['water_ml', 'Water target (ml)'],
    ]],
  ];

  const fmt = (v) => Array.isArray(v) ? v.join(', ') : String(v);
  const empty = (v) => v == null || v === '' || (Array.isArray(v) && !v.length);

  function toText(a, meta) {
    const out = ['ATHLETE INTAKE FORM'];
    if (meta && meta.created_at) out.push('Submitted: ' + new Date(meta.created_at).toLocaleString());
    for (const [title, fields] of SECTIONS) {
      const lines = fields.filter(([k]) => !empty(a[k])).map(([k, l]) => '- ' + l + ': ' + fmt(a[k]));
      if (lines.length) out.push('', title.toUpperCase(), ...lines);
    }
    return out.join('\n');
  }

  function download(name, content, type) {
    const blob = new Blob([content], { type: type || 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (_) {} t.remove(); return ok;
    }
  }

  const slug = (s) => String(s || 'intake').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'intake';

  return { SECTIONS, toText, download, copy, slug, empty, fmt };
})();
