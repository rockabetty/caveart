#include <stdio.h>
#include <stdlib.h>
#include <MagickCore.h>

int main(int argc, char **argv) {
    if (argc != 3) {
        printf("Usage: %s input_image output_thumbnail\n", argv[0]);
        return 1;
    }

    const char *inputImage = argv[1];
    const char *outputImage = argv[2];

    MagickCoreGenesis(*argv, MagickTrue);
    ExceptionInfo *exception = AcquireExceptionInfo();
    ImageInfo *imageInfo = CloneImageInfo(NULL);
    Image *image = NULL;

    strncpy(imageInfo->filename, inputImage, MaxTextExtent - 1);
    image = ReadImage(imageInfo, exception);
    if (exception->severity != UndefinedException) {
        CatchException(exception);
    }
    if (image == NULL) {
        printf("Failed to read image.\n");
        return 1;
    }

    Image *thumbnail = ResizeImage(image, 200, 0, LanczosFilter, 1.0, exception);
    if (thumbnail == NULL) {
        printf("Failed to create thumbnail.\n");
        return 1;
    }

    // Write the thumbnail to output file
    strncpy(thumbnail->filename, outputImage, MaxTextExtent - 1);
    if (!WriteImage(imageInfo, thumbnail)) {
        printf("Failed to write thumbnail.\n");
        return 1;
    }

    // Clean up
    DestroyImage(thumbnail);
    DestroyImage(image);
    DestroyImageInfo(imageInfo);
    DestroyExceptionInfo(exception);
    MagickCoreTerminus();

    printf("Thumbnail created successfully: %s\n", outputImage);
    return 0;
}