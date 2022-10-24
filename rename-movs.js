const Fs = require('fs');
const Path = require('path');
const colors = require('colors');
const fullPath = Path.join(__dirname, './images');
var Exif = require('exiftool');

function start() {
  // get all files in images folder
  // and rename images
  Fs.readdir(fullPath, (error, files) => {
    if (error) console.log(error);

    const movieFiles = files.filter(isMovie);
    movieFiles.forEach((movieFile) => {
      readMovieFile(movieFile);
    });
  });
}

function readMovieFile(movieFile) {
  Fs.readFile(Path.join(fullPath, movieFile), function (err, data) {
    if (err) throw err;
    else {
      Exif.metadata(data, function (err, metadata) {
        if (err) {
          throw err;
          return;
        }

        const newFilename = createNewMovieFileName(metadata, movieFile);
        renenameFile(movieFile, newFilename);
      });
    }
  });
}

function isMovie(file) {
  return (
    file.indexOf('.mov') !== -1 ||
    file.indexOf('.MOV') !== -1 ||
    file.indexOf('.mp4') !== -1 ||
    file.indexOf('.MP4') !== -1
  );
}

function renenameFile(oldName, newName) {
  const oldPath = Path.join(fullPath, oldName);
  const newPath = Path.join(fullPath, newName);
  const regExp =
    /[0-9]{4}-([0-9]{2}|[0-9])-([0-9]{2}|[0-9])-([0-9]{2}|[0-9])-([0-9]{2}|[0-9])/;

  // don't rename if names are the same
  if (oldName === newName) {
    return;
  }

  // don't rename when name already contains prefix date
  if (regExp.test(oldName)) {
    console.log('waning '.yellow + oldPath + ' seems to be renamed already');
    return;
  }

  Fs.renameSync(oldPath, newPath);
  console.log(oldName + ' renamed'.green + ' -> ' + newName);
}

function createNewMovieFileName(metadata, file) {
  const dateTimeOriginal = metadata.mediaCreateDate;
  const regExp = new RegExp(':', 'g');
  const dateTimeString = dateTimeOriginal
    .replace(regExp, '-')
    .replace(' ', '-');
  const newFileName = dateTimeString + '_' + file;
  return newFileName;
}

start();
