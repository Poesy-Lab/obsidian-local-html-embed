# Local HTML Embed

Embed local HTML files as interactive iframes in your Obsidian markdown notes.

[한국어 문서는 아래에 있습니다](#한국어)

## Installation

### BRAT Installation (Recommended)
1. Install and enable [BRAT](https://github.com/TfTHacker/obsidian42-brat) from Obsidian's community plugins.
2. Open Settings → BRAT → Beta Plugin List → Add Beta plugin.
3. Enter this repository URL:
   ```text
   https://github.com/Poesy-Lab/obsidian-local-html-embed
   ```
4. Enable "Local HTML Embed" from Settings → Community plugins.

### Manual Installation
1. Download this repository
2. Copy `main.js` and `manifest.json` to your vault's `.obsidian/plugins/local-html-embed/` folder
3. Go to Settings → Community plugins → Enable "Local HTML Embed"

### From Community Plugins (Coming Soon)
Search for "Local HTML Embed" in Obsidian's community plugins browser.

## Usage

Use the `html-embed` code block in your markdown:

~~~markdown
```html-embed
path: interactive/my-visualization.html
height: 500
```
~~~

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `path` | HTML file path (relative to current note) | Required |
| `height` | Iframe height in pixels | 500 (configurable) |

### Path Resolution

- **Relative path**: Resolved from current note's location → `charts/graph.html`
- **Absolute path**: Starts with `/`, resolved from vault root → `/shared/widget.html`

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Language | UI language (English / 한국어) | English |
| Default height | Default iframe height | 500px |
| Border radius | Corner rounding | 8px |
| Show border | Display border around iframe | On |
| Background color | Iframe background (CSS value) | transparent |

## Features

- ✅ Relative and absolute path support
- ✅ Full JavaScript support in HTML files
- ✅ Works with Plotly, D3.js, Chart.js, and other visualization libraries
- ✅ Responsive width
- ✅ Dark/Light theme compatible
- ✅ Multi-language support (English, 한국어)
- ✅ Configurable appearance

## Technical Details

Uses `srcdoc` method to directly inject HTML content into iframe, avoiding Obsidian's `getResourcePath()` API compatibility issues for stable operation across all platforms.

## Examples

### Interactive Math Visualization
```html-embed
path: interactive/epsilon-delta.html
height: 520
```

### Data Dashboard
```html-embed
path: /dashboards/sales-chart.html
height: 600
```

## License

MIT License

## Changelog

### 1.2.0
- Added multi-language support (English, Korean)
- Language selector in settings

### 1.1.0
- Added settings tab (default height, border, background)
- Code refactoring

### 1.0.0
- Initial release
- Stable HTML embedding using srcdoc method

---

# 한국어

마크다운 노트에서 로컬 HTML 파일을 인터랙티브하게 임베드하는 Obsidian 플러그인입니다.

## 설치

### BRAT 설치 (권장)
1. Obsidian 커뮤니티 플러그인에서 [BRAT](https://github.com/TfTHacker/obsidian42-brat)을 설치하고 활성화합니다.
2. 설정 → BRAT → Beta Plugin List → Add Beta plugin으로 이동합니다.
3. 아래 저장소 URL을 입력합니다:
   ```text
   https://github.com/Poesy-Lab/obsidian-local-html-embed
   ```
4. 설정 → 커뮤니티 플러그인에서 "Local HTML Embed"를 활성화합니다.

### 수동 설치
1. 이 저장소를 다운로드
2. `main.js`와 `manifest.json`을 vault의 `.obsidian/plugins/local-html-embed/` 폴더에 복사
3. 설정 → 커뮤니티 플러그인 → "Local HTML Embed" 활성화

## 사용법

마크다운 파일에서 `html-embed` 코드 블록을 사용하세요:

~~~markdown
```html-embed
path: interactive/my-visualization.html
height: 500
```
~~~

### 파라미터

| 파라미터 | 설명 | 기본값 |
|---------|------|--------|
| `path` | HTML 파일 경로 (현재 노트 기준 상대경로) | 필수 |
| `height` | iframe 높이 (px) | 500 (설정 가능) |

### 경로 지정

- **상대 경로**: 현재 노트 위치 기준 → `interactive/chart.html`
- **절대 경로**: `/`로 시작하면 vault 루트 기준 → `/shared/widget.html`

## 설정

설정에서 언어를 한국어로 변경하면 모든 UI가 한국어로 표시됩니다.

| 설정 | 설명 | 기본값 |
|-----|------|--------|
| 언어 | UI 언어 | English |
| 기본 높이 | 기본 iframe 높이 | 500px |
| 테두리 둥글기 | border-radius 값 | 8px |
| 테두리 표시 | 테두리 on/off | On |
| 배경색 | iframe 배경색 | transparent |

## 특징

- ✅ 상대/절대 경로 지원
- ✅ JavaScript 포함 HTML 완전 지원
- ✅ Plotly, D3.js, Chart.js 등 시각화 라이브러리 호환
- ✅ 반응형 너비
- ✅ 다크/라이트 테마 호환
- ✅ 다국어 지원 (English, 한국어)
