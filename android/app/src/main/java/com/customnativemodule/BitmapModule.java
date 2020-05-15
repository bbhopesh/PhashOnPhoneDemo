package com.customnativemodule;

import android.widget.Toast;

import com.facebook.react.bridge.JavaOnlyArray;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;


public class BitmapModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";


    BitmapModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "BitmapNative";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @ReactMethod
    public void getPixels(String filePath, final Promise promise) {
        try {
            WritableNativeMap result = new WritableNativeMap();
            WritableNativeArray pixels = new WritableNativeArray();
            //JavaOnlyArray pixels = new JavaOnlyArray();


            Bitmap bitmap = BitmapFactory.decodeFile(filePath);

            if (bitmap == null) {
                promise.reject("Failed to decode. Path is incorrect or image is corrupted");
                return;
            }

            int width = bitmap.getWidth();
            int height = bitmap.getHeight();

            long startTime = System.currentTimeMillis();

            boolean hasAlpha = bitmap.hasAlpha();
            //result.putString("Start time", Long.toString(startTime));
            int length = width * height;
            int[] pixelsArr = new int[length];
            bitmap.getPixels(pixelsArr, 0, width, 0, 0, width, height);
            /*
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    int colorInt = bitmap.getPixel(x, y);
                    Color color = new Color(colorInt);
                    pixels.pushInt(color.R);
                    pixels.pushInt(color.G);
                    pixels.pushInt(color.B);
                    pixels.pushInt(color.A);
                }
            }
            */

            long endTime = System.currentTimeMillis();
            // ArrayList<Integer> pixelsList = new ArrayList<>(4*length);
            // MyFastArray pixels = new MyFastArray(pixelsList);
            int A=0, R=0, G=0, B=0;
            for (int i = 0; i < length; i++) {
                int colorInt = pixelsArr[i];
                A = (colorInt >> 24) & 0xff;
                R = (colorInt >> 16) & 0xff;
                G = (colorInt >>  8) & 0xff;
                B = (colorInt      ) & 0xff;
                /*
                pixelsList.add(R);
                pixelsList.add(G);
                pixelsList.add(B);
                pixelsList.add(A);

                 */


                // Color color = new Color(colorInt);

                //System.out.println(colorInt);


                pixels.pushInt(R);
                pixels.pushInt(G);
                pixels.pushInt(B);
                pixels.pushInt(A);
            }
            /*
            pixelsList.add(R);
            pixelsList.add(G);
            pixelsList.add(B);
            pixelsList.add(A);
            pixels.pushInt(R);
            pixels.pushInt(G);
            pixels.pushInt(B);
            pixels.pushInt(A);
             */
            result.putString("Start time", Long.toString(System.currentTimeMillis() - endTime));
            result.putString("End time", Long.toString(endTime - startTime));
            //pixels.pushInt(A);
            // result.put

            /*
            String hex = Integer.toHexString(colorInt);
            pixels.pushString(hex);
            pixels.pushString(Integer.toHexString(color.A));
            pixels.pushString(Integer.toHexString(color.R));
            pixels.pushString(Integer.toHexString(color.G));
            pixels.pushString(Integer.toHexString(color.B));
             */

            // Color c = Color.valueOf(color);

            /*
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    int color = bitmap.getPixel(x, y);
                    String hex = Integer.toHexString(color);
                    pixels.pushString(hex);
                }
            }
             */

            result.putInt("width", width);
            result.putInt("height", height);
            result.putBoolean("hasAlpha", hasAlpha);
            result.putArray("data", pixels);
            //result.putArray("data", pixelsArr);

            promise.resolve(result);

        } catch (Exception e) {
            System.out.println(e);
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
