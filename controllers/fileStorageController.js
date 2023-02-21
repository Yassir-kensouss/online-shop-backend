const { cloudinary } = require("../utils/cloudinary");

exports.uploadFile = async (req, res) => {
  try {
    const pictureFiles = req.body;
    if (!pictureFiles) {
      return res.status(400).json({
        message: "No files attached",
      });
    }

    let multiplePicturesPromise = pictureFiles.map(picture => {
      return cloudinary.uploader.upload(picture.url);
    });

    let imagesResponse = await Promise.all(multiplePicturesPromise);
    let formateRes = [];

    imagesResponse.map(response => {
      formateRes = [
        ...formateRes,
        {
          url: response.secure_url,
          mediaType: response.resource_type,
          size: response.bytes,
          width: response.width,
          height: response.height,
          format: response.format,
        },
      ];
    });

    res.json({
        photos: formateRes,
    })

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, Please try again",
    });
  }
};
