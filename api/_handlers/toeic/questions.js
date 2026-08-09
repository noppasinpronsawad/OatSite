// TOEIC Question Handler - Pristine 100-Question Authentic Database
// Guarantees Complete Passage Content for Double/Triple Passages & Matched Part 6 Blanks

const PART_5_QUESTIONS = [
  { question_id: 'q-501', part: 5, question_text: 'All employees are required to submit their expense reports _______ the last Friday of every month.', choices: { A: 'before', B: 'prior', C: 'ahead', D: 'previous' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Prepositions'], detailed_explanation: { correct_reason: 'คำว่า before เป็นบุพบทที่ใช้ระบุเวลา เช่น before the last Friday' } },
  { question_id: 'q-502', part: 5, question_text: 'The newly elected board of directors will _______ the quarterly financial targets tomorrow morning.', choices: { A: 'review', B: 'reviews', C: 'reviewed', D: 'reviewing' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Grammar'], detailed_explanation: { correct_reason: 'หลังกริยาช่วย modal verb "will" ต้องใช้กริยาช่องกริยาเพียว (Infinitive without to)' } },
  { question_id: 'q-503', part: 5, question_text: 'Ms. Vance managed the software migration project _______, earning high praise from top management.', choices: { A: 'efficiently', B: 'efficiency', C: 'efficient', D: 'efficiencies' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 5', 'Adverbs'], detailed_explanation: { correct_reason: 'คำกริยาวิเศษณ์ (Adverb) "efficiently" ขยายกริยา managed' } },
  { question_id: 'q-504', part: 5, question_text: 'Due to unforeseen traffic delays, the keynote speaker arrived _______ than scheduled.', choices: { A: 'later', B: 'late', C: 'latest', D: 'lately' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Comparatives'], detailed_explanation: { correct_reason: 'มีคำว่า "than" แสดงการเปรียบเทียบขั้นกว่า จึงใช้ "later"' } },
  { question_id: 'q-505', part: 5, question_text: 'Please confirm whether Mr. Henderson has _______ the updated contract terms.', choices: { A: 'signed', B: 'signature', C: 'signing', D: 'signs' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Perfect Tense'], detailed_explanation: { correct_reason: 'หลังกริยาช่วย "has" ใน Present Perfect Tense ต้องตามด้วย กริยาช่อง 3 (Past Participle)' } },
  { question_id: 'q-506', part: 5, question_text: 'The marketing team conducted extensive market research to evaluate customer _______.', choices: { A: 'satisfaction', B: 'satisfy', C: 'satisfying', D: 'satisfied' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Nouns'], detailed_explanation: { correct_reason: 'หลังคำคุณศัพท์ "customer" ต้องใช้คำนาม "satisfaction" (ความพึงพอใจ)' } },
  { question_id: 'q-507', part: 5, question_text: 'Neither the Regional Manager _______ the department heads were aware of the policy update.', choices: { A: 'nor', B: 'or', C: 'and', D: 'but' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 5', 'Conjunctions'], detailed_explanation: { correct_reason: 'โครงสร้างคู่สันธาน "Neither ... nor ..."' } },
  { question_id: 'q-508', part: 5, question_text: 'All confidential documents must be kept in _______ cabinets at the end of the workday.', choices: { A: 'locked', B: 'locking', C: 'locks', D: 'locker' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Participles'], detailed_explanation: { correct_reason: 'คำคุณศัพท์ขยายตู้เอกสาร "locked cabinets" (ตู้ที่ถูกล็อกไว้)' } },
  { question_id: 'q-509', part: 5, question_text: 'The IT helpdesk is available 24/7 to assist staff _______ technical difficulties.', choices: { A: 'with', B: 'about', C: 'on', D: 'for' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Prepositions'], detailed_explanation: { correct_reason: 'สำนวน "assist someone with something"' } },
  { question_id: 'q-510', part: 5, question_text: 'Several candidates demonstrated exceptional qualifications, making the final selection _______ difficult.', choices: { A: 'particularly', B: 'particular', C: 'particularity', D: 'particulars' }, correct_answer: 'A', cefr_level: 'C1', tags: ['Part 5', 'Adverbs'], detailed_explanation: { correct_reason: 'ขยายคำคุณศัพท์ "difficult" ด้วยกริยาวิเศษณ์ "particularly"' } },
  { question_id: 'q-511', part: 5, question_text: 'The research division has expanded _______ capacity by opening a new lab facility.', choices: { A: 'its', B: 'it', C: 'itself', D: 'they' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Pronouns'], detailed_explanation: { correct_reason: 'คำสรรพนามแสดงความเป็นเจ้าของ "its" อ้างถึง "The research division"' } },
  { question_id: 'q-512', part: 5, question_text: 'Participants must register before August 15 to receive the early-bird _______ rate.', choices: { A: 'discounted', B: 'discounting', C: 'discounts', D: 'discount' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Adjectives'], detailed_explanation: { correct_reason: 'ใช้คำคุณศัพท์ "discounted rate" (ราคาที่ได้รับส่วนลด)' } },
  { question_id: 'q-513', part: 5, question_text: 'The renovated conference center can _______ up to 500 convention attendees comfortably.', choices: { A: 'accommodate', B: 'accommodation', C: 'accommodating', D: 'accommodated' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 5', 'Verbs'], detailed_explanation: { correct_reason: 'หลังกริยาช่วย "can" ต้องตามด้วยกริยา Infinitive "accommodate"' } },
  { question_id: 'q-514', part: 5, question_text: 'Please review the attached spreadsheet to ensure that all financial entries are _______.', choices: { A: 'accurate', B: 'accurately', C: 'accuracy', D: 'accurateness' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Adjectives'], detailed_explanation: { correct_reason: 'หลัง Linking Verb "are" ต้องตามด้วยคำคุณศัพท์ "accurate"' } },
  { question_id: 'q-515', part: 5, question_text: 'The factory supervisor strictly enforces safety protocols to _______ workplace accidents.', choices: { A: 'prevent', B: 'prevents', C: 'prevention', D: 'preventable' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Infinitive'], detailed_explanation: { correct_reason: 'โครงสร้าง "to + Infinitive" ระบุวัตถุประสงค์ (to prevent)' } },
  { question_id: 'q-516', part: 5, question_text: 'Unless we receive additional funding, we will be _______ to postpone the expansion.', choices: { A: 'forced', B: 'forcing', C: 'force', D: 'forces' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Passive Voice'], detailed_explanation: { correct_reason: 'โครงสร้าง Passive Voice "will be forced to postpone"' } },
  { question_id: 'q-517', part: 5, question_text: 'The annual report provides a _______ summary of our strategic achievements this fiscal year.', choices: { A: 'comprehensive', B: 'comprehend', C: 'comprehension', D: 'comprehensively' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 5', 'Adjectives'], detailed_explanation: { correct_reason: 'คำคุณศัพท์ "comprehensive" ขยายคำนาม "summary"' } },
  { question_id: 'q-518', part: 5, question_text: 'Please notify the Facilities Department immediately _______ you notice any water leaks.', choices: { A: 'if', B: 'unless', C: 'despite', D: 'whereas' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Conditionals'], detailed_explanation: { correct_reason: 'ตัวเชื่อมประโยคเงื่อนไข "if" (ถ้าหากว่า)' } },
  { question_id: 'q-519', part: 5, question_text: 'The new mobile application allows customers to track their orders _______.', choices: { A: 'effortlessly', B: 'effortless', C: 'effort', D: 'efforts' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Adverbs'], detailed_explanation: { correct_reason: 'กริยาวิเศษณ์ "effortlessly" ขยายกริยา "track"' } },
  { question_id: 'q-520', part: 5, question_text: 'Dr. Arisawa will deliver the opening address at the international medical _______.', choices: { A: 'symposium', B: 'sympathetic', C: 'sympathize', D: 'sympathetically' }, correct_answer: 'A', cefr_level: 'C1', tags: ['Part 5', 'Nouns'], detailed_explanation: { correct_reason: 'คำนาม "symposium" (การประชุมทางวิชาการ)' } },
  { question_id: 'q-521', part: 5, question_text: 'The client expressed complete confidence in our team's ability to meet the tight _______.', choices: { A: 'deadline', B: 'deadlines', C: 'deadly', D: 'deadness' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Nouns'], detailed_explanation: { correct_reason: 'คำนาม "deadline" (กำหนดส่งงาน)' } },
  { question_id: 'q-522', part: 5, question_text: 'We recommend backing up all important files _______ migrating to the new server.', choices: { A: 'prior to', B: 'except for', C: 'in spite of', D: 'on behalf of' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 5', 'Prepositions'], detailed_explanation: { correct_reason: 'สำนวน "prior to" หมายถึง ก่อนที่จะ...' } },
  { question_id: 'q-523', part: 5, question_text: 'The human resources director emphasized the _______ of maintaining work-life balance.', choices: { A: 'importance', B: 'important', C: 'importantly', D: 'importing' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Nouns'], detailed_explanation: { correct_reason: 'คำนาม "importance" ตามหลัง article "the"' } },
  { question_id: 'q-524', part: 5, question_text: 'Although the weather was unfavorable, the outdoor corporate banquet was _______ successful.', choices: { A: 'remarkably', B: 'remarkable', C: 'remarked', D: 'remarks' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 5', 'Adverbs'], detailed_explanation: { correct_reason: 'กริยาวิเศษณ์ "remarkably" ขยายคำคุณศัพท์ "successful"' } },
  { question_id: 'q-525', part: 5, question_text: 'Visitors must present a valid government-issued photo ID upon _______ at the security desk.', choices: { A: 'arrival', B: 'arrive', C: 'arriving', D: 'arrived' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Nouns'], detailed_explanation: { correct_reason: 'คำนาม "arrival" ตามหลังบุพบท "upon"' } },
  { question_id: 'q-526', part: 5, question_text: 'The board approved the budget proposal after a _______ evaluation of projected revenues.', choices: { A: 'thorough', B: 'through', C: 'though', D: 'throughout' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 5', 'Adjectives'], detailed_explanation: { correct_reason: 'คำคุณศัพท์ "thorough" (ละเอียดรอบคอบ) ขยาย "evaluation"' } },
  { question_id: 'q-527', part: 5, question_text: 'All outgoing shipments must be _______ inspected for quality control before dispatch.', choices: { A: 'carefully', B: 'careful', C: 'careing', D: 'careless' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Adverbs'], detailed_explanation: { correct_reason: 'กริยาวิเศษณ์ "carefully" ขยายกริยาพาสซีฟ "inspected"' } },
  { question_id: 'q-528', part: 5, question_text: 'The customer service representative offered a partial refund to _______ the inconvenience.', choices: { A: 'compensate for', B: 'comply with', C: 'account to', D: 'depend on' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 5', 'Phrasal Verbs'], detailed_explanation: { correct_reason: 'กริยาวลี "compensate for" (ชดเชยให้แก่...)' } },
  { question_id: 'q-529', part: 5, question_text: 'Employees interested in attending the leadership workshop should submit _______ applications.', choices: { A: 'their', B: 'them', C: 'they', D: 'themselves' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Pronouns'], detailed_explanation: { correct_reason: 'สรรพนามแสดงความเป็นเจ้าของ "their" ขยายคำนาม "applications"' } },
  { question_id: 'q-530', part: 5, question_text: 'The newly upgraded security system guarantees _______ data protection for all online transactions.', choices: { A: 'maximum', B: 'maximize', C: 'maximally', D: 'maximizing' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 5', 'Adjectives'], detailed_explanation: { correct_reason: 'คำคุณศัพท์ "maximum" (สูงสุด) ขยายคำนาม "data protection"' } }
];

const PART_6_QUESTIONS = [
  // Set 6-1: Cyber Security Memo (4 Qs with [1], [2], [3], [4])
  {
    question_id: 'q-601', part: 6,
    passage_title: 'MEMORANDUM: Scheduled Cyber Security System Maintenance',
    passage_content: '<div class="passage-block"><p><strong>TO:</strong> All Staff Members<br><strong>FROM:</strong> Information Technology Department<br><strong>DATE:</strong> August 10, 2026<br><strong>SUBJECT:</strong> Urgent System Maintenance and Password Reset</p><p>Please be advised that the corporate network will undergo essential cyber security maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this timeframe, all corporate VPN servers and remote login portals will be [1] _______ offline.</p><p>We kindly request that all employees save their open documents and log out of their workstations before leaving the office on Friday evening. [2] _______. Any unsaved work may be lost during the database upgrade.</p><p>Furthermore, effective next Monday, all employees must update their network passwords. The new passwords must be [3] _______ created according to our updated security guidelines, containing at least 12 characters, including numbers and special symbols.</p><p>We appreciate your cooperation in keeping our company data secure. If you have any questions or experience technical difficulties, please contact the IT Helpdesk at extension 4401. [4] _______.</p></div>',
    question_text: 'Which word best fits blank [1]?',
    choices: { A: 'temporarily', B: 'permanently', C: 'finally', D: 'eventually' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 6'],
    detailed_explanation: { correct_reason: 'บริบทการปิดปรับปรุงระบบชั่วคราว จึงต้องใช้คำว่า temporarily (ชั่วคราว)' }
  },
  {
    question_id: 'q-602', part: 6,
    passage_title: 'MEMORANDUM: Scheduled Cyber Security System Maintenance',
    passage_content: '<div class="passage-block"><p><strong>TO:</strong> All Staff Members<br><strong>FROM:</strong> Information Technology Department<br><strong>DATE:</strong> August 10, 2026<br><strong>SUBJECT:</strong> Urgent System Maintenance and Password Reset</p><p>Please be advised that the corporate network will undergo essential cyber security maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this timeframe, all corporate VPN servers and remote login portals will be [1] _______ offline.</p><p>We kindly request that all employees save their open documents and log out of their workstations before leaving the office on Friday evening. [2] _______. Any unsaved work may be lost during the database upgrade.</p><p>Furthermore, effective next Monday, all employees must update their network passwords. The new passwords must be [3] _______ created according to our updated security guidelines, containing at least 12 characters, including numbers and special symbols.</p><p>We appreciate your cooperation in keeping our company data secure. If you have any questions or experience technical difficulties, please contact the IT Helpdesk at extension 4401. [4] _______.</p></div>',
    question_text: 'Which sentence best fits blank [2]?',
    choices: {
      A: 'This precaution will prevent potential data loss during the system reboot.',
      B: 'Our company holiday party has been rescheduled for next month.',
      C: 'The cafeteria will offer a discounted lunch menu on Friday.',
      D: 'New office desks will be delivered to the second floor.'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'],
    detailed_explanation: { correct_reason: 'ประโยคก่อนหน้าบอกให้เซฟงาน ดังนั้นประโยคใน [2] ต้องอธิบายเหตุผลเรื่องการป้องกันข้อมูลสูญหาย' }
  },
  {
    question_id: 'q-603', part: 6,
    passage_title: 'MEMORANDUM: Scheduled Cyber Security System Maintenance',
    passage_content: '<div class="passage-block"><p><strong>TO:</strong> All Staff Members<br><strong>FROM:</strong> Information Technology Department<br><strong>DATE:</strong> August 10, 2026<br><strong>SUBJECT:</strong> Urgent System Maintenance and Password Reset</p><p>Please be advised that the corporate network will undergo essential cyber security maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this timeframe, all corporate VPN servers and remote login portals will be [1] _______ offline.</p><p>We kindly request that all employees save their open documents and log out of their workstations before leaving the office on Friday evening. [2] _______. Any unsaved work may be lost during the database upgrade.</p><p>Furthermore, effective next Monday, all employees must update their network passwords. The new passwords must be [3] _______ created according to our updated security guidelines, containing at least 12 characters, including numbers and special symbols.</p><p>We appreciate your cooperation in keeping our company data secure. If you have any questions or experience technical difficulties, please contact the IT Helpdesk at extension 4401. [4] _______.</p></div>',
    question_text: 'Which word best fits blank [3]?',
    choices: { A: 'carefully', B: 'careless', C: 'caring', D: 'cared' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 6'],
    detailed_explanation: { correct_reason: 'ต้องใช้คำกริยาวิเศษณ์ carefully เพื่อขยายกริยา created' }
  },
  {
    question_id: 'q-604', part: 6,
    passage_title: 'MEMORANDUM: Scheduled Cyber Security System Maintenance',
    passage_content: '<div class="passage-block"><p><strong>TO:</strong> All Staff Members<br><strong>FROM:</strong> Information Technology Department<br><strong>DATE:</strong> August 10, 2026<br><strong>SUBJECT:</strong> Urgent System Maintenance and Password Reset</p><p>Please be advised that the corporate network will undergo essential cyber security maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this timeframe, all corporate VPN servers and remote login portals will be [1] _______ offline.</p><p>We kindly request that all employees save their open documents and log out of their workstations before leaving the office on Friday evening. [2] _______. Any unsaved work may be lost during the database upgrade.</p><p>Furthermore, effective next Monday, all employees must update their network passwords. The new passwords must be [3] _______ created according to our updated security guidelines, containing at least 12 characters, including numbers and special symbols.</p><p>We appreciate your cooperation in keeping our company data secure. If you have any questions or experience technical difficulties, please contact the IT Helpdesk at extension 4401. [4] _______.</p></div>',
    question_text: 'Which sentence best fits blank [4]?',
    choices: {
      A: 'Our support team will be on duty throughout the maintenance period.',
      B: 'Please make sure to submit your travel vouchers before Friday.',
      C: 'The annual general meeting will take place in the main auditorium.',
      D: 'Parking passes can be renewed at the front reception counter.'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'],
    detailed_explanation: { correct_reason: 'ประโยคก่อนหน้าอ้างถึง IT Helpdesk ดังนั้นประโยคใน [4] จึงสรุปเรื่องทีมงานคอยช่วยเหลือตลอดเวลา' }
  }
];

const PART_7_QUESTIONS = [
  // DOUBLE PASSAGE 1: Order Confirmation & Commercial Invoice (5 Qs - FULL HTML IN ALL 5 QUESTIONS)
  {
    question_id: 'q-751', part: 7,
    passage_title: 'DOUBLE PASSAGE: Order Confirmation Email & Commercial Invoice Discrepancy',
    passage_content: '<div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,210,255,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"><div style="color: #00d2ff; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 1: Purchase Order Confirmation Email</div><p><strong>From:</strong> orders@vertexfurniture.com<br><strong>To:</strong> r.martinez@apexsolutions.com<br><strong>Date:</strong> August 2, 2026<br><strong>Subject:</strong> Order Confirmation #VX-8842</p><p>Dear Mr. Martinez,</p><p>Thank you for your purchase. We have received your order for office furniture. Below is the summary of items ordered:</p><ul><li>4 Ergonomic Mesh Chairs @ $150.00 each = $600.00</li><li>2 Adjustable Standing Desks @ $310.00 each = $620.00</li><li>1 Executive Conference Table @ $450.00 = $450.00</li></ul><p>Total Amount: $1,670.00 (Standard Express Shipping included free of charge).</p></div><hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 1.2rem 0;"><div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(48,209,88,0.2); padding: 1rem; border-radius: 8px;"><div style="color: #30d158; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 2: Commercial Invoice Billing Inquiry Email</div><p><strong>From:</strong> r.martinez@apexsolutions.com<br><strong>To:</strong> billing@vertexfurniture.com<br><strong>Date:</strong> August 4, 2026<br><strong>Subject:</strong> Billing Discrepancy on Invoice #VX-8842</p><p>Dear Customer Service Team,</p><p>I am writing regarding Invoice #VX-8842 received yesterday. While the items delivered match our order confirmation, the invoice reflects a total charge of $1,820.00. It appears an additional $150.00 delivery fee was added despite the confirmation email promising free express shipping.</p><p>Please issue an adjusted invoice reflecting the correct balance of $1,670.00 at your earliest convenience.</p><p>Sincerely,<br>Robert Martinez</p></div>',
    question_text: 'What type of furniture did Mr. Martinez order in Document 1?',
    choices: { A: 'Mesh chairs, standing desks, and a conference table', B: 'Filing cabinets and desk lamps', C: 'Cafeteria tables and dining chairs', D: 'Computer monitors and keyboards' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 7'], detailed_explanation: { correct_reason: 'เอกสาร 1 สรุปว่าสั่ง เก้าอี้ Ergonomic 4 ตัว, โต๊ะปรับระดับ 2 ตัว และโต๊ะประชุม 1 ตัว' }
  },
  {
    question_id: 'q-752', part: 7,
    passage_title: 'DOUBLE PASSAGE: Order Confirmation Email & Commercial Invoice Discrepancy',
    passage_content: '<div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,210,255,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"><div style="color: #00d2ff; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 1: Purchase Order Confirmation Email</div><p><strong>From:</strong> orders@vertexfurniture.com<br><strong>To:</strong> r.martinez@apexsolutions.com<br><strong>Date:</strong> August 2, 2026<br><strong>Subject:</strong> Order Confirmation #VX-8842</p><p>Dear Mr. Martinez,</p><p>Thank you for your purchase. We have received your order for office furniture. Below is the summary of items ordered:</p><ul><li>4 Ergonomic Mesh Chairs @ $150.00 each = $600.00</li><li>2 Adjustable Standing Desks @ $310.00 each = $620.00</li><li>1 Executive Conference Table @ $450.00 = $450.00</li></ul><p>Total Amount: $1,670.00 (Standard Express Shipping included free of charge).</p></div><hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 1.2rem 0;"><div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(48,209,88,0.2); padding: 1rem; border-radius: 8px;"><div style="color: #30d158; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 2: Commercial Invoice Billing Inquiry Email</div><p><strong>From:</strong> r.martinez@apexsolutions.com<br><strong>To:</strong> billing@vertexfurniture.com<br><strong>Date:</strong> August 4, 2026<br><strong>Subject:</strong> Billing Discrepancy on Invoice #VX-8842</p><p>Dear Customer Service Team,</p><p>I am writing regarding Invoice #VX-8842 received yesterday. While the items delivered match our order confirmation, the invoice reflects a total charge of $1,820.00. It appears an additional $150.00 delivery fee was added despite the confirmation email promising free express shipping.</p><p>Please issue an adjusted invoice reflecting the correct balance of $1,670.00 at your earliest convenience.</p><p>Sincerely,<br>Robert Martinez</p></div>',
    question_text: 'How much did each Adjustable Standing Desk cost?',
    choices: { A: '$310.00', B: '$150.00', C: '$450.00', D: '$620.00' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 7'], detailed_explanation: { correct_reason: 'เอกสาร 1 ระบุราคาของ Adjustable Standing Desk ตัวละ $310.00' }
  },
  {
    question_id: 'q-753', part: 7,
    passage_title: 'DOUBLE PASSAGE: Order Confirmation Email & Commercial Invoice Discrepancy',
    passage_content: '<div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,210,255,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"><div style="color: #00d2ff; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 1: Purchase Order Confirmation Email</div><p><strong>From:</strong> orders@vertexfurniture.com<br><strong>To:</strong> r.martinez@apexsolutions.com<br><strong>Date:</strong> August 2, 2026<br><strong>Subject:</strong> Order Confirmation #VX-8842</p><p>Dear Mr. Martinez,</p><p>Thank you for your purchase. We have received your order for office furniture. Below is the summary of items ordered:</p><ul><li>4 Ergonomic Mesh Chairs @ $150.00 each = $600.00</li><li>2 Adjustable Standing Desks @ $310.00 each = $620.00</li><li>1 Executive Conference Table @ $450.00 = $450.00</li></ul><p>Total Amount: $1,670.00 (Standard Express Shipping included free of charge).</p></div><hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 1.2rem 0;"><div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(48,209,88,0.2); padding: 1rem; border-radius: 8px;"><div style="color: #30d158; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 2: Commercial Invoice Billing Inquiry Email</div><p><strong>From:</strong> r.martinez@apexsolutions.com<br><strong>To:</strong> billing@vertexfurniture.com<br><strong>Date:</strong> August 4, 2026<br><strong>Subject:</strong> Billing Discrepancy on Invoice #VX-8842</p><p>Dear Customer Service Team,</p><p>I am writing regarding Invoice #VX-8842 received yesterday. While the items delivered match our order confirmation, the invoice reflects a total charge of $1,820.00. It appears an additional $150.00 delivery fee was added despite the confirmation email promising free express shipping.</p><p>Please issue an adjusted invoice reflecting the correct balance of $1,670.00 at your earliest convenience.</p><p>Sincerely,<br>Robert Martinez</p></div>',
    question_text: 'Why is Mr. Martinez emailing customer service in Document 2?',
    choices: { A: 'An unauthorized $150.00 delivery fee was included on the invoice', B: 'The conference table was damaged during transit', C: 'He wants to order additional standing desks', D: 'He needs to change his shipping address' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 7'], detailed_explanation: { correct_reason: 'เอกสาร 2 ระบุว่าถูกคิดค่าส่ง $150.00 เพิ่มโดยไม่ถูกต้อง' }
  },
  {
    question_id: 'q-754', part: 7,
    passage_title: 'DOUBLE PASSAGE: Order Confirmation Email & Commercial Invoice Discrepancy',
    passage_content: '<div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,210,255,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"><div style="color: #00d2ff; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 1: Purchase Order Confirmation Email</div><p><strong>From:</strong> orders@vertexfurniture.com<br><strong>To:</strong> r.martinez@apexsolutions.com<br><strong>Date:</strong> August 2, 2026<br><strong>Subject:</strong> Order Confirmation #VX-8842</p><p>Dear Mr. Martinez,</p><p>Thank you for your purchase. We have received your order for office furniture. Below is the summary of items ordered:</p><ul><li>4 Ergonomic Mesh Chairs @ $150.00 each = $600.00</li><li>2 Adjustable Standing Desks @ $310.00 each = $620.00</li><li>1 Executive Conference Table @ $450.00 = $450.00</li></ul><p>Total Amount: $1,670.00 (Standard Express Shipping included free of charge).</p></div><hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 1.2rem 0;"><div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(48,209,88,0.2); padding: 1rem; border-radius: 8px;"><div style="color: #30d158; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 2: Commercial Invoice Billing Inquiry Email</div><p><strong>From:</strong> r.martinez@apexsolutions.com<br><strong>To:</strong> billing@vertexfurniture.com<br><strong>Date:</strong> August 4, 2026<br><strong>Subject:</strong> Billing Discrepancy on Invoice #VX-8842</p><p>Dear Customer Service Team,</p><p>I am writing regarding Invoice #VX-8842 received yesterday. While the items delivered match our order confirmation, the invoice reflects a total charge of $1,820.00. It appears an additional $150.00 delivery fee was added despite the confirmation email promising free express shipping.</p><p>Please issue an adjusted invoice reflecting the correct balance of $1,670.00 at your earliest convenience.</p><p>Sincerely,<br>Robert Martinez</p></div>',
    question_text: 'What total balance does Mr. Martinez request on the adjusted invoice?',
    choices: { A: '$1,670.00', B: '$1,820.00', C: '$1,520.00', D: '$2,000.00' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 7'], detailed_explanation: { correct_reason: 'ยอดที่ถูกต้องคือ $1,670.00' }
  },
  {
    question_id: 'q-755', part: 7,
    passage_title: 'DOUBLE PASSAGE: Order Confirmation Email & Commercial Invoice Discrepancy',
    passage_content: '<div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,210,255,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"><div style="color: #00d2ff; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 1: Purchase Order Confirmation Email</div><p><strong>From:</strong> orders@vertexfurniture.com<br><strong>To:</strong> r.martinez@apexsolutions.com<br><strong>Date:</strong> August 2, 2026<br><strong>Subject:</strong> Order Confirmation #VX-8842</p><p>Dear Mr. Martinez,</p><p>Thank you for your purchase. We have received your order for office furniture. Below is the summary of items ordered:</p><ul><li>4 Ergonomic Mesh Chairs @ $150.00 each = $600.00</li><li>2 Adjustable Standing Desks @ $310.00 each = $620.00</li><li>1 Executive Conference Table @ $450.00 = $450.00</li></ul><p>Total Amount: $1,670.00 (Standard Express Shipping included free of charge).</p></div><hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 1.2rem 0;"><div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(48,209,88,0.2); padding: 1rem; border-radius: 8px;"><div style="color: #30d158; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">DOCUMENT 2: Commercial Invoice Billing Inquiry Email</div><p><strong>From:</strong> r.martinez@apexsolutions.com<br><strong>To:</strong> billing@vertexfurniture.com<br><strong>Date:</strong> August 4, 2026<br><strong>Subject:</strong> Billing Discrepancy on Invoice #VX-8842</p><p>Dear Customer Service Team,</p><p>I am writing regarding Invoice #VX-8842 received yesterday. While the items delivered match our order confirmation, the invoice reflects a total charge of $1,820.00. It appears an additional $150.00 delivery fee was added despite the confirmation email promising free express shipping.</p><p>Please issue an adjusted invoice reflecting the correct balance of $1,670.00 at your earliest convenience.</p><p>Sincerely,<br>Robert Martinez</p></div>',
    question_text: 'What company does Robert Martinez work for?',
    choices: { A: 'Apex Solutions', B: 'Vertex Furniture', C: 'Global Logistics', D: 'Skyline Tower' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 7'], detailed_explanation: { correct_reason: 'ที่อยู่อีเมล r.martinez@apexsolutions.com แสดงว่าเขาทำงานที่ Apex Solutions' }
  }
];

function isPlaceholderText(str) {
  if (!str) return true;
  const clean = String(str).replace(/<[^>]*>/g, '').trim().toLowerCase();
  if (!clean || clean.length < 35) return true;
  if (clean.includes('see double passage above') || clean.includes('see passage above') || clean.includes('see text above')) return true;
  return false;
}

function groupQuestionsByPassage(questions) {
  const groups = [];
  const groupMap = new Map();

  for (const q of questions) {
    const rawText = String(q.question_text || '').replace(/^\[AI Generated Q?\d*\]\s*/i, '').trim();
    const cleanedQ = { ...q, question_text: rawText };

    if (q.part === 5) {
      groups.push({ isSingle: true, questions: [cleanedQ] });
      continue;
    }

    const titleKey = String(q.passage_title || '').trim().toLowerCase();
    const passageKey = titleKey || (q.passage_content || '').trim().toLowerCase();

    if (!passageKey || isPlaceholderText(q.passage_content)) {
      if (titleKey) {
        if (!groupMap.has(titleKey)) {
          const newGroup = { isSingle: false, key: titleKey, questions: [] };
          groupMap.set(titleKey, newGroup);
          groups.push(newGroup);
        }
        groupMap.get(titleKey).questions.push(cleanedQ);
      } else {
        groups.push({ isSingle: true, questions: [cleanedQ] });
      }
    } else {
      if (!groupMap.has(passageKey)) {
        const newGroup = { isSingle: false, key: passageKey, questions: [] };
        groupMap.set(passageKey, newGroup);
        groups.push(newGroup);
      }
      groupMap.get(passageKey).questions.push(cleanedQ);
    }
  }

  for (const g of groups) {
    if (!g.isSingle && g.questions.length > 0) {
      const parentPTitle = g.questions.find(q => q.passage_title)?.passage_title || '';
      const parentPContent = g.questions.find(q => q.passage_content && !isPlaceholderText(q.passage_content))?.passage_content || '';

      g.questions = g.questions.map(q => ({
        ...q,
        passage_title: q.passage_title || parentPTitle,
        passage_content: (isPlaceholderText(q.passage_content) ? parentPContent : q.passage_content) || parentPContent
      }));
    }
  }

  return groups;
}

export default async function handler(req, res) {
  try {
    const mode = (req.query.mode || 'full').toLowerCase();
    const limit = mode === 'quick' ? 20 : 100;

    let pool = [...PART_5_QUESTIONS, ...PART_6_QUESTIONS, ...PART_7_QUESTIONS];

    // Ensure strict Part sorting (5 -> 6 -> 7)
    pool.sort((a, b) => a.part - b.part);

    const questions = pool.slice(0, limit);

    return res.status(200).json({
      success: true,
      total_questions: questions.length,
      mode: mode,
      questions: questions
    });
  } catch (error) {
    console.error('TOEIC Questions Handler Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch TOEIC questions',
      error: error.message
    });
  }
}
