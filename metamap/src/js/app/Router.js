const staticRoutes = {
    'contact': true,
    'home': true,
    'explore': true
}

let isHidden = false;
let toggleMain = (hide, path) => {
    track(path);
    if (hide) {
        isHidden = true;
        

    } else {
        isHidden = false;
        
        
    }
}

let track = (path) => {
    if (window.ga) {
        window.ga('set', {
            page: path
        });
        window.ga('send', 'pageview');
    }
}

class Router {
    constructor(metaMap) {
        this.history = [];
        riot.route.start();
        riot.route((target, id = '', action = '', ...params) => {
            let path = this.getPath(target);
            this.history.push(window.location.hash);
            if (!staticRoutes[path]) {
                toggleMain(true, path);
                switch (path) {
                case 'mymaps':
                    metaMap.Eventer.do(path, { id: id, action: action }, ...params);
                    break;
                default:
                    metaMap.Eventer.do('nav', path, { id: id, action: action }, ...params);
                    break;
                }

            } else {
                toggleMain(false, path);
            }
        });
        this.to(window.location.hash || 'home');
    }
    
    get currentPage() {
        return this.history[this.history.length - 1] || 'home';
    }

    static getPath(path) {
        if (path) {
            while (path.startsWith('!') || path.startsWith('#')) {
                path = path.substr(1);
            }
        }
        return path;
    }

    getPath(path) {
        return route.getPath(path);
    }

    static to(path) {
        path = route.getPath(path);
        if (path) {
            if (staticRoutes[path]) {
                toggleMain(false, path);
                riot.route(path);
            } else {
                toggleMain(true, path);
                riot.route(`!${path}`);
            }
        }
    }

    to(path) {
        return route.to(path);
    }

    back() {
        let path = 'home';
        let pageCnt = this.history.length;
        if (pageCnt > 1) {
            path = this.history[pageCnt - 2];
        }
        return this.to(path);
    }
}

const route = Router;

module.exports = Router;