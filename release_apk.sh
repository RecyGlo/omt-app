cd android && ./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk omt.apk
mv -f omt.apk ~/Downloads/