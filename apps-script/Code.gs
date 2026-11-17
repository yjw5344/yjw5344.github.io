/**
 * 청첩장 백엔드 (Google Apps Script 웹 앱)
 *
 *  - action "upload_init" : 구글 드라이브 '이어올리기(resumable)' 세션을 만들어 uploadUrl 반환
 *                           → 브라우저가 원본 파일을 드라이브로 직접 전송 (용량 제한 없이 원본 그대로)
 *
 * 설정은 [프로젝트 설정 > 스크립트 속성]에 넣습니다. (저장소에는 ID를 두지 않음)
 *   FOLDER_ID       (필수) 사진/영상을 저장할 드라이브 폴더 ID
 *   ALLOWED_ORIGINS (선택) 쉼표로 구분. 기본값 https://yjw5344.github.io
 *   MAX_FILE_MB     (선택) 파일당 최대 크기(MB). 기본값 2048
 *   UPLOAD_FROM     (선택) 업로드 허용 시작일 YYYY-MM-DD
 *   UPLOAD_UNTIL    (선택) 업로드 허용 종료일 YYYY-MM-DD (그날 끝까지)
 *
 * 자세한 배포 방법은 같은 폴더의 README.md 참고.
 */

var DEFAULT_ORIGINS = ['https://yjw5344.github.io'];
var RATE_LIMIT_PER_MIN = 120;   // 전체 요청 기준 분당 상한 (남용 방지)
var TZ = 'Asia/Seoul';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return reply_({ ok: false, error: 'empty_body' });
    if (!rateLimitOk_()) return reply_({ ok: false, error: 'rate_limited' });

    var body = JSON.parse(e.postData.contents);
    switch (body.action) {
      case 'upload_init': return reply_(handleUploadInit_(body));
      default:            return reply_({ ok: false, error: 'unknown_action' });
    }
  } catch (err) {
    console.error(err);
    return reply_({ ok: false, error: 'server_error' });
  }
}

/** 브라우저에서 URL을 직접 열었을 때 동작 확인용 */
function doGet() {
  return reply_({ ok: true, service: 'wedding-backend' });
}

/* ───────────── 업로드 세션 ───────────── */

function handleUploadInit_(b) {
  var folderId = prop_('FOLDER_ID');
  if (!folderId) throw new Error('FOLDER_ID 스크립트 속성이 없습니다.');

  if (!uploadWindowOpen_()) return { ok: false, error: 'upload_closed' };

  var mime = String(b.mimeType || '').toLowerCase();
  if (!/^(image|video)\/[a-z0-9.+-]+$/.test(mime)) return { ok: false, error: 'invalid_type' };

  var size = Number(b.size);
  var maxBytes = Number(prop_('MAX_FILE_MB') || 2048) * 1024 * 1024;
  if (!isFinite(size) || size <= 0) return { ok: false, error: 'invalid_size' };
  if (size > maxBytes) return { ok: false, error: 'too_large' };

  var origin = pickOrigin_(b.origin);
  if (!origin) return { ok: false, error: 'origin_not_allowed' };

  var uploader = clean_(b.uploader, 20).replace(/[\\/:*?"<>|]/g, '') || '하객';
  var original = clean_(b.name, 120).replace(/[\\/:*?"<>|]/g, '_') || 'file';
  var stamp = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd-HHmmss');
  var fileName = stamp + '_' + uploader + '_' + original;

  var res = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
    {
      method: 'post',
      contentType: 'application/json; charset=UTF-8',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
        'X-Upload-Content-Type': mime,
        'X-Upload-Content-Length': String(size),
        // 이 Origin으로 세션을 만들어야 브라우저가 uploadUrl에 직접 PUT 할 때 CORS가 허용됨
        Origin: origin
      },
      payload: JSON.stringify({ name: fileName, parents: [folderId] }),
      muteHttpExceptions: true
    }
  );

  if (res.getResponseCode() !== 200) {
    console.error('resumable init failed', res.getResponseCode(), res.getContentText());
    return { ok: false, error: 'drive_error' };
  }
  var headers = res.getAllHeaders();
  var uploadUrl = headers['Location'] || headers['location'];
  if (!uploadUrl) return { ok: false, error: 'drive_error' };

  return { ok: true, uploadUrl: uploadUrl };
}

function uploadWindowOpen_() {
  var today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  var from = prop_('UPLOAD_FROM');
  var until = prop_('UPLOAD_UNTIL');
  if (from && today < from) return false;
  if (until && today > until) return false;
  return true;
}

function pickOrigin_(requested) {
  var list = (prop_('ALLOWED_ORIGINS') || '')
    .split(',').map(function (s) { return s.trim().replace(/\/$/, ''); }).filter(String);
  if (!list.length) list = DEFAULT_ORIGINS;
  var want = String(requested || '').replace(/\/$/, '');
  if (want && list.indexOf(want) !== -1) return want;
  return want ? '' : list[0];
}

/* ───────────── 공통 ───────────── */

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function prop_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function clean_(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function rateLimitOk_() {
  var cache = CacheService.getScriptCache();
  var key = 'rl_' + Math.floor(Date.now() / 60000);
  var n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 120);
  return n <= RATE_LIMIT_PER_MIN;
}

/**
 * 배포 전에 편집기에서 한 번 실행하세요.
 * 권한 승인 창이 뜨고, 폴더 접근이 되는지 확인합니다.
 */
function setup() {
  var folder = DriveApp.getFolderById(prop_('FOLDER_ID'));
  console.log('폴더 OK: ' + folder.getName());
  console.log('토큰 OK: ' + (ScriptApp.getOAuthToken() ? 'yes' : 'no'));
}
