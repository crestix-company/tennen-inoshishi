# 天然いのしし 公式ホームページ

## 紹介動画

トップのメイン写真直下（`#movie`）に店舗・料理の紹介動画を掲載しています。ヘッダーの `MOVIE` と「動画でお店を見る」から移動できます。

- 動画: `media/tennen-inoshishi-introduction.mp4`（約24秒・縦型360×640）
- 再生前の画像: `media/tennen-inoshishi-poster.jpg`（動画の冒頭フレーム）
- 自動再生はせず、クリック／タップで再生します。初期表示では動画本体を先読みしません。
- 元動画は再圧縮せず、縦横比を維持して表示します。音量・シーク・全画面は標準プレーヤーで操作できます。
- `index.html`、`style.css`、`script.js` と `media/` を同時に配信してください。ビルド処理は不要です。
- `node scripts/verify-video.mjs` で動画設定・ファイル・内部参照を検証できます。

## ファイル構成

```
tennen-inoshishi/
├── index.html      # メインHTMLファイル
├── style.css       # スタイルシート
├── script.js       # JavaScript（IntersectionObserver）
├── images/         # 画像フォルダ（要作成）
│   ├── hero.jpg
│   ├── food-gibier.jpg
│   ├── food-horse.jpg
│   └── seat.jpg
└── README.md       # このファイル
```

## デザイン・構成の解説

### デザインコンセプト
- **和モダン × 大人 × 隠れ家**: 落ち着いた色調（黒・濃茶・生成り系）で、上品で静かな雰囲気を演出
- **写真主役**: 各セクションで大きな写真を使用し、視覚的なインパクトを重視
- **余白を活かした縦スクロール**: セクション間にたっぷりの余白を設け、ゆったりとしたスクロール体験を提供
- **色数は少なく**: 写真を邪魔しないよう、ベースカラーは最小限に抑制

### ページ構成

1. **HERO**: フルスクリーンのヒーロー画像と店名・キャッチコピー
2. **CONCEPT**: 店の想いと希少食材へのこだわりを簡潔に
3. **FOOD / MENU**: ジビエと馬肉の特徴を写真とテキストで紹介
4. **SEAT / SPACE**: 店内の雰囲気と席数情報
5. **ACCESS**: 住所、営業時間、定休日、Google Map埋め込み
6. **RESERVATION**: 食べログ予約と電話番号のCTA
7. **FOOTER**: 店舗情報とSNSリンク

### 技術的特徴

- **Pure HTML/CSS/JavaScript**: フレームワーク不使用
- **レスポンシブデザイン**: SP最優先で設計（モバイルファースト）
- **IntersectionObserver**: パフォーマンスを考慮したフェードインアニメーション
- **SEO対応**: 適切な見出し構造（h1〜h3）とmetaタグ

### アニメーション

- スクロールに応じて要素がフェードイン＋軽い上方向移動
- 上品で控えめなアニメーションで、信頼感を損なわない設計

## 画像の配置

以下の画像を `images/` フォルダに配置してください：

1. `hero.jpg` - HEROセクション用の店内写真（推奨サイズ: 1920×1080px以上）
2. `food-gibier.jpg` - ジビエ料理の写真（推奨サイズ: 800×600px以上）
3. `food-horse.jpg` - 馬肉料理の写真（推奨サイズ: 800×600px以上）
4. `seat.jpg` - 店内の席の写真（推奨サイズ: 1200×800px以上）

Google Driveから画像をダウンロードして配置してください：
https://drive.google.com/drive/folders/1Obt9ofwqPHOEOBVY7wcXg6udLP4zz-JH

## Google Mapの埋め込み

`index.html` のACCESSセクション内のGoogle Mapの埋め込みコードは、店舗位置の座標（緯度: 35.257960, 経度: 139.664445）を反映していますが、より正確な埋め込みコードに更新することを推奨します。

Google Mapsで「横須賀市衣笠栄町１丁目４ 渋谷ビル」を検索し、「地図を埋め込む」から取得した最新のコードに置き換えてください。

## カスタマイズポイント

- **色の調整**: `style.css` のカラーパレット（`#2c2c2c`, `#4a4a4a`, `#fafafa`など）を変更可能
- **フォント**: `body` の `font-family` を変更可能
- **アニメーション速度**: `script.js` の `threshold` や CSSの `transition` 時間を調整可能
- **セクション間の余白**: `.section` の `padding` を調整可能

## ブラウザ対応

- Chrome（最新版）
- Safari（最新版）
- Firefox（最新版）
- Edge（最新版）
- iOS Safari
- Android Chrome

## 注意事項

- 画像は必ず配置してください（画像がないとレイアウトが崩れます）
- Google Mapの埋め込みコードは実際の店舗位置に更新してください
- 食べログの予約URLが正しいか確認してください
- SNSリンクが正しいか確認してください
