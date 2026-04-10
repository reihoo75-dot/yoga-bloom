# 🌸 YOGA BLOOM — 可重用壓縮版專案說明
> 適用於：開新對話繼續開發 ｜ 最後更新：2026-04-09

---

## 【專案目的】

Yoga Bloom 是一個「每天都想打開的瑜伽練習記錄 App」，
完全在手機本地端執行，用溫柔的陪伴感讓人養成練習習慣。

---

## 【技術架構】

| 技術 | 用途 |
|------|------|
| Vite + React 18 + TypeScript | App 骨架 |
| Tailwind CSS（自訂色彩）| 所有樣式排版 |
| Framer Motion | 動畫效果 |
| Zustand | 全域狀態（設定 + Avatar 狀態） |
| Dexie v3（IndexedDB）| 本地資料庫（練習紀錄） |
| localStorage | 使用者設定持久化 |
| Recharts | 統計圖表 |
| React Router v6（HashRouter）| 頁面路由 |
| vite-plugin-pwa | PWA 安裝支援 |
| Noto Serif TC / Noto Sans TC | 繁體中文字體 |

**沒有：後端、Firebase、Supabase、登入系統**
**部署：GitHub → Vercel 自動部署**
**本地啟動：** `cd yoga-bloom` → `npm run dev` → http://localhost:5173
**路徑：** `D:/users/user/Desktop/yoga-bloom/`

---

## 【色彩系統】

```
cream: #FBF7F0（背景主色）
sage:  #8FAF8F（主色調・綠）
blush: #EDB0B8（強調色・粉）
beige: #D4B896（暖調・棕黃）
warm:  #8B6F5E（文字・深棕）
```

---

## 【已完成頁面與功能】

### 首頁（/）
- 動態問候（早/午/晚/夜 × 隨機詞組 × 暱稱）
- Avatar 浮動 idle 動畫 + XP 進度條
- 資源欄：🍃葉子 / ⭐星星 / 🌸花瓣
- 本週練習 mini 日曆（練習日顯示🌸）
- 統計三格：連續天數 / 本週 / 本月分鐘
- 每日提示（依時段 + 連續天數）
- 最近 3 筆練習 + 「開始記錄」CTA

### 記錄頁（/log）— 已大幅升級
9 個手風琴 Section，每個有 hint 文字 + 已填計數：
1. ⏱️ 練習時長（快選 + 自訂）
2. 📍 練習地點（7 選項）
3. 🧘 瑜伽類型（12 種，可複選）
4. 🎯 今天的目標（10 種，可複選）
5. 🌿 練習的體位法（全新）：
   - 30 個體位法 + SVG 棒狀示意圖 + 中英文名 + 難度
   - 搜尋框 + 分類篩選（站姿/地板/坐姿/平衡/倒立/修復/俯趴）
   - 點選展開詳細說明 + 可自訂新增
6. 💫 練習後身體感受（升級）：
   - 12 個預設標籤 + 自訂新增
   - 互動式人體 SVG 圖（點部位 → 推薦對應動作）
   - 100 字補充文字欄
7. 🌊 今天的情緒狀態（升級）：
   - 12 個預設標籤 + 自訂新增
   - 100 字補充文字欄
8. ⚡ 完成度（0–100% 滑桿）+ 練習前後能量（1–5）
9. 📝 給自己的一段話（自由文字）

底部 Sticky Bar：即時摘要（幾分鐘・幾種瑜伽・幾個動作）+ 完成紀錄按鈕

### 完成畫面（/completion）— 已升級
- 浮動粒子動畫（16顆）+ Avatar 慶祝動畫
- 月份主題顯示（「4月主題：覺察」）
- +XP 動畫 + XP 進度條填充動畫
- 里程碑訊息（第1/3/7/10/30/100次）
- 連續天數顯示（🔥 連續 X 天）
- 隨機鼓勵文案（44則，混合月份主題）

### 時間軸（/timeline）
- 依月份分組 + 可展開 Card
- Filter：全部 / 收藏 / 依瑜伽類型
- 收藏 toggle

### 統計（/insights）
- 週/月/季/年 Tab + 四格統計
- 智能建議（rule-based，最多5則）
- 4 張 Recharts 圖表

### Avatar 花園（/garden）
- Avatar 大圖 + 旋轉虛線圓環
- XP 進度條（shimmer）+ 資源三格
- 成長路徑 roadmap（5階段）+ 徽章牆（12枚）

### 設定（/settings）
- 暱稱 / Avatar（6隻）/ 主題色（3種）/ 提醒時間
- 匯出 JSON / CSV / 匯入 JSON / 清除資料

---

## 【資料結構】

### YogaLog（IndexedDB logs 表）
```typescript
{
  id, date(YYYY-MM-DD), startTime(HH:mm), durationMin,
  location, yogaTypes[], goals[], poses[],
  bodySignals[], bodyParts[],   // bodyParts = 人體部位選取
  bodyNote,                     // 身體感受補充文字
  emotions[], emotionNote,      // 情緒標籤 + 補充文字
  completionLevel(0-100),
  energyBefore(1-5), energyAfter(1-5),
  note, isFavorite, createdAt
}
```

### UserSettings（localStorage）
```typescript
{ nickname, avatar(AvatarId), theme(ThemeId), reminderTime, onboardingComplete }
```

### AvatarState（IndexedDB avatarState 表）
```typescript
{
  xp, level, stage(1-5), totalLogs, totalMinutes,
  resources{ leaves, stars, petals }, badges[]
}
```

### 型別定義
```typescript
AvatarId = 'capybara' | 'deer' | 'fox' | 'cat' | 'seal' | 'bunny'
ThemeId  = 'sage' | 'blush' | 'warm'
StageId  = 1 | 2 | 3 | 4 | 5
BadgeId  = 'first_log' | 'streak_7' | 'streak_30' | 'logs_10' |
           'logs_50' | 'logs_100' | 'minutes_500' | 'minutes_1000' |
           'all_types' | 'explorer' | 'night_owl' | 'early_bird'
```

---

## 【XP & 資源系統】

```
XP 計算：+10（基礎）+ 5（≥45分）+ 3（有筆記）= 最高 18 XP/次

成長階段：
  種子(0) → 發芽(100) → 成長(300) → 綻放(700) → 光亮(1500)

資源計算：
  🍃 葉子：每次 +1
  ⭐ 星星：bodySignals + emotions > 3 項 → +2，否則 +1
  🌸 花瓣：completionLevel ≥ 80% → +2，否則 +1
```

---

## 【月份主題系統（新增）】

`src/data/monthlyThemes.ts` 包含：
- 12 個月份主題（1月:開始 → 12月:成長），每月 5 則訊息
- 里程碑訊息：第 1/3/7/10/14/21/30/50/100 次紀錄
- 連續天數訊息：7/14/21/30 天
- `getCurrentMonthTheme()` / `getMilestoneMessage(n)` / `getStreakMessage(n)` 函數

---

## 【專案資料夾架構】

```
yoga-bloom/
├── public/
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── pwa-192x192.png        ⚠️ 需製作
│   └── pwa-512x512.png        ⚠️ 需製作
│
├── src/
│   ├── components/
│   │   ├── avatar/
│   │   │   ├── AvatarDisplay.tsx   # 動畫包裝（idle/celebrate）
│   │   │   └── AvatarSVG.tsx       # 6 隻動物 SVG（程式繪製）
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── BottomNav.tsx
│   │       ├── TagButton.tsx
│   │       ├── PageTransition.tsx
│   │       ├── CompletionSlider.tsx
│   │       ├── EnergyPicker.tsx
│   │       ├── BodyPartSelector.tsx  # 🆕 人體SVG點選圖
│   │       ├── PosePicker.tsx        # 🆕 體位法選取器
│   │       └── CustomTagInput.tsx    # 🆕 自訂標籤輸入
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Onboarding.tsx
│   │   ├── QuickLog.tsx        # 🔄 已大幅升級
│   │   ├── CompletionScreen.tsx # 🔄 已升級
│   │   ├── Timeline.tsx
│   │   ├── Insights.tsx
│   │   ├── AvatarGarden.tsx
│   │   └── Settings.tsx
│   │
│   ├── data/
│   │   ├── avatars.ts          # 6隻動物 + 5階段 + 12徽章
│   │   ├── options.ts          # 地點/類型/目標/感受/情緒選項
│   │   ├── poses.ts            # 🆕 30個體位法（描述/部位/分類/難度）
│   │   ├── bodyParts.ts        # 🆕 10個身體部位 + 推薦動作
│   │   ├── monthlyThemes.ts    # 🆕 12月份主題 + 里程碑訊息
│   │   └── messages.ts         # 鼓勵文案44則 + 每日提示 + 問候
│   │
│   ├── store/
│   │   ├── useAppStore.ts      # 設定 + Avatar 狀態（Zustand）
│   │   └── useLogStore.ts      # 練習紀錄 CRUD（Zustand）
│   │
│   ├── db/index.ts             # Dexie 資料庫（CRUD + 匯出/匯入）
│   ├── types/index.ts          # 所有 TypeScript 型別
│   └── utils/
│       ├── xp.ts               # XP計算/成長階段/徽章/連續天數
│       ├── date.ts             # 日期工具
│       └── insights.ts         # 統計分析邏輯
│
├── index.html                  # 🔄 PWA meta 已優化
├── vite.config.ts              # 🔄 PWA 設定已優化
├── tailwind.config.js          # 色彩系統 + 動畫
└── package.json
```

---

## 【目前限制（重要）】

| 限制 | 說明 |
|------|------|
| ⚠️ PWA 圖示尚缺 | pwa-192×192.png / pwa-512×512.png 無真實圖檔 |
| ⚠️ 無推播通知 | reminderTime 欄位存在，但未接 Notification API |
| ⚠️ 季/年統計不完整 | Insights 季/年 tab 沿用月份邏輯，未獨立聚合 |
| ⚠️ Avatar 無成長外觀 | 5 個階段目前外觀相同，無月份裝飾變化 |
| ⚠️ 動作圖是棒狀圖 | 15 個有客製 SVG，其餘通用棒狀圖 |
| 無雲端同步 | 純本地，換裝置需手動匯出/匯入 |
| 無搜尋 | Timeline 僅篩選，無關鍵字搜尋 |
| 無升階特效 | Avatar 升成長階段時無慶祝動畫 |

---

## 【接下來建議優先順序】

### 🔴 高優先
1. 製作 PWA 圖示（192 / 512 PNG）→ 安裝到主畫面完整體驗
2. Avatar 5 個成長階段圖片（現在全部長一樣）
3. 動作 SVG 示意圖（30 張統一風格）

### 🟡 中優先
4. Notification API 接入（reminderTime 已有欄位）
5. Insights 季/年真實聚合邏輯
6. Avatar 升階慶祝動畫
7. Avatar 月份裝飾系統（每月配件）
8. Timeline 關鍵字搜尋

### 🟢 低優先（長期）
9. Supabase 雲端同步
10. 多語系（en / zh-TW）
11. 練習計劃 / 課程系統

---

## 【UI 圖像資產規格】

### A. 動物角色系統

| 項目 | 規格 |
|------|------|
| 種類 | 6 種：水豚(capybara)、小鹿(deer)、狐狸(fox)、貓咪(cat)、海豹(seal)、兔子(bunny) |
| 成長階段 | 5 階段，每種 5 張，共 **30 張** |
| 設計尺寸 | **512 × 512 px** |
| UI 使用尺寸 | 首頁:100px ｜ 花園:200px ｜ 設定選擇:60px |
| 格式 | **PNG（透明背景）** |
| 風格 | 療癒・可愛・中性・溫暖，適合日常 App |

**命名規則：**
```
avatar_{id}_{階段}.png

avatar_capybara_1.png  ← 水豚・種子（最幼小）
avatar_capybara_2.png  ← 水豚・發芽
avatar_capybara_3.png  ← 水豚・成長
avatar_capybara_4.png  ← 水豚・綻放
avatar_capybara_5.png  ← 水豚・光亮（完整體+道具）
```

**各階段視覺方向：**
| 階段 | 名稱 | 視覺風格 |
|------|------|---------|
| 1 | 種子 | 最小隻、圓圓的、眼睛小、表情單純 |
| 2 | 發芽 | 稍大一點、有點精神、嘴角上揚 |
| 3 | 成長 | 中等大小、穩定感、表情有自信 |
| 4 | 綻放 | 較大、更漂亮、有花朵/光點裝飾 |
| 5 | 光亮 | 完整體、最美、拿道具（瑜伽墊/花/光環）|

---

### B. 月份裝飾（可疊加在角色上）

| 項目 | 規格 |
|------|------|
| 數量 | **12 套**（每月一個配件）|
| 設計尺寸 | **200 × 200 px** |
| 格式 | PNG 透明背景 |
| 方式 | 疊加在動物頭頂/身上的配件 |

**命名：** `avatar_decor_01.png` ～ `avatar_decor_12.png`

---

### C. 瑜伽動作圖示

| 項目 | 規格 |
|------|------|
| 數量 | **30 個動作，每個 1 張，共 30 張** |
| 設計尺寸 | **256 × 256 px** |
| UI 使用尺寸 | 卡片內:48px ｜ 詳細卡:80px |
| 格式 | **SVG（向量）** 優先 |
| 背景 | 透明 |
| 風格 | 線條插圖、性別中性、線條顏色 `#8FAF8F`（sage green） |

**命名：** `pose_{id}.svg`（例：`pose_downdog.svg`）

**30 個動作清單：**
```
mountain（山式）         downdog（下犬式）        warrior1（戰士一式）
warrior2（戰士二式）     warrior3（戰士三式）     tree（樹式）
child（嬰兒式）          cat_cow（貓牛式）         cobra（眼鏡蛇式）
updog（上犬式）          bridge（橋式）            wheel（輪式）
pigeon（鴿子式）         lizard（蜥蜴式）          forward_fold（站姿前彎）
seated_forward（坐姿前彎）  twist（坐姿扭轉）     supine_twist（仰臥扭轉）
butterfly（蝴蝶式）      lotus（蓮花式）           plank（平板式）
side_plank（側平板）     boat（船式）             shoulder_stand（肩倒立）
headstand（頭倒立）      legs_up（靠牆倒箭式）    savasana（攤屍式）
fish（魚式）             camel（駱駝式）           eagle（老鷹式）
```

---

### D. PWA App 圖示（立即需要）

| 檔名 | 尺寸 | 格式 | 說明 |
|------|------|------|------|
| pwa-192x192.png | 192×192 | PNG | 安裝圖示（小）|
| pwa-512x512.png | 512×512 | PNG | 安裝圖示（大）|
| apple-touch-icon.png | 180×180 | PNG | iOS 安裝圖示 |

**內容建議：** 蓮花圖示，背景色 `#FBF7F0`（米白）或 `#8FAF8F`（綠），圓角方形。

---

### E. 徽章圖示（可選，目前用 emoji）

| 項目 | 規格 |
|------|------|
| 數量 | 12 枚 |
| 設計尺寸 | 256 × 256 px |
| UI 使用尺寸 | 48 × 48 px |
| 格式 | PNG 透明背景 |

**命名：** `badge_{id}.png`（例：`badge_streak_7.png`）

---

## 【圖片放置位置】

```
public/
├── images/
│   ├── avatars/       ← avatar_capybara_1.png 等 30 張
│   ├── poses/         ← pose_downdog.svg 等 30 張
│   ├── badges/        ← badge_streak_7.png 等 12 張
│   └── decor/         ← avatar_decor_01.png 等 12 張
├── pwa-192x192.png
├── pwa-512x512.png
└── apple-touch-icon.png
```

---

## 【Gemini 產圖 Prompt 範本】

### 動物角色（通用）
```
Illustration for a yoga companion app. A [動物英文名，如 capybara] character.
Stage [1/2/3/4/5] out of 5 growth stages.
Stage 1 = tiny, simple, small eyes, round body.
Stage 3 = medium size, confident, healthy.
Stage 5 = full grown, beautiful, holding a yoga mat or surrounded by soft flowers and light.
Art style: soft kawaii, therapeutic, gender-neutral, warm color palette (cream #FBF7F0, sage green #8FAF8F, blush pink #EDB0B8).
Transparent background. 512x512px. Flat 2D illustration, no shadows, clean outlines.
```

### 瑜伽動作圖示
```
Minimalist yoga pose illustration: [動作英文名，如 downward facing dog].
Style: gender-neutral simplified human figure with rounded joints.
Single color line art, color: #8FAF8F (sage green), transparent background.
Clean, simple, instantly recognizable yoga silhouette. 256x256px. No text, no decoration.
```

### PWA App 圖示
```
App icon for a yoga tracking app "Yoga Bloom".
Design: a soft lotus flower with gentle glowing light effect.
Color palette: warm cream background #FBF7F0 with sage green #8FAF8F accents and soft blush pink #EDB0B8 highlights.
Rounded square format, minimalist clean modern app icon. 512x512px PNG.
```

---

## 【完整資產清單（Asset List）】

### 🔴 立即需要
```
[ ] pwa-192x192.png            192×192   PNG
[ ] pwa-512x512.png            512×512   PNG
[ ] apple-touch-icon.png       180×180   PNG
```

### 🟡 第一批（核心體驗，共 60 張）
```
// 動物主圖（30 張）
[ ] avatar_capybara_1~5.png    512×512   PNG × 5
[ ] avatar_deer_1~5.png        512×512   PNG × 5
[ ] avatar_fox_1~5.png         512×512   PNG × 5
[ ] avatar_cat_1~5.png         512×512   PNG × 5
[ ] avatar_seal_1~5.png        512×512   PNG × 5
[ ] avatar_bunny_1~5.png       512×512   PNG × 5

// 動作圖示（30 張）
[ ] pose_mountain.svg          256×256   PNG
[ ] pose_downdog.svg           256×256   PNG
[ ] pose_warrior1.svg          256×256   PNG
[ ] pose_warrior2.svg          256×256   PNG
[ ] pose_warrior3.svg          256×256   PNG
[ ] pose_tree.svg              256×256   PNG
[ ] pose_child.svg             256×256   PNG
[ ] pose_cat_cow.svg           256×256   PNG
[ ] pose_cobra.svg             256×256   PNG
[ ] pose_updog.svg             256×256   PNG
[ ] pose_bridge.svg            256×256   PNG
[ ] pose_wheel.svg             256×256   PNG
[ ] pose_pigeon.svg            256×256   PNG
[ ] pose_lizard.svg            256×256   PNG
[ ] pose_forward_fold.svg      256×256   PNG
[ ] pose_seated_forward.svg    256×256   PNG
[ ] pose_twist.svg             256×256   PNG
[ ] pose_supine_twist.svg      256×256   PNG
[ ] pose_butterfly.svg         256×256   PNG
[ ] pose_lotus.svg             256×256   PNG
[ ] pose_plank.svg             256×256   PNG
[ ] pose_side_plank.svg        256×256   PNG
[ ] pose_boat.svg              256×256   PNG
[ ] pose_shoulder_stand.svg    256×256   PNG
[ ] pose_headstand.svg         256×256   PNG
[ ] pose_legs_up.svg           256×256   PNG
[ ] pose_savasana.svg          256×256   PNG
[ ] pose_fish.svg              256×256   PNG
[ ] pose_camel.svg             256×256   PNG
[ ] pose_eagle.svg             256×256   PNG
```

### 🟢 第二批（加分體驗，共 24 張）
```
// 月份裝飾（12 張）
[ ] avatar_decor_01~12.png     200×200   PNG × 12

// 徽章圖示（12 張）
[ ] badge_first_log.png        256×256   PNG
[ ] badge_streak_7.png         256×256   PNG
[ ] badge_streak_30.png        256×256   PNG
[ ] badge_logs_10.png          256×256   PNG
[ ] badge_logs_50.png          256×256   PNG
[ ] badge_logs_100.png         256×256   PNG
[ ] badge_minutes_500.png      256×256   PNG
[ ] badge_minutes_1000.png     256×256   PNG
[ ] badge_all_types.png        256×256   PNG
[ ] badge_explorer.png         256×256   PNG
[ ] badge_night_owl.png        256×256   PNG
[ ] badge_early_bird.png       256×256   PNG
```

---

*總計：PWA 3 張 ＋ 動物 30 張 ＋ 動作 30 張 ＋ 裝飾 12 張 ＋ 徽章 12 張 = **87 個資產***
