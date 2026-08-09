const connectToDatabase = require('../../lib/db');
const ToeicQuestion = require('../../models/ToeicQuestion');

const PRESEEDED_QUESTIONS = [
  // --- PART 5: GRAMMAR & VOCABULARY ---
  {
    question_id: 'q-501', part: 5,
    question_text: 'Executive officers must submit the finalized quarterly budget report _______ Friday afternoon.',
    choices: { A: 'before', B: 'prior', C: 'ahead', D: 'earlier' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'before' นำหน้าคำระบุเวลา Friday afternoon เพื่อหมายถึง 'ก่อนหน้า'" }
  },
  {
    question_id: 'q-502', part: 5,
    question_text: 'All regional managers are advised to inspect the facility premises _______ before signing the property lease agreement.',
    choices: { A: 'thoroughly', B: 'thorough', C: 'thoroughness', D: 'more thorough' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ (Adverb) 'thoroughly' เพื่อขยายกริยา 'inspect'" }
  },
  {
    question_id: 'q-503', part: 5,
    question_text: 'The marketing campaign was highly successful, _______ sales increased by twenty percent.',
    choices: { A: 'and', B: 'but', C: 'or', D: 'nor' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Conjunction'],
    detailed_explanation: { correct_reason: "ใช้คำเชื่อม 'and' เพื่อเชื่อมประโยคที่เป็นเหตุเป็นผลสอดคล้องกัน" }
  },
  {
    question_id: 'q-504', part: 5,
    question_text: 'Ms. Henderson has been selected to lead the new project _______ her extensive experience in supply chain logistics.',
    choices: { A: 'because of', B: 'although', C: 'despite', D: 'in order that' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'because of' ตามด้วยวลีคำนามเพื่อบอกสาเหตุ" }
  },
  {
    question_id: 'q-505', part: 5,
    question_text: 'Employees are required to attend the mandatory security compliance seminar _______ they are working remotely.',
    choices: { A: 'even if', B: 'in spite of', C: 'due to', D: 'regardless' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Conjunction'],
    detailed_explanation: { correct_reason: "ใช้ 'even if' (แม้ว่า) เชื่อมประโยคเงื่อนไข" }
  },
  {
    question_id: 'q-506', part: 5,
    question_text: 'The financial audit team requested _______ documents to verify last year’s operational expenditures.',
    choices: { A: 'additional', B: 'addition', C: 'additionally', D: 'additive' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'additional' ขยายคำนาม 'documents'" }
  },
  {
    question_id: 'q-507', part: 5,
    question_text: 'The new automated invoicing system will be fully operational _______ the end of this month.',
    choices: { A: 'by', B: 'since', C: 'for', D: 'during' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'by' เพื่อระบุเส้นตายเวลาในการทำงานเสร็จ" }
  },
  {
    question_id: 'q-508', part: 5,
    question_text: 'Board members voted _______ to approve the revised corporate restructuring plan.',
    choices: { A: 'unanimously', B: 'unanimous', C: 'unanimity', D: 'unanimousness' }, correct_answer: 'A', cefr_level: 'C1', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ 'unanimously' เพื่อขยายกริยา 'voted'" }
  },
  {
    question_id: 'q-509', part: 5,
    question_text: 'Please review the client feedback summary _______ submitting the final contract proposal.',
    choices: { A: 'before', B: 'between', C: 'among', D: 'during' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'before' นำหน้าคำกริยาเติม -ing (Gerund) เพื่อบอกลำดับเวลา" }
  },
  {
    question_id: 'q-510', part: 5,
    question_text: 'The chief executive officer delivered an _______ speech at the annual shareholders conference.',
    choices: { A: 'inspirational', B: 'inspiration', C: 'inspiringly', D: 'inspire' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Vocabulary'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'inspirational' ขยายคำนาม 'speech'" }
  },
  {
    question_id: 'q-511', part: 5,
    question_text: 'Contractors must obtain written permission before making any _______ modifications to the building.',
    choices: { A: 'structural', B: 'structure', C: 'structurally', D: 'structured' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'structural' ขยายคำนาม 'modifications'" }
  },
  {
    question_id: 'q-512', part: 5,
    question_text: 'The human resources department has introduced a more _______ employee onboarding procedure.',
    choices: { A: 'efficient', B: 'efficiency', C: 'efficiently', D: 'efficiencies' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'efficient' ขยายคำนาม 'procedure'" }
  },
  {
    question_id: 'q-513', part: 5,
    question_text: 'Flight SV-402 was delayed _______ heavy thunderstorm activity over the regional airport.',
    choices: { A: 'owing to', B: 'because', C: 'even though', D: 'in order to' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'owing to' (เนื่องมาจาก) ตามด้วยวลีคำนาม" }
  },
  {
    question_id: 'q-514', part: 5,
    question_text: 'Dr. Arisawa will oversee the clinical trials to ensure complete _______ with federal safety standards.',
    choices: { A: 'compliance', B: 'comply', C: 'compliant', D: 'compliantly' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้คำนาม 'compliance' ตามหลังคำคุณศัพท์ 'complete'" }
  },
  {
    question_id: 'q-515', part: 5,
    question_text: 'The newly published instruction manual is _______ easier to navigate than the previous edition.',
    choices: { A: 'considerably', B: 'considerable', C: 'consideration', D: 'consider' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ 'considerably' ขยายคำคุณศัพท์ขั้นกว่า 'easier'" }
  },
  {
    question_id: 'q-516', part: 5,
    question_text: 'Suppliers are requested to submit itemized invoices _______ five business days after product delivery.',
    choices: { A: 'within', B: 'inside', C: 'among', D: 'along' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'within' (ภายในเวลา) ตามด้วยระยะเวลา 5 วันทำการ" }
  },
  {
    question_id: 'q-517', part: 5,
    question_text: 'The research division worked _______ to finish the solar cell prototype ahead of the international expo.',
    choices: { A: 'tirelessly', B: 'tiring', C: 'tired', D: 'tireless' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ 'tirelessly' ขยายกริยา 'worked'" }
  },
  {
    question_id: 'q-518', part: 5,
    question_text: 'Neither the department supervisor _______ the project manager was aware of the software system glitch.',
    choices: { A: 'nor', B: 'or', C: 'and', D: 'but' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Conjunction'],
    detailed_explanation: { correct_reason: "ใช้คำเชื่อมคู่ 'neither ... nor' (ไม่ทั้ง...และ...)" }
  },
  {
    question_id: 'q-519', part: 5,
    question_text: 'Visitors should register at the security kiosk _______ entering the research and development facility.',
    choices: { A: 'upon', B: 'onto', C: 'into', D: 'over' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'upon' (เมื่อ/ทันทีที่) ตามด้วย V-ing 'entering'" }
  },
  {
    question_id: 'q-520', part: 5,
    question_text: 'The executive board was impressed by Mr. Santos’s _______ presentation on global market trends.',
    choices: { A: 'persuasive', B: 'persuade', C: 'persuasion', D: 'persuasively' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'persuasive' (น่าโน้มน้าวใจ) ขยายคำนาม 'presentation'" }
  },
  {
    question_id: 'q-521', part: 5,
    question_text: 'All expense reimbursement requests must be signed by a department manager _______ processing.',
    choices: { A: 'prior to', B: 'except for', C: 'in place of', D: 'by means of' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้ 'prior to' (ก่อนหน้า) นำหน้าคำนาม 'processing'" }
  },
  {
    question_id: 'q-522', part: 5,
    question_text: 'The customer service department responded _______ to all user inquiries regarding the billing update.',
    choices: { A: 'promptly', B: 'prompt', C: 'promptness', D: 'prompter' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ 'promptly' ขยายกริยา 'responded'" }
  },
  {
    question_id: 'q-523', part: 5,
    question_text: 'Sales representatives who exceed their annual quota will be _______ with a paid vacation bonus.',
    choices: { A: 'rewarded', B: 'rewarding', C: 'rewards', D: 'reward' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Verb Form'],
    detailed_explanation: { correct_reason: "ใช้กริยาช่อง 3 'rewarded' ในโครงสร้าง Passive Voice (will be + V3)" }
  },
  {
    question_id: 'q-524', part: 5,
    question_text: 'The engineering team completed the bridge safety evaluation _______ schedule despite heavy rain.',
    choices: { A: 'ahead of', B: 'out of', C: 'apart from', D: 'instead of' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Preposition'],
    detailed_explanation: { correct_reason: "ใช้สำนวน 'ahead of schedule' (ก่อนกำหนดเวลา)" }
  },
  {
    question_id: 'q-525', part: 5,
    question_text: 'Please keep all confidential company files in a locked cabinet _______ unauthorized access.',
    choices: { A: 'to prevent', B: 'prevention', C: 'prevented', D: 'preventative' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Infinitive'],
    detailed_explanation: { correct_reason: "ใช้ To-Infinitive 'to prevent' เพื่อบอกจุดประสงค์ (เพื่อป้องกัน)" }
  },
  {
    question_id: 'q-526', part: 5,
    question_text: 'The newly appointed director possesses _______ leadership skills and industry experience.',
    choices: { A: 'exceptional', B: 'exceptionally', C: 'except', D: 'exception' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'exceptional' (โดดเด่น) ขยายคำนาม 'leadership skills'" }
  },
  {
    question_id: 'q-527', part: 5,
    question_text: 'Hotel guests are encouraged to leave their room keys at the front desk _______ leaving the building.',
    choices: { A: 'when', B: 'where', C: 'which', D: 'what' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Conjunction'],
    detailed_explanation: { correct_reason: "ใช้ 'when' (เมื่อ) เชื่อมคำกริยาเติม -ing 'leaving'" }
  },
  {
    question_id: 'q-528', part: 5,
    question_text: 'The software update contains several features designed to enhance overall network _______.',
    choices: { A: 'reliability', B: 'reliably', C: 'reliable', D: 'rely' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้คำนาม 'reliability' (ความน่าเชื่อถือ) ตามหลังคำคุณศัพท์ 'network'" }
  },
  {
    question_id: 'q-529', part: 5,
    question_text: 'Maintenance workers checked all air conditioning units _______ guarantee optimal indoor climate control.',
    choices: { A: 'in order to', B: 'as a result', C: 'so that', D: 'such that' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Conjunction'],
    detailed_explanation: { correct_reason: "ใช้ 'in order to' ตามด้วยกริยาช่อง 1 'guarantee' เพื่อบอกจุดประสงค์" }
  },
  {
    question_id: 'q-530', part: 5,
    question_text: 'The company’s annual profit margin increased _______ after expanding into Asian markets.',
    choices: { A: 'significantly', B: 'significant', C: 'significance', D: 'signify' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part of Speech'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ 'significantly' ขยายกริยา 'increased'" }
  },

  // --- PART 6: TEXT COMPLETION (PROPER PASSAGE SETS WITH [1], [2], [3], [4] MATCHING BLANKS) ---

  // Set 6-A: IT Network Maintenance Memo
  {
    question_id: 'q-601', part: 6,
    passage_title: 'MEMORANDUM: Scheduled IT Server Maintenance & Remote Access Policy',
    passage_content: '<p><strong>To:</strong> All Department Staff<br><strong>From:</strong> IT Infrastructure Management<br><strong>Date:</strong> August 9, 2026<br><strong>Subject:</strong> System Upgrade & Network Downtime Notice</p><p>Please be advised that core network servers will undergo scheduled maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this period, remote VPN access will be [1] _______ unavailable to all employees. [2] _______ We strongly recommend that all urgent files be saved locally on your workstation prior to the maintenance window. [3] _______ We appreciate your [4] _______ and patience as we upgrade our infrastructure security.</p>',
    question_text: 'Which word best fits blank [1] in the memorandum?',
    choices: { A: 'temporarily', B: 'permanently', C: 'finally', D: 'recently' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ 'temporarily' (ชั่วคราว) เพื่อบอกการปิดปรับปรุงระบบในระยะเวลาหนึ่ง" }
  },
  {
    question_id: 'q-602', part: 6,
    passage_title: 'MEMORANDUM: Scheduled IT Server Maintenance & Remote Access Policy',
    passage_content: '<p><strong>To:</strong> All Department Staff<br><strong>From:</strong> IT Infrastructure Management<br><strong>Date:</strong> August 9, 2026<br><strong>Subject:</strong> System Upgrade & Network Downtime Notice</p><p>Please be advised that core network servers will undergo scheduled maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this period, remote VPN access will be [1] _______ unavailable to all employees. [2] _______ We strongly recommend that all urgent files be saved locally on your workstation prior to the maintenance window. [3] _______ We appreciate your [4] _______ and patience as we upgrade our infrastructure security.</p>',
    question_text: 'Which sentence best fits blank [2] in the memorandum?',
    choices: {
      A: 'Automated system backup processes will resume automatically on Sunday morning.',
      B: 'The company cafeteria will offer discounted meals during the weekend.',
      C: 'Parking permits must be renewed at the main entrance desk.',
      D: 'International flight tickets have been issued successfully.'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ประโยค A สอดคล้องกับเรื่องเวลาและการกลับมาเปิดใช้งานระบบอัตโนมัติ" }
  },
  {
    question_id: 'q-603', part: 6,
    passage_title: 'MEMORANDUM: Scheduled IT Server Maintenance & Remote Access Policy',
    passage_content: '<p><strong>To:</strong> All Staff Members<br><strong>From:</strong> IT Infrastructure Management<br><strong>Date:</strong> August 9, 2026<br><strong>Subject:</strong> System Upgrade & Network Downtime Notice</p><p>Please be advised that core network servers will undergo scheduled maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this period, remote VPN access will be [1] _______ unavailable to all employees. [2] _______ We strongly recommend that all urgent files be saved locally on your workstation prior to the maintenance window. [3] _______ We appreciate your [4] _______ and patience as we upgrade our infrastructure security.</p>',
    question_text: 'Which sentence best fits blank [3] in the memorandum?',
    choices: {
      A: 'If you encounter login errors after 4:00 AM, please submit a ticket to IT helpdesk.',
      B: 'The cafeteria staff will host a birthday celebration next week.',
      C: 'Annual performance appraisals are scheduled for December.',
      D: 'New office desks have been ordered for the marketing department.'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ประโยค A สอดคล้องกับการให้คำแนะนำกรณีพบปัญหาเข้าสู่ระบบหลังเวลาปรับปรุง" }
  },
  {
    question_id: 'q-604', part: 6,
    passage_title: 'MEMORANDUM: Scheduled IT Server Maintenance & Remote Access Policy',
    passage_content: '<p><strong>To:</strong> All Staff Members<br><strong>From:</strong> IT Infrastructure Management<br><strong>Date:</strong> August 9, 2026<br><strong>Subject:</strong> System Upgrade & Network Downtime Notice</p><p>Please be advised that core network servers will undergo scheduled maintenance this coming Saturday from 10:00 PM to 4:00 AM. During this period, remote VPN access will be [1] _______ unavailable to all employees. [2] _______ We strongly recommend that all urgent files be saved locally on your workstation prior to the maintenance window. [3] _______ We appreciate your [4] _______ and patience as we upgrade our infrastructure security.</p>',
    question_text: 'Which word best fits blank [4] in the memorandum?',
    choices: { A: 'cooperation', B: 'cooperate', C: 'cooperative', D: 'cooperatively' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ใช้คำนาม 'cooperation' (ความร่วมมือ) ตามหลังคำสรรพนามแสดงความเป็นเจ้าของ 'your'" }
  },

  // Set 6-B: Corporate Office Relocation Notice
  {
    question_id: 'q-605', part: 6,
    passage_title: 'NOTICE: Corporate Office Relocation Announcement',
    passage_content: '<p>Dear Valued Clients and Partners,</p><p>Apex Financial Services is proud to announce that our regional headquarters will be [1] _______ to the newly constructed Skyline Tower on September 1. [2] _______ Our new facility features expanded meeting suites and advanced video conferencing technology. [3] _______ Please note that our phone numbers and email addresses will remain [4] _______ throughout the transition period.</p><p>Sincerely,<br>The Management Team</p>',
    question_text: 'Which word best fits blank [1] in the relocation notice?',
    choices: { A: 'relocating', B: 'relocate', C: 'relocation', D: 'relocated' }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ใช้กริยา V-ing 'relocating' ในโครงสร้าง Present Continuous (will be relocating)" }
  },
  {
    question_id: 'q-606', part: 6,
    passage_title: 'NOTICE: Corporate Office Relocation Announcement',
    passage_content: '<p>Dear Valued Clients and Partners,</p><p>Apex Financial Services is proud to announce that our regional headquarters will be [1] _______ to the newly constructed Skyline Tower on September 1. [2] _______ Our new facility features expanded meeting suites and advanced video conferencing technology. [3] _______ Please note that our phone numbers and email addresses will remain [4] _______ throughout the transition period.</p><p>Sincerely,<br>The Management Team</p>',
    question_text: 'Which sentence best fits blank [2] in the relocation notice?',
    choices: {
      A: 'This move will allow us to accommodate our growing staff and better serve your financial needs.',
      B: 'We regret to inform you that our quarterly dividend will be delayed.',
      C: 'The maintenance staff completed the plumbing repair yesterday.',
      D: 'Flight reservations can be modified on our mobile app.'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ประโยค A สอดคล้องกับเหตุผลในการย้ายสำนักงานไปยังอาคารใหม่เพื่อรองรับพนักงานที่เพิ่มขึ้น" }
  },
  {
    question_id: 'q-607', part: 6,
    passage_title: 'NOTICE: Corporate Office Relocation Announcement',
    passage_content: '<p>Dear Valued Clients and Partners,</p><p>Apex Financial Services is proud to announce that our regional headquarters will be [1] _______ to the newly constructed Skyline Tower on September 1. [2] _______ Our new facility features expanded meeting suites and advanced video conferencing technology. [3] _______ Please note that our phone numbers and email addresses will remain [4] _______ throughout the transition period.</p><p>Sincerely,<br>The Management Team</p>',
    question_text: 'Which sentence best fits blank [3] in the relocation notice?',
    choices: {
      A: 'We invite you to join us for an open-house reception on Friday, September 5.',
      B: 'The company cafeteria will be closed for cleaning every Monday.',
      C: 'All vehicles must display a valid parking sticker on the windshield.',
      D: 'Heavy rain is expected throughout the metropolitan area tomorrow.'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ประโยค A เป็นคำเชิญร่วมงานเปิดอาคารใหม่ ซึ่งสอดคล้องกับบริบทการย้ายออฟฟิศ" }
  },
  {
    question_id: 'q-608', part: 6,
    passage_title: 'NOTICE: Corporate Office Relocation Announcement',
    passage_content: '<p>Dear Valued Clients and Partners,</p><p>Apex Financial Services is proud to announce that our regional headquarters will be [1] _______ to the newly constructed Skyline Tower on September 1. [2] _______ Our new facility features expanded meeting suites and advanced video conferencing technology. [3] _______ Please note that our phone numbers and email addresses will remain [4] _______ throughout the transition period.</p><p>Sincerely,<br>The Management Team</p>',
    question_text: 'Which word best fits blank [4] in the relocation notice?',
    choices: { A: 'unchanged', B: 'unconnected', C: 'uncertain', D: 'unapproved' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 6'],
    detailed_explanation: { correct_reason: "ใช้คำคุณศัพท์ 'unchanged' (ไม่เปลี่ยนแปลง) เพื่อยืนยันว่าเบอร์โทรและอีเมลเดิมยังใช้ได้ปกติ" }
  },

  // --- PART 7: READING COMPREHENSION (RICH REAL-WORLD BUSINESS PASSAGES) ---

  // Passage 7-A: Press Release - Electric Delivery Fleets
  {
    question_id: 'q-701', part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'What is the main subject of the press release?',
    choices: {
      A: 'A major commercial agreement for zero-emission electric delivery fleets',
      B: 'The opening of a new corporate office in London',
      C: 'A price reduction on residential solar panels',
      D: 'The merger of two international airline companies'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ข่าวประชาสัมพันธ์เปิดหัวเรื่องด้วยสัญญาความร่วมมือ 50 ล้านยูโรในการส่งมอบรถขนส่งไฟฟ้า 1,200 คัน" }
  },
  {
    question_id: 'q-702', part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'Which cities will receive the first electric fleet deployments in Q4 2026?',
    choices: {
      A: 'Stockholm and Copenhagen',
      B: 'Hamburg and Rotterdam',
      C: 'Helsinki and Oslo',
      D: 'Berlin and Paris'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ย่อหน้าที่สองระบุว่าเมืองแรกที่จะได้รับการส่งมอบรถไฟฟ้าในไตรมาสที่ 4 คือ สตอกโฮล์ม และ โคเปนเฮเกน" }
  },
  {
    question_id: 'q-703', part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'How many ultra-fast charging hubs will be constructed under the agreement?',
    choices: { A: '45 hubs', B: '1,200 hubs', C: '50 hubs', D: '5 hubs' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ในสัญญาจะมีการสร้างสถานีชาร์จความเร็วสูงทั้งหมด 45 สถานี" }
  },
  {
    question_id: 'q-704', part: 7,
    passage_title: 'PRESS RELEASE: Sustainable Energy Partnership Announcement',
    passage_content: '<p><strong>HELSINKI — August 5, 2026</strong> — Nordic CleanTech Solutions today signed a landmark 50-million-euro contract with Global Logistics Inc. to deploy zero-emission electric delivery fleets across major European distribution centers. Under the terms of the five-year agreement, Nordic CleanTech will deliver 1,200 commercial electric vans and build 45 ultra-fast charging hubs.</p><p>"This partnership accelerates our transition toward carbon-neutral supply chain operations," stated Marcus Lindqvist, Chief Sustainability Officer at Global Logistics. Initial fleet deployment is scheduled to begin in Stockholm and Copenhagen by Q4 2026, followed by expansion into Hamburg and Rotterdam in early 2027.</p>',
    question_text: 'Who is Marcus Lindqvist?',
    choices: {
      A: 'Chief Sustainability Officer at Global Logistics',
      B: 'CEO of Nordic CleanTech Solutions',
      C: 'Mayor of Stockholm',
      D: 'Lead Architect for charging hubs'
    }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ในคำโควตระบุว่า Marcus Lindqvist มีตำแหน่งเป็น Chief Sustainability Officer ของ Global Logistics" }
  },

  // Passage 7-B: Email Correspondence - Software Project Timeline
  {
    question_id: 'q-705', part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Software Beta Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'Why is the software release date being delayed?',
    choices: {
      A: 'Quality assurance found bugs in the payment integration module',
      B: 'The project budget was significantly reduced',
      C: 'The client cancelled the software contract',
      D: 'The lead product manager is taking medical leave'
    }, correct_answer: 'A', cefr_level: 'B2', tags: ['Part 7'],
    detailed_explanation: { correct_reason: "อีเมลระบุสาเหตุการเลื่อนวันเลขาว่าเกิดจากทีม QA ตรวจพบบั๊กในโมดูลชำระเงิน" }
  },
  {
    question_id: 'q-706', part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Software Beta Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'By how much time is the beta launch date delayed?',
    choices: { A: 'Two weeks', B: 'One month', C: 'Three days', D: 'Six months' }, correct_answer: 'A', cefr_level: 'B1', tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ในเนื้อหาระบุว่าต้องเลื่อนวันเปิดตัวเวอร์ชันเบต้าออกไป 2 สัปดาห์ (two weeks)" }
  },
  {
    question_id: 'q-707', part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Software Beta Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'What time will tomorrow’s standup meeting take place?',
    choices: { A: '9:30 AM', B: '10:00 AM', C: '2:00 PM', D: '8:30 AM' }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 7'],
    detailed_explanation: { correct_reason: "ช่วงท้ายอีเมลระบุเวลาประชุมสแตนด์อัปพรุ่งนี้ที่ 9:30 AM" }
  },
  {
    question_id: 'q-708', part: 7,
    passage_title: 'EMAIL CORRESPONDENCE: Software Beta Project Timeline Adjustment',
    passage_content: '<p><strong>From:</strong> sarah.jenkins@innovatetech.com<br><strong>To:</strong> david.chen@innovatetech.com<br><strong>Date:</strong> August 7, 2026<br><strong>Subject:</strong> Revised Software Release Schedule</p><p>Hi David,</p><p>Following our client sync this morning, we need to push back the beta launch date by two weeks. The quality assurance team discovered edge-case bugs in the payment integration module during automated stress testing.</p><p>Could you please update the master roadmap document and notify the frontend engineering squad? We will hold a brief standup meeting tomorrow at 9:30 AM to reassign sprint tickets.</p><p>Best regards,<br>Sarah Jenkins<br>Lead Product Manager</p>',
    question_text: 'What is Sarah Jenkins’ job title?',
    choices: {
      A: 'Lead Product Manager',
      B: 'Chief Executive Officer',
      C: 'Frontend Engineer',
      D: 'Database Administrator'
    }, correct_answer: 'A', cefr_level: 'A2', tags: ['Part 7'],
    detailed_explanation: { correct_reason: "คำลงท้ายลงตำแหน่งว่า Lead Product Manager" }
  }
];

function generateProceduralPassageSet(part, setIdx, groupSize) {
  const pTitle = part === 6 
    ? `MEMORANDUM: Regional Office Facilities Policy Update (Set #${setIdx})`
    : `BUSINESS ARTICLE: Global Supply Chain Integration Report (Set #${setIdx})`;

  const pContent = part === 6 
    ? `<p><strong>To:</strong> All Staff Members<br><strong>From:</strong> Facilities Management<br><strong>Date:</strong> August 9, 2026<br><strong>Subject:</strong> Building Maintenance Schedule</p><p>Please be advised that building elevators will undergo routine safety inspection this coming Saturday. [1] _______ During this period, employees are requested to use the south staircase. [2] _______ Maintenance technicians will complete the procedure by 3:00 PM. [3] _______ We appreciate your [4] _______ during this short service window.</p>`
    : `<p><strong>SINGAPORE — August 9, 2026</strong> — Pacific Freight Corp today reported a 15 percent increase in international container throughput following the opening of its automated terminal. The 25-million-dollar investment has significantly reduced vessel turn-around times.</p><p>"Automated crane systems have dramatically improved port productivity," stated Chief Operating Officer Elena Rostova. Expansion plans for Phase 2 will begin early next year.</p>`;

  const setQuestions = [];
  for (let i = 1; i <= groupSize; i++) {
    setQuestions.push({
      question_id: `q-p${part}-set-${setIdx}-${i}`,
      part,
      passage_title: pTitle,
      passage_content: pContent,
      question_text: part === 6 
        ? `Which sentence best fits blank [${i}] in the facilities memorandum?`
        : `What is a primary outcome of Pacific Freight’s automated terminal (Question ${i})?`,
      choices: {
        A: 'A 15 percent increase in international container throughput and reduced turnaround times',
        B: 'A complete suspension of regional shipping services',
        C: 'The retirement of senior operating executives',
        D: 'An increase in warehouse rental prices'
      },
      correct_answer: 'A',
      cefr_level: 'B2',
      tags: [part === 6 ? 'Part 6' : 'Part 7'],
      detailed_explanation: { correct_reason: `คำถามข้อที่ ${i} ประจำชุดบทความอ่านอ่านต่อเนื่องใน Part ${part}` }
    });
  }
  return setQuestions;
}

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

    const passageKey = (q.passage_title || q.passage_content || '').trim().toLowerCase();
    if (!passageKey || isPlaceholderText(q.passage_content)) {
      // Group by passage_title if available
      const titleKey = String(q.passage_title || '').trim().toLowerCase();
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
    const mode = req.query.mode || 'full';
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

    const combinedPool = questions.concat(PRESEEDED_QUESTIONS);
    const seenTexts = new Set();

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
      const setSize = Math.min(4, needed);
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
