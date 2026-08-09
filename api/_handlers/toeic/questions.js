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

function generateProceduralQuestion(part, index) {
  if (part === 5) {
    return {
      question_id: `q-p5-gen-${index}`,
      part: 5,
      question_text: `The executive committee agreed to approve the corporate project plan number ${index} _______ next week's meeting.`,
      choices: { A: 'before', B: 'during', C: 'prior', D: 'ahead' },
      correct_answer: 'B',
      cefr_level: 'B2',
      tags: ['Grammar'],
      detailed_explanation: { correct_reason: "ใช้ 'during' บอกช่วงเวลาของการประชุม" }
    };
  } else if (part === 6) {
    return {
      question_id: `q-p6-gen-${index}`,
      part: 6,
      passage_title: `ANNOUNCEMENT: Office Policy Update #${index}`,
      passage_content: `<p>All department managers are requested to review the revised operational guidelines. Please complete the feedback form before Friday. [1] _______ Thank you for your continued dedication.</p>`,
      question_text: `Which sentence best fits blank [1] in announcement #${index}?`,
      choices: {
        A: 'Submissions received after the deadline will be processed next week.',
        B: 'The cafeteria will offer discounted meals during the weekend.',
        C: 'Visitors must wear blue passes.',
        D: 'Office parking is free on Sundays.'
      },
      correct_answer: 'A',
      cefr_level: 'B2',
      tags: ['Part 6'],
      detailed_explanation: { correct_reason: "ประโยค A สอดคล้องกับข้อความเรื่องกำหนดส่งแบบฟอร์ม" }
    };
  } else {
    return {
      question_id: `q-p7-gen-${index}`,
      part: 7,
      passage_title: `BUSINESS REPORT: Regional Market Expansion Plan #${index}`,
      passage_content: `<p><strong>SEOUL — August 9, 2026</strong> — EastAsia Logistics today announced plans to open 3 new automated distribution hubs across key commercial districts. The 15-million-dollar investment aims to shorten express delivery windows to under 4 hours.</p>`,
      question_text: `What is the main objective of distribution hub #${index}?`,
      choices: {
        A: 'To shorten express delivery windows to under 4 hours',
        B: 'To hire additional sales representatives',
        C: 'To manufacture industrial machinery',
        D: 'To reduce electricity consumption'
      },
      correct_answer: 'A',
      cefr_level: 'B2',
      tags: ['Part 7'],
      detailed_explanation: { correct_reason: "เนื้อหาระบุว่าศูนย์กระจายสินค้าใหม่มีเป้าหมายเพื่อย่อเวลาส่งของให้เหลือต่ำกว่า 4 ชั่วโมง" }
    };
  }
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
        const part6 = await ToeicQuestion.aggregate([{ $match: { part: 6 } }, { $sample: { size: 10 } }]);
        const part7 = await ToeicQuestion.aggregate([{ $match: { part: 7 } }, { $sample: { size: 25 } }]);
        questions = [...part5, ...part6, ...part7];
      } else {
        const part5 = await ToeicQuestion.aggregate([{ $match: { part: 5 } }, { $sample: { size: 40 } }]);
        const part6 = await ToeicQuestion.aggregate([{ $match: { part: 6 } }, { $sample: { size: 25 } }]);
        const part7 = await ToeicQuestion.aggregate([{ $match: { part: 7 } }, { $sample: { size: 70 } }]);
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

    // Merge with PRESEEDED_QUESTIONS to guarantee massive pool
    const combinedPool = shuffleArray(questions.concat(PRESEEDED_QUESTIONS));

    // Clean AI Generated prefix and Deduplicate
    const seenTexts = new Set();
    const cleanUniqueQuestions = [];

    for (const qObj of combinedPool) {
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

    let selectedQuestions = [];

    if (mode === 'quick') {
      // EXACTLY 20 QUESTIONS: 6 Part 5, 3 Part 6, 11 Part 7
      let p5 = cleanUniqueQuestions.filter(q => q.part === 5);
      let p6 = cleanUniqueQuestions.filter(q => q.part === 6);
      let p7 = cleanUniqueQuestions.filter(q => q.part === 7);

      let p5_idx = 100;
      while (p5.length < 6) p5.push(generateProceduralQuestion(5, p5_idx++));
      let p6_idx = 100;
      while (p6.length < 3) p6.push(generateProceduralQuestion(6, p6_idx++));
      let p7_idx = 100;
      while (p7.length < 11) p7.push(generateProceduralQuestion(7, p7_idx++));

      selectedQuestions = [
        ...shuffleArray(p5).slice(0, 6),
        ...shuffleArray(p6).slice(0, 3),
        ...shuffleArray(p7).slice(0, 11)
      ];
    } else {
      // EXACTLY 100 QUESTIONS: 30 Part 5, 16 Part 6, 54 Part 7
      let p5 = cleanUniqueQuestions.filter(q => q.part === 5);
      let p6 = cleanUniqueQuestions.filter(q => q.part === 6);
      let p7 = cleanUniqueQuestions.filter(q => q.part === 7);

      let p5_idx = 200;
      while (p5.length < 30) p5.push(generateProceduralQuestion(5, p5_idx++));
      let p6_idx = 200;
      while (p6.length < 16) p6.push(generateProceduralQuestion(6, p6_idx++));
      let p7_idx = 200;
      while (p7.length < 54) p7.push(generateProceduralQuestion(7, p7_idx++));

      selectedQuestions = [
        ...shuffleArray(p5).slice(0, 30),
        ...shuffleArray(p6).slice(0, 16),
        ...shuffleArray(p7).slice(0, 54)
      ];
    }

    // STRICT PART SORTING: Part 5 (Q1..30) -> Part 6 (Q31..46) -> Part 7 (Q47..100)
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
