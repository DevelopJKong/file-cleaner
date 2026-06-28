import fs from 'fs';
import dayjs from 'dayjs';

const mainPath = '/Users/jeongbin/Downloads';

const REGEX = Object.freeze({
  IMAGE_REGEX: /(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.avif|\.webp)$/i,
  VIDEO_REGEX: /\.mp4$|\.avi$|\.mov$|\.wmv$|\.flv$/i,
  AUDIO_REGEX: /\.mp3$/i,
  FILE_REGEX:
    /\.pdf$|\.doc$|\.docx$|\.ppt$|\.pptx$|\.xls$|\.xlsx$|\.csv$|\.hwp$|\.txt$|\.md$|\.html?$|\.zip$|\.7z$|\.rar$|\.tar$|\.gz$|\.xd$|\.iso|\.ips|\.ipa|\.psd|\.ai|\.xd|\.kra|\.json/i,
  PDF_REGEX: /\.pdf$/i,
  XLS_REGEX: /\.xls$|\.xlsx$|\.csv$/i,
  ZIP_REGEX: /\.zip$|\.7z$|\.rar$|\.tar$|\.gz$|\.iso$/i,
  HWP_REGEX: /\.hwp$/i,
  MARKDOWN_REGEX: /\.md$/i,
  HTML_REGEX: /\.html?$/i,
  ANDROID_REGEX: /\.apk|\.aab$/i,
  IOS_REGEX: /\.ips|\.ipa$/i,
  PHOTO_SHOP_REGEX: /\.psd|\.ai|\.xd$|\.kra$/i,
  JSON_REGEX: /\.json$/i,
});

/**
 * * 파일 복사
 * @description 파일 복사 후 기존 파일 삭제
 * @param path - 파일이 있는 경로
 * @param datePath - 날짜별 폴더 경로
 * @param item - 파일 이름
 */
const onCopyFileHandler = (path: string, datePath: string, item: string): void => {
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
 * @param path - 폴더 경로
 */
const onMkdirHandler = (path: string): void => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

/**
 * * 파일 정리
 * @description 파일 정리을 정리해주는 main 함수입니다.
 * @param path
 */
const onFileCleaner = (path: string): void => {
  const imagePath = path + '/_day_images';
  const videoPath = path + '/_day_videos';
  const audioPath = path + '/_day_audios';
  const filePath = path + '/_day_files';
  const date = dayjs().format('YYYY-MM-DD');
  const imageDateFolder = `${imagePath}/${date}`;
  const videoDateFolder = `${videoPath}/${date}`;
  const audioDateFolder = `${audioPath}/${date}`;
  const fileDateFolder = `${filePath}/${date}`;
  const fileDatePdf = `${fileDateFolder}/pdf`;
  const fileDateXls = `${fileDateFolder}/xls`;
  const fileDateZip = `${fileDateFolder}/zip`;
  const fileDateHwp = `${fileDateFolder}/hwp`;
  const fileDateMarkdown = `${fileDateFolder}/markdown`;
  const fileDateHtml = `${fileDateFolder}/html`;
  const fileDateAndroid = `${fileDateFolder}/android`;
  const fileDateIos = `${fileDateFolder}/ios`;
  const fileDatePhotoShop = `${fileDateFolder}/photo-shop`;
  const fileDateJson = `${fileDateFolder}/json`;
  const fileDateAll = `${fileDateFolder}/all`;

  onMkdirHandler(imagePath);
  onMkdirHandler(videoPath);
  onMkdirHandler(audioPath);
  onMkdirHandler(filePath);
  onMkdirHandler(imageDateFolder);
  onMkdirHandler(videoDateFolder);
  onMkdirHandler(audioDateFolder);
  onMkdirHandler(fileDateFolder);
  onMkdirHandler(fileDatePdf);
  onMkdirHandler(fileDateXls);
  onMkdirHandler(fileDateZip);
  onMkdirHandler(fileDateHwp);
  onMkdirHandler(fileDateMarkdown);
  onMkdirHandler(fileDateHtml);
  onMkdirHandler(fileDateAndroid);
  onMkdirHandler(fileDateIos);
  onMkdirHandler(fileDatePhotoShop);
  onMkdirHandler(fileDateJson);
  onMkdirHandler(fileDateAll);

  fs.readdir(path, (err, files) => {
    if (err) {
      console.log(err + '폴더를 읽는 과정에서 문제가 생겼습니다.');
    } else {
      const {
        IMAGE_REGEX,
        VIDEO_REGEX,
        AUDIO_REGEX,
        FILE_REGEX,
        PDF_REGEX,
        XLS_REGEX,
        ZIP_REGEX,
        HWP_REGEX,
        MARKDOWN_REGEX,
        HTML_REGEX,
        ANDROID_REGEX,
        IOS_REGEX,
        PHOTO_SHOP_REGEX,
        JSON_REGEX,
      } = REGEX;
      files.map((item) => {
        const itemPath = `${path}/${item}`;

        // 폴더는 건너뛰기 (파일만 처리)
        try {
          const stats = fs.statSync(itemPath);
          if (!stats.isFile()) {
            return;
          }
        } catch (error) {
          console.log(`파일 정보를 읽을 수 없습니다: ${item}`);
          return;
        }

        if (
          IMAGE_REGEX.test(item) ||
          VIDEO_REGEX.test(item) ||
          AUDIO_REGEX.test(item) ||
          FILE_REGEX.test(item)
        ) {
          if (IMAGE_REGEX.test(item)) {
            onCopyFileHandler(path, imageDateFolder, item);
          }

          if (VIDEO_REGEX.test(item)) {
            onCopyFileHandler(path, videoDateFolder, item);
          }

          if (AUDIO_REGEX.test(item)) {
            onCopyFileHandler(path, audioDateFolder, item);
          }

          if (FILE_REGEX.test(item)) {
            if (PDF_REGEX.test(item)) onCopyFileHandler(path, fileDatePdf, item);
            if (XLS_REGEX.test(item)) onCopyFileHandler(path, fileDateXls, item);
            if (ZIP_REGEX.test(item)) onCopyFileHandler(path, fileDateZip, item);
            if (HWP_REGEX.test(item)) onCopyFileHandler(path, fileDateHwp, item);
            if (MARKDOWN_REGEX.test(item)) onCopyFileHandler(path, fileDateMarkdown, item);
            if (HTML_REGEX.test(item)) onCopyFileHandler(path, fileDateHtml, item);
            if (ANDROID_REGEX.test(item)) onCopyFileHandler(path, fileDateAndroid, item);
            if (IOS_REGEX.test(item)) onCopyFileHandler(path, fileDateIos, item);
            if (PHOTO_SHOP_REGEX.test(item)) onCopyFileHandler(path, fileDatePhotoShop, item);
            if (JSON_REGEX.test(item)) onCopyFileHandler(path, fileDateJson, item);
            if (
              !PDF_REGEX.test(item) &&
              !XLS_REGEX.test(item) &&
              !ZIP_REGEX.test(item) &&
              !HWP_REGEX.test(item) &&
              !MARKDOWN_REGEX.test(item) &&
              !HTML_REGEX.test(item) &&
              !ANDROID_REGEX.test(item) &&
              !IOS_REGEX.test(item) &&
              !PHOTO_SHOP_REGEX.test(item) &&
              !JSON_REGEX.test(item)
            ) {
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
