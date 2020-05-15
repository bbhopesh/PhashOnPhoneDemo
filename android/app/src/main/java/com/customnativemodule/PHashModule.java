package com.customnativemodule;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeMap;


public class BitmapModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    BitmapModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "BitmapNative";
    }

    @ReactMethod
    public void computePHash(String filePath, final Promise promise) {
        try {
            long startTime = System.currentTimeMillis();
            WritableNativeMap result = new WritableNativeMap();
            Bitmap bitmap = BitmapFactory.decodeFile(filePath);

            if (bitmap == null) {
                promise.reject("Failed to decode. Path is incorrect or image is corrupted");
                return;
            }

            RGBAImageDataInterface imageData = new RGBAImageDataBitmapSimple(bitmap);
            // Surprisingly Smart ImageData is much slower.
            // RGBAImageDataInterface imageData = new RGBAImageDataBitmapSmart(bitmap);
            String pHash = BlockhashCore.computePhash(imageData);
            result.putString("Runtime", Long.toString(System.currentTimeMillis() - startTime));
            result.putString("pHash", pHash);

            promise.resolve(result);

        } catch (Exception e) {
            promise.reject(e);
        }

    }

    private static class Color {
        int R, G, B, A;

        Color(int color) {
            A = (color >> 24) & 0xff;
            R = (color >> 16) & 0xff;
            G = (color >>  8) & 0xff;
            B = (color      ) & 0xff;
        }
    }
}
