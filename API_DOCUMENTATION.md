# Peasy/HelperMate Backend API 文檔

## 基礎資訊

- **Base URL**: `http://localhost:3001/api`
- **認証方式**: JWT Bearer Token
- **內容類型**: `application/json`
- **數據庫**: PostgreSQL (via Prisma)

---

## 認証

### 格式
```
Authorization: Bearer <token>
```

### 獲取 Token
見 [Auth 路由](#auth-路由)

---

## API 路由詳解

---

## 📌 Auth 路由 (`/api/auth`)

### POST /register
**建立新帳戶**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "+852 1234 5678",
  "role": "helper" | "employer" | "admin"
}
```

**回應 (201 Created)**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "helper",
    "status": "active",
    "createdAt": "2026-02-07T15:50:00Z"
  },
  "token": "eyJhbGc..."
}
```

### POST /login
**登入帳戶**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**回應 (200 OK)**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "helper",
    "status": "active"
  },
  "token": "eyJhbGc..."
}
```

### GET /me
**取得目前用户資訊**

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**回應 (200 OK)**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "phone": "+852 1234 5678",
  "role": "helper",
  "status": "active",
  "employer": null,
  "helper": { /* helper object */ }
}
```

---

## 👨‍💼 Employers 路由 (`/api/employers`)

### GET /profile
**取得僱主檔案**

```http
GET /api/employers/profile
Authorization: Bearer <token>
```

**回應**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "李先生家庭",
  "householdSize": 4,
  "adults": 2,
  "children": 2,
  "childrenAges": [5, 8],
  "hasElderly": false,
  "location": "中環",
  "languagePreferences": ["粵語", "英文"],
  "preferredHelperTraits": {
    "experience_required": true,
    "clean_background": true
  },
  "wuxingElement": "fire",
  "westernZodiac": "leo",
  "createdAt": "2026-02-07T15:50:00Z",
  "jobs": []
}
```

### POST /profile
**建立或更新僱主檔案**

```http
POST /api/employers/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "李先生家庭",
  "householdSize": 4,
  "adults": 2,
  "children": 2,
  "childrenAges": [5, 8],
  "hasElderly": false,
  "location": "中環",
  "languagePreferences": ["粵語", "英文"],
  "preferredHelperTraits": {
    "experience_required": true,
    "background_check": true
  },
  "birthdate": "1970-03-15",
  "wuxingElement": "fire",
  "westernZodiac": "leo"
}
```

### GET /jobs
**列出僱主的所有職位**

```http
GET /api/employers/jobs
Authorization: Bearer <token>
```

**回應**
```json
[
  {
    "id": "uuid",
    "employerId": "uuid",
    "title": "家庭幫手",
    "description": "尋求有經驗的家庭幫手...",
    "duties": { "cooking": true, "childcare": true },
    "preferredExperienceYears": 3,
    "preferredLanguages": ["粵語", "英文"],
    "preferredStartDate": "2026-03-01",
    "salaryRange": "HKD 12000-15000",
    "status": "active",
    "matches": [
      {
        "id": "uuid",
        "helperId": "uuid",
        "matchScore": 82.5,
        "status": "shortlisted",
        "helper": { /* helper info */ }
      }
    ]
  }
]
```

### POST /jobs
**新增職位**

```http
POST /api/employers/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "家庭幫手",
  "description": "尋求有經驗的家庭幫手，負責...",
  "duties": {
    "cooking": true,
    "childcare": true,
    "cleaning": true,
    "laundry": true
  },
  "preferredExperienceYears": 3,
  "preferredLanguages": ["粵語", "英文"],
  "preferredStartDate": "2026-03-01",
  "salaryRange": "HKD 12000-15000"
}
```

### GET /jobs/:jobId
**取得特定職位詳情**

```http
GET /api/employers/jobs/{jobId}
Authorization: Bearer <token>
```

### PUT /jobs/:jobId
**更新職位**

```http
PUT /api/employers/jobs/{jobId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "更新後的標題",
  "status": "active" | "filled" | "closed"
}
```

### DELETE /jobs/:jobId
**關閉職位**

```http
DELETE /api/employers/jobs/{jobId}
Authorization: Bearer <token>
```

### GET /stats
**取得僱主統計資訊**

```http
GET /api/employers/stats
Authorization: Bearer <token>
```

**回應**
```json
{
  "totalJobs": 5,
  "activeJobs": 3,
  "totalMatches": 15,
  "hiringMatches": 2
}
```

---

## 🤝 Helpers 路由 (`/api/helpers`)

### GET /profile
**取得幫手檔案**

```http
GET /api/helpers/profile
Authorization: Bearer <token>
```

### POST /profile
**建立或更新幫手檔案**

```http
POST /api/helpers/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "陳美美",
  "displayName": "美美",
  "nationality": "香港",
  "birthdate": "1990-05-15",
  "religion": "Buddhist",
  "currentLocation": "旺角",
  "contractStatus": "freelance",
  "availableFrom": "2026-03-01",
  "yearsExperienceTotal": 8,
  "yearsExperienceLocal": 5,
  "educationLevel": "Diploma",
  "languages": ["粵語", "英文", "普通話"],
  "aboutMe": "我有8年家庭幫手經驗...",
  "profilePhotoUrl": "https://...",
  "expectedSalaryMin": 12000,
  "expectedSalaryMax": 15000,
  "personalityTraits": {
    "patient": true,
    "reliable": true,
    "hardworking": true
  },
  "workStylePreference": "structured",
  "cannotAccept": ["elderly_care"],
  "wuxingElement": "wood",
  "westernZodiac": "taurus"
}
```

### POST /skills
**新增技能**

```http
POST /api/helpers/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "skillType": "cooking",
  "proficiencyLevel": "expert" | "advanced" | "intermediate" | "beginner" | "basic"
}
```

### GET /skills
**列出所有技能**

```http
GET /api/helpers/skills
Authorization: Bearer <token>
```

### DELETE /skills/:skillId
**刪除技能**

```http
DELETE /api/helpers/skills/{skillId}
Authorization: Bearer <token>
```

### POST /care-experience
**新增護理經驗**

```http
POST /api/helpers/care-experience
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetType": "infant" | "toddler" | "school-age" | "elderly" | "special-needs",
  "yearsExperience": 3
}
```

### GET /care-experience
**列出護理經驗**

```http
GET /api/helpers/care-experience
Authorization: Bearer <token>
```

### GET /applications
**列出所有申請（配對）**

```http
GET /api/helpers/applications
Authorization: Bearer <token>
```

### GET /explore
**瀏覽可用職位**

```http
GET /api/helpers/explore?page=1&limit=20&location=中環&salaryMin=12000&salaryMax=15000
Authorization: Bearer <token>
```

### POST /apply/:jobId
**申請職位**

```http
POST /api/helpers/apply/{jobId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "我很感興趣這份工作..."
}
```

### GET /stats
**取得幫手統計資訊**

```http
GET /api/helpers/stats
Authorization: Bearer <token>
```

**回應**
```json
{
  "totalApplications": 10,
  "shortlistedCount": 3,
  "interviewCount": 1,
  "hiredCount": 0
}
```

---

## 🔗 Matches 路由 (`/api/matches`)

### GET /:jobId
**取得職位的所有配對**

```http
GET /api/matches/{jobId}
Authorization: Bearer <token>
```

**回應**
```json
[
  {
    "id": "uuid",
    "jobId": "uuid",
    "helperId": "uuid",
    "sourceType": "auto_match" | "helper_applied" | "admin_recommended",
    "matchScore": 82.5,
    "matchBreakdown": {
      "skills": 85,
      "experience": 80,
      "preferences": 90,
      "languages": 100,
      "time": 75,
      "wuxing": 100,
      "zodiac": 85,
      "overall": 82.5
    },
    "status": "pending" | "shortlisted" | "interviewed" | "hired" | "rejected",
    "notes": "優秀的候選人",
    "helper": {
      "id": "uuid",
      "fullName": "陳美美",
      "nationality": "香港",
      "yearsExperienceTotal": 8
    }
  }
]
```

### GET /
**取得目前用户的配對列表**

```http
GET /api/matches?status=pending&sortBy=score&page=1&limit=20
Authorization: Bearer <token>
```

### GET /detail/:matchId
**取得配對詳情**

```http
GET /api/matches/detail/{matchId}
Authorization: Bearer <token>
```

### POST /calculate
**計算特定配對分數**

```http
POST /api/matches/calculate
Authorization: Bearer <token>
Content-Type: application/json

{
  "helperId": "uuid",
  "jobId": "uuid"
}
```

**回應**
```json
{
  "matchScore": 82.5,
  "matchBreakdown": {
    "skills": 85,
    "experience": 80,
    "preferences": 90,
    "languages": 100,
    "time": 75,
    "wuxing": 100,
    "zodiac": 85,
    "overall": 82.5
  },
  "helperId": "uuid",
  "jobId": "uuid"
}
```

### PUT /:matchId/status
**更新配對狀態**

```http
PUT /api/matches/{matchId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shortlisted" | "interviewed" | "hired" | "rejected",
  "notes": "很好的面試表現"
}
```

### POST /bulk-create
**批量建立配對（管理員）**

```http
POST /api/matches/bulk-create
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "uuid",
  "threshold": 50
}
```

### DELETE /:matchId
**拒絕配對**

```http
DELETE /api/matches/{matchId}
Authorization: Bearer <token>
```

---

## 🛠️ Admin 路由 (`/api/admin`)

### GET /users
**列出所有用户**

```http
GET /api/admin/users?role=helper&status=active&page=1&limit=20
Authorization: Bearer <token>
```

### GET /users/:userId
**取得用户詳情**

```http
GET /api/admin/users/{userId}
Authorization: Bearer <token>
```

### PUT /users/:userId/status
**更新用户狀態**

```http
PUT /api/admin/users/{userId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active" | "suspended" | "inactive"
}
```

### PUT /users/:userId/role
**更新用户角色**

```http
PUT /api/admin/users/{userId}/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "helper" | "employer" | "admin"
}
```

### GET /jobs
**列出所有職位**

```http
GET /api/admin/jobs?status=active&page=1&limit=20
Authorization: Bearer <token>
```

### GET /matches
**列出所有配對**

```http
GET /api/admin/matches?status=hired&page=1&limit=20&minScore=70
Authorization: Bearer <token>
```

### GET /stats
**取得平台統計**

```http
GET /api/admin/stats
Authorization: Bearer <token>
```

**回應**
```json
{
  "users": {
    "total": 150,
    "employers": 30,
    "helpers": 120,
    "byStatus": [
      { "status": "active", "_count": 145 },
      { "status": "suspended", "_count": 5 }
    ]
  },
  "jobs": {
    "total": 45,
    "active": 30,
    "byStatus": [...]
  },
  "matches": {
    "total": 200,
    "hired": 15,
    "byStatus": [...]
  },
  "subscriptions": {
    "active": 40
  }
}
```

### GET /events
**取得審計日誌**

```http
GET /api/admin/events?eventType=match_status_updated&page=1&limit=50
Authorization: Bearer <token>
```

### POST /users
**建立新用户**

```http
POST /api/admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "phone": "+852 1234 5678",
  "role": "admin"
}
```

### POST /users/:userId/reset-password
**重設用户密碼**

```http
POST /api/admin/users/{userId}/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "newPassword123"
}
```

### POST /jobs/:jobId/close
**關閉職位**

```http
POST /api/admin/jobs/{jobId}/close
Authorization: Bearer <token>
```

### POST /matches/:matchId/note
**新增管理員備註**

```http
POST /api/admin/matches/{matchId}/note
Authorization: Bearer <token>
Content-Type: application/json

{
  "note": "需要額外背景審查"
}
```

### GET /health
**健康檢查**

```http
GET /api/admin/health
Authorization: Bearer <token>
```

**回應**
```json
{
  "status": "ok",
  "timestamp": "2026-02-07T15:50:00Z",
  "database": "connected"
}
```

---

## 🔄 配對計分算法詳解

### 計分公式
```
總分 = (技能 × 0.4) + (經驗 × 0.2) + (偏好 × 0.15) + (語言 × 0.1) + (時間 × 0.05) + (五行 × 0.05) + (星座 × 0.05)
```

### 各項評分標準

#### 1. 技能匹配 (0-100) - 40%
- 平均熟練度 (基於：expert=100, advanced=90, intermediate=75, beginner=50)
- 加分：職位描述中提及的技能

#### 2. 工作經驗 (0-100) - 20%
- 本地經驗：60% 權重
- 總經驗：40% 權重
- 加分：護理經驗

#### 3. 偏好相容 (0-100) - 15%
- 幫手特質與僱主偏好的匹配度
- 基於相同特質數量

#### 4. 語言匹配 (0-100) - 10%
- 幫手語言與職位要求語言的重疊
- 完全匹配 = 100%

#### 5. 時間對齐 (0-100) - 5%
- 完美：±5天內 = 100
- 優良：-30天內 = 90
- 可接受：-60天內 = 70
- 不可用：= 40

#### 6. 五行相容 (0-100) - 5%
- 相生（如木生火）= 100
- 同元素 = 100
- 中立 = 70
- 相剋（如木克土）= 40

#### 7. 星座相容 (0-100) - 5%
- 同元素 = 100
- 相容元素 = 85
- 中立 = 70
- 衝突元素 = 50

### 五行系統
```
木 → 火 → 土 → 金 → 水 → 木 (相生循環)

木克土
火克金
土克水
金克木
水克火
```

### 星座元素
```
火象：牡羊、獅子、射手
土象：金牛、處女、魔羯
風象：雙子、天秤、水瓶
水象：巨蟹、天蠍、雙魚
```

---

## 📊 HTTP 狀態碼

| 狀態碼 | 含義 | 範例 |
|------|------|------|
| 200 | OK | 成功檢索數據 |
| 201 | Created | 成功建立資源 |
| 400 | Bad Request | 缺少必填欄位 |
| 401 | Unauthorized | 缺少/無效的 token |
| 403 | Forbidden | 權限不足 |
| 404 | Not Found | 資源不存在 |
| 409 | Conflict | 重複的記錄 |
| 500 | Server Error | 伺服器錯誤 |

---

## ⚠️ 常見錯誤

### 401 Unauthorized
- **原因**：缺少 token 或 token 過期
- **解決**：重新登入並取得新 token

### 403 Forbidden
- **原因**：用户角色沒有此操作權限
- **解決**：使用正確的用户角色

### 404 Not Found
- **原因**：資源 ID 不存在或拼寫錯誤
- **解決**：檢查資源 ID

### 409 Conflict
- **原因**：記錄已存在（如重複的技能）
- **解決**：檢查記錄是否已存在

---

## 🔒 安全建議

1. **安全儲存 Token**
   - 使用 HTTP-only Cookie 或安全的本地儲存
   - 不要在 URL 中傳遞 token

2. **定期輪換密碼**
   - 每 90 天更換一次
   - 使用強密碼（至少 8 字元，含大小寫、數字、符號）

3. **審計日誌**
   - 定期檢查 `/api/admin/events` 以監控異常活動

4. **HTTPS**
   - 生產環境必須使用 HTTPS

5. **速率限制**
   - 實施 API 速率限制以防止 DDoS 攻擊

---

## 📞 API 版本

- **版本**：1.0
- **發佈日期**：2026-02-07
- **最後更新**：2026-02-07

---

**祝您使用愉快！** 🚀
