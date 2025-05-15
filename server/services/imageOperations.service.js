import sharp from 'sharp';





export const convertToPng = async (inputPath) => {
  const outputPath = `${inputPath}.png`;

  await sharp(inputPath)
    .png()
    .toFile(outputPath);
    // const metadata = await sharp(outputPath).metadata();
    // console.log(metadata.format)
  return outputPath;
};