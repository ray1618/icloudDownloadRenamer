const Fs = require('fs');
const Path = require('path');
const fullPath = Path.join(__dirname, './images');
const ExifReader = require('exifreader');

function start() {
  // get all files in images folder
  // and rename images
  Fs.readdir(fullPath, (error, files) => {
    if (error) console.log(error);

    const imageFiles = files.filter(isImage);
    renameImageFiles(imageFiles);

    // after renaming images get new file list
    // and rename mov files
    Fs.readdir(fullPath, (error, files2) => {
      if (error) console.log(error);

      renameMovFiles(files2);
    });
  });
}

function isImage(file) {
  return (
    file.indexOf('.heic') !== -1 ||
    file.indexOf('.HEIC') !== -1 ||
    file.indexOf('.png') !== -1 ||
    file.indexOf('.PNG') !== -1 ||
    file.indexOf('.jpg') !== -1 ||
    file.indexOf('.JPG') !== -1 ||
    file.indexOf('.jpeg') !== -1 ||
    file.indexOf('.JPEG') !== -1
  );
}

function renameImageFiles(imageFiles) {
  imageFiles.forEach((imageFile) => {
    const newImageFileName = createNewName(imageFile);

    if (newImageFileName) {
      renenameFile(imageFile, newImageFileName);
    }
  });
}

function renameMovFiles(files) {
  const movFiles = files.filter((file) => {
    return file.indexOf('.mov') !== -1 || file.indexOf('.MOV') !== -1;
  });

  movFiles.forEach((movFile) => {
    // find .heic / img files that belong to mov file
    const imageFile = files.find((file) => {
      return getCorrespondingImageFiles(file, movFile);
    });

    if (imageFile) {
      // get image name, and rename .mov with it
      const newMovFileName = imageFile
        .replace('.jpg', '.mov')
        .replace('.JPG', '.MOV')
        .replace('.jpeg', '.mov')
        .replace('.JPEG', '.MOV')
        .replace('.png', '.mov')
        .replace('.PNG', '.MOV')
        .replace('.heic', '.mov')
        .replace('.HEIC', '.MOV');

      renenameFile(movFile, newMovFileName);
    }
  });
}

function getCorrespondingImageFiles(file, movFile) {
  const fileNameBase = movFile.replace('.mov', '').replace('.MOV', '');
  return (
    (file.indexOf(fileNameBase) !== -1 && file.indexOf('.heic') !== -1) ||
    (file.indexOf(fileNameBase) !== -1 && file.indexOf('.HEIC') !== -1) ||
    (file.indexOf(fileNameBase) !== -1 && file.indexOf('.jpg') !== -1) ||
    (file.indexOf(fileNameBase) !== -1 && file.indexOf('.JPG') !== -1) ||
    (file.indexOf(fileNameBase) !== -1 && file.indexOf('.jpeg') !== -1) ||
    (file.indexOf(fileNameBase) !== -1 && file.indexOf('.JPEG') !== -1) ||
    (file.indexOf(fileNameBase) !== -1 && file.indexOf('.png') !== -1) ||
    (file.indexOf(fileNameBase) !== -1 && file.indexOf('.PNG') !== -1)
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

function createNewName(fileImg) {
  const tags = getExifTags(fileImg);

  if (tags && tags.DateTimeOriginal) {
    const dateTimeOriginal = tags.DateTimeOriginal.description;
    const regExp = new RegExp(':', 'g');
    const dateTimeString = dateTimeOriginal
      .replace(regExp, '-')
      .replace(' ', '-');
    const newImageFileName = dateTimeString + '_' + fileImg;
    return newImageFileName;
  } else {
    return null;
  }
}

function getExifTags(fileImg) {
  try {
    const filePath = Path.join(fullPath, fileImg);

    const data = Fs.readFileSync(filePath);
    const tags = ExifReader.load(data);

    if (tags) {
      delete tags['MakerNote'];
    }
    return tags;
  } catch (err) {
    console.log('error:', err);
  }
}

start();
