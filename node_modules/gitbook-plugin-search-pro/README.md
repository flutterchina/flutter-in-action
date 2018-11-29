## gitbook-plugin-search-pro

Gitbook search engine pro. (支持中文搜索)

You can search any characters(utf-8) and highlight it in your GitBook, not only english(exp:Chinese).

> Note: Only gitbook >= 3.0.0 support

### Demo preview

---

![](https://github.com/gitbook-plugins/gitbook-plugin-search-pro/blob/master/previews/search1.gif)

---

![](https://github.com/gitbook-plugins/gitbook-plugin-search-pro/blob/master/previews/search2.gif)

---

![](https://github.com/gitbook-plugins/gitbook-plugin-search-pro/blob/master/previews/search3.gif)

---

### Usage

Before use this plugin, you should disable the default search plugin first, 
Here is a `book.js` configuration example:

```js
{
    "plugins": [
      "-lunr", "-search", "search-pro"
    ]
}
```

### Example
    
After installed gitbook.
    
```
    > git clone git@github.com:gitbook-plugins/gitbook-plugin-search-pro.git -b gh-pages
    > cd ./gitbook-plugin-search-pro
    > npm install
    > gitbook serve ./
```

And then open http://127.0.0.1:4000


### Thanks:
* [lwdgit](https://github.com/lwdgit/gitbook-plugin-search-plus)
* [gitbook-plugin-lunr](https://github.com/GitbookIO/plugin-lunr)
* [gitbook-plugin-search](https://github.com/GitbookIO/plugin-search)
* [mark.js](https://github.com/julmot/mark.js)

