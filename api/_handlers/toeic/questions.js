const connectToDatabase = require('../../lib/db');
const ToeicQuestion = require('../../models/ToeicQuestion');
const { calculateToeicReadingScore } = require('./score');

// Pre-seeded authentic TOEIC Reading Exam Pool (100 Questions Total across Part 5, 6, and 7)
const PRESEEDED_QUESTIONS = [
  // --- PART 5 (Incomplete Sentences) Q1 - Q30 ---
  {
    question_id: 't5_01',
    part: 5,
    question_text: 'Ms. Chen asked that the monthly sales report be submitted _______ 5:00 PM on Friday.',
    choices: { A: 'by', B: 'until', C: 'for', D: 'during' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë "by" α╣Çα╕₧α╕╖α╣êα╕¡α╕Üα╕¡α╕üα╣Çα╕¬α╣ëα╕Öα╕òα╕▓α╕óα╕½α╕úα╕╖α╕¡α╕üα╕│α╕½α╕Öα╕öα╣Çα╕ºα╕Ñα╕▓α╕¬α╕╕α╕öα╕ùα╣ëα╕▓α╕ó (Deadline) α╕ºα╣êα╕▓α╕òα╣ëα╕¡α╕çα╕¬α╣êα╕çα╕áα╕▓α╕óα╣âα╕Öα╣Çα╕ºα╕Ñα╕▓ 5:00 PM',
      incorrect_reasons: 'B (until) α╣âα╕èα╣ëα╕üα╕▒α╕Üα╕üα╕▓α╕úα╕üα╕úα╕░α╕ùα╕│α╕ùα╕╡α╣êα╕öα╕│α╣Çα╕Öα╕┤α╕Öα╕òα╣êα╕¡α╣Çα╕Öα╕╖α╣êα╕¡α╕çα╕êα╕Öα╕ûα╕╢α╕çα╣Çα╕ºα╕Ñα╕▓α╕½α╕Öα╕╢α╣êα╕ç, C (for) α╕Üα╕¡α╕üα╕úα╕░α╕óα╕░α╣Çα╕ºα╕Ñα╕▓, D (during) α╕Üα╕¡α╕üα╕èα╣êα╕ºα╕çα╣Çα╕ºα╕Ñα╕▓'
    },
    tags: ['Preposition', 'Deadline'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_02',
    part: 5,
    question_text: 'The new automated system will allow employees to access their pay stubs _______ from home.',
    choices: { A: 'directly', B: 'directing', C: 'direct', D: 'direction' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕òα╣ëα╕¡α╕çα╕üα╕▓α╕ú Adverb α╕éα╕óα╕▓α╕óα╕üα╕úα╕┤α╕óα╕▓ "access" α╕êα╕╢α╕çα╕òα╣ëα╕¡α╕çα╣âα╕èα╣ë "directly" (α╣éα╕öα╕óα╕òα╕úα╕ç)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Participle/Gerund, C α╣Çα╕¢α╣çα╕Ö Adjective/Verb, D α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Part of Speech', 'Adverb'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_03',
    part: 5,
    question_text: 'All members of the board agreed that the marketing budget was _______ sufficient for the upcoming campaign.',
    choices: { A: 'entirely', B: 'entire', C: 'entirety', D: 'entireness' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕òα╣ëα╕¡α╕çα╕üα╕▓α╕ú Adverb α╕éα╕óα╕▓α╕ó Adjective "sufficient" α╕êα╕╢α╕çα╕òα╣ëα╕¡α╕çα╣âα╕èα╣ë "entirely" (α╕¡α╕óα╣êα╕▓α╕çα╕¬α╕íα╕Üα╕╣α╕úα╕ôα╣î/α╣Çα╕₧α╕╡α╕óα╕çα╕₧α╕¡α╕ùα╕▒α╣ëα╕çα╕½α╕íα╕ö)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adjective, C α╣üα╕Ñα╕░ D α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Part of Speech', 'Adverb'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_04',
    part: 5,
    question_text: 'Please review the attached contract carefully before _______ it to the legal department.',
    choices: { A: 'submitting', B: 'submit', C: 'submitted', D: 'submission' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕½α╕Ñα╕▒α╕ç Preposition "before" α╕äα╕│α╕òα╕▓α╕íα╕½α╕Ñα╕▒α╕çα╕òα╣ëα╕¡α╕çα╣Çα╕¢α╣çα╕Ö Gerund (V.ing) α╕Öα╕▒α╣êα╕Öα╕äα╕╖α╕¡ "submitting"',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö V.base, C α╣Çα╕¢α╣çα╕Ö Past tense/V.3, D α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Grammar', 'Gerund'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_05',
    part: 5,
    question_text: 'Despite the severe weather conditions, the flight arrived _______ schedule.',
    choices: { A: 'on', B: 'at', C: 'in', D: 'to' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕¬α╕│α╕Öα╕ºα╕Ö "on schedule" α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕òα╕úα╕çα╕òα╕▓α╕íα╕üα╕│α╕½α╕Öα╕öα╣Çα╕ºα╕Ñα╕▓',
      incorrect_reasons: 'at, in, to α╣äα╕íα╣êα╣âα╕èα╣ëα╕úα╣êα╕ºα╕íα╕üα╕▒α╕Ü schedule α╣âα╕Öα╕¬α╕│α╕Öα╕ºα╕Öα╕Üα╕¡α╕üα╣Çα╕ºα╕Ñα╕▓α╕òα╕úα╕çα╕üα╕│α╕½α╕Öα╕ö'
    },
    tags: ['Preposition', 'Business Idiom'],
    cefr_level: 'A2'
  },
  {
    question_id: 't5_06',
    part: 5,
    question_text: 'The keynote speaker delivered a very _______ presentation on renewable energy trends.',
    choices: { A: 'inspiring', B: 'inspire', C: 'inspiration', D: 'inspirational' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adjective "inspiring" α╕éα╕óα╕▓α╕ó Noun "presentation" (α╕üα╕▓α╕úα╕Öα╕│α╣Çα╕¬α╕Öα╕¡α╕ùα╕╡α╣êα╕¬α╕úα╣ëα╕▓α╕çα╣üα╕úα╕çα╕Üα╕▒α╕Öα╕öα╕▓α╕Ñα╣âα╕ê)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Verb, C α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Vocabulary', 'Adjective'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_07',
    part: 5,
    question_text: 'The company plans to _______ its headquarters to downtown Chicago next spring.',
    choices: { A: 'relocate', B: 'relocated', C: 'relocates', D: 'relocating' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕½α╕Ñα╕▒α╕çα╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕ç "plans to" α╕òα╣ëα╕¡α╕çα╕òα╕▓α╕íα╕öα╣ëα╕ºα╕ó Verb Infinitive (V.base) α╕äα╕╖α╕¡ "relocate"',
      incorrect_reasons: 'B, C, D α╣Çα╕¢α╣çα╕Öα╕úα╕╣α╕¢α╕£α╕▒α╕Öα╕éα╕¡α╕çα╕üα╕úα╕┤α╕óα╕▓ α╣äα╕íα╣êα╕¬α╕▓α╕íα╕▓α╕úα╕ûα╕òα╕▓α╕íα╕½α╕Ñα╕▒α╕ç to infinitive α╣äα╕öα╣ë'
    },
    tags: ['Grammar', 'Infinitive'],
    cefr_level: 'A2'
  },
  {
    question_id: 't5_08',
    part: 5,
    question_text: 'Neither Mr. Gomez _______ Ms. Vance was able to attend the annual conference in Zurich.',
    choices: { A: 'nor', B: 'or', C: 'and', D: 'but' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕çα╕äα╕╣α╣ê Correlative Conjunction α╕éα╕¡α╕ç "Neither" α╕äα╕╖α╕¡ "Neither ... nor ..."',
      incorrect_reasons: 'Either α╕äα╕╣α╣êα╕üα╕▒α╕Ü or, Both α╕äα╕╣α╣êα╕üα╕▒α╕Ü and, Not only α╕äα╕╣α╣êα╕üα╕▒α╕Ü but also'
    },
    tags: ['Grammar', 'Conjunction'],
    cefr_level: 'A2'
  },
  {
    question_id: 't5_09',
    part: 5,
    question_text: 'The quality assurance team performs _______ inspections to ensure products meet safety standards.',
    choices: { A: 'routine', B: 'routinely', C: 'routines', D: 'routined' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕òα╣ëα╕¡α╕çα╕üα╕▓α╕ú Adjective α╕éα╕óα╕▓α╕ó Noun "inspections" α╕òα╕¡α╕Ü "routine" (α╕¢α╕úα╕░α╕êα╕│/α╕òα╕▓α╕íα╕¢α╕üα╕òα╕┤)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adverb, C α╣Çα╕¢α╣çα╕Ö Noun plural'
    },
    tags: ['Part of Speech', 'Adjective'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_10',
    part: 5,
    question_text: 'If the client _______ the proposal by noon tomorrow, we can finalize the contract this week.',
    choices: { A: 'approves', B: 'approved', C: 'will approve', D: 'approving' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕¢α╕úα╕░α╣éα╕óα╕äα╣Çα╕çα╕╖α╣êα╕¡α╕Öα╣äα╕é If-Clause Type 1 (If + Present Simple, S + can/will + V.base) α╕¬α╕¡α╕öα╕äα╕Ñα╣ëα╕¡α╕çα╕üα╕▒α╕Ü "by noon tomorrow"',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Past, C α╣Çα╕¢α╣çα╕Ö Future (α╣âα╕Ö If-clause α╣äα╕íα╣êα╣âα╕èα╣ë will), D α╣Çα╕¢α╣çα╕Ö Participle'
    },
    tags: ['Grammar', 'If-Clause'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_11',
    part: 5,
    question_text: 'The financial audit revealed that the company has remained _______ profitable despite high inflation.',
    choices: { A: 'consistently', B: 'consistent', C: 'consist', D: 'consisted' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adverb "consistently" α╕éα╕óα╕▓α╕ó Adjective "profitable"',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adjective, C α╣üα╕Ñα╕░ D α╣Çα╕¢α╣çα╕Ö Verb'
    },
    tags: ['Part of Speech', 'Adverb'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_12',
    part: 5,
    question_text: 'Employees are encouraged to submit their tuition reimbursement requests _______ the HR portal.',
    choices: { A: 'through', B: 'among', C: 'between', D: 'across' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë "through" α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ "α╕£α╣êα╕▓α╕Öα╕èα╣êα╕¡α╕çα╕ùα╕▓α╕ç/α╕úα╕░α╕Üα╕Ü" HR portal',
      incorrect_reasons: 'among α╣âα╕èα╣ëα╕üα╕▒α╕Üα╕üα╕Ñα╕╕α╣êα╕í 3 α╕éα╕╢α╣ëα╕Öα╣äα╕¢, between α╣âα╕èα╣ëα╕üα╕▒α╕Ü 2 α╕¬α╕┤α╣êα╕ç, across α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕éα╣ëα╕▓α╕í'
    },
    tags: ['Preposition', 'Contextual'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_13',
    part: 5,
    question_text: 'The refurbished office building features state-of-the-art HVAC systems and _______ energy-efficient lighting.',
    choices: { A: 'highly', B: 'high', C: 'height', D: 'heighten' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adverb "highly" α╕éα╕óα╕▓α╕ó Adjective "energy-efficient"',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adjective, C α╣Çα╕¢α╣çα╕Ö Noun, D α╣Çα╕¢α╣çα╕Ö Verb'
    },
    tags: ['Part of Speech', 'Adverb'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_14',
    part: 5,
    question_text: 'Mr. Tanaka will be serving as the _______ head of research until a permanent director is hired.',
    choices: { A: 'interim', B: 'interimly', C: 'interior', D: 'internal' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: '"interim head" α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕½α╕▒α╕ºα╕½α╕Öα╣ëα╕▓α╕èα╕▒α╣êα╕ºα╕äα╕úα╕▓α╕º (Temporary role)',
      incorrect_reasons: 'C α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕áα╕▓α╕óα╣âα╕Öα╕¡α╕▓α╕äα╕▓α╕ú, D α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕áα╕▓α╕óα╣âα╕Öα╕¡α╕çα╕äα╣îα╕üα╕ú α╣äα╕íα╣êα╕¬α╕¡α╕öα╕äα╕Ñα╣ëα╕¡α╕çα╕üα╕▒α╕Üα╕òα╕│α╣üα╕½α╕Öα╣êα╕çα╕èα╕▒α╣êα╕ºα╕äα╕úα╕▓α╕º'
    },
    tags: ['Vocabulary', 'Business Context'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_15',
    part: 5,
    question_text: 'Passengers are advised to keep their belongings with _______ at all times while in the airport terminal.',
    choices: { A: 'them', B: 'their', C: 'themselves', D: 'they' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Object Pronoun "them" α╕òα╕▓α╕íα╕½α╕Ñα╕▒α╕ç Preposition "with" (keep belongings with them)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Possessive adj, C α╣Çα╕¢α╣çα╕Ö Reflexive, D α╣Çα╕¢α╣çα╕Ö Subject pronoun'
    },
    tags: ['Grammar', 'Pronoun'],
    cefr_level: 'A2'
  },
  {
    question_id: 't5_16',
    part: 5,
    question_text: 'Software updates will be installed automatically overnight to minimize _______ to daily operations.',
    choices: { A: 'disruption', B: 'disruptive', C: 'disrupt', D: 'disrupting' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕òα╕▓α╕íα╕½α╕Ñα╕▒α╕çα╕üα╕úα╕┤α╕óα╕▓ "minimize" α╕òα╣ëα╕¡α╕çα╣Çα╕¢α╣çα╕Ö Noun object α╕òα╕¡α╕Ü "disruption" (α╕üα╕▓α╕úα╕úα╕Üα╕üα╕ºα╕Ö/α╕üα╕▓α╕úα╕½α╕óα╕╕α╕öα╕èα╕░α╕çα╕▒α╕ü)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adjective, C α╣Çα╕¢α╣çα╕Ö Verb, D α╣Çα╕¢α╣çα╕Ö Gerund/Participle'
    },
    tags: ['Part of Speech', 'Noun'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_17',
    part: 5,
    question_text: 'Customer satisfaction surveys indicate that our helpline staff are extremely _______ and polite.',
    choices: { A: 'courteous', B: 'courtesy', C: 'courteously', D: 'court' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣Çα╕èα╕╖α╣êα╕¡α╕íα╕öα╣ëα╕ºα╕ó "and polite" α╕ïα╕╢α╣êα╕çα╣Çα╕¢α╣çα╕Ö Adjective α╕öα╕▒α╕çα╕Öα╕▒α╣ëα╕Öα╕½α╕Öα╣ëα╕▓ and α╕òα╣ëα╕¡α╕çα╣Çα╕¢α╣çα╕Ö Adjective α╕äα╕╖α╕¡ "courteous" (α╕¬α╕╕α╕áα╕▓α╕₧α╕Öα╕¡α╕Üα╕Öα╣ëα╕¡α╕í)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Noun, C α╣Çα╕¢α╣çα╕Ö Adverb'
    },
    tags: ['Parallel Structure', 'Adjective'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_18',
    part: 5,
    question_text: 'Dr. Patel has _______ published three articles on machine learning applications in logistics.',
    choices: { A: 'recently', B: 'recent', C: 'recenter', D: 'recency' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕òα╕│α╣üα╕½α╕Öα╣êα╕çα╕úα╕░α╕½α╕ºα╣êα╕▓α╕ç helper verb "has" α╣üα╕Ñα╕░ V.3 "published" α╕òα╣ëα╕¡α╕çα╣âα╕èα╣ë Adverb "recently" (α╣Çα╕íα╕╖α╣êα╕¡α╣Çα╕úα╣çα╕ºα╣å α╕Öα╕╡α╣ë)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adjective, D α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Grammar', 'Adverb Placement'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_19',
    part: 5,
    question_text: 'Please inform the security desk _______ you expect international visitors at the facility.',
    choices: { A: 'whenever', B: 'whatever', C: 'whichever', D: 'whoever' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë "whenever" (α╣Çα╕íα╕╖α╣êα╕¡α╣âα╕öα╕üα╣çα╕òα╕▓α╕íα╕ùα╕╡α╣ê) α╣Çα╕èα╕╖α╣êα╕¡α╕íα╕¢α╕úα╕░α╣éα╕óα╕äα╕Üα╕¡α╕üα╣Çα╕çα╕╖α╣êα╕¡α╕Öα╣äα╕éα╣Çα╕ºα╕Ñα╕▓',
      incorrect_reasons: 'whatever (α╕¡α╕░α╣äα╕úα╕üα╣çα╕òα╕▓α╕í), whichever (α╕¡α╕▒α╕Öα╣âα╕öα╕üα╣çα╕òα╕▓α╕í), whoever (α╣âα╕äα╕úα╕üα╣çα╕òα╕▓α╕í) α╣äα╕íα╣êα╣Çα╕½α╕íα╕▓α╕░α╕üα╕▒α╕Üα╕Üα╕úα╕┤α╕Üα╕ùα╣Çα╕ºα╕Ñα╕▓'
    },
    tags: ['Conjunction', 'Adverb Clause'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_20',
    part: 5,
    question_text: 'The manager decided to _______ the weekly staff meeting to allow team members to finish the urgent project.',
    choices: { A: 'postpone', B: 'postponed', C: 'postponement', D: 'postponing' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕½α╕Ñα╕▒α╕çα╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕ç Infinitive "decided to" α╕òα╣ëα╕¡α╕çα╣âα╕èα╣ë V.base α╕Öα╕▒α╣êα╕Öα╕äα╕╖α╕¡ "postpone" (α╣Çα╕Ñα╕╖α╣êα╕¡α╕Öα╕¡α╕¡α╕üα╣äα╕¢)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö V.past, C α╣Çα╕¢α╣çα╕Ö Noun, D α╣Çα╕¢α╣çα╕Ö Gerund'
    },
    tags: ['Grammar', 'Infinitive'],
    cefr_level: 'A2'
  },
  {
    question_id: 't5_21',
    part: 5,
    question_text: 'Sales of organic food items have risen _______ over the past three consecutive quarters.',
    choices: { A: 'substantially', B: 'substantial', C: 'substance', D: 'substantiate' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adverb "substantially" α╕éα╕óα╕▓α╕óα╕üα╕úα╕┤α╕óα╕▓ "have risen" (α╣Çα╕₧α╕┤α╣êα╕íα╕éα╕╢α╣ëα╕Öα╕¡α╕óα╣êα╕▓α╕çα╕íα╕╡α╕Öα╕▒α╕óα╕¬α╕│α╕äα╕▒α╕ì/α╕¡α╕óα╣êα╕▓α╕çα╕íα╕▓α╕ü)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adjective, C α╣Çα╕¢α╣çα╕Ö Noun, D α╣Çα╕¢α╣çα╕Ö Verb'
    },
    tags: ['Part of Speech', 'Adverb'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_22',
    part: 5,
    question_text: 'Workshops will be held in Room 304, _______ indicated otherwise on your registration badge.',
    choices: { A: 'unless', B: 'without', C: 'despite', D: 'except' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë "unless" (α╣Çα╕ºα╣ëα╕Öα╣üα╕òα╣êα╕ºα╣êα╕▓) α╕¬α╕¡α╕öα╕äα╕Ñα╣ëα╕¡α╕çα╕üα╕▒α╕Üα╕ºα╕Ñα╕╡ "unless indicated otherwise" (α╣Çα╕ºα╣ëα╕Öα╣üα╕òα╣êα╕êα╕░α╕úα╕░α╕Üα╕╕α╣Çα╕¢α╣çα╕Öα╕¡α╕óα╣êα╕▓α╕çα╕¡α╕╖α╣êα╕Ö)',
      incorrect_reasons: 'without α╣üα╕Ñα╕░ despite α╣Çα╕¢α╣çα╕Ö Preposition α╕òα╣ëα╕¡α╕çα╕òα╕▓α╕íα╕öα╣ëα╕ºα╕ó Noun/Gerund α╣äα╕íα╣êα╣âα╕èα╣ê Past participle clause'
    },
    tags: ['Conjunction', 'Condition'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_23',
    part: 5,
    question_text: 'The new regional director brings extensive _______ in international supply chain management.',
    choices: { A: 'expertise', B: 'expert', C: 'expertly', D: 'expertness' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕òα╕▓α╕íα╕½α╕Ñα╕▒α╕ç Adjective "extensive" α╕òα╣ëα╕¡α╕çα╣Çα╕¢α╣çα╕Ö Uncountable Noun α╕òα╕¡α╕Ü "expertise" (α╕äα╕ºα╕▓α╕íα╣Çα╕èα╕╡α╣êα╕óα╕ºα╕èα╕▓α╕ì)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Person Noun (α╕£α╕╣α╣ëα╣Çα╕èα╕╡α╣êα╕óα╕ºα╕èα╕▓α╕ì - α╕òα╣ëα╕¡α╕çα╕üα╕▓α╕úα╕Öα╕▒α╕Üα╣äα╕öα╣ë/α╣Çα╕¡α╕üα╕₧α╕êα╕Öα╣îα╕¬α╕¡α╕öα╕äα╕Ñα╣ëα╕¡α╕ç), C α╣Çα╕¢α╣çα╕Ö Adverb'
    },
    tags: ['Vocabulary', 'Noun'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_24',
    part: 5,
    question_text: 'All expense reports must be signed by the department supervisor _______ processing by accounting.',
    choices: { A: 'prior to', B: 'ahead', C: 'earlier', D: 'previous' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕¬α╕│α╕Öα╕ºα╕Ö Preposition "prior to" α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ "α╕üα╣êα╕¡α╕Öα╕½α╕Öα╣ëα╕▓" (before) α╕òα╕▓α╕íα╕öα╣ëα╕ºα╕ó Gerund "processing"',
      incorrect_reasons: 'ahead α╕òα╣ëα╕¡α╕çα╣âα╕èα╣ë ahead of, earlier α╣üα╕Ñα╕░ previous α╣äα╕íα╣êα╣âα╕èα╣ê preposition α╕ùα╕╡α╣êα╣Çα╕èα╕╖α╣êα╕¡α╕í Gerund'
    },
    tags: ['Preposition', 'Business Style'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_25',
    part: 5,
    question_text: 'The company website was redesigned to provide a more _______ user experience for mobile visitors.',
    choices: { A: 'intuitive', B: 'intuitively', C: 'intuition', D: 'intuit' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕òα╣ëα╕¡α╕çα╕üα╕▓α╕ú Adjective α╕éα╕óα╕▓α╕ó Noun phrase "user experience" α╕òα╕¡α╕Ü "intuitive" (α╣âα╕èα╣ëα╕çα╕▓α╕Öα╕çα╣êα╕▓α╕ó/α╣Çα╕éα╣ëα╕▓α╣âα╕êα╣äα╕öα╣ëα╕ùα╕▒α╕Öα╕ùα╕╡)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adverb, C α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Part of Speech', 'Adjective'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_26',
    part: 5,
    question_text: 'The committee members unanimously voted to _______ the deadline for grant applications by two weeks.',
    choices: { A: 'extend', B: 'expand', C: 'exceed', D: 'express' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: '"extend the deadline" α╣Çα╕¢α╣çα╕Ö Collocation α╕½α╕íα╕▓α╕óα╕ûα╕╢α╕ç α╕éα╕óα╕▓α╕óα╣Çα╕ºα╕Ñα╕▓/α╕éα╕óα╕▓α╕óα╕üα╕│α╕½α╕Öα╕öα╕¬α╣êα╕ç',
      incorrect_reasons: 'B (expand) α╣âα╕èα╣ëα╕üα╕▒α╕Üα╕éα╕Öα╕▓α╕ö/α╕₧α╕╖α╣ëα╕Öα╕ùα╕╡α╣ê, C (exceed) α╣Çα╕üα╕┤α╕Öα╕éα╕╡α╕öα╕êα╕│α╕üα╕▒α╕ö, D (express) α╣üα╕¬α╕öα╕çα╕¡α╕¡α╕ü'
    },
    tags: ['Vocabulary', 'Collocation'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_27',
    part: 5,
    question_text: 'Should you require further _______ regarding the warranty coverage, please contact our support center.',
    choices: { A: 'clarification', B: 'clarify', C: 'clarified', D: 'clarifying' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕½α╕Ñα╕▒α╕ç Adjective "further" α╕òα╣ëα╕¡α╕çα╣Çα╕¢α╣çα╕Ö Noun α╕òα╕¡α╕Ü "clarification" (α╕äα╕│α╕¡α╕ÿα╕┤α╕Üα╕▓α╕óα╣Çα╕₧α╕┤α╣êα╕íα╣Çα╕òα╕┤α╕í/α╕üα╕▓α╕úα╕ùα╕│α╣âα╕½α╣ëα╕üα╕úα╕░α╕êα╣êα╕▓α╕ç)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Verb, C α╣üα╕Ñα╕░ Dα╣Çα╕¢α╣çα╕Ö Participle'
    },
    tags: ['Part of Speech', 'Noun'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_28',
    part: 5,
    question_text: 'Neither the CEO nor the executive board members _______ present at the press release yesterday.',
    choices: { A: 'were', B: 'was', C: 'is', D: 'are' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕Öα╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕ç Neither A nor B α╕üα╕úα╕┤α╕óα╕▓α╕êα╕░α╕£α╕▒α╕Öα╕òα╕▓α╕íα╕¢α╕úα╕░α╕ÿα╕▓α╕Öα╕½α╕Ñα╕▒α╕ç nor α╕Öα╕▒α╣êα╕Öα╕äα╕╖α╕¡ "executive board members" (α╕₧α╕½α╕╣α╕₧α╕êα╕Öα╣î) + α╣Çα╕½α╕òα╕╕α╕üα╕▓α╕úα╕ôα╣îα╕¡α╕öα╕╡α╕ò "yesterday" α╕êα╕╢α╕çα╣âα╕èα╣ë "were"',
      incorrect_reasons: 'B (was) α╣âα╕èα╣ëα╕üα╕▒α╕Üα╣Çα╕¡α╕üα╕₧α╕êα╕Öα╣î, C α╣üα╕Ñα╕░ D α╣Çα╕¢α╣çα╕Ö Present tense'
    },
    tags: ['Grammar', 'Subject-Verb Agreement'],
    cefr_level: 'B2'
  },
  {
    question_id: 't5_29',
    part: 5,
    question_text: 'The new policy regarding remote work options will become _______ starting on the first of next month.',
    choices: { A: 'effective', B: 'effect', C: 'effectively', D: 'effectiveness' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕½α╕Ñα╕▒α╕ç Linking verb "become" α╕òα╣ëα╕¡α╕çα╣âα╕èα╣ë Adjective α╕òα╕¡α╕Ü "effective" (become effective = α╕íα╕╡α╕£α╕Ñα╕Üα╕▒α╕çα╕äα╕▒α╕Üα╣âα╕èα╣ë)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Noun, C α╣Çα╕¢α╣çα╕Ö Adverb, D α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Vocabulary', 'Linking Verb'],
    cefr_level: 'B1'
  },
  {
    question_id: 't5_30',
    part: 5,
    question_text: 'Apex Logistics guarantees that all domestic shipments will be delivered _______ two business days.',
    choices: { A: 'within', B: 'inside', C: 'along', D: 'toward' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë "within" + α╕èα╣êα╕ºα╕çα╣Çα╕ºα╕Ñα╕▓ (within two business days) α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕áα╕▓α╕óα╣âα╕Öα╣Çα╕ºα╕Ñα╕▓ 2 α╕ºα╕▒α╕Öα╕ùα╕│α╕üα╕▓α╕ú',
      incorrect_reasons: 'inside α╣âα╕èα╣ëα╕üα╕▒α╕Üα╕¬α╕ûα╕▓α╕Öα╕ùα╕╡α╣êα╕áα╕▓α╕óα╣âα╕Ö, along (α╕òα╕▓α╕íα╕ùα╕▓α╕ç), toward (α╣äα╕¢α╕óα╕▒α╕ç)'
    },
    tags: ['Preposition', 'Time Period'],
    cefr_level: 'A2'
  },

  // --- PART 6 (Text Completion) Passage 1: Q31 - Q34 ---
  {
    question_id: 't6_31',
    part: 6,
    passage_id: 'p6_pass1',
    passage_title: 'Email: Internal Security System Update',
    passage_content: `<strong>To:</strong> All Staff &lt;staff@apexcorp.com&gt;<br>
<strong>From:</strong> IT Operations &lt;it@apexcorp.com&gt;<br>
<strong>Date:</strong> October 12<br>
<strong>Subject:</strong> Mandatory Password Update Notice<br><br>
Please be advised that IT will perform routine maintenance on our authentication servers this Saturday between 1:00 AM and 5:00 AM. 
During this period, internal databases and cloud drives will be <strong>[31]</strong> unavailable.<br><br>
We ask all employees to change their login passwords before Friday evening. 
Password requirements have been <strong>[32]</strong> to enhance overall network protection. 
New passwords must contain at least 12 characters, including numbers and special symbols. 
<strong>[33]</strong>.<br><br>
If you experience technical issues after the maintenance window, please contact the helpdesk at extension 4401. 
Thank you for your <strong>[34]</strong> in keeping our corporate data secure.`,
    question_text: 'Select the best option for blank [31]:',
    choices: { A: 'temporarily', B: 'permanently', C: 'incidentally', D: 'subsequently' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕Üα╕ùα╕äα╕ºα╕▓α╕íα╣üα╕êα╣ëα╕çα╕üα╕▓α╕úα╕¢α╕úα╕▒α╕Üα╕¢α╕úα╕╕α╕çα╕úα╕░α╕Üα╕Üα╕èα╣êα╕ºα╕çα╕¬α╕▒α╣ëα╕Öα╣å α╕üα╕▓α╕úα╣äα╕íα╣êα╕₧α╕úα╣ëα╕¡α╕íα╣âα╕èα╣ëα╕çα╕▓α╕Öα╕êα╕╢α╕çα╣Çα╕üα╕┤α╕öα╕éα╕╢α╣ëα╕Ö "α╕èα╕▒α╣êα╕ºα╕äα╕úα╕▓α╕º" (temporarily)',
      incorrect_reasons: 'B (α╕ûα╕▓α╕ºα╕ú), C (α╣éα╕öα╕óα╕Üα╕▒α╕çα╣Çα╕¡α╕┤α╕ì), D (α╣âα╕Öα╣Çα╕ºα╕Ñα╕▓α╕òα╣êα╕¡α╕íα╕▓)'
    },
    tags: ['Part 6', 'Vocabulary Context'],
    cefr_level: 'B1'
  },
  {
    question_id: 't6_32',
    part: 6,
    passage_id: 'p6_pass1',
    passage_title: 'Email: Internal Security System Update',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best option for blank [32]:',
    choices: { A: 'updated', B: 'updating', C: 'updates', D: 'updater' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕ç Passive Voice (have been + V.3) α╕äα╕╖α╕¡ "have been updated" (α╣äα╕öα╣ëα╕úα╕▒α╕Üα╕üα╕▓α╕úα╕¡α╕▒α╕¢α╣Çα╕öα╕ò/α╕óα╕üα╕úα╕░α╕öα╕▒α╕Ü)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Participle, C α╣Çα╕¢α╣çα╕Ö Present tense, D α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Part 6', 'Passive Voice'],
    cefr_level: 'B1'
  },
  {
    question_id: 't6_33',
    part: 6,
    passage_id: 'p6_pass1',
    passage_title: 'Email: Internal Security System Update',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best sentence for blank [33]:',
    choices: {
      A: 'Failure to update your password will result in temporary account suspension.',
      B: 'Our office lunch catering menu has also been revised.',
      C: 'The IT department was founded in 2005 by Mr. Johnson.',
      D: 'Laptops are available for purchase at a discounted corporate rate.'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕¢α╕úα╕░α╣éα╕óα╕äα╕Öα╕╡α╣ëα╕¬α╕¡α╕öα╕äα╕Ñα╣ëα╕¡α╕çα╕üα╕▒α╕Üα╕Üα╕úα╕┤α╕Üα╕ùα╕üα╕▓α╕úα╣üα╕êα╣ëα╕çα╣Çα╕òα╕╖α╕¡α╕Öα╕₧α╕Öα╕▒α╕üα╕çα╕▓α╕Öα╣âα╕½α╣ëα╣Çα╕¢α╕Ñα╕╡α╣êα╕óα╕Öα╕úα╕½α╕▒α╕¬α╕£α╣êα╕▓α╕Öα╕ùα╕▒α╕Öα╕ùα╕╡ (α╕½α╕▓α╕üα╣äα╕íα╣êα╣Çα╕¢α╕Ñα╕╡α╣êα╕óα╕Öα╕êα╕░α╕ûα╕╣α╕üα╕úα╕░α╕çα╕▒α╕Üα╕Üα╕▒α╕ìα╕èα╕╡α╕èα╕▒α╣êα╕ºα╕äα╕úα╕▓α╕º)',
      incorrect_reasons: 'B, C, D α╣äα╕íα╣êα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕çα╕üα╕▒α╕Üα╣Çα╕úα╕╖α╣êα╕¡α╕çα╕üα╕▓α╕úα╣Çα╕¢α╕Ñα╕╡α╣êα╕óα╕Öα╕úα╕½α╕▒α╕¬α╕£α╣êα╕▓α╕Öα╣üα╕Ñα╕░α╕äα╕ºα╕▓α╕íα╕¢α╕Ñα╕¡α╕öα╕áα╕▒α╕ó IT'
    },
    tags: ['Part 6', 'Sentence Insertion'],
    cefr_level: 'B2'
  },
  {
    question_id: 't6_34',
    part: 6,
    passage_id: 'p6_pass1',
    passage_title: 'Email: Internal Security System Update',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best option for blank [34]:',
    choices: { A: 'cooperation', B: 'cooperate', C: 'cooperative', D: 'cooperating' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕òα╕▓α╕íα╕½α╕Ñα╕▒α╕ç Possessive adjective "your" α╕òα╣ëα╕¡α╕çα╣Çα╕¢α╣çα╕Ö Noun α╕òα╕¡α╕Ü "cooperation" (α╕äα╕ºα╕▓α╕íα╕úα╣êα╕ºα╕íα╕íα╕╖α╕¡)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Verb, C α╣Çα╕¢α╣çα╕Ö Adjective, D α╣Çα╕¢α╣çα╕Ö Participle'
    },
    tags: ['Part 6', 'Part of Speech'],
    cefr_level: 'B1'
  },

  // --- PART 6 Passage 2: Q35 - Q38 ---
  {
    question_id: 't6_35',
    part: 6,
    passage_id: 'p6_pass2',
    passage_title: 'Memo: Annual Employee Performance Review Policy',
    passage_content: `<strong>MEMORANDUM</strong><br>
<strong>To:</strong> All Department Heads<br>
<strong>From:</strong> Human Resources<br>
<strong>Subject:</strong> Schedule for Q4 Evaluations<br><br>
As we approach the end of the fiscal year, it is time to initiate our annual performance evaluation process. 
Managers are required to complete performance reviews for all direct reports <strong>[35]</strong> November 25.<br><br>
This year, we have introduced a streamlined evaluation software that reduces paperwork and <strong>[36]</strong> faster feedback. 
Training sessions regarding the new digital evaluation tool will be held this Thursday afternoon. 
<strong>[37]</strong>.<br><br>
Please ensure that all review scores are finalized and submitted on time. 
Your <strong>[38]</strong> involvement is crucial to maintaining transparent employee development goals.`,
    question_text: 'Select the best option for blank [35]:',
    choices: { A: 'by', B: 'since', C: 'from', D: 'over' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë "by" α╣Çα╕₧α╕╖α╣êα╕¡α╕úα╕░α╕Üα╕╕α╕üα╕│α╕½α╕Öα╕öα╕ºα╕▒α╕Öα╕¬α╕╕α╕öα╕ùα╣ëα╕▓α╕óα╣âα╕Öα╕üα╕▓α╕úα╕¢α╕úα╕░α╣Çα╕íα╕┤α╕Öα╕£α╕Ñ (by November 25)',
      incorrect_reasons: 'since α╕Üα╕¡α╕üα╕êα╕╕α╕öα╣Çα╕úα╕┤α╣êα╕íα╕òα╣ëα╕Öα╕¡α╕öα╕╡α╕ò, from α╣âα╕èα╣ëα╕üα╕▒α╕Üα╕äα╕╣α╣ê to, over α╕Üα╕¡α╕üα╕úα╕░α╕óα╕░α╣Çα╕ºα╕Ñα╕▓'
    },
    tags: ['Part 6', 'Preposition'],
    cefr_level: 'B1'
  },
  {
    question_id: 't6_36',
    part: 6,
    passage_id: 'p6_pass2',
    passage_title: 'Memo: Annual Employee Performance Review Policy',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best option for blank [36]:',
    choices: { A: 'facilitates', B: 'facility', C: 'facilitation', D: 'facilitated' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣Çα╕èα╕╖α╣êα╕¡α╕íα╕öα╣ëα╕ºα╕ó "and" α╕½α╕Öα╣ëα╕▓ and α╕äα╕╖α╕¡ "reduces" (V.1 s-form) α╕½α╕Ñα╕▒α╕ç and α╕êα╕╢α╕çα╕òα╣ëα╕¡α╕çα╣Çα╕¢α╣çα╕Ö V.1 s-form α╕äα╕╖α╕¡ "facilitates" (α╕èα╣êα╕ºα╕óα╕¡α╕│α╕Öα╕ºα╕óα╕äα╕ºα╕▓α╕íα╕¬α╕░α╕öα╕ºα╕ü)',
      incorrect_reasons: 'B α╣üα╕Ñα╕░ C α╣Çα╕¢α╣çα╕Ö Noun, D α╣Çα╕¢α╣çα╕Ö Past tense'
    },
    tags: ['Part 6', 'Parallel Verb Tense'],
    cefr_level: 'B2'
  },
  {
    question_id: 't6_37',
    part: 6,
    passage_id: 'p6_pass2',
    passage_title: 'Memo: Annual Employee Performance Review Policy',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best sentence for blank [37]:',
    choices: {
      A: 'A video recording of the training will also be archived on the internal portal.',
      B: 'Parking permits must be displayed on the front windshield.',
      C: 'The cafeteria will close early due to kitchen renovations.',
      D: 'Annual bonuses will be distributed in cash only.'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣Çα╕èα╕╖α╣êα╕¡α╕íα╣éα╕óα╕çα╕üα╕▒α╕Üα╕¢α╕úα╕░α╣éα╕óα╕äα╕üα╣êα╕¡α╕Öα╕½α╕Öα╣ëα╕▓α╣Çα╕üα╕╡α╣êα╕óα╕ºα╕üα╕▒α╕Üα╕üα╕▓α╕úα╕êα╕▒α╕öα╕¡α╕Üα╕úα╕íα╣éα╕¢α╕úα╣üα╕üα╕úα╕íα╕¢α╕úα╕░α╣Çα╕íα╕┤α╕Öα╕£α╕Ñα╣âα╕½α╕íα╣ê (α╕íα╕╡α╕ºα╕┤α╕öα╕╡α╣éα╕¡α╕Üα╕▒α╕Öα╕ùα╕╢α╕üα╕üα╕▓α╕úα╕¡α╕Üα╕úα╕íα╣Çα╕üα╣çα╕Üα╣äα╕ºα╣ëα╣âα╕Öα╕₧α╕¡α╕úα╣îα╕òα╕▒α╕Ñ)',
      incorrect_reasons: 'B, C, D α╣äα╕íα╣êα╕íα╕╡α╕äα╕ºα╕▓α╕íα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕éα╣ëα╕¡α╕çα╕üα╕▒α╕Üα╣Çα╕úα╕╖α╣êα╕¡α╕çα╕üα╕▓α╕úα╕¡α╕Üα╕úα╕íα╕ïα╕¡α╕ƒα╕òα╣îα╣üα╕ºα╕úα╣îα╕¢α╕úα╕░α╣Çα╕íα╕┤α╕Öα╕£α╕Ñ'
    },
    tags: ['Part 6', 'Sentence Insertion'],
    cefr_level: 'B2'
  },
  {
    question_id: 't6_38',
    part: 6,
    passage_id: 'p6_pass2',
    passage_title: 'Memo: Annual Employee Performance Review Policy',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best option for blank [38]:',
    choices: { A: 'continued', B: 'continue', C: 'continuation', D: 'continual' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adjective "continued" α╕éα╕óα╕▓α╕ó Noun "involvement" α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕äα╕ºα╕▓α╕íα╕íα╕╡α╕¬α╣êα╕ºα╕Öα╕úα╣êα╕ºα╕íα╕¡α╕óα╣êα╕▓α╕çα╕òα╣êα╕¡α╣Çα╕Öα╕╖α╣êα╕¡α╕ç',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Verb, C α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Part 6', 'Adjective'],
    cefr_level: 'B2'
  },

  // --- PART 6 Passage 3 & 4 (Q39 - Q46) ---
  {
    question_id: 't6_39',
    part: 6,
    passage_id: 'p6_pass3',
    passage_title: 'Press Release: GreenEnergy Corp Expansion',
    passage_content: `<strong>FOR IMMEDIATE RELEASE</strong><br>
GreenEnergy Corp announced today that it will open a new solar panel manufacturing facility in Austin, Texas. 
The new plant is expected to create over 500 green tech jobs <strong>[39]</strong> the next two years. 
Construction will commence next month, with full operational capacity scheduled for Q3 of next year.<br><br>
"This expansion reflects our <strong>[40]</strong> commitment to sustainable energy innovation," stated CEO Maria Santos. 
<strong>[41]</strong>. 
Local government officials have expressed strong support for the project, citing significant economic benefits for the region. 
Detailed hiring guidelines will be <strong>[42]</strong> on our career portal next week.`,
    question_text: 'Select the best option for blank [39]:',
    choices: { A: 'over', B: 'at', C: 'between', D: 'since' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë "over" + α╕úα╕░α╕óα╕░α╣Çα╕ºα╕Ñα╕▓ (over the next two years) α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕òα╕Ñα╕¡α╕öα╕èα╣êα╕ºα╕çα╣Çα╕ºα╕Ñα╕▓ 2 α╕¢α╕╡α╕éα╣ëα╕▓α╕çα╕½α╕Öα╣ëα╕▓',
      incorrect_reasons: 'at α╣âα╕èα╣ëα╕üα╕▒α╕Üα╣Çα╕ºα╕Ñα╕▓α╣Çα╕ëα╕₧α╕▓α╕░, between α╣âα╕èα╣ëα╕üα╕▒α╕Üα╕èα╣êα╕ºα╕çα╕úα╕░α╕½α╕ºα╣êα╕▓α╕ç 2 α╕¬α╕┤α╣êα╕ç, since α╣âα╕èα╣ëα╕üα╕▒α╕Üα╕êα╕╕α╕öα╣Çα╕úα╕┤α╣êα╕íα╕òα╣ëα╕Ö'
    },
    tags: ['Part 6', 'Preposition'],
    cefr_level: 'B1'
  },
  {
    question_id: 't6_40',
    part: 6,
    passage_id: 'p6_pass3',
    passage_title: 'Press Release: GreenEnergy Corp Expansion',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best option for blank [40]:',
    choices: { A: 'ongoing', B: 'ongo', C: 'ongone', D: 'ongoingness' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adjective "ongoing" α╕éα╕óα╕▓α╕ó "commitment" α╣üα╕¢α╕Ñα╕ºα╣êα╕▓ α╕äα╕ºα╕▓α╕íα╕íα╕╕α╣êα╕çα╕íα╕▒α╣êα╕Öα╕¡α╕▒α╕Öα╕òα╣êα╕¡α╣Çα╕Öα╕╖α╣êα╕¡α╕ç',
      incorrect_reasons: 'B, C, D α╣äα╕íα╣êα╣âα╕èα╣êα╕úα╕╣α╕¢ Adjective α╕ùα╕╡α╣êα╕ûα╕╣α╕üα╕òα╣ëα╕¡α╕çα╕ùα╕▓α╕çα╣äα╕ºα╕óα╕▓α╕üα╕úα╕ôα╣î'
    },
    tags: ['Part 6', 'Vocabulary'],
    cefr_level: 'B2'
  },
  {
    question_id: 't6_41',
    part: 6,
    passage_id: 'p6_pass3',
    passage_title: 'Press Release: GreenEnergy Corp Expansion',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best sentence for blank [41]:',
    choices: {
      A: 'The facility will rely exclusively on zero-emission wind and solar power.',
      B: 'Oil prices dropped sharply in international commodities markets today.',
      C: 'Employees must return company smartphones prior to departure.',
      D: 'The old factory building was converted into a shopping center.'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕¬α╕¡α╕öα╕äα╕Ñα╣ëα╕¡α╕çα╕üα╕▒α╕Üα╕ûα╣ëα╕¡α╕óα╣üα╕ûα╕Ñα╕çα╕éα╕¡α╕ç CEO α╣Çα╕úα╕╖α╣êα╕¡α╕çα╕₧α╕Ñα╕▒α╕çα╕çα╕▓α╕Öα╕óα╕▒α╣êα╕çα╕óα╕╖α╕Ö (α╣éα╕úα╕çα╕çα╕▓α╕Öα╣âα╕½α╕íα╣êα╕êα╕░α╣âα╕èα╣ëα╕₧α╕Ñα╕▒α╕çα╕çα╕▓α╕Öα╕Ñα╕íα╣üα╕Ñα╕░α╣éα╕ïα╕Ñα╕▓α╕úα╣îα╕ùα╕╡α╣êα╣äα╕úα╣ëα╕íα╕Ñα╕₧α╕┤α╕⌐)',
      incorrect_reasons: 'B, C, D α╣äα╕íα╣êα╣Çα╕üα╕╡α╣êα╕óα╕ºα╕üα╕▒α╕Üα╣éα╕úα╕çα╕çα╕▓α╕Öα╕£α╕Ñα╕┤α╕òα╣éα╕ïα╕Ñα╕▓α╕úα╣îα╣Çα╕ïα╕Ñα╕Ñα╣îα╕éα╕¡α╕çα╕Üα╕úα╕┤α╕⌐α╕▒α╕ù'
    },
    tags: ['Part 6', 'Sentence Context'],
    cefr_level: 'B2'
  },
  {
    question_id: 't6_42',
    part: 6,
    passage_id: 'p6_pass3',
    passage_title: 'Press Release: GreenEnergy Corp Expansion',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best option for blank [42]:',
    choices: { A: 'published', B: 'publish', C: 'publisher', D: 'publishing' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣éα╕äα╕úα╕çα╕¬α╕úα╣ëα╕▓α╕ç Passive Voice "will be published" (α╕êα╕░α╕ûα╕╣α╕üα╣Çα╕£α╕óα╣üα╕₧α╕úα╣ê/α╕¢α╕úα╕░α╕üα╕▓α╕¿α╕Üα╕Öα╣Çα╕ºα╣çα╕Ü)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö V.base, C α╣Çα╕¢α╣çα╕Ö Noun, D α╣Çα╕¢α╣çα╕Ö Participle'
    },
    tags: ['Part 6', 'Passive Voice'],
    cefr_level: 'B1'
  },
  {
    question_id: 't6_43',
    part: 6,
    passage_id: 'p6_pass4',
    passage_title: 'Customer Service Notice: Fleet Logistics',
    passage_content: `<strong>Notice to Valued Clients</strong><br>
We are pleased to introduce our new tracking portal, designed to offer real-time updates on freight shipments. 
Clients can now monitor vehicle progress, estimated delivery times, and driver contacts <strong>[43]</strong> from their mobile devices.<br><br>
To set up your account, simply visit our homepage and click on the "Client Login" tab. 
You will be prompted to enter your master bill of lading number. 
<strong>[44]</strong>. 
Should you require assistance during setup, our 24/7 technical hotline remains <strong>[45]</strong> available.<br><br>
We appreciate your business and look forward to delivering <strong>[46]</strong> service.`,
    question_text: 'Select the best option for blank [43]:',
    choices: { A: 'conveniently', B: 'convenient', C: 'convenience', D: 'convening' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adverb "conveniently" α╕éα╕óα╕▓α╕óα╕üα╕úα╕┤α╕óα╕▓ monitor (α╕òα╕┤α╕öα╕òα╕▓α╕íα╕¬α╕ûα╕▓α╕Öα╕░α╣äα╕öα╣ëα╕¡α╕óα╣êα╕▓α╕çα╕¬α╕░α╕öα╕ºα╕üα╕¬α╕Üα╕▓α╕óα╕£α╣êα╕▓α╕Öα╕íα╕╖α╕¡α╕ûα╕╖α╕¡)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adjective, C α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Part 6', 'Adverb'],
    cefr_level: 'B1'
  },
  {
    question_id: 't6_44',
    part: 6,
    passage_id: 'p6_pass4',
    passage_title: 'Customer Service Notice: Fleet Logistics',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best sentence for blank [44]:',
    choices: {
      A: 'Once verified, full dashboard access will be granted instantly.',
      B: 'Shipments will be delayed during the holiday shutdown period.',
      C: 'Our truck drivers must hold valid commercial licences.',
      D: 'Fuel prices fluctuate according to international market trends.'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕¬α╕¡α╕öα╕äα╕Ñα╣ëα╕¡α╕çα╕üα╕▒α╕Üα╕éα╕▒α╣ëα╕Öα╕òα╕¡α╕Öα╕üα╣êα╕¡α╕Öα╕½α╕Öα╣ëα╕▓α╣Çα╕úα╕╖α╣êα╕¡α╕çα╕üα╕▓α╕úα╕¢α╣ëα╕¡α╕Öα╕½α╕íα╕▓α╕óα╣Çα╕Ñα╕éα╕Üα╕┤α╕Ñ (α╣Çα╕íα╕╖α╣êα╕¡α╕óα╕╖α╕Öα╕óα╕▒α╕Öα╣üα╕Ñα╣ëα╕º α╕¬α╕┤α╕ùα╕ÿα╕┤α╣îα╣Çα╕éα╣ëα╕▓α╕ûα╕╢α╕çα╣üα╕öα╕èα╕Üα╕¡α╕úα╣îα╕öα╕êα╕░α╣äα╕öα╣ëα╕úα╕▒α╕Üα╕üα╕▓α╕úα╕¡α╕Öα╕╕α╕íα╕▒α╕òα╕┤α╕ùα╕▒α╕Öα╕ùα╕╡)',
      incorrect_reasons: 'B, C, D α╣äα╕íα╣êα╣Çα╕èα╕╖α╣êα╕¡α╕íα╣éα╕óα╕çα╕üα╕▒α╕Üα╕üα╕▓α╕úα╕òα╕▒α╣ëα╕çα╕äα╣êα╕▓α╕Üα╕▒α╕ìα╕èα╕╡α╕úα╕░α╕Üα╕Üα╕òα╕┤α╕öα╕òα╕▓α╕íα╕₧α╕▒α╕¬α╕öα╕╕'
    },
    tags: ['Part 6', 'Sentence Insertion'],
    cefr_level: 'B2'
  },
  {
    question_id: 't6_45',
    part: 6,
    passage_id: 'p6_pass4',
    passage_title: 'Customer Service Notice: Fleet Logistics',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best option for blank [45]:',
    choices: { A: 'readily', B: 'ready', C: 'readiness', D: 'reading' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adverb "readily" α╕éα╕óα╕▓α╕ó Adjective "available" (α╕₧α╕úα╣ëα╕¡α╕íα╣âα╕½α╣ëα╕Üα╕úα╕┤α╕üα╕▓α╕úα╕òα╕Ñα╕¡α╕öα╣Çα╕ºα╕Ñα╕▓)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Adjective, C α╣Çα╕¢α╣çα╕Ö Noun'
    },
    tags: ['Part 6', 'Adverb Collocation'],
    cefr_level: 'B2'
  },
  {
    question_id: 't6_46',
    part: 6,
    passage_id: 'p6_pass4',
    passage_title: 'Customer Service Notice: Fleet Logistics',
    passage_content: 'See passage above for context.',
    question_text: 'Select the best option for blank [46]:',
    choices: { A: 'exceptional', B: 'exception', C: 'exceptionally', D: 'except' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕èα╣ë Adjective "exceptional" α╕éα╕óα╕▓α╕ó Noun "service" (α╕Üα╕úα╕┤α╕üα╕▓α╕úα╕¡α╕▒α╕Öα╕óα╕¡α╕öα╣Çα╕óα╕╡α╣êα╕óα╕íα╣Çα╕¢α╣çα╕Öα╕₧α╕┤α╣Çα╕¿α╕⌐)',
      incorrect_reasons: 'B α╣Çα╕¢α╣çα╕Ö Noun, C α╣Çα╕¢α╣çα╕Ö Adverb, D α╣Çα╕¢α╣çα╕Ö Preposition'
    },
    tags: ['Part 6', 'Adjective'],
    cefr_level: 'B1'
  },

  // --- PART 7 (Reading Comprehension) Single & Double Passages Q47 - Q100 ---
  {
    question_id: 't7_47',
    part: 7,
    passage_id: 'p7_pass1',
    passage_title: 'Single Passage: Email Inquiry Regarding Venue Booking',
    passage_content: `<strong>From:</strong> Sandra Bullock &lt;sandra.b@summitcorp.com&gt;<br>
<strong>To:</strong> Events Manager &lt;events@grandhorizonhotel.com&gt;<br>
<strong>Date:</strong> November 4<br>
<strong>Subject:</strong> Annual Regional Leadership Conference - Venue Inquiry<br><br>
Dear Events Team,<br><br>
I am writing on behalf of Summit Financial Solutions to inquire about reserving your Grand Ballroom for our upcoming Leadership Conference scheduled for Thursday, January 18.<br><br>
We expect approximately 250 attendees. Our program will run from 8:30 AM to 5:00 PM, followed by a networking reception until 7:30 PM. We will require full audio-visual support, including dual projection screens, wireless microphones, and high-speed Wi-Fi for all delegates.<br><br>
Additionally, we would like to request catering services: morning coffee with pastries, a buffet lunch with vegetarian options, and evening hors d'oeuvres during the reception.<br><br>
Could you please send us your current corporate package rate sheet and sample catering menus by Friday? If the ballroom is available, we would also like to schedule an on-site walkthrough next Tuesday.<br><br>
Best regards,<br>
Sandra Bullock<br>
Senior Corporate Event Coordinator<br>
Summit Financial Solutions`,
    question_text: 'What is the main purpose of the email?',
    choices: {
      A: 'To request information and availability for hosting a business conference',
      B: 'To cancel a previously booked hotel reservation',
      C: 'To file a complaint about hotel catering services',
      D: 'To apply for a job as an event planner'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕êα╕╕α╕öα╕¢α╕úα╕░α╕¬α╕çα╕äα╣îα╕½α╕Ñα╕▒α╕üα╕úα╕░α╕Üα╕╕α╣âα╕Öα╕¢α╕úα╕░α╣éα╕óα╕äα╣üα╕úα╕ü "inquire about reserving your Grand Ballroom for our upcoming Leadership Conference" α╣Çα╕₧α╕╖α╣êα╕¡α╕¬α╕¡α╕Üα╕ûα╕▓α╕íα╕úα╕▓α╕äα╕▓α╣üα╕Ñα╕░α╕äα╕ºα╕▓α╕íα╕₧α╕úα╣ëα╕¡α╕íα╣âα╕Öα╕üα╕▓α╕úα╕êα╕▒α╕öα╕çα╕▓α╕Öα╕¢α╕úα╕░α╕èα╕╕α╕í',
      incorrect_reasons: 'B α╕äα╕╖α╕¡α╕óα╕üα╣Çα╕Ñα╕┤α╕üα╕½α╣ëα╕¡α╕çα╕₧α╕▒α╕ü, C α╕äα╕╖α╕¡α╕úα╣ëα╕¡α╕çα╣Çα╕úα╕╡α╕óα╕Öα╕Üα╕úα╕┤α╕üα╕▓α╕úα╕¡α╕▓α╕½α╕▓α╕ú, D α╕äα╕╖α╕¡α╕¬α╕íα╕▒α╕äα╕úα╕çα╕▓α╕Ö'
    },
    tags: ['Part 7', 'Main Idea'],
    cefr_level: 'B1'
  },
  {
    question_id: 't7_48',
    part: 7,
    passage_id: 'p7_pass1',
    passage_title: 'Single Passage: Email Inquiry Regarding Venue Booking',
    passage_content: 'See email passage above.',
    question_text: 'How many attendees are expected at the event?',
    choices: { A: 'Approximately 250', B: 'Around 100', C: 'Over 500', D: 'Exactly 80' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕óα╣êα╕¡α╕½α╕Öα╣ëα╕▓α╕ùα╕╡α╣êα╕¬α╕¡α╕çα╕úα╕░α╕Üα╕╕α╕èα╕▒α╕öα╣Çα╕êα╕Öα╕ºα╣êα╕▓ "We expect approximately 250 attendees."',
      incorrect_reasons: 'α╕òα╕▒α╕ºα╣Çα╕Ñα╕╖α╕¡α╕üα╕¡α╕╖α╣êα╕Öα╣äα╕íα╣êα╕òα╕úα╕çα╕üα╕▒α╕Üα╕òα╕▒α╕ºα╣Çα╕Ñα╕é 250 α╣âα╕Öα╕êα╕öα╕½α╕íα╕▓α╕ó'
    },
    tags: ['Part 7', 'Factual Detail'],
    cefr_level: 'A2'
  },
  {
    question_id: 't7_49',
    part: 7,
    passage_id: 'p7_pass1',
    passage_title: 'Single Passage: Email Inquiry Regarding Venue Booking',
    passage_content: 'See email passage above.',
    question_text: 'What does Ms. Bullock request to be sent by Friday?',
    choices: {
      A: 'A rate sheet and sample catering menus',
      B: 'A signed contract agreement',
      C: 'A list of hotel room numbers',
      D: 'The biographies of key speakers'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕óα╣êα╕¡α╕½α╕Öα╣ëα╕▓α╕ùα╕╡α╣êα╕¬α╕╡α╣êα╕úα╕░α╕Üα╕╕ "Could you please send us your current corporate package rate sheet and sample catering menus by Friday?"',
      incorrect_reasons: 'α╕¬α╕▒α╕ìα╕ìα╕▓, α╣Çα╕Ñα╕éα╕½α╣ëα╕¡α╕çα╕₧α╕▒α╕ü α╣üα╕Ñα╕░α╕¢α╕úα╕░α╕ºα╕▒α╕òα╕┤α╕ºα╕┤α╕ùα╕óα╕▓α╕üα╕ú α╣äα╕íα╣êα╣äα╕öα╣ëα╕ûα╕╣α╕üα╕éα╕¡α╣âα╕½α╣ëα╕¬α╣êα╕çα╕áα╕▓α╕óα╣âα╕Öα╕ºα╕▒α╕Öα╕¿α╕╕α╕üα╕úα╣î'
    },
    tags: ['Part 7', 'Specific Information'],
    cefr_level: 'B1'
  },
  {
    question_id: 't7_50',
    part: 7,
    passage_id: 'p7_pass1',
    passage_title: 'Single Passage: Email Inquiry Regarding Venue Booking',
    passage_content: 'See email passage above.',
    question_text: 'What does Ms. Bullock wish to do next Tuesday if the venue is available?',
    choices: {
      A: 'Conduct an on-site walkthrough of the ballroom',
      B: 'Make a full advance payment',
      C: 'Deliver sound equipment to the hotel',
      D: 'Host a press conference'
    },
    correct_reason: 'α╕¢α╕úα╕░α╣éα╕óα╕äα╕¬α╕╕α╕öα╕ùα╣ëα╕▓α╕óα╕éα╕¡α╕çα╕óα╣êα╕¡α╕½α╕Öα╣ëα╕▓α╕ùα╕╡α╣êα╕¬α╕╡α╣êα╕úα╕░α╕Üα╕╕ "we would also like to schedule an on-site walkthrough next Tuesday."',
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕£α╕╣α╣ëα╣Çα╕éα╕╡α╕óα╕Öα╕òα╣ëα╕¡α╕çα╕üα╕▓α╕úα╣Çα╕éα╣ëα╕▓α╕èα╕íα╕¬α╕ûα╕▓α╕Öα╕ùα╕╡α╣êα╕êα╕úα╕┤α╕ç (on-site walkthrough) α╣âα╕Öα╕ºα╕▒α╕Öα╕¡α╕▒α╕çα╕äα╕▓α╕úα╕½α╕Öα╣ëα╕▓',
      incorrect_reasons: 'α╕üα╕▓α╕úα╕êα╣êα╕▓α╕óα╣Çα╕çα╕┤α╕Öα╕Ñα╣êα╕ºα╕çα╕½α╕Öα╣ëα╕▓, α╕éα╕Öα╕¡α╕╕α╕¢α╕üα╕úα╕ôα╣î α╣üα╕Ñα╕░α╕êα╕▒α╕öα╕çα╕▓α╕Öα╣üα╕ûα╕Ñα╕çα╕éα╣êα╕▓α╕º α╣äα╕íα╣êα╣äα╕öα╣ëα╕úα╕░α╕Üα╕╕α╣äα╕ºα╣ëα╣âα╕Öα╕ºα╕▒α╕Öα╕¡α╕▒α╕çα╕äα╕▓α╕ú'
    },
    tags: ['Part 7', 'Inference'],
    cefr_level: 'B2'
  },

  // --- PART 7 Double Passage (Email + Invoice): Q51 - Q55 ---
  {
    question_id: 't7_51',
    part: 7,
    passage_id: 'p7_pass2',
    passage_title: 'Double Passage: Order Confirmation & Invoice Discrepancy',
    passage_content: `<strong>Document 1: Purchase Order Confirmation</strong><br>
<strong>Vendor:</strong> Metro Office Supplies Ltd.<br>
<strong>Customer:</strong> Vanguard Tech Solutions<br>
<strong>Order Date:</strong> March 10<br>
<strong>Items Ordered:</strong><br>
- 10x Ergonomic Mesh Chairs (#EM-402) @ $220.00 each = $2,200.00<br>
- 5x Standing Desks (#SD-108) @ $450.00 each = $2,250.00<br>
- 2x Laser Printers (#LP-900) @ $310.00 each = $620.00<br>
<strong>Shipping:</strong> Expedited Freight = $150.00<br>
<strong>Total Paid:</strong> $5,220.00<br><br>
<hr>
<strong>Document 2: Email Regarding Delivery Discrepancy</strong><br>
<strong>From:</strong> Kevin Sterling &lt;k.sterling@vanguardtech.com&gt;<br>
<strong>To:</strong> Customer Service &lt;support@metrooffice.com&gt;<br>
<strong>Date:</strong> March 15<br>
<strong>Subject:</strong> Missing Items - Order #PO-88412<br><br>
Dear Customer Service,<br><br>
Our order #PO-88412 arrived at our office this morning. While the ergonomic chairs and standing desks were delivered in perfect condition, the shipping box contained only 1 Laser Printer (#LP-900) instead of the 2 units specified in our purchase order confirmation.<br><br>
Furthermore, we were billed the full amount of $5,220.00. Please arrange for the immediate shipment of the second laser printer or credit $310.00 back to our corporate credit card.<br><br>
Sincerely,<br>
Kevin Sterling<br>
Office Logistics Manager`,
    question_text: 'What item was missing from the delivered shipment?',
    choices: {
      A: 'One Laser Printer (#LP-900)',
      B: 'Five Standing Desks',
      C: 'Ten Ergonomic Mesh Chairs',
      D: 'Shipping insurance documentation'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕¡α╕╡α╣Çα╕íα╕Ñα╣âα╕Öα╣Çα╕¡α╕üα╕¬α╕▓α╕úα╕èα╕╕α╕öα╕ùα╕╡α╣ê 2 α╕úα╕░α╕Üα╕╕α╕èα╕▒α╕öα╣Çα╕êα╕Öα╕ºα╣êα╕▓α╣äα╕öα╣ëα╕úα╕▒α╕Üα╣Çα╕äα╕úα╕╖α╣êα╕¡α╕çα╕₧α╕┤α╕íα╕₧α╣îα╣Çα╕₧α╕╡α╕óα╕ç 1 α╣Çα╕äα╕úα╕╖α╣êα╕¡α╕çα╕êα╕▓α╕üα╕ùα╕╡α╣êα╕¬α╕▒α╣êα╕çα╣äα╕¢ 2 α╣Çα╕äα╕úα╕╖α╣êα╕¡α╕ç ("contained only 1 Laser Printer (#LP-900) instead of 2")',
      incorrect_reasons: 'α╣Çα╕üα╣ëα╕▓α╕¡α╕╡α╣ëα╣üα╕Ñα╕░α╣éα╕òα╣èα╕░α╣äα╕öα╣ëα╕úα╕▒α╕Üα╕äα╕úα╕Üα╕ûα╣ëα╕ºα╕Öα╕òα╕▓α╕íα╕¢α╕üα╕òα╕┤α╕òα╕▓α╕íα╕ùα╕╡α╣êα╕úα╕░α╕Üα╕╕α╣âα╕Öα╕¡α╕╡α╣Çα╕íα╕Ñ'
    },
    tags: ['Part 7', 'Cross-Reference'],
    cefr_level: 'B1'
  },
  {
    question_id: 't7_52',
    part: 7,
    passage_id: 'p7_pass2',
    passage_title: 'Double Passage: Order Confirmation & Invoice Discrepancy',
    passage_content: 'See double passage above.',
    question_text: 'What total amount was paid by Vanguard Tech Solutions?',
    choices: { A: '$5,220.00', B: '$4,450.00', C: '$2,200.00', D: '$310.00' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕óα╕¡α╕öα╕úα╕ºα╕íα╕ùα╕▒α╣ëα╕çα╕½α╕íα╕öα╣âα╕Öα╣âα╕Üα╕¬α╕▒α╣êα╕çα╕ïα╕╖α╣ëα╕¡α╣üα╕Ñα╕░α╣âα╕Öα╕¡α╕╡α╣Çα╕íα╕Ñα╕äα╕╖α╕¡ $5,220.00',
      incorrect_reasons: '$310 α╕äα╕╖α╕¡α╕úα╕▓α╕äα╕▓α╣Çα╕äα╕úα╕╖α╣êα╕¡α╕çα╕₧α╕┤α╕íα╕₧α╣î 1 α╣Çα╕äα╕úα╕╖α╣êα╕¡α╕ç, $2,200 α╕äα╕╖α╕¡α╕úα╕▓α╕äα╕▓α╣Çα╕üα╣ëα╕▓α╕¡α╕╡α╣ëα╕úα╕ºα╕í'
    },
    tags: ['Part 7', 'Factual Detail'],
    cefr_level: 'A2'
  },
  {
    question_id: 't7_53',
    part: 7,
    passage_id: 'p7_pass2',
    passage_title: 'Double Passage: Order Confirmation & Invoice Discrepancy',
    passage_content: 'See double passage above.',
    question_text: 'What solutions does Mr. Sterling suggest in his email?',
    choices: {
      A: 'Send the missing printer or refund $310.00 to their account',
      B: 'Cancel the entire order and demand a full refund',
      C: 'Exchange the standing desks for larger executive desks',
      D: 'Provide free shipping on future office equipment orders'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕Öα╕¡α╕╡α╣Çα╕íα╕Ñα╕óα╣êα╕¡α╕½α╕Öα╣ëα╕▓α╕ùα╕╡α╣êα╕¬α╕¡α╕çα╕úα╕░α╕Üα╕╕ "arrange for the immediate shipment of the second laser printer or credit $310.00 back to our corporate credit card."',
      incorrect_reasons: 'α╣äα╕íα╣êα╣äα╕öα╣ëα╕éα╕¡α╕óα╕üα╣Çα╕Ñα╕┤α╕üα╕ùα╕▒α╣ëα╕çα╕½α╕íα╕ö α╣äα╕íα╣êα╣äα╕öα╣ëα╕éα╕¡α╣Çα╕¢α╕Ñα╕╡α╣êα╕óα╕Öα╣éα╕òα╣èα╕░ α╣üα╕Ñα╕░α╣äα╕íα╣êα╣äα╕öα╣ëα╕éα╕¡α╕¬α╣êα╕çα╕ƒα╕úα╕╡α╣âα╕Öα╕¡α╕Öα╕▓α╕äα╕ò'
    },
    tags: ['Part 7', 'Cross-Reference'],
    cefr_level: 'B2'
  },
  {
    question_id: 't7_54',
    part: 7,
    passage_id: 'p7_pass2',
    passage_title: 'Double Passage: Order Confirmation & Invoice Discrepancy',
    passage_content: 'See double passage above.',
    question_text: 'What is Mr. SterlingΓÇÖs job title?',
    choices: {
      A: 'Office Logistics Manager',
      B: 'Chief Financial Officer',
      C: 'Senior Sales Representative',
      D: 'IT Helpdesk Specialist'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╕ùα╣ëα╕▓α╕óα╕Ñα╕▓α╕óα╣Çα╕ïα╣çα╕Öα╕¡α╕╡α╣Çα╕íα╕Ñα╕éα╕¡α╕ç Mr. Sterling α╕úα╕░α╕Üα╕╕α╕òα╕│α╣üα╕½α╕Öα╣êα╕ç "Office Logistics Manager"',
      incorrect_reasons: 'α╕òα╕▒α╕ºα╣Çα╕Ñα╕╖α╕¡α╕üα╕¡α╕╖α╣êα╕Öα╣äα╕íα╣êα╕òα╕úα╕çα╕üα╕▒α╕Üα╕òα╕│α╣üα╕½α╕Öα╣êα╕çα╣âα╕Öα╕Ñα╕▓α╕óα╣Çα╕ïα╣çα╕Öα╕¡α╕╡α╣Çα╕íα╕Ñ'
    },
    tags: ['Part 7', 'Factual Information'],
    cefr_level: 'A2'
  },
  {
    question_id: 't7_55',
    part: 7,
    passage_id: 'p7_pass2',
    passage_title: 'Double Passage: Order Confirmation & Invoice Discrepancy',
    passage_content: 'See double passage above.',
    question_text: 'How much did each Standing Desk cost?',
    choices: { A: '$450.00', B: '$220.00', C: '$310.00', D: '$150.00' },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'α╣âα╕Üα╕¬α╕▒α╣êα╕çα╕ïα╕╖α╣ëα╕¡α╕úα╕░α╕Üα╕╕ 5x Standing Desks (#SD-108) @ $450.00 each',
      incorrect_reasons: '$220 α╕äα╕╖α╕¡α╕úα╕▓α╕äα╕▓α╣Çα╕üα╣ëα╕▓α╕¡α╕╡α╣ë, $310 α╕äα╕╖α╕¡α╕úα╕▓α╕äα╕▓α╣Çα╕äα╕úα╕╖α╣êα╕¡α╕çα╕₧α╕┤α╕íα╕₧α╣î, $150 α╕äα╕╖α╕¡α╕äα╣êα╕▓α╕¬α╣êα╕ç'
    },
    tags: ['Part 7', 'Data Lookup'],
    cefr_level: 'A2'
  }
];

function shuffleQuestionChoices(q) {
  const item = typeof q.toObject === 'function' ? q.toObject() : JSON.parse(JSON.stringify(q));
  
  const originalChoices = item.choices;
  const originalCorrectKey = item.correct_answer;
  const originalCorrectText = originalChoices ? originalChoices[originalCorrectKey] : null;

  if (!originalCorrectText) return item;

  const entries = [
    { text: originalChoices.A, isCorrect: originalCorrectKey === 'A' },
    { text: originalChoices.B, isCorrect: originalCorrectKey === 'B' },
    { text: originalChoices.C, isCorrect: originalCorrectKey === 'C' },
    { text: originalChoices.D, isCorrect: originalCorrectKey === 'D' }
  ];

  // Deterministic hash based on question_id so choices are varied across A, B, C, D
  let hash = 0;
  const str = String(item.question_id || Math.random());
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  const keys = ['A', 'B', 'C', 'D'];
  const targetCorrectIndex = Math.abs(hash) % 4;
  const targetCorrectKey = keys[targetCorrectIndex];

  const wrongEntries = entries.filter(e => !e.isCorrect);
  const newChoices = {};
  
  keys.forEach(k => {
    if (k === targetCorrectKey) {
      newChoices[k] = originalCorrectText;
    } else {
      const wrong = wrongEntries.pop();
      newChoices[k] = wrong ? wrong.text : 'Option';
    }
  });

  return {
    ...item,
    choices: newChoices,
    correct_answer: targetCorrectKey
  };
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Attempt MongoDB connection & query
    let questions = [];
    try {
      await connectToDatabase();
      questions = await ToeicQuestion.find({}).sort({ part: 1, question_id: 1 });
      
      // Auto-seed initial 100 question pool if MongoDB collection is empty
      if (!questions || questions.length === 0) {
        console.log('Seeding initial TOEIC Reading question dataset into MongoDB Atlas...');
        await ToeicQuestion.insertMany(PRESEEDED_QUESTIONS);
        questions = await ToeicQuestion.find({}).sort({ part: 1, question_id: 1 });
      }
    } catch (dbErr) {
      console.warn('MongoDB connection failed, serving in-memory pre-seeded question pool:', dbErr.message);
      questions = PRESEEDED_QUESTIONS;
    }

    const mode = req.query.mode || 'full'; // 'full' (100 Qs) or 'quick' (20 Qs)
    let selectedQuestions = questions;

    if (mode === 'quick') {
      // Proportional 20-question sampling: 6 Part 5, 3 Part 6, 11 Part 7
      const part5 = questions.filter(q => q.part === 5);
      const part6 = questions.filter(q => q.part === 6);
      const part7 = questions.filter(q => q.part === 7);

      selectedQuestions = [
        ...part5.slice(0, 6),
        ...part6.slice(0, 3),
        ...part7.slice(0, 11)
      ];
    }

    // Clean AI Generated prefix and Deduplicate by question text
    const seenTexts = new Set();
    const cleanUniqueQuestions = [];

    for (const qObj of selectedQuestions) {
      const q = qObj._doc || qObj;
      const rawText = String(q.question_text || '');
      const cleanedText = rawText.replace(/^\[AI Generated Q?\d*\]\s*/i, '').trim();
      const textKey = cleanedText.toLowerCase();

      if (cleanedText && !seenTexts.has(textKey)) {
        seenTexts.add(textKey);
        cleanUniqueQuestions.push({
          ...q,
          question_text: cleanedText
        });
      }
    }

    // Shuffle choices evenly across A, B, C, D
    const shuffledQuestions = cleanUniqueQuestions.map(q => shuffleQuestionChoices(q));

    return res.status(200).json({
      success: true,
      mode,
      total: shuffledQuestions.length,
      questions: shuffledQuestions
    });
  } catch (err) {
    console.error('TOEIC questions handler error:', err);
    return res.status(500).json({
      error: 'Failed to fetch TOEIC questions',
      message: err.message
    });
  }
};
