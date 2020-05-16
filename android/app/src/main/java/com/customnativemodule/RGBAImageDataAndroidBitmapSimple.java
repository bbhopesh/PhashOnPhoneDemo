package com.customnativemodule;

import android.graphics.Bitmap;

public class RGBAImageDataAndroidBitmapSimple implements RGBAImageDataInterface {
    private int[] pixels;
    private int width;
    private int height;

    public RGBAImageDataAndroidBitmapSimple(Bitmap bitmap) {
        this.width = bitmap.getWidth();
        this.height = bitmap.getHeight();
        this.pixels = new int[this.width * this.height];
        bitmap.getPixels(this.pixels, 0, this.width, 0, 0, this.width, this.height);
    }

    @Override
    public int value(int index) {
        int pixedlIndex = index / 4;
        int rgbaIndex = index % 4;
        int pixel = this.pixels[pixedlIndex];
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
