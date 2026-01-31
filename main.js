/*
 * Local HTML Embed Plugin for Obsidian
 * Version: 1.2.0
 * 
 * Embed local HTML files as iframes in your markdown notes.
 */

const { Plugin, PluginSettingTab, Setting } = require('obsidian');

// 다국어 지원
const i18n = {
    en: {
        settingsTitle: 'Local HTML Embed Settings',
        defaultHeight: 'Default height',
        defaultHeightDesc: 'Default iframe height when height is not specified (px)',
        borderRadius: 'Border radius',
        borderRadiusDesc: 'Border radius of the iframe (px)',
        showBorder: 'Show border',
        showBorderDesc: 'Display a border around the iframe',
        backgroundColor: 'Background color',
        backgroundColorDesc: 'Iframe background color (CSS value: transparent, #ffffff, etc.)',
        language: 'Language',
        languageDesc: 'Plugin UI language',
        usage: 'Usage',
        pathDesc: 'path: HTML file path (relative to current note, or absolute from vault root if starts with /)',
        heightDesc: 'height: Iframe height (optional, uses default if not specified)',
        errorNoPath: 'path is not specified',
        errorFileNotFound: 'File not found: ',
        errorReadFailed: 'Failed to read file'
    },
    ko: {
        settingsTitle: 'Local HTML Embed 설정',
        defaultHeight: '기본 높이',
        defaultHeightDesc: 'height를 지정하지 않았을 때 사용할 기본 iframe 높이 (px)',
        borderRadius: '테두리 둥글기',
        borderRadiusDesc: 'iframe 테두리의 border-radius 값 (px)',
        showBorder: '테두리 표시',
        showBorderDesc: 'iframe 주변에 테두리를 표시합니다',
        backgroundColor: '배경색',
        backgroundColorDesc: 'iframe 배경색 (CSS 값: transparent, #ffffff 등)',
        language: '언어 (Language)',
        languageDesc: '플러그인 UI 언어',
        usage: '사용법',
        pathDesc: 'path: HTML 파일 경로 (현재 노트 기준 상대경로, 또는 /로 시작하면 vault 루트 기준)',
        heightDesc: 'height: iframe 높이 (선택사항, 미지정 시 기본값 사용)',
        errorNoPath: 'path가 지정되지 않았습니다',
        errorFileNotFound: '파일을 찾을 수 없습니다: ',
        errorReadFailed: '파일을 읽을 수 없습니다'
    }
};

const DEFAULT_SETTINGS = {
    defaultHeight: 500,
    borderRadius: 8,
    showBorder: true,
    backgroundColor: 'transparent',
    language: 'en'
};

module.exports = class LocalHtmlEmbed extends Plugin {
    async onload() {
        await this.loadSettings();

        this.addSettingTab(new LocalHtmlEmbedSettingTab(this.app, this));

        this.registerMarkdownCodeBlockProcessor('html-embed', async (source, el, ctx) => {
            const params = this.parseParams(source);
            const t = i18n[this.settings.language];
            
            if (!params.path) {
                this.showError(el, t.errorNoPath);
                return;
            }

            const fullPath = this.resolvePath(params.path, ctx.sourcePath);

            try {
                const file = this.app.vault.getAbstractFileByPath(fullPath);
                if (!file) {
                    this.showError(el, t.errorFileNotFound + fullPath);
                    return;
                }

                const content = await this.app.vault.adapter.read(fullPath);

                const iframe = el.createEl('iframe');
                iframe.srcdoc = content;
                iframe.style.cssText = this.getIframeStyle(params);
            } catch (error) {
                console.error('Local HTML Embed:', error);
                this.showError(el, t.errorReadFailed);
            }
        });
    }

    t(key) {
        return i18n[this.settings.language][key] || i18n.en[key];
    }

    getIframeStyle(params) {
        const height = params.height || this.settings.defaultHeight;
        const radius = this.settings.borderRadius;
        const border = this.settings.showBorder 
            ? '1px solid var(--background-modifier-border)' 
            : 'none';
        const bg = this.settings.backgroundColor;

        return `
            width: 100%;
            height: ${height}px;
            border: ${border};
            border-radius: ${radius}px;
            background: ${bg};
        `;
    }

    parseParams(source) {
        const params = { path: '', height: null };
        const lines = source.trim().split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('path:')) {
                params.path = trimmed.substring(5).trim();
            } else if (trimmed.startsWith('height:')) {
                params.height = parseInt(trimmed.substring(7).trim()) || null;
            } else if (trimmed && !trimmed.includes(':')) {
                params.path = trimmed;
            }
        }

        return params;
    }

    resolvePath(filePath, sourcePath) {
        if (filePath.startsWith('/')) {
            return filePath.substring(1);
        }

        const lastSlash = sourcePath.lastIndexOf('/');
        const sourceDir = lastSlash >= 0 ? sourcePath.substring(0, lastSlash) : '';
        
        return sourceDir ? sourceDir + '/' + filePath : filePath;
    }

    showError(el, message) {
        el.createEl('div', {
            text: '⚠️ ' + message,
            attr: { 
                style: 'color: var(--text-error); padding: 12px; font-size: 13px; background: var(--background-secondary); border-radius: 6px;' 
            }
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    onunload() {}
};

class LocalHtmlEmbedSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        const t = (key) => this.plugin.t(key);
        
        containerEl.empty();

        containerEl.createEl('h2', { text: t('settingsTitle') });

        // Language setting (always show both languages)
        new Setting(containerEl)
            .setName(t('language'))
            .setDesc(t('languageDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('en', 'English')
                .addOption('ko', '한국어')
                .setValue(this.plugin.settings.language)
                .onChange(async (value) => {
                    this.plugin.settings.language = value;
                    await this.plugin.saveSettings();
                    this.display(); // 언어 변경 시 UI 새로고침
                }));

        new Setting(containerEl)
            .setName(t('defaultHeight'))
            .setDesc(t('defaultHeightDesc'))
            .addText(text => text
                .setPlaceholder('500')
                .setValue(String(this.plugin.settings.defaultHeight))
                .onChange(async (value) => {
                    const num = parseInt(value);
                    if (!isNaN(num) && num > 0) {
                        this.plugin.settings.defaultHeight = num;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName(t('borderRadius'))
            .setDesc(t('borderRadiusDesc'))
            .addSlider(slider => slider
                .setLimits(0, 20, 1)
                .setValue(this.plugin.settings.borderRadius)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.borderRadius = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t('showBorder'))
            .setDesc(t('showBorderDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showBorder)
                .onChange(async (value) => {
                    this.plugin.settings.showBorder = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(t('backgroundColor'))
            .setDesc(t('backgroundColorDesc'))
            .addText(text => text
                .setPlaceholder('transparent')
                .setValue(this.plugin.settings.backgroundColor)
                .onChange(async (value) => {
                    this.plugin.settings.backgroundColor = value || 'transparent';
                    await this.plugin.saveSettings();
                }));

        // Usage section
        containerEl.createEl('h3', { text: t('usage') });
        
        const usageEl = containerEl.createEl('div', {
            attr: { style: 'background: var(--background-secondary); padding: 16px; border-radius: 8px; font-family: var(--font-monospace); font-size: 13px;' }
        });
        usageEl.innerHTML = `<pre style="margin: 0; white-space: pre-wrap;">\`\`\`html-embed
path: interactive/example.html
height: 500
\`\`\`</pre>`;

        const paramsEl = containerEl.createEl('div', {
            attr: { style: 'margin-top: 12px; font-size: 13px; color: var(--text-muted);' }
        });
        paramsEl.innerHTML = `
            <p><strong>path</strong>: ${t('pathDesc').replace('path: ', '')}</p>
            <p><strong>height</strong>: ${t('heightDesc').replace('height: ', '')}</p>
        `;
    }
}
