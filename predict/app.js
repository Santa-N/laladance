// ===== LALA DANCE — Firebase 출석 관리 시스템 =====

// ===== Firebase 초기화 =====
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCCzceJKVQaGEb8HlrM9u9W51hMZ6EsOpM",
  authDomain: "laladance-512b2.firebaseapp.com",
  projectId: "laladance-512b2",
  storageBucket: "laladance-512b2.firebasestorage.app",
  messagingSenderId: "431031625640",
  appId: "1:431031625640:web:04e4d9f89fcd1964879f9d"
};
if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db   = firebase.firestore();

// ===== 기본 수업 목록 (Firestore 초기화용) =====
const LALA_CLASSES = [
  { id:'adult-morning',   name:'성인발레 오전반',   emoji:'🌸', days:[1,5],   time:'10:00', category:'adult',    accent:'#c97a74' },
  { id:'infant-56',       name:'유아발레 5~6세',    emoji:'🩰', days:[6],     time:'10:30', category:'kids',     accent:'#e8a0b0' },
  { id:'infant-7',        name:'유아발레 7세',      emoji:'🩰', days:[6],     time:'11:20', category:'kids',     accent:'#e8a0b0' },
  { id:'elem-basic-a',    name:'초등발레 기초 A반', emoji:'🩰', days:[1,3,5], time:'15:00', category:'elem',     accent:'#9a7eb8' },
  { id:'elem-basic-b',    name:'초등발레 기초 B반', emoji:'🩰', days:[2,4],   time:'16:00', category:'elem',     accent:'#9a7eb8' },
  { id:'elem-mid-a',      name:'초등발레 중급 A반', emoji:'🩰', days:[1,3,5], time:'16:00', category:'elem',     accent:'#6a9abf' },
  { id:'elem-mid-b',      name:'초등발레 중급 B반', emoji:'🩰', days:[2,4],   time:'18:00', category:'elem',     accent:'#6a9abf' },
  { id:'modern-basic',    name:'현대무용 기초',     emoji:'💃', days:[1,3,5], time:'17:00', category:'modern',   accent:'#6aaa88' },
  { id:'adult-basic',     name:'성인발레 기초',     emoji:'🌸', days:[1,3],   time:'19:00', category:'adult',    accent:'#c97a74' },
  { id:'entrance-ballet', name:'입시 발레',         emoji:'🏆', days:[2,4],   time:'19:00', category:'entrance', accent:'#b89c6b' },
  { id:'entrance-modern', name:'입시 현대무용',     emoji:'🏆', days:[1,3,5], time:'19:00', category:'entrance', accent:'#b89c6b' },
  { id:'adult-beginner',  name:'성인발레 완전초급', emoji:'🌸', days:[2,4],   time:'19:00', category:'adult',    accent:'#c97a74' },
  { id:'adult-upper',     name:'성인발레 중상급',   emoji:'🌸', days:[2,4],   time:'20:00', category:'adult',    accent:'#c97a74' },
  { id:'adult-mid',       name:'성인발레 중급',     emoji:'🌸', days:[2,4],   time:'21:00', category:'adult',    accent:'#c97a74' },
];

const DEFAULT_CLASSINFO = [
  { id:'ci_1', title:'유아 발레',       filterCat:'kids',       colorTheme:'pink',     emoji:'🩰', badge:'유아',  age:'5세 ~ 7세',                    description:'어린 나이부터 발레 기초를 자연스럽게 익히며 바른 자세, 유연성, 음악적 감수성을 키웁니다. 토요일 전용 과정입니다.',   schedule:['5~6세 | 토요일 10:30 – 11:10','7세 | 토요일 11:20 – 12:00'],                                               price:'월 80,000원 (주 1회)',   featured:false, featuredMain:false, ribbon:'' },
  { id:'ci_2', title:'초등 발레 기초',  filterCat:'kids',       colorTheme:'lavender', emoji:'🩰', badge:'초등',  age:'초등학생 전학년',               description:'기초 테크닉과 표현력을 함께 키우는 초등생 전용 발레 기초반. 꾸준한 반복 훈련으로 올바른 기본기를 다집니다.',       schedule:['A반 | 월·수·금 15:00','B반 | 화·목 16:00'],                                                                  price:'월 140,000원 (주 3회)',  featured:false, featuredMain:false, ribbon:'' },
  { id:'ci_3', title:'초등 발레 중급',  filterCat:'kids',       colorTheme:'sky',      emoji:'🩰', badge:'초등',  age:'기초 수료 후',                  description:'기초반 수료 후 심화 동작과 표현력 강화. 단계적인 난이도 상승으로 실력을 향상시킵니다.',                               schedule:['A반 | 월·수·금 16:00','B반 | 화·목 18:00'],                                                                  price:'월 150,000원 (주 3회)',  featured:false, featuredMain:false, ribbon:'' },
  { id:'ci_4', title:'초등 현대무용',   filterCat:'kids',       colorTheme:'mint',     emoji:'💃', badge:'초등',  age:'초등학생 전학년',               description:'자유로운 표현과 창의성을 기르는 현대무용. 몸의 언어로 감정을 표현하며 예술적 감각을 키웁니다.',                       schedule:['기초 | 월·수·금 17:00'],                                                                                      price:'월 150,000원 (주 3회)',  featured:false, featuredMain:false, ribbon:'' },
  { id:'ci_5', title:'영재반',          filterCat:'kids teens', colorTheme:'gold',     emoji:'⭐', badge:'영재',  age:'선발 과정',                    description:'발레·현대무용 뛰어난 자질의 학생들을 위한 집중 심화 과정. 높은 수준의 기술과 표현력을 개발합니다.',                   schedule:['발레 영재 | 주 3회','현대 영재 | 주 3회'],                                                                    price:'월 280,000원 (주 3회)',  featured:true,  featuredMain:false, ribbon:'' },
  { id:'ci_6', title:'무용 입시반',     filterCat:'teens',      colorTheme:'rose',     emoji:'🏆', badge:'입시',  age:'중·고등학생 / 대학 입시 준비생', description:'입시 합격률 99%! 현대무용과 발레를 병행하며 대학·예고 입시에 최적화된 커리큘럼을 제공합니다.',                      schedule:['현대무용 | 월·수·금 19:00 – 20:30','발레 | 화·목 19:00 – 20:00','집중반 | 주 5회'],                          price:'월 600,000원 (주 5회)',  featured:false, featuredMain:true,  ribbon:'입시 전문' },
  { id:'ci_7', title:'성인 발레 오전반', filterCat:'adult',     colorTheme:'blush',    emoji:'🌸', badge:'성인',  age:'성인 누구나',                  description:'오전 시간 여유로운 분들을 위한 성인 발레. 운동 효과와 예술적 즐거움을 동시에 경험하세요.',                           schedule:['오전반 | 월·금 10:00 – 11:30'],                                                                               price:'월 150,000원 (주 2회)',  featured:false, featuredMain:false, ribbon:'' },
  { id:'ci_8', title:'성인 발레 완전초급', filterCat:'adult',   colorTheme:'blush',    emoji:'🌸', badge:'성인',  age:'발레 처음 시작하는 분',         description:'발레가 처음인 분들을 위한 가장 기초부터 시작하는 과정. 친절하고 체계적인 지도로 누구나 시작할 수 있습니다.',           schedule:['완전초급 | 화·목 19:00 – 20:00'],                                                                             price:'월 120,000원 (주 2회)',  featured:false, featuredMain:false, ribbon:'' },
  { id:'ci_9', title:'성인 발레 기초',   filterCat:'adult',     colorTheme:'blush',    emoji:'🌸', badge:'성인',  age:'성인 초급자',                  description:'기초 테크닉과 발레 감각을 익히는 과정. 아름다운 자세와 유연성을 함께 키워갑니다.',                                   schedule:['기초 | 월·수 19:00 – 20:00'],                                                                                price:'월 120,000원 (주 2회)',  featured:false, featuredMain:false, ribbon:'' },
  { id:'ci_10', title:'성인 발레 중·상급', filterCat:'adult',   colorTheme:'blush',    emoji:'🌸', badge:'성인',  age:'중급 이상',                    description:'심화 테크닉과 표현력을 향상시키는 중상급 과정. 포인트슈즈 착용 및 바리에이션 등 고급 동작을 배웁니다.',               schedule:['중상급 | 화·목 20:00 – 21:00','중급 | 화·목 21:00 – 22:00'],                                                 price:'별도 문의',              featured:false, featuredMain:false, ribbon:'' },
];

const DEFAULT_NEWS = [
  { id:'news_1', date:'2024. 02', icon:'🎓', title:'교원임용 합격',              description:'라라댄스 출신 선생님이 2024년 체육교사 임용시험(무용 전공) 합격!' },
  { id:'news_2', date:'2024',     icon:'🏆', title:'제10회 전국 무용 예술제 수상', description:'제10회 전국 무용 예술제에서 다수 학생이 수상하는 쾌거를 이뤘습니다.' },
  { id:'news_3', date:'2024',     icon:'🏫', title:'고양예술고등학교 합격',        description:'라라댄스 입시반 학생이 명문 고양예술고등학교 무용과에 최종 합격했습니다.' },
  { id:'news_4', date:'정기',     icon:'🎤', title:'전문 강사 특별 강의',          description:'유명 전문가 초청 특별 강좌를 정기적으로 운영합니다.' },
  { id:'news_5', date:'매년',     icon:'🎭', title:'정기 공연',                    description:'매년 정기 공연을 통해 학생들이 무대 경험을 쌓고 성장하는 기회를 제공합니다.' },
  { id:'news_6', date:'상시',     icon:'💯', title:'토요 유아반 재등록률 100%',   description:'토요 유아발레반은 만족도가 높아 거의 100%에 달하는 재등록률을 자랑합니다.' },
];

const MIN_STUDENTS = 2;
const DAY_NAMES   = ['일','월','화','수','목','금','토'];
const CAT_LABELS  = { kids:'유아', elem:'초등', modern:'현대', entrance:'입시', adult:'성인' };

// ===== 유틸리티 =====
function formatDateKR(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${DAY_NAMES[d.getDay()]})`;
}
function todayStr() { return new Date().toISOString().split('T')[0]; }

// ===== XSS 방지 — 모든 innerHTML 삽입 시 사용 =====
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== 로그인 시도 제한 (5회 실패 → 15분 잠금) =====
function _loginLocked() {
  const t = +localStorage.getItem('lala_lockout_until');
  if (t && Date.now() < t) return Math.ceil((t - Date.now()) / 60000);
  if (t) { localStorage.removeItem('lala_lockout_until'); localStorage.removeItem('lala_login_fails'); }
  return 0;
}
function _recordFail() {
  const n = (+localStorage.getItem('lala_login_fails') || 0) + 1;
  if (n >= 5) {
    localStorage.setItem('lala_lockout_until', Date.now() + 15 * 60000);
    localStorage.removeItem('lala_login_fails');
  } else {
    localStorage.setItem('lala_login_fails', n);
  }
}
function _clearFails() {
  localStorage.removeItem('lala_login_fails');
  localStorage.removeItem('lala_lockout_until');
}

// 아이디 → Firebase Auth용 이메일 변환
// 한글·특수문자 포함 아이디도 허용되도록 base64 인코딩 후 @laradance.local 붙임
function toFirebaseEmail(input) {
  if (!input) return '';
  if (input.includes('@')) return input; // 이미 이메일 형식이면 그대로
  // btoa는 ASCII만 지원 → encodeURIComponent로 안전하게 변환 후 base64
  const safe = btoa(unescape(encodeURIComponent(input.trim().toLowerCase())))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return safe + '@laradance.local';
}

// ===== 세션 =====
function getSession()  { return JSON.parse(localStorage.getItem('lala_session') || 'null'); }
function setSession(u) { localStorage.setItem('lala_session', JSON.stringify(u)); }
function clearSession() {
  localStorage.removeItem('lala_session');
  auth.signOut().catch(() => {});
}
function requireAuth() {
  const s = getSession();
  if (!s) { window.location.href = 'login.html'; return null; }
  return s;
}

// ===== 인증 =====
async function login(email, password) {
  const remaining = _loginLocked();
  if (remaining) return { ok: false, msg: `로그인이 ${remaining}분간 잠금 상태입니다. 잠시 후 다시 시도해주세요.` };

  const fbEmail = toFirebaseEmail(email);
  try {
    const cred = await auth.signInWithEmailAndPassword(fbEmail, password);
    const userDoc = await db.collection('users').doc(cred.user.uid).get();
    if (!userDoc.exists) {
      await auth.signOut();
      _recordFail();
      return { ok: false, msg: '계정 정보를 찾을 수 없습니다.' };
    }
    const ud = userDoc.data();
    if (ud.suspended) {
      await auth.signOut();
      return { ok: false, msg: '정지된 계정입니다. 학원에 문의하세요.' };
    }
    _clearFails();
    const user = { id: cred.user.uid, name: ud.name, email: ud.displayEmail || email, role: ud.role };
    setSession(user);
    return { ok: true, user };
  } catch(e) {
    _recordFail();
    return { ok: false, msg: '아이디 또는 비밀번호가 올바르지 않습니다.' };
  }
}

async function signup(name, email, password, role, code) {
  try {
    const codesDoc = await db.collection('settings').doc('codes').get();
    const codes = codesDoc.exists ? codesDoc.data() : { student: 'LALA2024', teacher: 'TEACHER2024' };
    if (code !== codes[role]) return { ok: false, msg: '학원 코드가 올바르지 않습니다. 선생님께 문의하세요.' };

    const fbEmail = toFirebaseEmail(email);
    const cred = await auth.createUserWithEmailAndPassword(fbEmail, password);
    await db.collection('users').doc(cred.user.uid).set({
      name, displayEmail: email, role,
      createdAt: new Date().toISOString(), suspended: false
    });
    const user = { id: cred.user.uid, name, email, role };
    setSession(user);
    return { ok: true, user };
  } catch(e) {
    if (e.code === 'auth/email-already-in-use') return { ok: false, msg: '이미 사용 중인 아이디입니다.' };
    if (e.code === 'auth/weak-password')        return { ok: false, msg: '비밀번호는 6자 이상이어야 합니다.' };
    if (e.code === 'auth/invalid-email')        return { ok: false, msg: '아이디 형식이 올바르지 않습니다.' };
    return { ok: false, msg: '가입 중 오류가 발생했습니다. (' + (e.code || e.message) + ')' };
  }
}

// ===== 출석 체크인 =====
async function fetchTodayCheckins(date) {
  const snap = await db.collection('checkins').where('date', '==', date).get();
  return snap.docs.map(d => d.data());
}

async function toggleCheckin(classId, date, userId, userName) {
  const docId = `${classId}_${date}_${userId}`;
  const ref   = db.collection('checkins').doc(docId);
  const doc   = await ref.get();
  if (doc.exists) { await ref.delete(); return false; }
  await ref.set({ classId, date, userId, userName, checkedAt: new Date().toISOString() });
  return true;
}

async function fetchHistory() {
  const snap = await db.collection('checkins')
    .where('date', '<', todayStr())
    .orderBy('date', 'desc')
    .get();
  return snap.docs.map(d => d.data());
}

// ===== 활성 수업 =====
async function fetchActiveClassIds() {
  const doc = await db.collection('settings').doc('active').get();
  return doc.exists ? (doc.data().classIds || null) : null;
}
async function saveActiveClassIds(ids) {
  await db.collection('settings').doc('active').set({ classIds: ids });
}
function resolveActiveClasses(classIds) {
  if (classIds === null) return LALA_CLASSES;
  return LALA_CLASSES.filter(c => classIds.includes(c.id));
}

// ===== 수업 관리 =====
async function fetchClasses() {
  const snap = await db.collection('classes').get();
  const list = snap.docs.map(d => ({ ...d.data(), id: d.id }));
  return list.sort((a, b) => a.time.localeCompare(b.time));
}
async function addClass(cls) {
  const id = 'custom_' + Date.now();
  const newCls = { ...cls, id };
  await db.collection('classes').doc(id).set(newCls);
  return { ok: true, cls: newCls };
}
async function deleteClass(classId) {
  await db.collection('classes').doc(classId).delete();
  return { ok: true };
}
async function updateClass(classId, data) {
  await db.collection('classes').doc(classId).update(data);
  return { ok: true };
}

// ===== 원생 통계 =====
async function fetchUserStats() {
  const snap = await db.collection('users').get();
  const students = snap.docs.filter(d => d.data().role === 'student' && !d.data().suspended);
  const teachers = snap.docs.filter(d => d.data().role === 'teacher' && !d.data().suspended);
  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    students: students.map(d => ({ id: d.id, name: d.data().name, email: d.data().displayEmail || '' }))
  };
}

// ===== 사용자 관리 =====
async function fetchAllUsers() {
  const snap = await db.collection('users').get();
  return snap.docs.map(d => ({
    id: d.id,
    name:      d.data().name,
    email:     d.data().displayEmail || '',
    role:      d.data().role,
    suspended: d.data().suspended || false,
    createdAt: d.data().createdAt || ''
  }));
}
async function deleteUser(userId) {
  // Firestore 프로필 삭제 (Firebase Auth 계정은 서버 SDK 없이는 삭제 불가)
  await db.collection('users').doc(userId).delete();
  return { ok: true };
}
async function suspendUser(userId) {
  const ref = db.collection('users').doc(userId);
  const doc = await ref.get();
  const suspended = !(doc.data().suspended || false);
  await ref.update({ suspended });
  return { ok: true, suspended };
}
async function changePassword(userId, currentPassword, newPassword) {
  const session = getSession();
  if (!session) return { ok: false, msg: '로그인이 필요합니다.' };
  const fbEmail = toFirebaseEmail(session.email);
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(fbEmail, currentPassword);
    let user = auth.currentUser;
    if (!user) {
      const cred = await auth.signInWithEmailAndPassword(fbEmail, currentPassword);
      user = cred.user;
    } else {
      await user.reauthenticateWithCredential(credential);
    }
    await user.updatePassword(newPassword);
    return { ok: true };
  } catch(e) {
    const msg = (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential')
      ? '현재 비밀번호가 올바르지 않습니다.'
      : e.code === 'auth/weak-password' ? '새 비밀번호는 6자 이상이어야 합니다.'
      : '비밀번호 변경에 실패했습니다.';
    return { ok: false, msg };
  }
}

// ===== 학원코드 =====
async function fetchCodes() {
  const doc = await db.collection('settings').doc('codes').get();
  return doc.exists ? doc.data() : { student: 'LALA2024', teacher: 'TEACHER2024' };
}
async function saveCodes(student, teacher) {
  await db.collection('settings').doc('codes').set({ student, teacher });
  return { ok: true };
}

// ===== 기간별 출석 조회 =====
async function fetchCheckinsRange(start, end) {
  const snap = await db.collection('checkins')
    .where('date', '>=', start)
    .where('date', '<=', end)
    .get();
  return snap.docs.map(d => d.data());
}

// ===== 수업별 등록 원생 목록 =====
async function fetchEnrolledByClass() {
  const [enrolledSnap, usersSnap] = await Promise.all([
    db.collection('enrolled').get(),
    db.collection('users').where('role', '==', 'student').get()
  ]);
  const students = {};
  usersSnap.docs.forEach(d => { if (!d.data().suspended) students[d.id] = d.data().name; });
  const byClass = {};
  enrolledSnap.docs.forEach(doc => {
    const uid = doc.id;
    if (!students[uid]) return;
    (doc.data().classIds || []).forEach(cid => {
      byClass[cid] = byClass[cid] || [];
      byClass[cid].push({ id: uid, name: students[uid] });
    });
  });
  return byClass;
}

// ===== 수업별 수강 인원 =====
async function fetchEnrollmentCounts() {
  const snap = await db.collection('enrolled').get();
  const counts = {};
  snap.docs.forEach(doc => {
    (doc.data().classIds || []).forEach(cid => { counts[cid] = (counts[cid] || 0) + 1; });
  });
  return counts;
}

// ===== 내 출석 전체 기록 =====
async function fetchMyCheckins(userId) {
  const snap = await db.collection('checkins').where('userId', '==', userId).get();
  return snap.docs.map(d => d.data());
}

// ===== 소식 관리 =====
async function fetchNews() {
  const snap  = await db.collection('news').get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
async function addNews(item) {
  const snap = await db.collection('news').get();
  const ref  = await db.collection('news').add({ ...item, order: snap.size });
  return { ok: true, item: { id: ref.id, ...item } };
}
async function updateNews(id, item) {
  await db.collection('news').doc(id).update(item);
  return { ok: true };
}
async function deleteNews(id) {
  await db.collection('news').doc(id).delete();
  return { ok: true };
}

// ===== 원생 수강 수업 =====
async function fetchEnrolledIds(userId) {
  const doc = await db.collection('enrolled').doc(userId).get();
  return doc.exists ? (doc.data().classIds || []) : [];
}
async function saveEnrolledIds(userId, ids) {
  await db.collection('enrolled').doc(userId).set({ classIds: ids });
}

// ===== 수업 안내 카드 =====
async function fetchClassInfo() {
  const snap  = await db.collection('classinfo').get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
async function addClassInfo(item) {
  const snap = await db.collection('classinfo').get();
  const ref  = await db.collection('classinfo').add({ ...item, order: snap.size });
  return { ok: true, item: { id: ref.id, ...item } };
}
async function updateClassInfo(id, item) {
  await db.collection('classinfo').doc(id).update(item);
  return { ok: true };
}
async function deleteClassInfo(id) {
  await db.collection('classinfo').doc(id).delete();
  return { ok: true };
}

// ===== 초기 데이터 세팅 (최초 1회) =====
// ensureAdmin() 실행 후 인증 상태에서 호출되어야 함
async function initDefaultData() {
  if (localStorage.getItem('lala_data_init_v1')) return;
  try {
    const [classSnap, codesDoc, ciSnap, newsSnap] = await Promise.all([
      db.collection('classes').limit(1).get(),
      db.collection('settings').doc('codes').get(),
      db.collection('classinfo').limit(1).get(),
      db.collection('news').limit(1).get()
    ]);
    const batch = db.batch();
    if (classSnap.empty) {
      LALA_CLASSES.forEach(cls => batch.set(db.collection('classes').doc(cls.id), cls));
    }
    if (!codesDoc.exists) {
      batch.set(db.collection('settings').doc('codes'), { student: 'LALA2024', teacher: 'TEACHER2024' });
    }
    if (ciSnap.empty) {
      DEFAULT_CLASSINFO.forEach((item, i) =>
        batch.set(db.collection('classinfo').doc(item.id), { ...item, order: i })
      );
    }
    if (newsSnap.empty) {
      DEFAULT_NEWS.forEach((item, i) =>
        batch.set(db.collection('news').doc(item.id), { ...item, order: i })
      );
    }
    await batch.commit();
    localStorage.setItem('lala_data_init_v1', '1');
  } catch(e) { /* 권한 문제 등 - 무시 */ }
  finally {
    // ensureAdmin()에서 로그아웃하지 않았으므로 여기서 처리
    try { await auth.signOut(); } catch {}
  }
}

// ===== 관리자 계정 초기화 (로그인 페이지에서만 호출) =====
// 주의: signOut은 하지 않음 — initDefaultData()가 인증 상태에서 실행되어야 하므로
async function ensureAdmin() {
  if (localStorage.getItem('lala_admin_init_v1')) return;
  localStorage.setItem('lala_admin_init_v1', '1');
  try {
    const cred = await auth.createUserWithEmailAndPassword('laladance@laradance.local', '123456');
    await db.collection('users').doc(cred.user.uid).set({
      name: '라라댄스', displayEmail: 'laladance',
      role: 'admin', suspended: false, createdAt: new Date().toISOString()
    });
    // signOut 생략 — initDefaultData() 완료 후 처리
  } catch(e) {
    // 이미 계정이 존재하는 경우 정상 (재실행 방지 플래그가 있어야 하나 없을 경우 대비)
  }
}
