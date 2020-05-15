package com.customnativemodule;

import android.graphics.Bitmap;

// Surprisingly this is faster than Smart implementation.
public class RGBAImageDataBitmapSmart implements RGBAImageDataInterface {
    private Bitmap bitmap;
    private int width;
    private int height;

    public RGBAImageDataBitmapSmart(Bitmap bitmap) {
        this.bitmap = bitmap;
        this.width = this.bitmap.getWidth();
        this.height = this.bitmap.getHeight();
    }
    @Override
    public int value(int index) {
        int pixelIndex = index / 4;
        int pixelIndexY = pixelIndex / this.width;
        int pixelIndexX = pixelIndex - (pixelIndexY * this.width);
        int rgbaIndex = index % 4;
        int pixel = this.bitmap.getPixel(pixelIndexX, pixelIndexY);
        if (rgbaIndex == 0) {
            // Red
            return (pixel >> 16) & 0xff;
        } else if (rgbaIndex == 1) {
            // Green
            return (pixel >>  8) & 0xff;
        } else if (rgbaIndex == 2) {
            // Blue
            return pixel & 0xff;
        } else {
            // Alpha
            return (pixel >> 24) & 0xff;
        }
    }

    @Override
    public int getWidth() {
        return this.width;
    }

    @Override
    public int getHeight() {
        return this.height;
    }
}
