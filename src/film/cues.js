// Narration timing, measured from the supplied ElevenLabs voiceovers
// (RMS envelope, 20 ms windows, silences >= 220 ms). Each entry: [start, end, text].
// Long lines are split into readable caption chunks automatically.

export const PART1_DURATION = 183.7191836734694; // 8,102,016 samples @ 44.1 kHz stereo
export const PART2_DURATION = 278.5175510204082; // 12,282,624 samples @ 44.1 kHz stereo

export const PART1_LINES = [
  [0.0, 3.8, 'JEE Main 2027 mein competition kam ho raha hai.'],
  [4.22, 11.78, 'Aur bhai, ye news sunkar kuch aspirants ki gaand mein aisi gudgudi ho rahi hai jaise IIT Bombay ka director inke liye rishta lekar aa raha ho.'],
  [12.1, 16.22, 'Matlab saale itne khush hain ki inko dekhkar lag raha hai competition kam nahi,'],
  [16.46, 17.78, 'inki akal kam ho gayi hai.'],
  [18.22, 23.94, 'Internet par har jagah discussion chal raha hai ki JEE Main 2027 mein registration kam ho raha hai.'],
  [24.22, 28.46, 'Aur kuch mahaan chutiye toh abhi se apni imaginary percentile calculate karne lage hain.'],
  [28.86, 29.74, 'Registration kam,'],
  [29.98, 30.82, 'competition kam,'],
  [31.08, 32.92, 'cutoff kam, aur selection pakka!'],
  [33.26, 40.58, 'Bhai, itni jaldi toh tumhare baap ne bhi tumhare paida hone ke baad naam nahi socha hoga jitni jaldi tumne IIT ka admission confirm kar liya.'],
  [40.86, 43.8, 'Thoda apni gaand se bahar niklo aur reality check kar lo.'],
  [44.08, 50.72, 'Abhi tumhara syllabus poora nahi hua hai, mock test mein 50 number aa rahe hain aur sapna dekh rahe ho IIT Bombay CSE ka.'],
  [50.96, 51.74, 'Bhosdiwalo,'],
  [51.98, 55.28, 'IIT jaana hai ya IIT ke sapne mein hi retirement leni hai?'],
  [55.66, 58.9, 'Ab sabse pehle samajhte hain ki registration kam kyun dikh raha hai.'],
  [59.26, 60.98, 'Kisi ka Aadhaar Card mismatch hai.'],
  [61.24, 63.44, 'Kisi ka EWS certificate pending hai.'],
  [63.68, 65.3, 'Kisi ka DigiLocker nahi khul raha.'],
  [65.48, 67.02, 'Kisi ka OTP nahi aa raha.'],
  [67.24, 70.06, 'Kisi ke school wale Board Registration Number nahi de rahe.'],
  [70.34, 76.62, 'Matlab bachcha JEE ki preparation karne baitha tha, lekin government website ne uski zindagi ka software corrupt kar diya.'],
  [76.96, 81.82, 'Physics ke numericals baad mein solve honge, pehle Aadhaar ki spelling ka antim sanskar karna hai.'],
  [82.1, 83.12, 'Upar se Diwali,'],
  [83.34, 85.2, 'Chhath Puja aur last date ka drama.'],
  [85.52, 88.6, 'Aur kuch alag hi level ke namoone last date ka wait kar rahe hain.'],
  [88.82, 93.04, 'Inko lagta hai last mein form bharenge toh shayad examination bhi last date ko milega.'],
  [93.34, 97.58, 'Arey jhantu! JEE ka form bhar rahe ho ya Goa trip ki booking kar rahe ho?'],
  [97.8, 102.88, 'Aur last date par website crash ho gayi toh NTA ke server ko gaali dekar apna career bana loge kya?'],
  [103.16, 109.3, 'Isliye starting registration numbers ko dekhkar competition kam hone ka conclusion nikalna ek number ka chutiyaap hai.'],
  [109.74, 111.46, 'Ab aate hain asli competition par.'],
  [111.76, 115.26, 'Maan lo JEE Main mein 15 lakh students appear kar rahe hain.'],
  [115.54, 118.5, 'Ab tum sochoge ki 15 lakh bachchon se competition hai.'],
  [118.74, 119.64, 'Lekin ek minute.'],
  [120.04, 120.86, 'Tumhe chahiye kya?'],
  [121.16, 122.0, 'IIT Bombay.'],
  [122.26, 122.84, 'Kaunsi branch?'],
  [123.28, 123.68, 'CSE.'],
  [123.96, 124.5, 'Achha!'],
  [124.78, 125.54, 'Nahi toh AI.'],
  [125.78, 127.4, 'Nahi toh Mathematics and Computing.'],
  [127.64, 128.62, 'Nahi toh Electronics.'],
  [129.06, 133.06, 'Matlab bhadwe ko poora IIT nahi chahiye, bas CSE ki seat ke saath saat janmon ka rishta chahiye.'],
  [133.28, 134.74, 'Aur yahi asli game hai.'],
  [134.98, 136.42, 'College mein hazaaron seats hain,'],
  [136.7, 138.08, 'lekin tumhari wishlist mein sirf chaar branches hain.'],
  [138.44, 139.74, 'Mechanical nahi chahiye.'],
  [139.8, 140.84, 'Civil nahi chahiye.'],
  [141.22, 142.28, 'Metallurgy nahi chahiye.'],
  [142.58, 143.42, 'Textile nahi chahiye.'],
  [143.6, 145.86, 'Bhai, tum engineering karne aaye ho'],
  [146.22, 150.52, 'ya branch ka matrimonial advertisement nikalne?'],
  [150.84, 152.74, 'Aur main kisi branch ko chhota nahi bol raha.'],
  [153.0, 154.42, 'Har branch ki apni value hai.'],
  [154.68, 160.64, 'Lekin jab tumhari preference sirf top branches hain, toh tumhe unhi branches ki seats aur closing ranks dekhni padegi.'],
  [160.9, 164.06, 'Baaki seats gin kar apni gaand mein laddoo phodne ka koi fayda nahi.'],
  [164.44, 169.86, 'Aur top branches ke liye jo students compete kar rahe hain, unki preparation bhi generally kaafi strong hoti hai.'],
  [170.12, 173.46, 'Tum yahan YouTube par search kar rahe ho competition kam ho raha hai kya,'],
  [173.74, 176.64, 'aur udhar koi banda subah se PYQs solve kar raha hai.'],
  [176.9, 177.38, 'Ab batao,'],
  [177.68, 178.64, 'selection kiska hoga?'],
  [178.92, 181.82, 'Tumhara ya us harami ka jo chupchaap mehnat kar raha hai?'],
  [182.1, 183.72, 'Thodi sharam kar lo, saalo!'],
];

export const PART2_LINES = [
  [0.0, 2.48, 'Ab zara apni preparation ki aukaat check karte hain.'],
  [2.78, 4.96, '300 mein se mock test mein kitne marks aa rahe hain?'],
  [5.42, 6.26, '80 se kam?'],
  [6.54, 8.46, 'Bhai, pehle syllabus complete kar le.'],
  [8.74, 13.38, 'Tu competition kam hone ka intezaar kar raha hai aur tera syllabus abhi tak ventilator par pada hai.'],
  [13.7, 19.32, 'Physics mein do chapter kiye hain, Chemistry mein teen aur Maths mein toh bas notebook ke first page par naam likha hai.'],
  [19.58, 21.3, 'Aur sapna AIR 1 ka!'],
  [21.66, 22.84, 'Kya chutiyaap hai bhai?'],
  [23.16, 24.8, '80 se 120 aa rahe hain?'],
  [25.1, 26.76, 'Theek hai, abhi umeed zinda hai.'],
  [27.02, 30.3, 'Important chapters complete karo, PYQs lagao aur concepts strong karo.'],
  [30.62, 33.3, '120 se 160 aa rahe hain?'],
  [33.62, 35.46, 'Ab thoda apne dimaag ka istemaal karo.'],
  [35.72, 40.56, 'Calculation mistakes pakdo, silly errors identify karo aur weak chapters ko improve karo.'],
  [40.82, 44.72, 'Aur agar 160 se upar aa rahe hain toh congratulations, bhai sahab!'],
  [45.0, 46.46, 'Lekin zyada hawa mein mat udna.'],
  [46.74, 52.9, 'Ek mock test mein 180 laakar Instagram story lagane se IIT ka director tumhe personally invite nahi karne wala.'],
  [53.14, 57.32, 'Consistency chahiye, accuracy chahiye aur question-solving ability chahiye.'],
  [57.6, 59.2, 'Aur ek category alag hoti hai.'],
  [59.46, 63.78, 'Ye woh bachche hain jo mock test mein galti karne ke baad solution dekhte hain aur bolte hain,'],
  [64.08, 65.74, 'arey yaar ye toh aata tha.'],
  [66.02, 69.32, 'Bhai, agar aata tha toh gaand marwane ke liye galat kyun kiya?'],
  [69.56, 72.66, 'Solution dekhkar har chutiye ko lagta hai ki question aata tha.'],
  [72.92, 77.12, 'Asli aukaat tab pata chalti hai jab solution band karke dobara solve karte ho.'],
  [77.4, 78.62, 'Ab ek strategy batata hoon.'],
  [78.94, 81.56, 'Roz 100 questions solve karne ka target rakho.'],
  [81.84, 82.66, 'Physics ke 33,'],
  [82.94, 84.98, 'Chemistry ke 33 aur Maths ke 34.'],
  [85.4, 90.88, 'Lekin 100 questions solve karne ka matlab ye nahi ki bina samjhe notebook mein 100 tick mark laga diye.'],
  [91.14, 95.16, 'Aisa karna hai toh seedha notebook mein 100 baar I LOVE JEE likh do.'],
  [95.4, 96.94, 'Result lagbhag utna hi milega.'],
  [97.24, 99.3, '1000 quality questions select karo.'],
  [99.56, 101.3, 'Pehli baar concept samajhne ke liye.'],
  [101.54, 103.4, 'Doosri baar khud solve karne ke liye.'],
  [103.66, 105.98, 'Teesri baar timer lagakar solve karne ke liye.'],
  [106.26, 108.96, 'Kyunki solution dekhte waqt toh har question easy lagta hai.'],
  [109.2, 112.98, 'Lekin solution band karte hi tumhara dimaag Windows XP ban jaata hai.'],
  [113.26, 114.02, 'Loading...'],
  [114.52, 115.3, 'Loading...'],
  [115.68, 117.24, 'Error 404:'],
  [117.56, 119.08, 'Dimaag apni jagah se gayab.'],
  [119.4, 121.38, 'Isliye questions ko genuinely samjho.'],
  [121.6, 123.4, 'Jo galat hua usko note karo.'],
  [123.64, 125.6, 'Jo nahi bana usko dobara solve karo.'],
  [125.88, 128.98, 'Sirf question count badhane ke chakkar mein apni gaand mat ghisna.'],
  [129.22, 130.02, 'Quality matters.'],
  [130.5, 132.7, 'Aur ek baat jo shayad tumhe buri lagegi.'],
  [132.96, 137.82, 'JEE preparation mein sabse bada dushman competition nahi, tumhari khud ki habits hain.'],
  [138.1, 139.76, 'Subah uthte hi Telegram kholna.'],
  [140.04, 141.92, 'Kisi topper ka study timetable dekhna.'],
  [142.14, 145.06, 'Instagram par kisi AIR 1 ki desk setup dekhna.'],
  [145.34, 149.3, 'YouTube par search karna ki 60 days mein 99 percentile kaise laayein.'],
  [149.64, 151.12, 'Phir ek motivation video dekhna.'],
  [151.42, 153.32, 'Uske baad ek aur motivation video.'],
  [153.6, 157.5, 'Aur phir raat ko sone se pehle khud ko gaali dena ki aaj bhi kuch nahi padha.'],
  [157.78, 162.16, 'Bhai, tum preparation kar rahe ho ya motivational content ka PhD kar rahe ho?'],
  [162.42, 165.94, 'Ek banda 12 ghante padh raha hai, doosra 14 ghante padh raha hai.'],
  [166.2, 168.92, 'Tum dono ko dekhkar apna timetable change kar rahe ho.'],
  [169.16, 172.86, 'Arey apni aukaat aur apni capacity ke according plan banao na, saalo!'],
  [173.16, 177.94, 'Kisi topper ka timetable download karne se uska dimaag tumhare andar transfer nahi hone wala.'],
  [178.18, 180.68, 'Aur ek aur chutiyaap hai syllabus completion ka.'],
  [180.94, 183.96, 'Bachche bolte hain mera syllabus 90% complete hai.'],
  [184.22, 186.0, 'Achha, kitne questions solve kiye?'],
  [186.26, 187.48, 'Sir theory complete hai.'],
  [187.72, 188.28, 'PYQs?'],
  [188.58, 188.92, 'Nahi.'],
  [189.18, 189.6, 'Mock tests?'],
  [190.08, 190.4, 'Nahi.'],
  [190.66, 191.16, 'Revision?'],
  [191.38, 191.9, 'Abhi nahi.'],
  [192.2, 194.7, 'Toh bhai, tumhara syllabus complete nahi hai.'],
  [194.92, 197.6, 'Tumne bas kitaab ke pages ke saath darshan kiye hain.'],
  [197.92, 204.2, 'Chapter complete tab hota hai jab tum uske questions solve kar pao, concepts samajh pao aur exam mein apply kar pao.'],
  [204.46, 207.36, 'Sirf lecture dekhkar khud ko topper samajhna band karo.'],
  [207.66, 209.1, 'Ab ek simple rule follow karo.'],
  [209.34, 210.44, 'Daily targets banao.'],
  [210.72, 211.66, 'Questions solve karo.'],
  [211.88, 212.64, 'Revision karo.'],
  [212.88, 215.48, 'Har mock test ke baad apni mistakes analyse karo.'],
  [215.74, 222.12, 'Aur sabse important, apni progress ko kal ke apne score se compare karo, kisi random Telegram topper se nahi.'],
  [222.38, 226.16, 'Kyunki internet par har doosra banda 99 percentile la raha hai.'],
  [226.44, 231.38, 'Pata nahi bhai, agar sab 99 percentile la rahe hain toh 50 percentile kaun la raha hai?'],
  [231.66, 233.18, 'Mars se bachche aa rahe hain kya?'],
  [233.46, 234.26, 'Ab aakhri baat.'],
  [234.58, 241.02, 'Doosre kitne form bhar rahe hain, kitne bachche exam dene aa rahe hain, cutoff kitni jayegi, competition kitna badhega...'],
  [241.24, 242.36, 'Bhai, ye sab chhod!'],
  [242.56, 243.7, 'Apni preparation dekh.'],
  [244.02, 251.68, 'Warna exam ke din question paper khulega aur tumhara confidence aise uninstall hoga jaise kisi ne tumhare dimaag se operating system hi uda diya ho.'],
  [251.92, 256.12, 'Competition kam ho ya zyada, tumhara kaam hai apna level improve karna.'],
  [256.38, 260.76, 'Aur jo abhi bhi registration numbers dekhkar khush ho rahe hain, unse bas itna kehna hai:'],
  [260.98, 265.36, 'Bhai, comment section mein AIR 1 banne se selection nahi hota, bhosdiwalo!'],
  [265.64, 267.86, 'Thodi bakchodi kam karo aur padhai zyada.'],
  [268.12, 270.28, 'Ab gaand mein dum hai toh mock test mein dikhao.'],
  [270.54, 271.76, 'Milte hain agle video mein.'],
  [272.06, 277.02, 'Tab tak apna dhyaan rakho, dimaag lagao aur NTA ke bharose apni zindagi mat chalao.'],
  [277.26, 278.52, 'Bye-bye, saalo!'],
];

/**
 * Turn narration lines into caption cues, splitting long lines at punctuation
 * (or word boundaries) into chunks of at most `max` characters. Time is shared
 * proportionally to character count.
 */
export function buildCues(lines, max = 64) {
  const out = [];
  for (const [s, e, text] of lines) {
    const chunks = splitText(text, max);
    const total = chunks.reduce((a, c) => a + c.length, 0);
    let acc = 0;
    for (const c of chunks) {
      const cs = s + ((e - s) * acc) / total;
      acc += c.length;
      const ce = s + ((e - s) * acc) / total;
      out.push({ s: cs, e: ce, text: c });
    }
  }
  // Prevent overlap of the caption "hang" with the next cue.
  for (let i = 0; i < out.length - 1; i++) out[i].next = out[i + 1].s;
  return out;
}

function splitText(text, max) {
  if (text.length <= max) return [text];
  // Prefer splitting at commas / sentence ends near the middle.
  const parts = [];
  let rest = text;
  while (rest.length > max) {
    let cut = -1;
    for (let i = Math.min(max, rest.length - 8); i > max * 0.4; i--) {
      if (/[,.!?:]/.test(rest[i]) && rest[i + 1] === ' ') {
        cut = i + 1;
        break;
      }
    }
    if (cut < 0) {
      cut = rest.lastIndexOf(' ', max);
      if (cut < max * 0.4) cut = rest.indexOf(' ', max);
      if (cut < 0) cut = rest.length;
    }
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

/** Narration speech spans for music ducking: [[start, end], ...] */
export function speechSpans(lines) {
  return lines.map(([s, e]) => [s, e]);
}
