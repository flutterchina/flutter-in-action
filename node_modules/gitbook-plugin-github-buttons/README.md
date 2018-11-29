# gitbook-plugin-github-buttons

Gitbook plugin that provide [The Unofficial GitHub Watch & Fork Buttons](https://ghbtns.com/ "The Unofficial GitHub Watch &amp; Fork Buttons").

![screenshot](https://monosnap.com/file/pzLUbsaOvgah0aWPt6E0TqG0l73faX.png)

## Installation

    npm install gitbook-plugin-github-buttons

## Usage

Plugin Config

```json
{
  "plugins": [
    "github-buttons"
  ],
  "pluginsConfig": {
    "github-buttons": {
      "buttons": [{
        "user": "azu",
        "repo": "JavaScript-Plugin-Architecture",
        "type": "star",
        "size": "large"
      }, {
        "user": "azu",
        "type": "follow",
        "width": "230",
        "count": false
      }]
    }
  }
}
```

The default size of `large` is `150 x 30`, and `small` is `100 x 20`, however, you can specify the size you want by using `width` and `height`. Such as:

- "size": "small" || "large"
- "width": `number`
- "height": `number`

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
