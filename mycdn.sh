sed -i "" 's/..\/gitbook/https:\/\/pcdn.flutterchina.club\/gitbook/g' `grep -rl '../gitbook/' ./_book`
sed -i "" 's/="gitbook/="https:\/\/pcdn.flutterchina.club\/gitbook/g' `grep -rl '=\"gitbook/' ./_book`
sed -i "" 's/src="..\/imgs/src="https:\/\/pcdn.flutterchina.club\/imgs/g' `grep -rl '../gitbook/' ./_book`
