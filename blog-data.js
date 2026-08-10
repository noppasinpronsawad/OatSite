// User Published Articles Database (Full Rich Content & Cover Image)
const BLOG_POSTS = [
  {
    "_id": "post_hello_world_ep1",
    "id": "post_hello_world_ep1",
    "title": "Hello World Ep1 สวัสดีครับ",
    "category": "Daily Life",
    "summary": "ต้อนรับสู่บล็อกบทความแรก Hello World Ep1 สวัสดีครับ สรุปเส้นทางการพัฒนา Noppasin Pronsawad Portfolio & High-Performance AI Architecture Engine 2026",
    "content": `<div class="article-rich-body">
      <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80" style="width:100%; border-radius:12px; margin-bottom:1.5rem; border:1px solid rgba(255,255,255,0.1);" alt="Hello World Development">
      <h3>Hello World Ep1 สวัสดีครับ</h3>
      <p>ยินดีต้อนรับทุกท่านเข้าสู่บล็อกอย่างเป็นทางการสำหรับ <strong>Noppasin Pronsawad Portfolio & CMS Architecture</strong> เว็บไซต์นี้ถูกออกแบบและพัฒนาขึ้นเพื่อทำหน้าที่เป็นทั้งพื้นที่นำเสนอผลงาน นวัตกรรมเทคโนโลยี และแพลตฟอร์มการทดสอบประมวลผลระบบ FinTech และ AI</p>

      <h4>🚀 ภาพรวมระบบและสถาปัตยกรรม (System Architecture Overview):</h4>
      <p>โครงสร้างของเว็บไซต์นี้ได้รับการพัฒนาขึ้นโดยคำนึงถึง Performance และ High Availability เป็นสำคัญ:</p>
      <ul>
        <li><strong>Single Page Application (SPA):</strong> สลับมุมมองบทความ เครื่องมือคำนวณภาษี และระบบจำลองข้อสอบ TOEIC Simulator ไร้การกระตุก ไม่ต้องโหลดหน้าใหม่</li>
        <li><strong>TOEIC Simulator Engine:</strong> คลังข้อสอบมาตรฐาน ETS มากกว่า 10,000 ข้อ พร้อมระบบสุ่มคำถามแยกพาร์ท 5, 6, 7 และตัวนับเวลา 75 นาที</li>
        <li><strong>Daily News Ingestion Pipeline:</strong> สคริปต์สกัดข่าวภาษาอังกฤษจาก BBC, Financial Times, Bloomberg และ TechCrunch ประจำวัน เพื่อสร้างโจทย์ภาษาอังกฤษระดับ CEFR B2/C1</li>
        <li><strong>Security & Session Control:</strong> ระบบป้องกันการล็อกอินซ้อน Multi-Device Active Session Enforcement เฝ้าระวังเซสชันเรียลไทม์</li>
      </ul>

      <p>ขอขอบคุณทุกท่านสำหรับการติดตามและเยี่ยมชมเว็บไซต์ สามารถร่วมทดสอบระบบหรือติดต่อสอบถามข้อมูลเพิ่มเติมได้ตลอดเวลาครับ</p>
    </div>`,
    "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    "date": "08 Aug 2026",
    "readTime": "4 min read",
    "publishAt": "2026-08-08T07:30:00.000Z",
    "createdAt": "2026-08-08T07:30:00.000Z"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BLOG_POSTS;
}
if (typeof window !== 'undefined') {
  window.BLOG_POSTS = BLOG_POSTS;
}
