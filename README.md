# iCloud downloaded images name prefixer

As I downloaded my icloud images to my local storage. I found out al the names make no sense. It's hard to sort them by date without some kind of photo library as all the images are named img_XXXX.jpg

What this script will do is put the date that the image is taken as a prefix of the original filename and batch rename all images in the image folder. And in the process do the same thing to the "livephoto" .mov

For example an image **img_XXXXX.jpg** & **img_img_XXXXX.mov** will be renamed to **2020-10-01-23-55-55_img_XXXX.jpg** & **2020-10-01-23-55-55_img_XXXX.mov**

Luckely the images have exif available and we can use that to rename it.

This script wil rename **.jpg**, **.png**, **.heic** and the corresponding **.mov** files that's used for live photo's. It will use the Exif DateTimeOriginal timestamp to create a dateprefix in the original filename

## How to use:

- Put your downloaded images to the images folder.
- Install the npm dependencies `npm install`
- Then run `npm start` or `npm run rename`
- Done!

## Only rename mov files:

- If you not done this already installthe npm dependencies `npm install`
- For this to work you will also need to install exiftool
- Mac OS: `$brew install exiftool`
- Ubuntu: `apt-get install libimage-exiftool-perl`
- Put your downloaded mov files in image folder.
- run `npm run rename:movs`

> Make a copy of your images / movs before you run this command and check the result before deleting the originals.
