// LICENSE : MIT
"use strict";
require(['gitbook'], function (gitbook) {
    function addBeforeHeader(element) {
        jQuery('.book-header > h1').before(element)
    }

    function createButton({
        user,
        repo,
        type,
        size,
        width,
        height,
        count
        }) {
        var extraParam = type === "watch" ? "&v=2" : "";
        return `<a class="btn pull-right hidden-mobile" aria-label="github">
            <iframe
                style="display:inline-block;vertical-align:middle;"
                src="https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=${type}&count=${count}&size=${size}${extraParam}"
                frameborder="0"
                scrolling="0"
                width="${width}px"
                height="${height}px"
            ></iframe>
        </a>`;
    }

    function createUserButton({
        user,
        size,
        width,
        height,
        count
        }) {
        return `<a class="btn pull-right hidden-mobile" aria-label="github">
            <iframe
                style="display:inline-block;vertical-align:middle;"
                src="https://ghbtns.com/github-btn.html?user=${user}&type=follow&count=${count}&size=${size}"
                frameborder="0"
                scrolling="0"
                width="${width}px"
                height="${height}px"
            ></iframe>
        </a>`;
    }

    function insertGitHubLink(button) {
        var {
            user,
            repo,
            type,
            size,
            width,
            height,
            count
        } = button;

        var size = size || "large";
        var width = width || (size === "large" ? "150" : "100");
        var height = height || (size === "large" ? "30" : "20");
        var count = typeof count === "boolean" ? count : false;

        if (type === 'follow') {
            var elementString = createUserButton({
                user,
                size,
                width,
                height,
                count                
            });
        } else {
            var elementString = createButton({
                user,
                repo,
                type,
                size,
                width,
                height,
                count
            });
        }
        addBeforeHeader(elementString);
    }

    function init(config) {
        config.buttons.forEach(insertGitHubLink);
    }

    // injected by html hook
    function getPluginConfig() {
        return window["gitbook-plugin-github-buttons"];
    }

    // make sure configuration gets injected
    gitbook.events.bind('start', function (e, config) {
        window["gitbook-plugin-github-buttons"] = config["github-buttons"];
    });

    gitbook.events.bind('page.change', function () {
        init(getPluginConfig());
    });
});
