cd android && ./gradlew bundleRelease
cp app/build/outputs/bundle/release/app-release.aab omt.aab
mv -f omt.aab ~/Downloads/