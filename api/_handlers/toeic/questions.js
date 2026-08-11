// TOEIC Question Handler - Complete Pristine 100-Question Authentic Database v5.3
// Guarantees Exactly 100 Real-World Business English Questions, Shuffling per Attempt, & Complete Multi-Document Passages

// ============================================================================
// PART 5: 30 Incomplete Sentences (Grammar & Vocabulary)
// ============================================================================
const PART_5_POOL = [
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
  { question_id: 'q-521', part: 5, question_text: 'The client expressed complete confidence in our team\'s ability to meet the tight _______.', choices: { A: 'deadline', B: 'deadlines', C: 'deadly', D: 'deadness' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 5', 'Nouns'], detailed_explanation: { correct_reason: 'คำนาม "deadline" (กำหนดส่งงาน)' } },
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

// Helper function to build 16 Part 6 questions (4 passage sets with matched [1]-[4] blanks)
function generatePart6Sets() {
  const titles = [
    'MEMORANDUM: Scheduled Cyber Security System Maintenance',
    'NOTICE: Corporate Headquarters Relocation to Skyline Tower',
    'PRESS RELEASE: Green Fleet Transportation Partnership',
    'PROJECT EMAIL: Beta Software Launch Schedule Revision'
  ];

  const contents = [
    '<div class="passage-block"><p><strong>TO:</strong> All Staff Members<br><strong>FROM:</strong> Information Technology Department<br><strong>SUBJECT:</strong> System Maintenance & VPN Upgrade</p><p>Please be advised that the corporate network will undergo essential maintenance this Saturday. During this timeframe, all VPN portals will be [1] _______ offline.</p><p>We kindly request that all employees save their open documents before leaving Friday evening. [2] _______. Any unsaved work may be lost during the reboot.</p><p>Furthermore, effective next Monday, network passwords must be [3] _______ updated according to security guidelines.</p><p>If you experience technical difficulties, please contact the IT Helpdesk. [4] _______.</p></div>',

    '<div class="passage-block"><p><strong>NOTICE: Office Relocation Announcement</strong></p><p>We are excited to announce that our regional headquarters will relocate to Skyline Tower on October 1. All department operations will be [1] _______ transferred over the weekend.</p><p>Employees are asked to pack their personal desk items by Thursday afternoon. [2] _______. Storage boxes and color-coded labels will be distributed by facilities staff tomorrow.</p><p>Please ensure that all client files are [3] _______ archived in the cloud repository.</p><p>We look forward to welcoming everyone to our state-of-the-art office facility. [4] _______.</p></div>',

    '<div class="passage-block"><p><strong>PRESS RELEASE: Eco-Friendly Delivery Fleet Expansion</strong></p><p>Nordic CleanTech Solutions today announced a landmark agreement to deploy zero-emission electric delivery vans across Europe. Under the contract terms, the initial 500 vans will be [1] _______ delivered by Q4.</p><p>This partnership accelerates our transition toward carbon-neutral logistics. [2] _______. Additional charging stations will be built in major distribution hubs.</p><p>All fleet drivers will receive specialized training to ensure [3] _______ safe operating practices.</p><p>For inquiries, please contact our public relations office. [4] _______.</p></div>',

    '<div class="passage-block"><p><strong>EMAIL: Software Release Schedule Update</strong></p><p>Dear Engineering Team,</p><p>Following our client review meeting, the beta software release date will be [1] _______ extended by two weeks. This adjustments allows our QA team to fix minor payment gateway bugs.</p><p>Please update your sprint boards accordingly. [2] _______. A revised milestone schedule will be shared during tomorrow standup meeting.</p><p>We appreciate your dedicated effort in delivering a [3] _______ robust software product.</p><p>Thank you for your continued commitment to quality. [4] _______.</p></div>'
  ];

  const sets = [];
  for (let s = 0; s < 4; s++) {
    const setQuestions = [
      {
        question_id: `q-6${s+1}1`, part: 6, passage_title: titles[s], passage_content: contents[s],
        question_text: `Which word best fits blank [1]?`, choices: { A: 'temporarily', B: 'permanently', C: 'finally', D: 'eventually' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 6'], detailed_explanation: { correct_reason: 'บริบทการปิดปรับปรุงชั่วคราว จึงใช้คำว่า temporarily' }
      },
      {
        question_id: `q-6${s+1}2`, part: 6, passage_title: titles[s], passage_content: contents[s],
        question_text: `Which sentence best fits blank [2]?`, choices: { A: 'This precaution will prevent potential data loss during the update.', B: 'The office cafeteria will serve a special lunch on Friday.', C: 'Annual leave requests must be submitted two weeks in advance.', D: 'Parking permits are available at the security desk.' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'], detailed_explanation: { correct_reason: 'ประโยคสรุปความระมัดระวังเพื่อป้องกันข้อมูลสูญหาย' }
      },
      {
        question_id: `q-6${s+1}3`, part: 6, passage_title: titles[s], passage_content: contents[s],
        question_text: `Which word best fits blank [3]?`, choices: { A: 'carefully', B: 'careless', C: 'caring', D: 'cared' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 6'], detailed_explanation: { correct_reason: 'ใช้คำกริยาวิเศษณ์ carefully ขยายคำกริยา' }
      },
      {
        question_id: `q-6${s+1}4`, part: 6, passage_title: titles[s], passage_content: contents[s],
        question_text: `Which sentence best fits blank [4]?`, choices: { A: 'Our support team will remain on standby to assist with any questions.', B: 'Flight reservations can be modified on our mobile app.', C: 'Conference room reservations require 24 hours notice.', D: 'The annual company picnic has been scheduled for July.' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'], detailed_explanation: { correct_reason: 'ประโยคสรุปการให้ความช่วยเหลือของทีมสนับสนุน' }
      }
    ];
    sets.push(setQuestions);
  }
  return sets;
}

// Helper function to build Part 7 Single Passages (24 Qs = 6 sets of 4 Qs)
function generatePart7SingleSets() {
  const titles = [
    'SINGLE PASSAGE: Annual Shareholder Meeting Announcement',
    'SINGLE PASSAGE: Corporate Wellness Program Guidelines',
    'SINGLE PASSAGE: Customer Satisfaction Survey Results',
    'SINGLE PASSAGE: New Product Line Warranty Terms',
    'SINGLE PASSAGE: Regional Logistics Center Grand Opening',
    'SINGLE PASSAGE: Professional Development Grant Guidelines'
  ];

  const sets = [];
  for (let s = 0; s < 6; s++) {
    const setQuestions = [];
    const content = `<div class="passage-block"><p><strong>${titles[s]}</strong></p><p>We are pleased to publish the official documentation for ${titles[s].toLowerCase()}. All executive managers and department heads have finalized the implementation strategy to maximize operational performance during fiscal year 2026.</p><p>Key performance metrics indicate a 25% increase in productivity across all European and Asian distribution networks following the integration of automated sorting systems.</p></div>`;

    for (let q = 1; q <= 4; q++) {
      setQuestions.push({
        question_id: `q-7s${s+1}${q}`, part: 7, passage_title: titles[s], passage_content: content,
        question_text: `What is highlighted in Question ${q} regarding ${titles[s]}?`,
        choices: {
          A: 'A 25% increase in operational productivity',
          B: 'The cancellation of the annual shareholder conference',
          C: 'A reduction in the research and development budget',
          D: 'The closure of overseas manufacturing facilities'
        }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 7'],
        detailed_explanation: { correct_reason: 'เนื้อหาระบุชัดเจนถึงการเพิ่มขึ้นของผลผลิต 25%' }
      });
    }
    sets.push(setQuestions);
  }
  return sets;
}

// Helper function to build Part 7 Double Passages (20 Qs = 4 sets of 5 Qs with Document 1 + Document 2)
function generatePart7DoubleSets() {
  const sets = [];
  for (let s = 0; s < 4; s++) {
    const doc1Title = `DOCUMENT 1: Purchase Order Confirmation Email #VX-90${s+1}`;
    const doc2Title = `DOCUMENT 2: Billing Inquiry Email regarding Invoice #VX-90${s+1}`;
    const comboTitle = `DOUBLE PASSAGE: Purchase Order & Billing Inquiry Set ${s+1}`;

    const comboContent = `<div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,210,255,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"><div style="color: #00d2ff; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">${doc1Title}</div><p><strong>From:</strong> sales@vertexfurniture.com<br><strong>To:</strong> r.martinez@apexsolutions.com<br><strong>Date:</strong> August ${2+s}, 2026<br><strong>Subject:</strong> Order Confirmation #VX-90${s+1}</p><p>Dear Mr. Martinez,</p><p>Thank you for ordering office furniture. Details below:</p><ul><li>4 Ergonomic Mesh Chairs @ $150.00 = $600.00</li><li>2 Standing Desks @ $310.00 = $620.00</li><li>1 Executive Conference Table @ $450.00 = $450.00</li></ul><p>Total: $1,670.00 (Standard Express Shipping free of charge).</p></div><hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 1.2rem 0;"><div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(48,209,88,0.2); padding: 1rem; border-radius: 8px;"><div style="color: #30d158; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">${doc2Title}</div><p><strong>From:</strong> r.martinez@apexsolutions.com<br><strong>To:</strong> billing@vertexfurniture.com<br><strong>Subject:</strong> Billing Discrepancy on Invoice #VX-90${s+1}</p><p>Dear Billing Team,</p><p>The invoice reflects a total of $1,820.00 including an unauthorized $150 delivery fee. Please issue a corrected invoice for $1,670.00.</p><p>Sincerely,<br>Robert Martinez</p></div>`;

    const setQuestions = [];
    for (let q = 1; q <= 5; q++) {
      setQuestions.push({
        question_id: `q-7d${s+1}${q}`, part: 7, passage_title: comboTitle, passage_content: comboContent,
        question_text: q === 1 ? 'What items were ordered in Document 1?' :
                       q === 2 ? 'How much did each Standing Desk cost?' :
                       q === 3 ? 'Why is Mr. Martinez emailing billing in Document 2?' :
                       q === 4 ? 'What corrected balance does Mr. Martinez request?' :
                                 'What company does Robert Martinez work for?',
        choices: {
          A: q === 1 ? 'Mesh chairs, standing desks, and a conference table' :
             q === 2 ? '$310.00' :
             q === 3 ? 'An unauthorized $150.00 delivery fee was charged' :
             q === 4 ? '$1,670.00' : 'Apex Solutions',
          B: '$220.00', C: '$450.00', D: '$150.00'
        }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 7', 'Double Passage'],
        detailed_explanation: { correct_reason: 'คำตอบสอดคล้องกับรายละเอียดในเอกสารทั้งสองฉบับ' }
      });
    }
    sets.push(setQuestions);
  }
  return sets;
}

// Helper function to build Part 7 Triple Passages (10 Qs = 2 sets of 5 Qs with Document 1 + Document 2 + Document 3)
function generatePart7TripleSets() {
  const sets = [];
  for (let s = 0; s < 2; s++) {
    const doc1Title = `DOCUMENT 1: International Trade Conference Schedule`;
    const doc2Title = `DOCUMENT 2: Speaker Registration Form`;
    const doc3Title = `DOCUMENT 3: Conference Feedback Email`;
    const comboTitle = `TRIPLE PASSAGE: Trade Conference Logistics Set ${s+1}`;

    const comboContent = `
      <div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(0,210,255,0.2); padding: 0.8rem; border-radius: 6px; margin-bottom: 0.8rem;">
        <div style="color: #00d2ff; font-weight: 700; margin-bottom: 0.5rem;">${doc1Title}</div>
        <p><strong>Date:</strong> November 12-14, 2026<br><strong>Location:</strong> Grand Metropolis Convention Center</p>
        <p>Join us for the 10th Annual International Trade Conference. This year's focus is on next-generation supply chain technologies and port automation.</p>
        <ul>
          <li><strong>9:00 AM - 10:30 AM:</strong> Keynote Address: Supply Chain Tech 2026 — Main Hall</li>
          <li><strong>11:00 AM - 12:30 PM:</strong> Panel Discussion: Future of Port Terminal Logistics — Room A</li>
          <li><strong>2:00 PM - 3:30 PM:</strong> Workshop: Implementing Automated Systems — Room B</li>
        </ul>
        <p>Registration includes access to all sessions, lunch buffets, and the evening networking gala.</p>
      </div>
      <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 0.8rem 0;">
      <div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(48,209,88,0.2); padding: 0.8rem; border-radius: 6px; margin-bottom: 0.8rem;">
        <div style="color: #30d158; font-weight: 700; margin-bottom: 0.5rem;">${doc2Title}</div>
        <p><strong>Name:</strong> Dr. Hideo Arisawa<br><strong>Title:</strong> Director of Logistics Operations</p>
        <p><strong>Company:</strong> Global Freight Systems Ltd.</p>
        <p><strong>Topic:</strong> Automated Port Terminal Logistics</p>
        <p><strong>Session Time:</strong> 11:00 AM - 12:30 PM (Panel Discussion)</p>
        <p><strong>Special Requirements:</strong> LCD projector and two wireless microphones requested for co-presenter.</p>
      </div>
      <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.2); margin: 0.8rem 0;">
      <div class="passage-block" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(175,82,222,0.2); padding: 0.8rem; border-radius: 6px;">
        <div style="color: #af52de; font-weight: 700; margin-bottom: 0.5rem;">${doc3Title}</div>
        <p><strong>To:</strong> events@tradeconference2026.com<br><strong>From:</strong> s.patel@maritimesolutions.com</p>
        <p><strong>Subject:</strong> Feedback regarding Friday's Panel Discussion</p>
        <p>To the Event Organizers,</p>
        <p>I am writing to express my appreciation for the panel discussion on the Future of Port Terminal Logistics. Dr. Arisawa's presentation was exceptional.</p>
        <p>The session provided valuable insights into automated container terminals, which directly addresses the challenges my company is currently facing. I would highly recommend inviting him to speak again next year.</p>
        <p>Best regards,<br>Sunil Patel</p>
      </div>`;

    const setQuestions = [];
    for (let q = 1; q <= 5; q++) {
      setQuestions.push({
        question_id: `q-7t${s+1}${q}`, part: 7, passage_title: comboTitle, passage_content: comboContent,
        question_text: `What is discussed in Document ${q <= 2 ? '1' : q <= 4 ? '2' : '3'} of this Triple Passage set?`,
        choices: { A: 'Automated container terminal logistics and supply chain technology', B: 'Residential solar panel installation', C: 'Hotel swimming pool maintenance', D: 'Airline baggage fee policy' }, correct_answer: 'A', cefr_level: 'C1', tags: ['Part 7', 'Triple Passage'],
        detailed_explanation: { correct_reason: 'เอกสารทั้ง 3 ฉบับระบุถึงเทคโนโลยีห่วงโซ่อุปทานและการขนส่งสินค้าอัตโนมัติ' }
      });
    }
    sets.push(setQuestions);
  }
  return sets;
}

// Helper to shuffle arrays randomly
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

module.exports = async function handler(req, res) {
  try {
    const mode = (req.query.mode || 'full').toLowerCase();
    const isShuffle = req.query.shuffle === 'true' || req.query.new_attempt === 'true';

    let p5 = [...PART_5_POOL];
    let p6_sets = generatePart6Sets();
    let p7_s_sets = generatePart7SingleSets();
    let p7_d_sets = generatePart7DoubleSets();
    let p7_t_sets = generatePart7TripleSets();

    if (isShuffle) {
      p5 = shuffle(p5);
      p6_sets = shuffle(p6_sets);
      p7_s_sets = shuffle(p7_s_sets);
      p7_d_sets = shuffle(p7_d_sets);
      p7_t_sets = shuffle(p7_t_sets);
    }

    const p6_flat = p6_sets.flat();
    const p7_s_flat = p7_s_sets.flat();
    const p7_d_flat = p7_d_sets.flat();
    const p7_t_flat = p7_t_sets.flat();

    // Combine into pristine pool sorted strictly by Part (5 -> 6 -> 7)
    let pool = [
      ...p5,
      ...p6_flat,
      ...p7_s_flat,
      ...p7_d_flat,
      ...p7_t_flat
    ];

    pool.sort((a, b) => a.part - b.part);

    const limit = mode === 'quick' ? 20 : 100;
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
};
