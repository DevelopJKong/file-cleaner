import fs from 'fs';
import dayjs from 'dayjs';

const mainPath = '/Users/jeongbin/Downloads';

const REGEX = Object.freeze({
  IMAGE_REGEX: /(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.avif|\.webp)$/i,
  VIDEO_REGEX: /\.mp4$|\.avi$|\.mov$|\.wmv$|\.flv$/i,
  FILE_REGEX: /\.pdf$|\.doc$|\.docx$|\.ppt$|\.pptx$|\.xls$|\.xlsx$|\.hwp$|\.txt$|\.zip$|\.7z$|\.rar$|\.tar$|\.gz$|\.xd$|\.iso$/i,
  PDF_REGEX: /\.pdf$/i,
  XLS_REGEX: /\.xls$|\.xlsx$/i,
  ZIP_REGEX: /\.zip$|\.7z$|\.rar$|\.tar$|\.gz$|\.iso$/i,
  HWP_REGEX: /\.hwp$/i,
});

/**
 * * 파일 복사
 * @description 파일 복사 후 기존 파일 삭제
 * @param {string} path - 파일이 있는 경로
 * @param {string} datePath - 날짜별 폴더 경로
 * @param {string} item - 파일 이름
 * @returns {void}
 */
const onCopyFileHandler = (path, datePath, item) => {
  fs.copyFile(`${path}/${item}`, `${datePath}/${item}`, (err) => {
    if (err) throw err;

    console.log('파일이 복사되었습니다.');

    // 기존 파일 삭제
    fs.unlink(`${path}/${item}`, (err) => {
      if (err) throw err;
      console.log('기존 파일이 삭제되었습니다.');
    });
  });
};

/**
 * * 폴더 생성
 * @description 폴더가 없을 경우 폴더 생성
 * @param {string} path - 폴더 경로
 * @returns {void}
 */
const onMkdirHandler = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

/**
 * * 파일 정리
 * @description 파일 정리을 정리해주는 main 함수입니다.
 * @param {string} path
 */
const onFileCleaner = (path) => {
  const imagePath = path + '/_day_images';
  const videoPath = path + '/_day_videos';
  const filePath = path + '/_day_files';
  const date = dayjs().format('YYYY-MM-DD');
  const imageDateFolder = `${imagePath}/${date}`;
  const videoDateFolder = `${videoPath}/${date}`;
  const fileDateFolder = `${filePath}/${date}`;
  const fileDatePdf = `${fileDateFolder}/pdf`;
  const fileDateXls = `${fileDateFolder}/xls`;
  const fileDateZip = `${fileDateFolder}/zip`;
  const fileDateHwp = `${fileDateFolder}/hwp`;
  const fileDateAll = `${fileDateFolder}/all`;

  onMkdirHandler(imagePath);
  onMkdirHandler(videoPath);
  onMkdirHandler(filePath);
  onMkdirHandler(imageDateFolder);
  onMkdirHandler(videoDateFolder);
  onMkdirHandler(fileDateFolder);
  onMkdirHandler(fileDatePdf);
  onMkdirHandler(fileDateXls);
  onMkdirHandler(fileDateZip);
  onMkdirHandler(fileDateHwp);
  onMkdirHandler(fileDateAll);

  fs.readdir(path, (err, files) => {
    if (err) {
      console.log(err + '폴더를 읽는 과정에서 문제가 생겼습니다.');
    } else {
      const { IMAGE_REGEX, VIDEO_REGEX, FILE_REGEX, PDF_REGEX, XLS_REGEX, ZIP_REGEX, HWP_REGEX } = REGEX;
      files.map((item) => {
        if (IMAGE_REGEX.test(item) || VIDEO_REGEX.test(item) || FILE_REGEX.test(item)) {
          if (IMAGE_REGEX.test(item)) {
            onCopyFileHandler(path, imageDateFolder, item);
          }

          if (VIDEO_REGEX.test(item)) {
            onCopyFileHandler(path, videoDateFolder, item);
          }

          if (FILE_REGEX.test(item)) {
            if (PDF_REGEX.test(item)) onCopyFileHandler(path, fileDatePdf, item);
            if (XLS_REGEX.test(item)) onCopyFileHandler(path, fileDateXls, item);
            if (ZIP_REGEX.test(item)) onCopyFileHandler(path, fileDateZip, item);
            if (HWP_REGEX.test(item)) onCopyFileHandler(path, fileDateHwp, item);
            if (!PDF_REGEX.test(item) && !XLS_REGEX.test(item) && !ZIP_REGEX.test(item) && !HWP_REGEX.test(item)) {
              onCopyFileHandler(path, fileDateAll, item);
            }
          }
        }
      });
    }
  });
};

onFileCleaner(mainPath);
console.log('script done');
