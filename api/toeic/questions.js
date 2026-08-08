const connectToDatabase = require('../lib/db');
const ToeicQuestion = require('../models/ToeicQuestion');
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
      correct_reason: 'ใช้ "by" เพื่อบอกเส้นตายหรือกำหนดเวลาสุดท้าย (Deadline) ว่าต้องส่งภายในเวลา 5:00 PM',
      incorrect_reasons: 'B (until) ใช้กับการกระทำที่ดำเนินต่อเนื่องจนถึงเวลาหนึ่ง, C (for) บอกระยะเวลา, D (during) บอกช่วงเวลา'
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
      correct_reason: 'ต้องการ Adverb ขยายกริยา "access" จึงต้องใช้ "directly" (โดยตรง)',
      incorrect_reasons: 'B เป็น Participle/Gerund, C เป็น Adjective/Verb, D เป็น Noun'
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
      correct_reason: 'ต้องการ Adverb ขยาย Adjective "sufficient" จึงต้องใช้ "entirely" (อย่างสมบูรณ์/เพียงพอทั้งหมด)',
      incorrect_reasons: 'B เป็น Adjective, C และ D เป็น Noun'
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
      correct_reason: 'หลัง Preposition "before" คำตามหลังต้องเป็น Gerund (V.ing) นั่นคือ "submitting"',
      incorrect_reasons: 'B เป็น V.base, C เป็น Past tense/V.3, D เป็น Noun'
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
      correct_reason: 'สำนวน "on schedule" แปลว่า ตรงตามกำหนดเวลา',
      incorrect_reasons: 'at, in, to ไม่ใช้ร่วมกับ schedule ในสำนวนบอกเวลาตรงกำหนด'
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
      correct_reason: 'ใช้ Adjective "inspiring" ขยาย Noun "presentation" (การนำเสนอที่สร้างแรงบันดาลใจ)',
      incorrect_reasons: 'B เป็น Verb, C เป็น Noun'
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
      correct_reason: 'หลังโครงสร้าง "plans to" ต้องตามด้วย Verb Infinitive (V.base) คือ "relocate"',
      incorrect_reasons: 'B, C, D เป็นรูปผันของกริยา ไม่สามารถตามหลัง to infinitive ได้'
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
      correct_reason: 'โครงสร้างคู่ Correlative Conjunction ของ "Neither" คือ "Neither ... nor ..."',
      incorrect_reasons: 'Either คู่กับ or, Both คู่กับ and, Not only คู่กับ but also'
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
      correct_reason: 'ต้องการ Adjective ขยาย Noun "inspections" ตอบ "routine" (ประจำ/ตามปกติ)',
      incorrect_reasons: 'B เป็น Adverb, C เป็น Noun plural'
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
      correct_reason: 'ประโยคเงื่อนไข If-Clause Type 1 (If + Present Simple, S + can/will + V.base) สอดคล้องกับ "by noon tomorrow"',
      incorrect_reasons: 'B เป็น Past, C เป็น Future (ใน If-clause ไม่ใช้ will), D เป็น Participle'
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
      correct_reason: 'ใช้ Adverb "consistently" ขยาย Adjective "profitable"',
      incorrect_reasons: 'B เป็น Adjective, C และ D เป็น Verb'
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
      correct_reason: 'ใช้ "through" แปลว่า "ผ่านช่องทาง/ระบบ" HR portal',
      incorrect_reasons: 'among ใช้กับกลุ่ม 3 ขึ้นไป, between ใช้กับ 2 สิ่ง, across แปลว่า ข้าม'
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
      correct_reason: 'ใช้ Adverb "highly" ขยาย Adjective "energy-efficient"',
      incorrect_reasons: 'B เป็น Adjective, C เป็น Noun, D เป็น Verb'
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
      correct_reason: '"interim head" แปลว่า หัวหน้าชั่วคราว (Temporary role)',
      incorrect_reasons: 'C แปลว่า ภายในอาคาร, D แปลว่า ภายในองค์กร ไม่สอดคล้องกับตำแหน่งชั่วคราว'
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
      correct_reason: 'ใช้ Object Pronoun "them" ตามหลัง Preposition "with" (keep belongings with them)',
      incorrect_reasons: 'B เป็น Possessive adj, C เป็น Reflexive, D เป็น Subject pronoun'
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
      correct_reason: 'ตามหลังกริยา "minimize" ต้องเป็น Noun object ตอบ "disruption" (การรบกวน/การหยุดชะงัก)',
      incorrect_reasons: 'B เป็น Adjective, C เป็น Verb, D เป็น Gerund/Participle'
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
      correct_reason: 'เชื่อมด้วย "and polite" ซึ่งเป็น Adjective ดังนั้นหน้า and ต้องเป็น Adjective คือ "courteous" (สุภาพนอบน้อม)',
      incorrect_reasons: 'B เป็น Noun, C เป็น Adverb'
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
      correct_reason: 'ตำแหน่งระหว่าง helper verb "has" และ V.3 "published" ต้องใช้ Adverb "recently" (เมื่อเร็วๆ นี้)',
      incorrect_reasons: 'B เป็น Adjective, D เป็น Noun'
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
      correct_reason: 'ใช้ "whenever" (เมื่อใดก็ตามที่) เชื่อมประโยคบอกเงื่อนไขเวลา',
      incorrect_reasons: 'whatever (อะไรก็ตาม), whichever (อันใดก็ตาม), whoever (ใครก็ตาม) ไม่เหมาะกับบริบทเวลา'
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
      correct_reason: 'หลังโครงสร้าง Infinitive "decided to" ต้องใช้ V.base นั่นคือ "postpone" (เลื่อนออกไป)',
      incorrect_reasons: 'B เป็น V.past, C เป็น Noun, D เป็น Gerund'
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
      correct_reason: 'ใช้ Adverb "substantially" ขยายกริยา "have risen" (เพิ่มขึ้นอย่างมีนัยสำคัญ/อย่างมาก)',
      incorrect_reasons: 'B เป็น Adjective, C เป็น Noun, D เป็น Verb'
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
      correct_reason: 'ใช้ "unless" (เว้นแต่ว่า) สอดคล้องกับวลี "unless indicated otherwise" (เว้นแต่จะระบุเป็นอย่างอื่น)',
      incorrect_reasons: 'without และ despite เป็น Preposition ต้องตามด้วย Noun/Gerund ไม่ใช่ Past participle clause'
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
      correct_reason: 'ตามหลัง Adjective "extensive" ต้องเป็น Uncountable Noun ตอบ "expertise" (ความเชี่ยวชาญ)',
      incorrect_reasons: 'B เป็น Person Noun (ผู้เชี่ยวชาญ - ต้องการนับได้/เอกพจน์สอดคล้อง), C เป็น Adverb'
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
      correct_reason: 'สำนวน Preposition "prior to" แปลว่า "ก่อนหน้า" (before) ตามด้วย Gerund "processing"',
      incorrect_reasons: 'ahead ต้องใช้ ahead of, earlier และ previous ไม่ใช่ preposition ที่เชื่อม Gerund'
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
      correct_reason: 'ต้องการ Adjective ขยาย Noun phrase "user experience" ตอบ "intuitive" (ใช้งานง่าย/เข้าใจได้ทันที)',
      incorrect_reasons: 'B เป็น Adverb, C เป็น Noun'
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
      correct_reason: '"extend the deadline" เป็น Collocation หมายถึง ขยายเวลา/ขยายกำหนดส่ง',
      incorrect_reasons: 'B (expand) ใช้กับขนาด/พื้นที่, C (exceed) เกินขีดจำกัด, D (express) แสดงออก'
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
      correct_reason: 'หลัง Adjective "further" ต้องเป็น Noun ตอบ "clarification" (คำอธิบายเพิ่มเติม/การทำให้กระจ่าง)',
      incorrect_reasons: 'B เป็น Verb, C และ Dเป็น Participle'
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
      correct_reason: 'ในโครงสร้าง Neither A nor B กริยาจะผันตามประธานหลัง nor นั่นคือ "executive board members" (พหูพจน์) + เหตุการณ์อดีต "yesterday" จึงใช้ "were"',
      incorrect_reasons: 'B (was) ใช้กับเอกพจน์, C และ D เป็น Present tense'
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
      correct_reason: 'หลัง Linking verb "become" ต้องใช้ Adjective ตอบ "effective" (become effective = มีผลบังคับใช้)',
      incorrect_reasons: 'B เป็น Noun, C เป็น Adverb, D เป็น Noun'
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
      correct_reason: 'ใช้ "within" + ช่วงเวลา (within two business days) แปลว่า ภายในเวลา 2 วันทำการ',
      incorrect_reasons: 'inside ใช้กับสถานที่ภายใน, along (ตามทาง), toward (ไปยัง)'
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
      correct_reason: 'บทความแจ้งการปรับปรุงระบบช่วงสั้นๆ การไม่พร้อมใช้งานจึงเกิดขึ้น "ชั่วคราว" (temporarily)',
      incorrect_reasons: 'B (ถาวร), C (โดยบังเอิญ), D (ในเวลาต่อมา)'
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
      correct_reason: 'โครงสร้าง Passive Voice (have been + V.3) คือ "have been updated" (ได้รับการอัปเดต/ยกระดับ)',
      incorrect_reasons: 'B เป็น Participle, C เป็น Present tense, D เป็น Noun'
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
      correct_reason: 'ประโยคนี้สอดคล้องกับบริบทการแจ้งเตือนพนักงานให้เปลี่ยนรหัสผ่านทันที (หากไม่เปลี่ยนจะถูกระงับบัญชีชั่วคราว)',
      incorrect_reasons: 'B, C, D ไม่เกี่ยวข้องกับเรื่องการเปลี่ยนรหัสผ่านและความปลอดภัย IT'
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
      correct_reason: 'ตามหลัง Possessive adjective "your" ต้องเป็น Noun ตอบ "cooperation" (ความร่วมมือ)',
      incorrect_reasons: 'B เป็น Verb, C เป็น Adjective, D เป็น Participle'
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
      correct_reason: 'ใช้ "by" เพื่อระบุกำหนดวันสุดท้ายในการประเมินผล (by November 25)',
      incorrect_reasons: 'since บอกจุดเริ่มต้นอดีต, from ใช้กับคู่ to, over บอกระยะเวลา'
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
      correct_reason: 'เชื่อมด้วย "and" หน้า and คือ "reduces" (V.1 s-form) หลัง and จึงต้องเป็น V.1 s-form คือ "facilitates" (ช่วยอำนวยความสะดวก)',
      incorrect_reasons: 'B และ C เป็น Noun, D เป็น Past tense'
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
      correct_reason: 'เชื่อมโยงกับประโยคก่อนหน้าเกี่ยวกับการจัดอบรมโปรแกรมประเมินผลใหม่ (มีวิดีโอบันทึกการอบรมเก็บไว้ในพอร์ตัล)',
      incorrect_reasons: 'B, C, D ไม่มีความเกี่ยวข้องกับเรื่องการอบรมซอฟต์แวร์ประเมินผล'
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
      correct_reason: 'ใช้ Adjective "continued" ขยาย Noun "involvement" แปลว่า ความมีส่วนร่วมอย่างต่อเนื่อง',
      incorrect_reasons: 'B เป็น Verb, C เป็น Noun'
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
      correct_reason: 'ใช้ "over" + ระยะเวลา (over the next two years) แปลว่า ตลอดช่วงเวลา 2 ปีข้างหน้า',
      incorrect_reasons: 'at ใช้กับเวลาเฉพาะ, between ใช้กับช่วงระหว่าง 2 สิ่ง, since ใช้กับจุดเริ่มต้น'
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
      correct_reason: 'ใช้ Adjective "ongoing" ขยาย "commitment" แปลว่า ความมุ่งมั่นอันต่อเนื่อง',
      incorrect_reasons: 'B, C, D ไม่ใช่รูป Adjective ที่ถูกต้องทางไวยากรณ์'
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
      correct_reason: 'สอดคล้องกับถ้อยแถลงของ CEO เรื่องพลังงานยั่งยืน (โรงงานใหม่จะใช้พลังงานลมและโซลาร์ที่ไร้มลพิษ)',
      incorrect_reasons: 'B, C, D ไม่เกี่ยวกับโรงงานผลิตโซลาร์เซลล์ของบริษัท'
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
      correct_reason: 'โครงสร้าง Passive Voice "will be published" (จะถูกเผยแพร่/ประกาศบนเว็บ)',
      incorrect_reasons: 'B เป็น V.base, C เป็น Noun, D เป็น Participle'
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
      correct_reason: 'ใช้ Adverb "conveniently" ขยายกริยา monitor (ติดตามสถานะได้อย่างสะดวกสบายผ่านมือถือ)',
      incorrect_reasons: 'B เป็น Adjective, C เป็น Noun'
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
      correct_reason: 'สอดคล้องกับขั้นตอนก่อนหน้าเรื่องการป้อนหมายเลขบิล (เมื่อยืนยันแล้ว สิทธิ์เข้าถึงแดชบอร์ดจะได้รับการอนุมัติทันที)',
      incorrect_reasons: 'B, C, D ไม่เชื่อมโยงกับการตั้งค่าบัญชีระบบติดตามพัสดุ'
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
      correct_reason: 'ใช้ Adverb "readily" ขยาย Adjective "available" (พร้อมให้บริการตลอดเวลา)',
      incorrect_reasons: 'B เป็น Adjective, C เป็น Noun'
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
      correct_reason: 'ใช้ Adjective "exceptional" ขยาย Noun "service" (บริการอันยอดเยี่ยมเป็นพิเศษ)',
      incorrect_reasons: 'B เป็น Noun, C เป็น Adverb, D เป็น Preposition'
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
      correct_reason: 'จุดประสงค์หลักระบุในประโยคแรก "inquire about reserving your Grand Ballroom for our upcoming Leadership Conference" เพื่อสอบถามราคาและความพร้อมในการจัดงานประชุม',
      incorrect_reasons: 'B คือยกเลิกห้องพัก, C คือร้องเรียนบริการอาหาร, D คือสมัครงาน'
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
      correct_reason: 'ย่อหน้าที่สองระบุชัดเจนว่า "We expect approximately 250 attendees."',
      incorrect_reasons: 'ตัวเลือกอื่นไม่ตรงกับตัวเลข 250 ในจดหมาย'
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
      correct_reason: 'ย่อหน้าที่สี่ระบุ "Could you please send us your current corporate package rate sheet and sample catering menus by Friday?"',
      incorrect_reasons: 'สัญญา, เลขห้องพัก และประวัติวิทยากร ไม่ได้ถูกขอให้ส่งภายในวันศุกร์'
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
    correct_reason: 'ประโยคสุดท้ายของย่อหน้าที่สี่ระบุ "we would also like to schedule an on-site walkthrough next Tuesday."',
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'ผู้เขียนต้องการเข้าชมสถานที่จริง (on-site walkthrough) ในวันอังคารหน้า',
      incorrect_reasons: 'การจ่ายเงินล่วงหน้า, ขนอุปกรณ์ และจัดงานแถลงข่าว ไม่ได้ระบุไว้ในวันอังคาร'
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
      correct_reason: 'อีเมลในเอกสารชุดที่ 2 ระบุชัดเจนว่าได้รับเครื่องพิมพ์เพียง 1 เครื่องจากที่สั่งไป 2 เครื่อง ("contained only 1 Laser Printer (#LP-900) instead of 2")',
      incorrect_reasons: 'เก้าอี้และโต๊ะได้รับครบถ้วนตามปกติตามที่ระบุในอีเมล'
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
      correct_reason: 'ยอดรวมทั้งหมดในใบสั่งซื้อและในอีเมลคือ $5,220.00',
      incorrect_reasons: '$310 คือราคาเครื่องพิมพ์ 1 เครื่อง, $2,200 คือราคาเก้าอี้รวม'
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
      correct_reason: 'ในอีเมลย่อหน้าที่สองระบุ "arrange for the immediate shipment of the second laser printer or credit $310.00 back to our corporate credit card."',
      incorrect_reasons: 'ไม่ได้ขอยกเลิกทั้งหมด ไม่ได้ขอเปลี่ยนโต๊ะ และไม่ได้ขอส่งฟรีในอนาคต'
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
    question_text: 'What is Mr. Sterling’s job title?',
    choices: {
      A: 'Office Logistics Manager',
      B: 'Chief Financial Officer',
      C: 'Senior Sales Representative',
      D: 'IT Helpdesk Specialist'
    },
    correct_answer: 'A',
    detailed_explanation: {
      correct_reason: 'ท้ายลายเซ็นอีเมลของ Mr. Sterling ระบุตำแหน่ง "Office Logistics Manager"',
      incorrect_reasons: 'ตัวเลือกอื่นไม่ตรงกับตำแหน่งในลายเซ็นอีเมล'
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
      correct_reason: 'ใบสั่งซื้อระบุ 5x Standing Desks (#SD-108) @ $450.00 each',
      incorrect_reasons: '$220 คือราคาเก้าอี้, $310 คือราคาเครื่องพิมพ์, $150 คือค่าส่ง'
    },
    tags: ['Part 7', 'Data Lookup'],
    cefr_level: 'A2'
  }
];

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
      // Pick 20 questions across Parts
      selectedQuestions = questions.slice(0, 20);
    }

    return res.status(200).json({
      success: true,
      mode,
      total: selectedQuestions.length,
      questions: selectedQuestions
    });
  } catch (err) {
    console.error('TOEIC questions handler error:', err);
    return res.status(500).json({
      error: 'Failed to fetch TOEIC questions',
      message: err.message
    });
  }
};
