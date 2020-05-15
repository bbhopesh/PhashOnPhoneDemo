package com.customnativemodule;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.DynamicFromArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;

import java.util.ArrayList;

public class MyFastArray implements ReadableArray {

    private ArrayList list;

    public MyFastArray(ArrayList list) {
        this.list = list;
    }

    private void illegalOperation() {
        throw new UnsupportedOperationException();
    }

    @Override
    public int size() {
        return list.size();
    }

    @Override
    public boolean isNull(int index) {
        return false;
    }

    @Override
    public boolean getBoolean(int index) {
        illegalOperation();
        return false;
    }

    @Override
    public double getDouble(int index) {
        // illegalOperation();
        return ((Number) list.get(index)).doubleValue();
    }

    @Override
    public int getInt(int index) {
        return ((Number) list.get(index)).intValue();
    }

    @Nullable
    @Override
    public String getString(int index) {
        illegalOperation();
        return null;
    }

    @Nullable
    @Override
    public ReadableArray getArray(int index) {
        illegalOperation();
        return null;
    }

    @Nullable
    @Override
    public ReadableMap getMap(int index) {
        illegalOperation();
        return null;
    }

    @NonNull
    @Override
    public Dynamic getDynamic(int index) {
        return DynamicFromArray.create(this, index);
    }

    @NonNull
    @Override
    public ReadableType getType(int index) {
        return ReadableType.Number;
    }

    @NonNull
    @Override
    public ArrayList<Object> toArrayList() {
        return this.list;
    }
}
