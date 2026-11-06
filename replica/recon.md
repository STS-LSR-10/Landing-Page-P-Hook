# Recon map: parnuan.com & abdul-ai.com -> พี่ฮูก (P'Hook) LINE Bot Landing Page

Scope: Marketing Landing Page, Interactive LINE Chat Simulator ("#tell"), Feature Showcases, LIFF Web App Previews, Pricing Comparison, and Trust/FAQ Architecture
For: ผู้ใช้ทั่วไป, ฟรีแลนซ์, คนทำงาน, คู่รัก/ครอบครัว, และกลุ่มเพื่อนที่ต้องการผู้ช่วยจดบัญชีและการเงินบน LINE
Date: 2026-11-06

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Parnuan (ป้านวล) Official Website | https://parnuan.com | เว็บบันทึกรายรับรายจ่ายผ่าน LINE ชูจุดเด่นพิมพ์แชทเป็นธรรมชาติ สแกนสลิป ตั้งงบ และรายงานผล |
| 2 | Abdul AI (อับดุล) Official Website | https://abdul-ai.com/#tell | เว็บผู้ช่วย AI บน LINE พร้อมฟีเจอร์เด่น Interactive Simulator "#tell" ให้ทดลองพิมพ์คำสั่งและเห็นผลลัพธ์ทันที |
| 3 | P'Hook Project Assets | `./` (Workspace) | ชุดข้อมูลครบถ้วน: features.md, commands.json, plans.json/md, faq.md, privacy-summary.md, 131 LINE Flex cards, 33 LIFF screenshots, brand mascot & palettes |

## Core loop

ผู้ใช้พิมพ์ข้อความสั้นๆ ส่งเสียง หรือส่งรูปสลิปในแชท LINE -> พี่ฮูกประมวลผลทันที บันทึกรายรับ-รายจ่าย ส่งการ์ดสรุป Flex Message ที่กดแก้ไขได้ และเปิดดูแดชบอร์ด/กราฟ/งบในแอป LIFF ได้ทันทีโดยไม่ต้องติดตั้งแอปแยก

## Reference Benchmark & UX Analysis

### 1. Parnuan.com (ป้านวล)
- **จุดเด่น UX:**
  - บุคลิกเป็นมิตร อบอุ่น สไตล์คนใกล้ชิดเตือนสติเรื่องเงิน
  - เน้นความง่าย "แค่เพิ่มเพื่อนใน LINE ไม่ต้องโหลดแอป"
  - มีการจัดหมวดหมู่อัตโนมัติ สแกนสลิป และสรุปรายเดือน
  - โครงสร้างหน้า: Hero -> ปัญหาผู้ใช้ -> วิธีใช้งาน -> ฟีเจอร์หลัก -> แพ็กเกจ -> คำถามที่พบบ่อย -> Add Friend LINE CTA

### 2. Abdul-AI.com (อับดุล) - ฟีเจอร์ `#tell`
- **จุดเด่น UX:**
  - Interactive Simulator บนหน้าเว็บที่ให้ผู้ใช้กดปุ่มตัวอย่างหรือพิมพ์คำสั่งเอง แล้วจำลองหน้าจอ LINE Chat โต้ตอบแบบ Real-time
  - ฟีเจอร์อเนกประสงค์: บันทึก, ตั้งเตือน, เชื่อม Google Calendar, โน้ต/ไฟล์, ตอบคำถาม
  - Mockup มือถือที่ดูทันสมัย มีแอนิเมชันปุ่มคำสั่งยอดนิยม

### 3. P'Hook Synthesis (พี่ฮูก)
- รวมข้อดีของทั้งสองเว็บไซต์:
  - **ความอบอุ่น น่ารัก และเลือกนิสัยได้ 5 แบบ** (อบอุ่น, เพื่อนซี้, ปากแจ๋ว, จิบชา, นอนดึก)
  - **ฟีเจอร์การเงินครบวงจร:** จดรายจ่าย/รายรับ, สลิป, เสียง, หลายกระเป๋า, กระเป๋าร่วมกับแฟน, หนี้/บิล, งบประมาณ 50-30-20, กระปุกออม
  - **ฟีเจอร์ผู้ช่วยอเนกประสงค์:** เตือนซ้ำ, ลิงก์ Google Calendar, โน้ต/คลังไฟล์, ถามตอบ AI
  - **ฟีเจอร์สมุดกลุ่ม LINE:** หารบิลพร้อม QR พร้อมเพย์รายคน, สรุปทริป, ตามเงิน
  - **Interactive LINE Simulator:** ให้ผู้ใช้ลองกดเล่นคำสั่งจริงแล้วเห็นการ์ดจริงจากโฟลเดอร์ `cards/`
  - **โทนสีเขียวพาสเทล (Mint Pastel #CCFBF1, #0F766E, #1ABC9C):** ให้ความรู้สึกสบายตา สบายใจเรื่องเงิน ทันสมัยและน่าเชื่อถือ

## Screens

| ID | screen / section | route / anchor | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Navigation Bar | Top fixed | นำทางและแปลงผู้เข้าชมเป็นผู้ใช้ | Logo, Menu Links, "แอดไลน์ฟรี" CTA, Mobile Menu | default, scrolled, mobile open |
| S02 | Hero Section | `#hero` | นำเสนอคุณค่าหลักและดึงดูดความสนใจ | Headline, Mascot Avatar, Subtext, Add LINE Button, QR Trigger, Trust Badges, Animated Chat Preview | default, hover |
| S03 | Interactive Chat Simulator | `#tell` / `#simulator` | จำลองประสบการณ์แชทจริงแบบไม่ต้องแอดไลน์ก่อน | Chat Screen Mockup, Prompt Category Pills, Input box, LINE Message Bubbles, Flex Card Renderers | idle, typing, card response, error fallback |
| S04 | 6 Core Features | `#features` | แจกแจงฟังก์ชันหลัก 6 เสา | Feature Cards, Icon Badges, Plan Badges (Free/Pro/Elite), Micro-demos | default, active tab, hover |
| S05 | LIFF Web App Showcase | `#webapp` | โชว์ภาพจริงในแอปเว็บมือถือ | Device Frame, Tab Navigator (สรุป, กราฟวิเคราะห์, จัดการงบ, รายการ, เตือน), Real Screenshots | tab switches, zoom modal |
| S06 | Persona Selector | `#persona` | สัมผัสความพิเศษของบุคลิกบอท 5 แบบ | 5 Persona Cards (อบอุ่น, เพื่อนซี้, ปากแจ๋ว, จิบชา, นอนดึก), Voice Sample Bubbles | selected persona, quote switch |
| S07 | Command Cheatsheet | `#commands` | คลังคำสั่งที่พิมพ์ในแชท | Category Filters, Search Input, Plan Tags, Copy Command Button | all, filtered, empty search |
| S08 | Pricing & Plans | `#pricing` | ตารางราคาและแพ็กเกจ (เปิดตัวลดพิเศษ) | Billing Toggle (รายเดือน/รายปี), 3 Plan Tiers (Free, Pro, Elite), Feature Checklist, Launch Badge | monthly, yearly (-30% to -40%) |
| S09 | FAQ Accordion | `#faq` | ตอบข้อสงสัยและคลายความกังวล | Accordion Items, Search/Category Tag, Help contact | collapsed, expanded |
| S10 | Privacy & Security | `#privacy` | สร้างความมั่นใจเรื่องข้อมูลส่วนบุคคลและ PDPA | Security Highlights (PDPA, AI Privacy, Data Export/Delete) | static |
| S11 | Footer & Floating CTA | Bottom & Floating | ปิดการขายและอำนวยความสะดวกในการแอดไลน์ | Sticky Mobile Bar, QR Code Modal, Social Links, Copyright | desktop, mobile sticky bar, modal open |

## Flows

```
F01 Quick Conversion Flow (ผู้ใช้ต้องการลองทันที)
    S02 Hero "เพิ่มเพื่อนใน LINE" -> S11 QR Code Modal หรือลิงก์ตรง line.me/R/ti/p/@p-hook -> เริ่มใช้งาน
    happy path clicks: 1 click

F02 Interactive Trial Flow (ผู้ใช้ต้องการเห็นว่าแชททำงานอย่างไรก่อนแอด)
    S02 Hero "ลองพิมพ์คำสั่ง" -> S03 Simulator -> กดปุ่ม "กาแฟ 30" -> เห็นพิมพ์เสมือนจริง -> การ์ดสรุปเด้งขึ้นมา -> กด "ลองคำสั่งอื่น" (เช่น หารบิล / สรุปเดือน) -> ประทับใจ -> กด CTA "เริ่มใช้ฟรี"
    happy path clicks: 2 clicks

F03 Plan Evaluation Flow (ผู้ใช้เปรียบเทียบความคุ้มค่า)
    S01 Nav "ราคา" -> S08 Pricing -> สลับ toggle "รายปี" เพื่อดูส่วนลดเปิดตัว -> เทียบฟังก์ชัน Pro vs Elite -> กด "ทดลองฟรี 7 วัน"
    happy path clicks: 2 clicks
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Button | Primary (Mint Green), Secondary (Outline), Ghost, LINE Green | default, hover, active, disabled | S01, S02, S03, S08, S11 |
| ChatBubble | User text, Bot text, Typing indicator, Flex Image Card | default, enter animation | S03 |
| CategoryFilterPills | All, จดรายการ, สรุป, กระเป๋า, งบ, เตือน, กลุ่ม | active, inactive, hover | S03, S07 |
| PricingCard | Standard, Featured (Pro - Recommended), Elite | default, hover, discounted toggle | S08 |
| AccordionItem | Question header with Chevron + Answer body | collapsed, expanded | S09 |
| DeviceMockup | iPhone Frame for LINE Chat, iPhone Frame for LIFF App | responsive, interactive carousel | S02, S03, S05 |
| QRModal | Modal backdrop with QR code and copy ID `@p-hook` | hidden, visible | S01, S02, S08, S11 |

## Inferred Data Model (สำหรับจำลองบนเว็บ)

```
CommandItem: { type: string, does: string, plan: 'Free' | 'Pro' | 'Elite', category: string, sampleCard?: string }
PlanItem:    { name: string, priceMonthly: number, priceYearly: number, launchMonthly: number, launchYearly: number, limits: object, features: string[] }
PersonaItem: { key: string, label: string, emoji: string, desc: string, sample: string, badge?: string }
FaqItem:     { q: string, a: string }
AppScreen:   { file: string, title: string, description: string, tag: string }
```

## Size

Screens/Sections: 11, Flows: 3, Components: 7. โทนสีเขียวพาสเทล ดีไซน์ระดับพรีเมียม สบายตา โหลดไว ไร้ dependency หนัก. Size: M.
