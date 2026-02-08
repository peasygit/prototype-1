# 🚀 Peasy/HelperMate Backend - 快速指南

## ✅ 完成清單

### 已完成的 5 個文件

| # | 文件路徑 | 大小 | 功能 | 端點數 |
|---|---------|------|------|--------|
| 1 | `src/utils/matching.ts` | 11.3 KB | 智能配對算法 | - |
| 2 | `src/routes/employers.ts` | 10.8 KB | 僱主管理 | 8 |
| 3 | `src/routes/helpers.ts` | 14.4 KB | 幫手管理 | 11 |
| 4 | `src/routes/matches.ts` | 15.3 KB | 配對管理 | 7 |
| 5 | `src/routes/admin.ts` | 14.9 KB | 管理功能 | 13 |

**總計：52 個 API 端點 | ~71 KB | ~2,500 行代碼**

---

## 🏗️ 項目結構

```
peasy_helper/backend/
├── prisma/
│   └── schema.prisma          # ✅ 數據模型
├── src/
│   ├── server.ts              # ✅ Express 應用配置
│   ├── middleware/
│   │   └── auth.ts            # ✅ JWT 認証中間件
│   ├── routes/
│   │   ├── auth.ts            # ✅ 認証路由
│   │   ├── employers.ts       # ✅ 新增 - 僱主路由
│   │   ├── helpers.ts         # ✅ 新增 - 幫手路由
│   │   ├── matches.ts         # ✅ 新增 - 配對路由
│   │   └── admin.ts           # ✅ 新增 - 管理路由
│   └── utils/
│       └── matching.ts        # ✅ 新增 - 配對算法
└── package.json

```

---

## 🎯 核心功能概覽

### 1️⃣ 配對算法 (`matching.ts`)
```typescript
// 7 維度配對計分（滿分 100）
- 技能 40%         (評估技能匹配度)
- 經驗 20%         (評估工作經驗)
- 偏好 15%         (評估性格特質)
- 語言 10%         (評估語言能力)
- 時間 5%          (評估時間對齐)
- 五行 5%          (相生=100, 相剋=40, 中立=70)
- 星座 5%          (同元素=100, 相容=85)

計分公式：
score = 技能×0.4 + 經驗×0.2 + 偏好×0.15 + 語言×0.1 + 時間×0.05 + 五行×0.05 + 星座×0.05
```

**五行算法：**
```
木生火、火生土、土生金、金生水、水生木  (相生 = 1.0)
木克土、火克金、土克水、金克木、水克火  (相剋 = 0.4)
```

### 2️⃣ 僱主功能 (`employers.ts`)
```
- 建立/編輯個人檔案 (含五行、星座、偏好)
- 發佈職位 (含薪資、經驗要求、語言)
- 檢視配對候選人 (按分數排序)
- 管理配對狀態
- 查看統計數據
```

### 3️⃣ 幫手功能 (`helpers.ts`)
```
- 建立/編輯個人檔案 (含技能、經驗、語言)
- 新增技能和護理經驗
- 瀏覽可用職位
- 申請職位
- 追蹤申請狀態
- 查看個人統計
```

### 4️⃣ 配對管理 (`matches.ts`)
```
- 檢視配對列表 (個人/職位)
- 計算配對分數 (實時)
- 更新配對狀態 (pending → shortlisted → interviewed → hired)
- 批量建立配對 (管理員)
- 拒絕/刪除配對
```

### 5️⃣ 管理功能 (`admin.ts`)
```
- 用户管理 (建立、角色、狀態、重設密碼)
- 職位管理 (關閉職位)
- 配對管理 (新增備註)
- 平台統計 (用户、職位、配對、訂閱數量)
- 審計日誌 (操作追蹤)
- 健康檢查
```

---

## 🔐 安全特性

✅ **JWT 令牌認証**
- 格式：`Bearer <token>`
- 過期時間：7 天（可配置）
- 每個請求驗證 token

✅ **角色型訪問控制 (RBAC)**
- `admin` - 完全訪問
- `employer` - 職位/配對管理
- `helper` - 檔案/申請管理

✅ **完整的錯誤處理**
- Try-catch 所有異步操作
- 結構化錯誤回應
- 適當的 HTTP 狀態碼

✅ **數據驗證**
- 必填欄位檢查
- 數據類型驗證
- 唯一性約束

✅ **審計日誌**
- 所有重要操作記錄
- 時間戳記
- 操作者 ID

---

## 📊 API 統計

### 端點分佈
```
Auth      (認証)      3 個端點
Employers (僱主)      8 個端點
Helpers   (幫手)     11 個端點
Matches   (配對)      7 個端點
Admin     (管理)     13 個端點
─────────────────────────
總計              42 個端點
```

### 支援的操作
```
GET     - 檢索數據           (16 個)
POST    - 建立/提交數據       (16 個)
PUT     - 更新數據           ( 5 個)
DELETE  - 刪除/拒絕數據       ( 5 個)
─────────────────────────
總計                    42 個
```

---

## 🚀 快速開始

### 1. 安裝依賴
```bash
cd peasy_helper/backend
npm install
```

### 2. 環境配置
```bash
# 建立 .env 文件
cat > .env << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/peasy_db"
JWT_SECRET="your-secret-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
EOF
```

### 3. 資料庫初始化
```bash
# 創建表
npx prisma migrate dev --name init

# 生成 Prisma 客户端
npx prisma generate

# 選擇性：填充示例數據
npx prisma db seed
```

### 4. 啟動伺服器
```bash
# 開發模式
npm run dev

# 生產模式
npm run build
npm start
```

### 5. 驗證伺服器
```bash
# 健康檢查
curl http://localhost:3001/api/health

# 預期回應：
# {"status":"ok","timestamp":"2026-02-07T15:50:00.000Z"}
```

---

## 📝 快速測試

### 1. 註冊用户
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "helper@example.com",
    "password": "Test@123",
    "phone": "+852 1234 5678",
    "role": "helper"
  }'

# 儲存返回的 token
TOKEN="eyJhbGc..."
```

### 2. 建立幫手檔案
```bash
curl -X POST http://localhost:3001/api/helpers/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "陳美美",
    "nationality": "香港",
    "birthdate": "1990-05-15",
    "currentLocation": "旺角",
    "contractStatus": "freelance",
    "yearsExperienceTotal": 8,
    "yearsExperienceLocal": 5,
    "languages": ["粵語", "英文"],
    "wuxingElement": "wood",
    "westernZodiac": "taurus"
  }'
```

### 3. 新增技能
```bash
curl -X POST http://localhost:3001/api/helpers/skills \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skillType": "childcare",
    "proficiencyLevel": "expert"
  }'
```

### 4. 瀏覽職位
```bash
curl -X GET "http://localhost:3001/api/helpers/explore?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 文檔位置

| 文檔 | 路徑 | 用途 |
|------|------|------|
| API 文檔 | `API_DOCUMENTATION.md` | 詳細 API 參考 |
| 完成總結 | `BACKEND_COMPLETE.md` | 項目概覽 |
| 本文件 | `QUICK_START.md` | 快速開始指南 |

---

## 🐛 常見問題

### Q: Token 過期了怎麼辦？
A: 使用 `/api/auth/login` 重新登入並取得新 token

### Q: 為什麼配對分數是 0？
A: 檢查幫手和職位是否有以下信息：
- 幫手的技能和經驗
- 職位的描述和要求
- 語言偏好設定

### Q: 如何重設密碼？
A: 管理員使用 `POST /api/admin/users/:userId/reset-password`

### Q: 如何批量建立配對？
A: 管理員使用 `POST /api/matches/bulk-create`

### Q: 五行配對算法如何工作？
A: 見 `src/utils/matching.ts` 中的 `calculateWuxingCompatibility()` 函數

---

## 🔗 API 基本用法

### 建立配對
```bash
# 自動計算配對分數
curl -X POST http://localhost:3001/api/matches/calculate \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "helperId": "uuid-1",
    "jobId": "uuid-2"
  }'

# 回應包含 7 個維度的評分
```

### 更新配對狀態
```bash
# 接受配對
curl -X PUT http://localhost:3001/api/matches/uuid/status \
  -H "Authorization: Bearer $EMPLOYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shortlisted",
    "notes": "優秀候選人"
  }'
```

### 查看平台統計
```bash
# 管理員查看統計
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 包括用户、職位、配對、訂閱統計
```

---

## 📈 下一步

1. ✅ **完成代碼** - 所有 5 個文件已完成
2. 🔄 **測試 API** - 使用上面的快速測試命令
3. 📦 **部署準備** - 配置生產環境變數
4. 🚀 **上線** - 部署到伺服器
5. 📊 **監控** - 追蹤審計日誌和統計

---

## 💡 設計亮點

✨ **智能配對算法**
- 7 個維度（技能、經驗、偏好、語言、時間、五行、星座）
- 可配置的權重
- 實時計算

✨ **完整的生命週期**
- 用户註冊 → 檔案建立 → 職位發佈 → 自動配對 → 狀態管理 → 錄用

✨ **企業級安全**
- JWT 認証、RBAC、審計日誌

✨ **高度模塊化**
- 清晰的路由分離
- 集中式認証中間件
- 可重用的配對算法

✨ **文化融合**
- 五行相生相剋
- 星座元素相容
- 支援多語言

---

## 📞 支持

有問題？
1. 檢查 `API_DOCUMENTATION.md` 中的詳細文檔
2. 查看 `BACKEND_COMPLETE.md` 中的項目概覽
3. 檢查代碼註釋和類型定義
4. 查看錯誤日誌和回應信息

---

**祝您使用愉快！** 🎉

**版本**：1.0
**最後更新**：2026-02-07
