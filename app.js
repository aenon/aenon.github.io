// 使用marked库来解析Markdown
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

// 配置marked以支持HTML标签
marked.setOptions({
    headerIds: false,
    mangle: false
});

// 路由和内容管理
class Router {
    constructor() {
        this.routes = new Map();
        this.init();
    }

    init() {
        // 监听URL变化
        window.addEventListener('popstate', () => this.handleRoute());
        // 初始化导航
        this.loadNavigation();
        // 处理当前路由
        this.handleRoute();
    }

    async loadNavigation() {
        try {
            const response = await fetch('/nav.md');
            if (!response.ok) throw new Error('Navigation not found');
            const text = await response.text();
            document.getElementById('navigation').innerHTML = marked.parse(text);
        } catch (error) {
            console.error('Failed to load navigation:', error);
        }
    }

    async handleRoute() {
        const path = window.location.pathname;
        const targetPath = path === '/' ? '/index.md' : path + '.md';

        try {
            const response = await fetch(targetPath);
            if (!response.ok) throw new Error('Page not found');
            const text = await response.text();
            document.getElementById('content').innerHTML = marked.parse(text);
        } catch (error) {
            console.error('Failed to load page:', error);
            document.getElementById('content').innerHTML = '<h1>404 - Page Not Found</h1>';
        }
    }

    navigate(event) {
        if (event.target.tagName === 'A') {
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('/')) {
                event.preventDefault();
                window.history.pushState(null, '', href);
                this.handleRoute();
            }
        }
    }
}

// 初始化路由
const router = new Router();

// 处理导航点击
document.addEventListener('click', (e) => router.navigate(e));