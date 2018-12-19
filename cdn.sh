sed -i "" 's/..\/gitbook/https:\/\/cdn.jsdelivr.net\/gh\/flutterchina\/flutter-in-action\/_book\/gitbook/g' `grep -rl '../gitbook/' ./_book`
sed -i "" 's/="gitbook/="https:\/\/cdn.jsdelivr.net\/gh\/flutterchina\/flutter-in-action\/_book\/gitbook/g' `grep -rl '=\"gitbook/' ./_book`
sed -i "" 's/src="..\/imgs/src="https:\/\/cdn.jsdelivr.net\/gh\/flutterchina\/flutter-in-action\/docs\/imgs/g' `grep -rl '../gitbook/' ./_book`
