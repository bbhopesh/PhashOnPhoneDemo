package com.customnativemodule;

import android.graphics.Bitmap;

public class RGBAImageDataBitmapSimple implements RGBAImageDataInterface {
    private Bitmap bitmap;
    private int[] pixels;

    public RGBAImageDataBitmapSimple(Bitmap bitmap) {
        this.bitmap = bitmap;
        this.pixels = new int[getWidth() * getHeight()];
        this.bitmap.getPixels(pixels, 0, getWidth(), 0, 0, getWidth(), getHeight());
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
        return this.bitmap.getWidth();
    }

    @Override
    public int getHeight() {
        return this.bitmap.getHeight();
    }
}
