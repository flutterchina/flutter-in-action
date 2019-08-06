import 'dart:io';
import 'package:path/path.dart' as path;

void main() async {
  await Process.run('cp', ["-r", "docs/imgs/.", "book/imgs"]);
  await Process.run('cp', [ "docs/img_des.txt", "book/img_des.txt"]);
  await walk("docs", "book");
  await Process.run('rm', ["-f","book/README.docx"]);
  await Process.run('rm', ["-f","book/SUMMARY.docx"]);
}

//遍历JSON目录生成模板
walk(String srcDir, String distDir) async {
  if (srcDir.endsWith("/")) srcDir = srcDir.substring(0, srcDir.length - 1);
  if (distDir.endsWith("/")) distDir = distDir.substring(0, distDir.length - 1);
  var src = Directory(srcDir);
  var list = src.listSync(recursive: true);
  if (list.isEmpty) return false;
  if (!Directory(distDir).existsSync()) {
    Directory(distDir).createSync(recursive: true);
  }

  for (var f in list) {
    String filePath = f.path;
    if (FileSystemEntity.isFileSync(filePath)) {
      //File file = File(f.path);
      var ext = path.extension(filePath);

      if (ext != ".md") continue;
      var output =
          filePath.replaceFirst("docs/", "book/").replaceFirst(".md", ".docx");
      var dir = path.dirname(output);
      print(dir);
      if (!Directory(dir).existsSync()) {
        Directory(dir).createSync(recursive: true);
      }
      await Process.run('pandoc', ["-s", filePath, "-o", output,"--extract-media=docs/imgs"]);
    }
  }
}
