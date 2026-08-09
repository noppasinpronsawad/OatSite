const connectToDatabase = require('../../lib/db');
const ToeicQuestion = require('../../models/ToeicQuestion');

const PRESEEDED_QUESTIONS = [
  {
    question_id: 'q-501',
    part: 5,
    question_text: 'Executive officers must submit the finalized quarterly budget report _______ Friday afternoon.',
    choices: { A: 'before', B: 'prior', C: 'ahead', D: 'earlier' },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'before' นำหน้าคำระบุเวลา Friday afternoon เพื่อหมายถึง 'ก่อนหน้า'" }
  },
  {
    question_id: 'q-502',
    part: 5,
    question_text: 'All regional managers are advised to inspect the facility premises _______ before signing the property lease agreement.',
    choices: { A: 'thoroughly', B: 'thorough', C: 'thoroughness', D: 'more thorough' },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ (Adverb) 'thoroughly' เพื่อขยายกริยา 'inspect'" }
  },
  {
    question_id: 'q-503',
    part: 5,
    question_text: 'The marketing campaign was highly successful, _______ sales increased by twenty percent.',
    choices: { A: 'and', B: 'but', C: 'or', D: 'nor' },
    correct_answer: 'A',
    cefr_level: 'B1',
    tags: ['Conjunction'],
    detailed_explanation: { correct_reason: "ใช้คำเชื่อม 'and' เพื่อเชื่อมประโยคที่เป็นเหตุเป็นผลสอดคล้องกัน" }
  },
  {
    question_id: 'q-504',
    part: 5,
    question_text: 'Ms. Henderson has been selected to lead the new project _______ her extensive experience in supply chain logistics.',
    choices: { A: 'because of', B: 'although', C: 'despite', D: 'in order that' },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'because of' ตามด้วยวลีคำนามเพื่อบอกสาเหตุ" }
  },
  {
    question_id: 'q-505',
    part: 5,
    question_text: 'Employees are required to attend the mandatory security compliance seminar _______ they are working remotely.',
    choices: { A: 'even if', B: 'in spite of', C: 'due to', D: 'regardless' },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Conjunction'],
    detailed_explanation: { correct_reason: "ใช้ 'even if' (แม้ว่า) เชื่อมประโยคเงื่อนไข" }
  },
  {
    question_id: 'q-506',
    part: 5,
    question_text: 'The financial audit team requested _______ documents to verify last year’s operational expenditures.',
    choices: { A: 'additional', B: 'addition', C: 'additionally', D: 'additive' },
    correct_answer: 'A',
    cefr_level: 'B1',
    tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'additional' ขยายคำนาม 'documents'" }
  },
  {
    question_id: 'q-507',
    part: 5,
    question_text: 'The new automated invoicing system will be fully operational _______ the end of this month.',
    choices: { A: 'by', B: 'since', C: 'for', D: 'during' },
    correct_answer: 'A',
    cefr_level: 'B1',
    tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'by' เพื่อระบุเส้นตายเวลาในการทำงานเสร็จ" }
  },
  {
    question_id: 'q-508',
    part: 5,
    question_text: 'Board members voted _______ to approve the revised corporate restructuring plan.',
    choices: { A: 'unanimously', B: 'unanimous', C: 'unanimity', D: 'unanimousness' },
    correct_answer: 'A',
    cefr_level: 'C1',
    tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ 'unanimously' เพื่อขยายกริยา 'voted'" }
  },
  {
    question_id: 'q-509',
    part: 5,
    question_text: 'Please review the client feedback summary _______ submitting the final contract proposal.',
    choices: { A: 'before', B: 'between', C: 'among', D: 'during' },
    correct_answer: 'A',
    cefr_level: 'A2',
    tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'before' นำหน้าคำกริยาเติม -ing (Gerund) เพื่อบอกลำดับเวลา" }
  },
  {
    question_id: 'q-510',
    part: 5,
    question_text: 'The chief executive officer delivered an _______ speech at the annual shareholders conference.',
    choices: { A: 'inspiring', B: 'inspiration', C: 'inspirational', D: 'inspire' },
    correct_answer: 'C',
    cefr_level: 'B2',
    tags: ['Vocabulary'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'inspirational' ขยายคำนาม 'speech'" }
  },

  {
    question_id: 'q-601',
    part: 6,
    passage_title: 'MEMORANDUM: Workplace Remote Access Policy 2026',
    passage_content: '<p><strong>To:</strong> All Staff Members<br><strong>From:</strong> IT Infrastructure Team<br><strong>Date:</strong> August 8, 2026<br><strong>Subject:</strong> System Upgrade & Multi-Factor Authentication</p><p>Please be advised that our core network servers will undergo scheduled maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this period, remote VPN access will be temporarily unavailable. Employees should ensure that all critical files are saved locally prior to the maintenance window. [1] _______ We appreciate your cooperation in keeping our data infrastructure secure.</p>',
    question_text: 'Which sentence best fits blank [1] in the memorandum?',
    choices: {
      A: 'Regular system access will resume automatically on Sunday morning.',
      B: 'The cafeteria will offer discounted meals during the weekend.',
      C: 'Parking passes must be renewed at the security desk.',
      D: 'Flight reservations have been successfully confirmed.'
    },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ประโยค A สอดคล้องกับเนื้อหาการแจ้งเตือนเวลาเปิดใช้งานระบบหลังการปรับปรุง" }
  },
  {
    question_id: 'q-602',
    part: 6,
    passage_title: 'MEMORANDUM: Workplace Remote Access Policy 2026',
    passage_content: '<p><strong>To:</strong> All Staff Members<br><strong>From:</strong> IT Infrastructure Team<br><strong>Date:</strong> August 8, 2026<br><strong>Subject:</strong> System Upgrade & Multi-Factor Authentication</p><p>Please be advised that our core network servers will undergo scheduled maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this period, remote VPN access will be temporarily unavailable. Employees should ensure that all critical files are saved locally prior to the maintenance window. [1] _______ We appreciate your cooperation in keeping our data infrastructure secure.</p>',
    question_text: 'What is the primary purpose of the scheduled maintenance?',
    choices: {
      A: 'To upgrade core network servers and maintain security',
      B: 'To hire new IT support personnel',
      C: 'To renovate the company cafeteria',
      D: 'To relocate the office headquarters'
    },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part 6'],
    detailed_explanation: { correct_reason: "จุดประสงค์หลักระบุในบทความว่าเป็นการปรับปรุงระบบเซิร์ฟเวอร์หลักเพื่อความปลอดภัย" }
  },
  {
    question_id: 'q-603',
    part: 6,
    passage_title: 'MEMORANDUM: Workplace Remote Access Policy 2026',
    passage_content: '<p><strong>To:</strong> All Staff Members<br><strong>From:</strong> IT Infrastructure Team<br><strong>Date:</strong> August 8, 2026<br><strong>Subject:</strong> System Upgrade & Multi-Factor Authentication</p><p>Please be advised that our core network servers will undergo scheduled maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this period, remote VPN access will be temporarily unavailable. Employees should ensure that all critical files are saved locally prior to the maintenance window. [1] _______ We appreciate your cooperation in keeping our data infrastructure secure.</p>',
    question_text: 'What are employees instructed to do before Saturday 10:00 PM?',
    choices: {
      A: 'Save all critical files locally on their devices',
      B: 'Submit their annual performance evaluation',
      C: 'Contact the travel manager immediately',
      D: 'Shut down all electrical outlets in the building'
    },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ในบันทึกข้อความระบุชัดเจนว่าพนักงานควรรีบเซฟไฟล์งานลงเครื่องก่อนปิดปรับปรุง" }
  },
  {
    question_id: 'q-604',
    part: 6,
    passage_title: 'MEMORANDUM: Workplace Remote Access Policy 2026',
    passage_content: '<p><strong>To:</strong> All Staff Members<br><strong>From:</strong> IT Infrastructure Team<br><strong>Date:</strong> August 8, 2026<br><strong>Subject:</strong> System Upgrade & Multi-Factor Authentication</p><p>Please be advised that our core network servers will undergo scheduled maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this period, remote VPN access will be temporarily unavailable. Employees should ensure that all critical files are saved locally prior to the maintenance window. [1] _______ We appreciate your cooperation in keeping our data infrastructure secure.</p>',
    question_text: 'The word "critical" in paragraph 1 is closest in meaning to:',
    choices: {
      A: 'essential',
      B: 'faulty',
      C: 'dangerous',
      D: 'optional'
    },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part 6'],
    detailed_explanation: { correct_reason: "คำว่า 'critical' ในบริบทนี้หมายถึง 'จำเป็น/สำคัญยิ่ง' ซึ่งตรงกับ 'essential'" }
  },

  {
    question_id: 'q-701',
    part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'What is the main subject of the press release?',
    choices: {
      A: 'A major commercial agreement for zero-emission electric delivery fleets',
      B: 'The opening of a new corporate office in London',
      C: 'A price reduction on residential solar panels',
      D: 'The merger of two international airline companies'
    },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ข่าวประชาสัมพันธ์เปิดหัวเรื่องด้วยสัญญาความร่วมมือ 50 ล้านยูโรในการส่งมอบรถขนส่งไฟฟ้า 1,200 คัน" }
  },
  {
    question_id: 'q-702',
    part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'Which cities will receive the first electric fleet deployments in Q4 2026?',
    choices: {
      A: 'Stockholm and Copenhagen',
      B: 'Hamburg and Rotterdam',
      C: 'Helsinki and Oslo',
      D: 'Berlin and Paris'
    },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ย่อหน้าที่สองระบุว่าเมืองแรกที่จะได้รับการส่งมอบรถไฟฟ้าในไตรมาสที่ 4 คือ สตอกโฮล์ม และ โคเปนเฮเกน" }
  },
  {
    question_id: 'q-703',
    part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'How many ultra-fast charging hubs will be constructed under the agreement?',
    choices: {
      A: '45 hubs',
      B: '1,200 hubs',
      C: '50 hubs',
      D: '5 hubs'
    },
    correct_answer: 'A',
    cefr_level: 'B1',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ในสัญญาจะมีการสร้างสถานีชาร์จความเร็วสูงทั้งหมด 45 สถานี" }
  },
  {
    question_id: 'q-704',
    part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'Who is Marcus Lindqvist?',
    choices: {
      A: 'Chief Sustainability Officer at Global Logistics',
      B: 'CEO of Nordic CleanTech Solutions',
      C: 'Mayor of Stockholm',
      D: 'Lead Architect for charging hubs'
    },
    correct_answer: 'A',
    cefr_level: 'B1',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ในคำโควตระบุว่า Marcus Lindqvist มีตำแหน่งเป็น Chief Sustainability Officer ของ Global Logistics" }
  },
  {
    question_id: 'q-705',
    part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'When will fleet expansion into Hamburg and Rotterdam take place?',
    choices: {
      A: 'Early 2027',
      B: 'Q4 2026',
      C: 'Late 2028',
      D: 'August 2025'
    },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ในข่าวระบุการขยายไปยังเมืองฮัมบวร์กและร็อตเทอร์ดามจะเกิดขึ้นต้นปี 2027" }
  },
  {
    question_id: 'q-706',
    part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'Why is the software release date being delayed?',
    choices: {
      A: 'Quality assurance found bugs in the payment integration module',
      B: 'The project budget was significantly reduced',
      C: 'The client cancelled the software contract',
      D: 'The lead product manager is taking medical leave'
    },
    correct_answer: 'A',
    cefr_level: 'B2',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "อีเมลระบุสาเหตุการเลื่อนวันเลขาว่าเกิดจากทีม QA ตรวจพบบั๊กในโมดูลชำระเงิน" }
  },
  {
    question_id: 'q-707',
    part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'By how much time is the beta launch date delayed?',
    choices: {
      A: 'Two weeks',
      B: 'One month',
      C: 'Three days',
      D: 'Six months'
    },
    correct_answer: 'A',
    cefr_level: 'B1',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ในเนื้อหาระบุว่าต้องเลื่อนวันเปิดตัวเวอร์ชันเบต้าออกไป 2 สัปดาห์ (two weeks)" }
  },
  {
    question_id: 'q-708',
    part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'What time will tomorrow’s standup meeting take place?',
    choices: {
      A: '9:30 AM',
      B: '10:00 AM',
      C: '2:00 PM',
      D: '8:30 AM'
    },
    correct_answer: 'A',
    cefr_level: 'A2',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ช่วงท้ายอีเมลระบุเวลาประชุมสแตนด์อัปพรุ่งนี้ที่ 9:30 AM" }
  },
  {
    question_id: 'q-709',
    part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'What is David requested to update?',
    choices: {
      A: 'The master roadmap document',
      B: 'The company financial balance sheet',
      C: 'The catering order for lunch',
      D: 'The server security passwords'
    },
    correct_answer: 'A',
    cefr_level: 'B1',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ซาร่าห์ขอให้เดวิดอัปเดตเอกสารแผนงานหลัก (master roadmap document)" }
  },
  {
    question_id: 'q-710',
    part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'What is Sarah Jenkins’ job title?',
    choices: {
      A: 'Lead Product Manager',
      B: 'Chief Executive Officer',
      C: 'Frontend Engineer',
      D: 'Database Administrator'
    },
    correct_answer: 'A',
    cefr_level: 'A2',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "คำลงท้ายลงตำแหน่งว่า Lead Product Manager" }
  },
  {
    question_id: 'q-711',
    part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'The word "discovered" in paragraph 1 is closest in meaning to:',
    choices: {
      A: 'found',
      B: 'hidden',
      C: 'ignored',
      D: 'created'
    },
    correct_answer: 'A',
    cefr_level: 'B1',
    tags: ['Part 7'],
    detailed_explanation: { correct_reason: "คำว่า 'discovered' แปลว่า ตรวจพบ/ค้นพบ ซึ่งตรงกับคำว่า 'found'" }
  }
];

function generateProceduralPassageSet(part, setIdx, groupSize) {
  const pTitle = part === 6 
    ? `MEMORANDUM: Workplace Remote Access Policy Update #${setIdx}`
    : `PRESS RELEASE: Sustainable Business Strategy Announcement #${setIdx}`;

  const pContent = part === 6 
    ? `<p><strong>To:</strong> All Staff Members<br><strong>From:</strong> IT Management<br><strong>Subject:</strong> System Upgrade Policy #${setIdx}</p><p>Please be advised that core network servers will undergo scheduled maintenance this coming weekend from 10:00 PM to 4:00 AM. During this period, remote VPN access will be temporarily unavailable. Employees should ensure that all critical files are saved locally prior to the maintenance window. [1] _______ We appreciate your cooperation in keeping data infrastructure secure.</p>`
    : `<p><strong>HELSINKI — August 9, 2026</strong> — Nordic Logistics today signed a 40-million-euro agreement to expand zero-emission electric delivery fleets across major European commercial centers. Under the terms of the five-year agreement, 1,000 commercial electric vans will be delivered by Q4 2026.</p><p>"This partnership accelerates our transition toward carbon-neutral operations," stated the Chief Sustainability Officer. Initial deployment is scheduled for Stockholm and Copenhagen.</p>`;

  const setQuestions = [];
  for (let i = 1; i <= groupSize; i++) {
    setQuestions.push({
      question_id: `q-p${part}-set-${setIdx}-${i}`,
      part,
      passage_title: pTitle,
      passage_content: pContent,
      question_text: part === 6 
        ? `Which sentence best fits blank [${i}] in memorandum #${setIdx}?`
        : `What is the main objective of commercial agreement #${setIdx} (Question ${i})?`,
      choices: {
        A: 'To expand zero-emission electric delivery fleets and upgrade system servers',
        B: 'To hire additional corporate sales personnel',
        C: 'To renovate the main office cafeteria',
        D: 'To relocate company headquarters to London'
      },
      correct_answer: 'A',
      cefr_level: 'B2',
      tags: [part === 6 ? 'Part 6' : 'Part 7'],
      detailed_explanation: { correct_reason: `ข้อสอบกลุ่มบทความเดียวกันสำหรับ Part ${part} (ข้อที่ ${i} จากทั้งสิ้น ${groupSize} ข้อ)` }
    });
  }
  return setQuestions;
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

    const passageKey = (q.passage_title || q.passage_content || '').trim();
    if (!passageKey) {
      groups.push({ isSingle: true, questions: [cleanedQ] });
    } else {
      if (!groupMap.has(passageKey)) {
        const newGroup = { isSingle: false, key: passageKey, questions: [] };
        groupMap.set(passageKey, newGroup);
        groups.push(newGroup);
      }
      groupMap.get(passageKey).questions.push(cleanedQ);
    }
  }

  // Ensure passage_title and passage_content are inherited across all questions in each group
  for (const g of groups) {
    if (!g.isSingle && g.questions.length > 0) {
      const parentPTitle = g.questions.find(q => q.passage_title)?.passage_title || '';
      const parentPContent = g.questions.find(q => q.passage_content)?.passage_content || '';

      g.questions = g.questions.map(q => ({
        ...q,
        passage_title: q.passage_title || parentPTitle,
        passage_content: q.passage_content || parentPContent
      }));
    }
  }

  return groups;
}

function shuffleArray(arr) {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function shuffleQuestionChoices(q) {
  const choices = q.choices || {};
  const keys = ['A', 'B', 'C', 'D'];
  const originalCorrectText = choices[q.correct_answer] || choices['A'] || '';

  const shuffledKeys = shuffleArray(keys);
  const newChoices = {};
  let newCorrectKey = 'A';

  shuffledKeys.forEach((origKey, newIdx) => {
    const targetKey = keys[newIdx];
    newChoices[targetKey] = choices[origKey] || '';
    if (choices[origKey] === originalCorrectText) {
      newCorrectKey = targetKey;
    }
  });

  return {
    ...q,
    choices: newChoices,
    correct_answer: newCorrectKey
  };
}

module.exports = async function handler(req, res) {
  // Disable API caching completely (Force Dynamic Response)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const mode = req.query.mode || 'full'; // 'full' (100 Qs) or 'quick' (20 Qs)
    let questions = [];

    try {
      await connectToDatabase();

      if (mode === 'quick') {
        const part5 = await ToeicQuestion.aggregate([{ $match: { part: 5 } }, { $sample: { size: 20 } }]);
        const part6 = await ToeicQuestion.aggregate([{ $match: { part: 6 } }, { $sample: { size: 15 } }]);
        const part7 = await ToeicQuestion.aggregate([{ $match: { part: 7 } }, { $sample: { size: 30 } }]);
        questions = [...part5, ...part6, ...part7];
      } else {
        const part5 = await ToeicQuestion.aggregate([{ $match: { part: 5 } }, { $sample: { size: 50 } }]);
        const part6 = await ToeicQuestion.aggregate([{ $match: { part: 6 } }, { $sample: { size: 30 } }]);
        const part7 = await ToeicQuestion.aggregate([{ $match: { part: 7 } }, { $sample: { size: 90 } }]);
        questions = [...part5, ...part6, ...part7];
      }

      if (!questions || questions.length < 5) {
        questions = await ToeicQuestion.find({}).sort({ part: 1, question_id: 1 });
      }
    } catch (dbErr) {
      console.warn('MongoDB query failed, using PRESEEDED_QUESTIONS pool:', dbErr.message);
      questions = PRESEEDED_QUESTIONS;
    }

    if (!questions || questions.length === 0) {
      questions = PRESEEDED_QUESTIONS;
    }

    // Merge with PRESEEDED_QUESTIONS
    const combinedPool = questions.concat(PRESEEDED_QUESTIONS);
    const seenTexts = new Set();

    // Grouping by Passage for Part 6 & Part 7
    const targetP5 = mode === 'quick' ? 6 : 30;
    const targetP6 = mode === 'quick' ? 3 : 16;
    const targetP7 = mode === 'quick' ? 11 : 54;

    // --- Part 5 Sampling ---
    const p5Candidates = combinedPool.filter(q => q.part === 5);
    const selectedP5 = [];
    for (const q of shuffleArray(p5Candidates)) {
      if (selectedP5.length >= targetP5) break;
      const qText = String(q.question_text || '').replace(/^\[AI Generated Q?\d*\]\s*/i, '').trim();
      const k = qText.toLowerCase();
      if (k && !seenTexts.has(k)) {
        seenTexts.add(k);
        selectedP5.push({ ...q, question_text: qText });
      }
    }
    let p5_gen_idx = 500;
    while (selectedP5.length < targetP5) {
      selectedP5.push({
        question_id: `q-p5-gen-${p5_gen_idx}`,
        part: 5,
        question_text: `Executive managers agreed to approve project proposal number ${p5_gen_idx} _______ next week's meeting.`,
        choices: { A: 'before', B: 'during', C: 'prior', D: 'ahead' },
        correct_answer: 'B',
        cefr_level: 'B2',
        tags: ['Grammar'],
        detailed_explanation: { correct_reason: "ใช้ 'during' บอกช่วงเวลาของการประชุม" }
      });
      p5_gen_idx++;
    }

    // --- Part 6 Group Sampling ---
    const p6Candidates = combinedPool.filter(q => q.part === 6);
    const p6Groups = groupQuestionsByPassage(p6Candidates);
    const selectedP6 = [];

    for (const g of shuffleArray(p6Groups)) {
      if (selectedP6.length >= targetP6) break;

      // Group validation: check if any question in this passage set is duplicate
      const isGroupValid = g.questions.every(q => {
        const k = String(q.question_text || '').toLowerCase();
        return k && !seenTexts.has(k);
      });

      if (isGroupValid) {
        for (const q of g.questions) {
          const k = String(q.question_text || '').toLowerCase();
          seenTexts.add(k);
          selectedP6.push(q);
          if (selectedP6.length >= targetP6) break;
        }
      }
    }
    let p6_set_idx = 100;
    while (selectedP6.length < targetP6) {
      const needed = targetP6 - selectedP6.length;
      const setSize = Math.min(3, needed);
      const newSet = generateProceduralPassageSet(6, p6_set_idx++, setSize);
      selectedP6.push(...newSet);
    }

    // --- Part 7 Group Sampling ---
    const p7Candidates = combinedPool.filter(q => q.part === 7);
    const p7Groups = groupQuestionsByPassage(p7Candidates);
    const selectedP7 = [];

    for (const g of shuffleArray(p7Groups)) {
      if (selectedP7.length >= targetP7) break;

      const isGroupValid = g.questions.every(q => {
        const k = String(q.question_text || '').toLowerCase();
        return k && !seenTexts.has(k);
      });

      if (isGroupValid) {
        for (const q of g.questions) {
          const k = String(q.question_text || '').toLowerCase();
          seenTexts.add(k);
          selectedP7.push(q);
          if (selectedP7.length >= targetP7) break;
        }
      }
    }
    let p7_set_idx = 100;
    while (selectedP7.length < targetP7) {
      const needed = targetP7 - selectedP7.length;
      const setSize = Math.min(4, needed);
      const newSet = generateProceduralPassageSet(7, p7_set_idx++, setSize);
      selectedP7.push(...newSet);
    }

    const selectedQuestions = [
      ...selectedP5.slice(0, targetP5),
      ...selectedP6.slice(0, targetP6),
      ...selectedP7.slice(0, targetP7)
    ];

    // STRICT PART SORTING: Part 5 (Q1..) -> Part 6 -> Part 7
    selectedQuestions.sort((a, b) => Number(a.part || 5) - Number(b.part || 5));

    // Shuffle choices (A,B,C,D) for each question while maintaining strict Part sequence
    const finalQuestions = selectedQuestions.map(q => shuffleQuestionChoices(q));

    return res.status(200).json({
      success: true,
      mode,
      total: finalQuestions.length,
      questions: finalQuestions
    });
  } catch (err) {
    console.error('TOEIC questions handler error:', err);
    return res.status(500).json({
      error: 'Failed to fetch TOEIC questions',
      message: err.message
    });
  }
};
