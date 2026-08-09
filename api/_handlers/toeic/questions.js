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
    detailed_explanation: { correct_reason: "ใช้กริยาวิเศษณ์ (Adverb) 'thoroughly' เพื่อ ขยายกริยา 'inspect'" }
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
    detailed_explanation: { correct_reason: "ประโยค A สอดคล้องกับเนื้อหาการแจ้งเตือนเวลาเปิดใช้งานระบบหลังจากการปิดปรับปรุง VPN" }
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
    detailed_explanation: { correct_reason: "ในบันทึกข้อความระบุชัดเจนว่าพนักงานควรรีบเซฟไฟล์งานลงเครื่องก่อนช่วงปิดปรับปรุงระบบ" }
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
  }
];

function shuffleQuestionChoices(q) {
  const choices = q.choices || {};
  const keys = ['A', 'B', 'C', 'D'];
  const originalCorrectText = choices[q.correct_answer] || choices['A'] || '';

  const shuffledKeys = [...keys];
  for (let i = shuffledKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledKeys[i], shuffledKeys[j]] = [shuffledKeys[j], shuffledKeys[i]];
  }

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
        // Target: 6 Part 5, 3 Part 6, 11 Part 7 (Total 20)
        const part5 = await ToeicQuestion.aggregate([{ $match: { part: 5 } }, { $sample: { size: 15 } }]);
        const part6 = await ToeicQuestion.aggregate([{ $match: { part: 6 } }, { $sample: { size: 8 } }]);
        const part7 = await ToeicQuestion.aggregate([{ $match: { part: 7 } }, { $sample: { size: 20 } }]);
        questions = [...part5, ...part6, ...part7];
      } else {
        // Full 100 Qs: 30 Part 5, 16 Part 6, 54 Part 7
        const part5 = await ToeicQuestion.aggregate([{ $match: { part: 5 } }, { $sample: { size: 30 } }]);
        const part6 = await ToeicQuestion.aggregate([{ $match: { part: 6 } }, { $sample: { size: 16 } }]);
        const part7 = await ToeicQuestion.aggregate([{ $match: { part: 7 } }, { $sample: { size: 54 } }]);
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

    // Clean AI Generated prefix and Deduplicate
    const seenTexts = new Set();
    const cleanUniqueQuestions = [];

    for (const qObj of questions) {
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

    let selectedQuestions = cleanUniqueQuestions;

    if (mode === 'quick') {
      const part5 = selectedQuestions.filter(q => q.part === 5);
      const part6 = selectedQuestions.filter(q => q.part === 6);
      const part7 = selectedQuestions.filter(q => q.part === 7);

      selectedQuestions = [
        ...part5.slice(0, 6),
        ...part6.slice(0, 3),
        ...part7.slice(0, 11)
      ];

      // Array Padding: If deduplication dropped length below 20, pad with remaining pool items
      if (selectedQuestions.length < 20) {
        const pool = PRESEEDED_QUESTIONS.concat(cleanUniqueQuestions);
        for (const p of pool) {
          if (selectedQuestions.length >= 20) break;
          const cleanPText = String(p.question_text || '').replace(/^\[AI Generated Q?\d*\]\s*/i, '').trim();
          if (!selectedQuestions.some(existing => existing.question_text === cleanPText)) {
            selectedQuestions.push({
              ...p,
              question_text: cleanPText
            });
          }
        }
      }
    }

    // Shuffle choices evenly across A, B, C, D
    const shuffledQuestions = selectedQuestions.map(q => shuffleQuestionChoices(q));

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
